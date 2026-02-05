const fs = require("fs");
const path = require("path");

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
  discord: [
    `${process.env.LOCALAPPDATA}\\Discord\\Update.exe`,
    `${process.env.LOCALAPPDATA}\\Discord\\app-*\\Discord.exe`,
    "C:\\Program Files\\Discord\\Discord.exe",
  ],
  notion: [
    `${process.env.LOCALAPPDATA}\\Programs\\Notion\\Notion.exe`,
    `${process.env.LOCALAPPDATA}\\Notion\\Notion.exe`,
    "C:\\Program Files\\Notion\\Notion.exe",
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
  edge: [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
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
    discord: "Discord",
    notion: "Notion",
    figma: "Figma",
    postman: "Postman",
    docker: "Docker Desktop",
    visualStudio: "Visual Studio",
    vscode: "VS Code",
    pycharm: "PyCharm",
    chrome: "Google Chrome",
    firefox: "Firefox",
    edge: "Microsoft Edge",
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
  getAppDisplayName,
  getCodeEditors,
};
