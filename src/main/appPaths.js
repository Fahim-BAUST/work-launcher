const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

// Folders to skip when scanning
const SKIP_FOLDERS = [
  "administrative tools",
  "accessibility",
  "system tools",
  "windows tools",
  "startup",
  "maintenance",
  "windows powershell",
  "windows system",
];

// Files to skip (lowercase)
const SKIP_FILES = [
  "uninstall",
  "readme",
  "help",
  "license",
  "website",
  "documentation",
  "manual",
  "changelog",
  "release notes",
  "remove",
  "repair",
  "update",
];

/**
 * Collect all .lnk files from a directory recursively
 * @param {string} dir - Directory to scan
 * @param {Array} lnkFiles - Array to collect .lnk file paths
 */
function collectLnkFiles(dir, lnkFiles) {
  try {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        // Skip certain system folders
        if (
          SKIP_FOLDERS.some((skip) => item.name.toLowerCase().includes(skip))
        ) {
          continue;
        }
        // Recursively scan subdirectories
        collectLnkFiles(fullPath, lnkFiles);
      } else if (item.name.toLowerCase().endsWith(".lnk")) {
        // Skip uninstall and other utility shortcuts
        const nameLower = item.name.toLowerCase();
        if (SKIP_FILES.some((skip) => nameLower.includes(skip))) {
          continue;
        }
        lnkFiles.push(fullPath);
      }
    }
  } catch (error) {
    // Silently ignore permission errors
  }
}

/**
 * Batch parse multiple .lnk files using PowerShell script file
 * @param {Array} lnkPaths - Array of .lnk file paths
 * @returns {Object} - Map of lnkPath -> targetPath
 */
function batchParseLnkFiles(lnkPaths) {
  if (lnkPaths.length === 0) return {};

  const mapping = {};
  const tempDir = os.tmpdir();
  const timestamp = Date.now();
  const inputFile = path.join(tempDir, `wl-input-${timestamp}.txt`);
  const outputFile = path.join(tempDir, `wl-output-${timestamp}.txt`);
  const scriptFile = path.join(tempDir, `wl-script-${timestamp}.ps1`);

  try {
    // Write all paths to a temp file (one per line)
    fs.writeFileSync(inputFile, lnkPaths.join("\r\n"), "utf8");

    // Create PowerShell script file
    const psScript = `
$shell = New-Object -ComObject WScript.Shell
$inputFile = "${inputFile.replace(/\\/g, "\\\\")}"
$outputFile = "${outputFile.replace(/\\/g, "\\\\")}"
$results = @()
Get-Content $inputFile | ForEach-Object {
  $lnk = $_.Trim()
  if ($lnk -and (Test-Path -LiteralPath $lnk)) {
    try {
      $target = $shell.CreateShortcut($lnk).TargetPath
      if ($target -and $target.ToLower().EndsWith('.exe') -and (Test-Path -LiteralPath $target)) {
        $results += "$lnk|$target"
      }
    } catch {}
  }
}
$results | Set-Content -Path $outputFile -Encoding UTF8
`;

    fs.writeFileSync(scriptFile, psScript, "utf8");

    // Execute the script
    execSync(
      `powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptFile}"`,
      {
        encoding: "utf8",
        timeout: 60000,
        windowsHide: true,
      },
    );

    // Read results from output file
    if (fs.existsSync(outputFile)) {
      const output = fs.readFileSync(outputFile, "utf8").trim();
      const lines = output.split(/\r?\n/).filter((line) => line.trim());

      for (const line of lines) {
        const pipeIndex = line.indexOf("|");
        if (pipeIndex > 0) {
          const lnkPath = line.substring(0, pipeIndex).trim();
          const targetPath = line.substring(pipeIndex + 1).trim();
          if (lnkPath && targetPath) {
            mapping[lnkPath] = targetPath;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error parsing shortcuts:", error.message);
  } finally {
    // Cleanup temp files
    try {
      if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
    } catch {}
    try {
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    } catch {}
    try {
      if (fs.existsSync(scriptFile)) fs.unlinkSync(scriptFile);
    } catch {}
  }

  return mapping;
}

/**
 * Get all installed apps by scanning Start Menu and common locations
 * @returns {Object} - Object containing all detected apps
 */
function getAllInstalledApps() {
  const apps = {};
  const seenPaths = new Set();

  // First, add the pre-defined apps
  for (const [appName, paths] of Object.entries(DEFAULT_APP_PATHS)) {
    const foundPath = findExecutable(paths);
    if (foundPath) {
      seenPaths.add(foundPath.toLowerCase());
      apps[appName] = {
        path: foundPath,
        enabled: true,
        displayName: getAppDisplayName(appName),
        scanned: false,
      };
    }
  }

  // Collect all .lnk files from Start Menu
  const lnkFiles = [];
  const startMenuLocations = [
    path.join(
      process.env.APPDATA,
      "Microsoft",
      "Windows",
      "Start Menu",
      "Programs",
    ),
    path.join(
      process.env.PROGRAMDATA || "C:\\ProgramData",
      "Microsoft",
      "Windows",
      "Start Menu",
      "Programs",
    ),
  ];

  for (const location of startMenuLocations) {
    collectLnkFiles(location, lnkFiles);
  }

  // Batch parse all shortcuts in one PowerShell call
  const shortcutTargets = batchParseLnkFiles(lnkFiles);

  // Process results
  for (const [lnkPath, targetPath] of Object.entries(shortcutTargets)) {
    if (!seenPaths.has(targetPath.toLowerCase())) {
      seenPaths.add(targetPath.toLowerCase());

      // Create app key from shortcut name
      const appName = path.basename(lnkPath, ".lnk");
      const appKey = `scanned_${appName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`;

      apps[appKey] = {
        path: targetPath,
        enabled: true,
        displayName: appName,
        scanned: true,
      };
    }
  }

  return apps;
}

// Default application paths for Windows
const DEFAULT_APP_PATHS = {
  hubstaff: [
    "C:\\Program Files\\Hubstaff\\HubstaffClient.exe",
    `${process.env.LOCALAPPDATA}\\Programs\\Hubstaff\\Hubstaff.exe`,
    `${process.env.APPDATA}\\Hubstaff\\Hubstaff.exe`,
    "C:\\Program Files\\Hubstaff\\Hubstaff.exe",
    "C:\\Program Files (x86)\\Hubstaff\\Hubstaff.exe",
  ],
  hubstaffCli: [
    "C:\\Program Files\\Hubstaff\\HubstaffCLI.exe",
    "C:\\Program Files (x86)\\Hubstaff\\HubstaffCLI.exe",
  ],
  slack: [
    `${process.env.LOCALAPPDATA}\\slack\\slack.exe`,
    "C:\\Program Files\\Slack\\slack.exe",
    `${process.env.LOCALAPPDATA}\\Microsoft\\WindowsApps\\slack.exe`,
  ],
  teams: [
    `${process.env.LOCALAPPDATA}\\Microsoft\\Teams\\Update.exe`,
    `${process.env.LOCALAPPDATA}\\Microsoft\\Teams\\current\\Teams.exe`,
    "C:\\Program Files\\Microsoft Teams\\MSTeams.exe",
    "C:\\Program Files (x86)\\Microsoft Teams\\MSTeams.exe",
    `${process.env.LOCALAPPDATA}\\Microsoft\\WindowsApps\\ms-teams.exe`,
  ],
  figma: [
    `${process.env.LOCALAPPDATA}\\Figma\\Figma.exe`,
    `${process.env.LOCALAPPDATA}\\Programs\\Figma\\Figma.exe`,
    "C:\\Program Files\\Figma\\Figma.exe",
  ],
  postman: [
    `${process.env.LOCALAPPDATA}\\Postman\\Postman.exe`,
    `${process.env.LOCALAPPDATA}\\Programs\\Postman\\Postman.exe`,
    "C:\\Program Files\\Postman\\Postman.exe",
  ],
  docker: [
    "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe",
    `${process.env.LOCALAPPDATA}\\Docker\\Docker Desktop.exe`,
    `${process.env.APPDATA}\\Docker\\Docker Desktop.exe`,
  ],
  visualStudio: [
    "C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\devenv.exe",
    "C:\\Program Files\\Microsoft Visual Studio\\2022\\Professional\\Common7\\IDE\\devenv.exe",
    "C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise\\Common7\\IDE\\devenv.exe",
    "C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\Common7\\IDE\\devenv.exe",
    "C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Professional\\Common7\\IDE\\devenv.exe",
  ],
  vscode: [
    `${process.env.LOCALAPPDATA}\\Programs\\Microsoft VS Code\\Code.exe`,
    "C:\\Program Files\\Microsoft VS Code\\Code.exe",
  ],
  pycharm: [
    "C:\\Program Files\\JetBrains\\PyCharm 2025.3.2.1\\bin\\pycharm64.exe",
    `${process.env.LOCALAPPDATA}\\Programs\\PyCharm Community\\bin\\pycharm64.exe`,
    `${process.env.LOCALAPPDATA}\\Programs\\PyCharm Professional\\bin\\pycharm64.exe`,
    "C:\\Program Files\\JetBrains\\PyCharm Community Edition 2024.1\\bin\\pycharm64.exe",
    "C:\\Program Files\\JetBrains\\PyCharm Community Edition 2023.3\\bin\\pycharm64.exe",
    "C:\\Program Files\\JetBrains\\PyCharm 2024.1\\bin\\pycharm64.exe",
    "C:\\Program Files\\JetBrains\\PyCharm 2023.3\\bin\\pycharm64.exe",
    `${process.env.LOCALAPPDATA}\\JetBrains\\Toolbox\\apps\\PyCharm-C\\ch-0\\*\\bin\\pycharm64.exe`,
    `${process.env.LOCALAPPDATA}\\JetBrains\\Toolbox\\apps\\PyCharm-P\\ch-0\\*\\bin\\pycharm64.exe`,
  ],
  chrome: [
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ],
  firefox: [
    "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
    "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
  ],
  mongodb: [
    `${process.env.LOCALAPPDATA}\\MongoDBCompass\\MongoDBCompass.exe`,
    `${process.env.LOCALAPPDATA}\\Programs\\MongoDB Compass\\MongoDBCompass.exe`,
    "C:\\Program Files\\MongoDB Compass\\MongoDBCompass.exe",
    "C:\\Program Files (x86)\\MongoDB Compass\\MongoDBCompass.exe",
    `${process.env.LOCALAPPDATA}\\MongoDBCompass Community\\MongoDBCompass Community.exe`,
  ],
  dbeaver: [
    "C:\\Program Files\\DBeaver\\dbeaver.exe",
    `${process.env.LOCALAPPDATA}\\Programs\\DBeaver\\dbeaver.exe`,
  ],
  tableplus: [
    `${process.env.LOCALAPPDATA}\\Programs\\TablePlus\\TablePlus.exe`,
    "C:\\Program Files\\TablePlus\\TablePlus.exe",
  ],
  spotify: [
    `${process.env.APPDATA}\\Spotify\\Spotify.exe`,
    `${process.env.LOCALAPPDATA}\\Microsoft\\WindowsApps\\Spotify.exe`,
  ],
};

/**
 * Find the first existing executable path from a list of possible paths
 * @param {string[]} possiblePaths - Array of possible file paths
 * @returns {string|null} - The first existing path or null
 */
function findExecutable(possiblePaths) {
  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    } catch (error) {
      console.error(`Error checking path ${filePath}:`, error.message);
    }
  }
  return null;
}

/**
 * Detect installed applications and return their paths
 * @returns {Object} - Object containing detected app paths
 */
function detectInstalledApps() {
  const detected = {};

  for (const [appName, paths] of Object.entries(DEFAULT_APP_PATHS)) {
    const foundPath = findExecutable(paths);
    if (foundPath) {
      detected[appName] = {
        path: foundPath,
        enabled: true,
      };
    }
  }

  return detected;
}

/**
 * Get the display name for an app
 * @param {string} appKey - The app key
 * @returns {string} - Display name
 */
function getAppDisplayName(appKey) {
  const names = {
    hubstaff: "Hubstaff",
    hubstaffCli: "Hubstaff CLI",
    slack: "Slack",
    teams: "Microsoft Teams",
    figma: "Figma",
    postman: "Postman",
    docker: "Docker Desktop",
    visualStudio: "Visual Studio",
    vscode: "VS Code",
    pycharm: "PyCharm",
    chrome: "Google Chrome",
    firefox: "Firefox",
    mongodb: "MongoDB Compass",
    dbeaver: "DBeaver",
    tableplus: "TablePlus",
    spotify: "Spotify",
  };
  return names[appKey] || appKey;
}

/**
 * Get all available code editors (VS Code and PyCharm)
 * @returns {Array} - Array of objects with path and name for each found editor
 */
function getCodeEditors() {
  const editors = [];

  // Check VS Code
  const vscodePath = findExecutable(DEFAULT_APP_PATHS.vscode);
  if (vscodePath) {
    editors.push({
      path: vscodePath,
      name: "vscode",
      displayName: "VS Code",
    });
  }

  // Check PyCharm
  const pycharmPath = findExecutable(DEFAULT_APP_PATHS.pycharm);
  if (pycharmPath) {
    editors.push({
      path: pycharmPath,
      name: "pycharm",
      displayName: "PyCharm",
    });
  }

  return editors;
}

module.exports = {
  DEFAULT_APP_PATHS,
  findExecutable,
  detectInstalledApps,
  getAllInstalledApps,
  getAppDisplayName,
  getCodeEditors,
};
