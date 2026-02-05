const { app } = require("electron");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SHORTCUT_NAME = "Work Launcher.lnk";

/**
 * Get the Windows Startup folder path
 */
function getStartupFolder() {
  return path.join(
    process.env.APPDATA,
    "Microsoft",
    "Windows",
    "Start Menu",
    "Programs",
    "Startup",
  );
}

/**
 * Enable auto-launch using Startup folder shortcut (fastest method)
 * @returns {Promise<void>}
 */
async function enableAutoLaunch() {
  return new Promise((resolve, reject) => {
    try {
      const exePath = app.getPath("exe");
      const startupFolder = getStartupFolder();
      const shortcutPath = path.join(startupFolder, SHORTCUT_NAME);
      const workingDir = path.dirname(exePath);

      // Create a VBScript to make the shortcut (more reliable than PowerShell escaping)
      const vbsContent = `
Set WshShell = CreateObject("WScript.Shell")
Set Shortcut = WshShell.CreateShortcut("${shortcutPath.replace(/\\/g, "\\\\")}")
Shortcut.TargetPath = "${exePath.replace(/\\/g, "\\\\")}"
Shortcut.Arguments = "--startup"
Shortcut.WorkingDirectory = "${workingDir.replace(/\\/g, "\\\\")}"
Shortcut.Save
`;

      const vbsPath = path.join(app.getPath("temp"), "create_shortcut.vbs");
      fs.writeFileSync(vbsPath, vbsContent);

      execSync(`cscript //nologo "${vbsPath}"`, { windowsHide: true });

      // Clean up
      try {
        fs.unlinkSync(vbsPath);
      } catch (e) {}

      console.log("Auto-launch enabled via Startup folder");
      resolve();
    } catch (error) {
      console.error("Failed to enable auto-launch:", error.message);
      reject(error);
    }
  });
}

/**
 * Disable auto-launch
 * @returns {Promise<void>}
 */
async function disableAutoLaunch() {
  return new Promise((resolve, reject) => {
    try {
      const startupFolder = getStartupFolder();
      const shortcutPath = path.join(startupFolder, SHORTCUT_NAME);

      // Delete shortcut if exists
      if (fs.existsSync(shortcutPath)) {
        fs.unlinkSync(shortcutPath);
      }

      // Also clean up old Task Scheduler entries
      try {
        execSync(`schtasks /delete /tn "WorkLauncherStartup" /f`, {
          windowsHide: true,
          stdio: "ignore",
        });
      } catch (e) {}

      // Also clean up old Registry entries
      try {
        execSync(
          `reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "WorkLauncher" /f`,
          { windowsHide: true, stdio: "ignore" },
        );
      } catch (e) {}

      console.log("Auto-launch disabled successfully");
      resolve();
    } catch (error) {
      console.log("Auto-launch already disabled");
      resolve();
    }
  });
}

/**
 * Check if auto-launch is enabled
 * @returns {Promise<boolean>}
 */
async function isAutoLaunchEnabled() {
  try {
    const startupFolder = getStartupFolder();
    const shortcutPath = path.join(startupFolder, SHORTCUT_NAME);
    return fs.existsSync(shortcutPath);
  } catch (error) {
    return false;
  }
}

module.exports = {
  enableAutoLaunch,
  disableAutoLaunch,
  isAutoLaunchEnabled,
};
