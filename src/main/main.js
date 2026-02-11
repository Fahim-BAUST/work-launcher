const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
  globalShortcut,
  shell,
} = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");
const { autoUpdater } = require("electron-updater");
const {
  launchApp,
  launchMultipleApps,
  launchHubstaff,
  getHubstaffOrganizations,
  getHubstaffProjects,
  startHubstaffProject,
} = require("./appLauncher");
const {
  detectInstalledApps,
  getAllInstalledApps,
  getAppDisplayName,
  findExecutable,
  DEFAULT_APP_PATHS,
} = require("./appPaths");
const {
  enableAutoLaunch,
  disableAutoLaunch,
  isAutoLaunchEnabled,
  fixBrokenStartupShortcut,
  migrateToTaskScheduler,
} = require("./autoLaunch");

// Helper to get asset path (works in both dev and production)
function getAssetPath(assetName) {
  if (app.isPackaged) {
    // In production, assets are in resources folder next to app.asar
    return path.join(process.resourcesPath, "assets", assetName);
  }
  // In development, assets are relative to project root
  return path.join(__dirname, "../../assets", assetName);
}

// Handle Squirrel.Windows events (install/update/uninstall)
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require("child_process");
  const appFolder = path.resolve(process.execPath, "..");
  const rootAtomFolder = path.resolve(appFolder, "..");
  const updateDotExe = path.resolve(path.join(rootAtomFolder, "Update.exe"));
  const exeName = path.basename(process.execPath);

  const spawn = function (command, args) {
    let spawnedProcess;
    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
    } catch (error) {
      console.error("Error spawning Squirrel process:", error);
    }
    return spawnedProcess;
  };

  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case "--squirrel-install":
    case "--squirrel-updated":
      // Create desktop and start menu shortcuts
      spawnUpdate([
        "--createShortcut",
        exeName,
        "--shortcut-locations",
        "Desktop,StartMenu",
      ]);
      setTimeout(app.quit, 1000);
      return true;

    case "--squirrel-uninstall":
      // Remove desktop and start menu shortcuts
      spawnUpdate(["--removeShortcut", exeName]);
      setTimeout(app.quit, 1000);
      return true;

    case "--squirrel-obsolete":
      app.quit();
      return true;
  }

  return false;
}

// Quit during install/uninstall
if (handleSquirrelEvent()) {
  return;
}

// Store for persistent settings
const Store = require("electron-store");
const store = new Store({
  defaults: {
    apps: {},
    customApps: {},
    appOrder: [], // Array of app keys in launch order
    profiles: {
      default: { name: "Default", apps: {} },
    },
    activeProfile: "default",
    autoLaunchEnabled: false,
    showStartupDialog: true,
    minimizeToTray: true,
    firstRun: true,
    theme: "dark",
    launchDelay: 1000,
    globalShortcut: "CommandOrControl+Shift+L",
    shortcutEnabled: true,
    notes: [],
    noteOrder: [], // Array of note IDs in display order
    activeNoteId: null,
    // Scheduled launches
    scheduledLaunch: {
      enabled: false,
      time: "09:00",
      days: [1, 2, 3, 4, 5], // Monday to Friday
    },
    // Day-based profiles
    dayBasedProfiles: {
      enabled: false,
      mapping: {
        0: "default", // Sunday
        1: "default", // Monday
        2: "default", // Tuesday
        3: "default", // Wednesday
        4: "default", // Thursday
        5: "default", // Friday
        6: "default", // Saturday
      },
    },
  },
});

let mainWindow = null;
let tray = null;

// ============================================
// Auto-Update Configuration
// ============================================
autoUpdater.autoDownload = false; // Don't auto-download, ask user first
autoUpdater.autoInstallOnAppQuit = true;

// Store for pending update info
let pendingUpdateInfo = null;

// Auto-update event handlers
autoUpdater.on("checking-for-update", () => {
  console.log("Checking for updates...");
});

autoUpdater.on("update-available", (info) => {
  console.log("Update available:", info.version);
  pendingUpdateInfo = info;
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("update-available", {
      version: info.version,
      releaseNotes: info.releaseNotes,
    });
  }
});

autoUpdater.on("update-not-available", (info) => {
  console.log("No updates available. Current version:", app.getVersion());
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("update-not-available");
  }
});

autoUpdater.on("download-progress", (progressObj) => {
  console.log(`Download progress: ${Math.round(progressObj.percent)}%`);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(
      "update-download-progress",
      progressObj.percent,
    );
    mainWindow.setProgressBar(progressObj.percent / 100);
  }
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("Update downloaded:", info.version);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setProgressBar(-1); // Remove progress bar
    mainWindow.webContents.send("update-downloaded", {
      version: info.version,
    });
  }
});

autoUpdater.on("error", (error) => {
  console.error("Auto-update error:", error.message);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("update-error", error.message);
  }
});

/**
 * Check for updates (only in production)
 */
function checkForUpdates() {
  if (app.isPackaged) {
    autoUpdater.checkForUpdates().catch((err) => {
      console.error("Failed to check for updates:", err.message);
    });
  }
}

// ============================================

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

/**
 * Create the main settings window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 750,
    height: 950,
    resizable: true,
    minWidth: 650,
    minHeight: 700,
    icon: getAssetPath("icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  // Remove menu bar
  mainWindow.setMenuBarVisibility(false);

  // Minimize to tray instead of closing
  mainWindow.on("close", (event) => {
    if (!app.isQuitting && store.get("minimizeToTray")) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/**
 * Show startup confirmation dialog
 * @returns {Promise<boolean>} - True if user wants to start apps
 */
async function showStartupDialog() {
  // Get configured apps
  const apps = store.get("apps");
  const enabledApps = Object.entries(apps)
    .filter(([_, config]) => config.enabled)
    .map(([key, _]) => getAppDisplayName(key));

  if (enabledApps.length === 0) {
    return false;
  }

  const appList = enabledApps.join(", ");

  const { response } = await dialog.showMessageBox({
    type: "question",
    title: "Work Launcher",
    message: "Ready to start working?",
    detail: `This will launch:\n${appList}\n\nDo you want to open these applications?`,
    buttons: ["🚀 Start Work", "❌ Skip"],
    defaultId: 0,
    cancelId: 1,
    noLink: true,
  });

  return response === 0;
}

/**
 * Create system tray icon and menu
 */
function createTray() {
  // Create tray icon
  const iconPath = getAssetPath("icon.ico");
  tray = new Tray(iconPath);

  updateTrayMenu();

  tray.setToolTip("Work Launcher");

  // Single click to open settings
  tray.on("click", () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
  });
}

/**
 * Update tray menu with current profiles and quick app launchers
 */
function updateTrayMenu() {
  const profiles = store.get("profiles");
  const activeProfile = store.get("activeProfile");
  const apps = store.get("apps");

  const profileMenuItems = Object.entries(profiles).map(([id, profile]) => ({
    label: `${id === activeProfile ? "✓ " : "   "}${profile.name}`,
    click: async () => {
      store.set("activeProfile", id);
      // Load the profile's app settings
      const currentApps = store.get("apps");
      for (const [appKey, appConfig] of Object.entries(currentApps)) {
        if (profile.apps[appKey] !== undefined) {
          appConfig.enabled = profile.apps[appKey];
        }
      }
      store.set("apps", currentApps);
      updateTrayMenu();
      // Notify renderer if window is open
      if (mainWindow) {
        mainWindow.webContents.send("profile-changed", id);
      }
    },
  }));

  // Build quick launch menu items for enabled apps
  const enabledApps = Object.entries(apps)
    .filter(([key, config]) => config.enabled && key !== "hubstaffCli")
    .slice(0, 10); // Limit to 10 to keep menu manageable

  const quickLaunchItems = enabledApps.map(([key, config]) => ({
    label: config.customName || getAppDisplayName(key),
    click: async () => {
      try {
        if (config.isUrl) {
          await shell.openExternal(config.path);
        } else {
          await launchApp(config.path, config.args || []);
        }
      } catch (error) {
        console.error(`Failed to launch ${key}:`, error);
      }
    },
  }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "🚀 Launch All Apps",
      click: async () => {
        const allApps = store.get("apps");
        const delay = store.get("launchDelay", 1000);

        // Launch URLs first
        for (const [key, config] of Object.entries(allApps)) {
          if (config.enabled && config.isUrl) {
            try {
              await shell.openExternal(config.path);
            } catch (error) {
              console.error(`Failed to open URL ${config.path}:`, error);
            }
          }
        }

        if (allApps.hubstaff && allApps.hubstaff.enabled) {
          const hubstaffCliPath = findExecutable(DEFAULT_APP_PATHS.hubstaffCli);
          if (hubstaffCliPath) {
            await launchHubstaff(allApps.hubstaff.path, hubstaffCliPath);
            delete allApps.hubstaff;
          }
        }

        // Launch non-URL apps
        const appsToLaunch = {};
        for (const [key, config] of Object.entries(allApps)) {
          if (!config.isUrl) {
            appsToLaunch[key] = config;
          }
        }
        await launchMultipleApps(appsToLaunch, delay);
      },
    },
    { type: "separator" },
    ...(quickLaunchItems.length > 0
      ? [
          {
            label: "⚡ Quick Launch",
            submenu: quickLaunchItems,
          },
          { type: "separator" },
        ]
      : []),
    {
      label: "📋 Profiles",
      submenu: profileMenuItems,
    },
    { type: "separator" },
    {
      label: "⚙️ Settings",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      },
    },
    { type: "separator" },
    {
      label: "❌ Quit",
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

/**
 * Main startup flow
 */
async function startupFlow() {
  // Detect and save apps on first run
  if (store.get("firstRun")) {
    const detectedApps = detectInstalledApps();
    store.set("apps", detectedApps);
    store.set("firstRun", false);

    // Create tray and open settings window on first run
    createTray();
    createWindow();
    return;
  }

  // Check if startup dialog is enabled - show it FIRST before creating tray
  if (store.get("showStartupDialog")) {
    // Show startup dialog immediately
    const shouldLaunch = await showStartupDialog();

    // Now create tray in background
    createTray();

    if (shouldLaunch) {
      const apps = store.get("apps");

      // Handle Hubstaff specially - try to start timer
      if (apps.hubstaff && apps.hubstaff.enabled) {
        const hubstaffCliPath = findExecutable(DEFAULT_APP_PATHS.hubstaffCli);

        if (hubstaffCliPath) {
          console.log("Found Hubstaff CLI at:", hubstaffCliPath);
          const hubstaffResult = await launchHubstaff(
            apps.hubstaff.path,
            hubstaffCliPath,
          );

          if (hubstaffResult.appLaunched) {
            console.log(
              "Hubstaff launched. Timer started:",
              hubstaffResult.timerStarted,
            );
            if (!hubstaffResult.timerStarted) {
              // Timer couldn't be auto-started, user needs to select project
              dialog.showMessageBox({
                type: "info",
                title: "Hubstaff",
                message: "Hubstaff launched successfully!",
                detail:
                  "Please select a project in Hubstaff to start tracking time.",
              });
            }
          }

          // Remove hubstaff from the apps list so it's not launched twice
          delete apps.hubstaff;
        }
      }

      // Launch remaining apps
      const delay = store.get("launchDelay", 1000);
      const results = await launchMultipleApps(apps, delay);

      // Show results notification
      if (results.failed.length > 0) {
        const failedNames = results.failed.map((f) => f.name).join(", ");
        dialog.showMessageBox({
          type: "warning",
          title: "Launch Results",
          message: "Some applications failed to launch",
          detail: `Failed: ${failedNames}\n\nSuccessfully launched: ${results.success.length} apps`,
        });
      }
    }
    return;
  }

  // Startup dialog disabled - create tray first then auto-launch
  createTray();

  // Auto-launch apps without asking
  const apps = store.get("apps");
  const enabledApps = Object.entries(apps).filter(
    ([_, config]) => config.enabled,
  );

  if (enabledApps.length > 0) {
    if (apps.hubstaff && apps.hubstaff.enabled) {
      const hubstaffCliPath = findExecutable(DEFAULT_APP_PATHS.hubstaffCli);
      if (hubstaffCliPath) {
        await launchHubstaff(apps.hubstaff.path, hubstaffCliPath);
        delete apps.hubstaff;
      }
    }
    const delay = store.get("launchDelay", 1000);
    await launchMultipleApps(apps, delay);
  }
  // Stay running in tray
}

// IPC Handlers
function setupIpcHandlers() {
  // Get all apps configuration
  ipcMain.handle("get-apps", () => {
    return store.get("apps");
  });

  // Save apps configuration
  ipcMain.handle("save-apps", (event, apps) => {
    store.set("apps", apps);
    return true;
  });

  // Detect installed apps
  ipcMain.handle("detect-apps", () => {
    const detected = detectInstalledApps();
    store.set("apps", detected);
    return detected;
  });

  // Get all available apps (for add app modal) - scans Start Menu
  ipcMain.handle("get-available-apps", () => {
    return getAllInstalledApps();
  });

  // Get auto-launch status
  ipcMain.handle("get-autolaunch-status", async () => {
    return await isAutoLaunchEnabled();
  });

  // Toggle auto-launch
  ipcMain.handle("toggle-autolaunch", async (event, enabled) => {
    if (enabled) {
      await enableAutoLaunch();
    } else {
      await disableAutoLaunch();
    }
    store.set("autoLaunchEnabled", enabled);
    return enabled;
  });

  // Launch apps now
  ipcMain.handle("launch-apps-now", async () => {
    const apps = store.get("apps");
    const appOrder = store.get("appOrder", []);
    const delay = store.get("launchDelay", 1000);

    const results = {
      success: [],
      failed: [],
    };

    // Handle Hubstaff specially
    let hubstaffResult = null;
    if (apps.hubstaff && apps.hubstaff.enabled) {
      const hubstaffCliPath = findExecutable(DEFAULT_APP_PATHS.hubstaffCli);
      if (hubstaffCliPath) {
        hubstaffResult = await launchHubstaff(
          apps.hubstaff.path,
          hubstaffCliPath,
        );
        delete apps.hubstaff;
      }
    }

    // Sort apps by saved order
    const orderedApps = {};
    const appKeys = Object.keys(apps).filter((k) => k !== "hubstaffCli");

    // First, add apps in the saved order
    for (const key of appOrder) {
      if (apps[key]) {
        orderedApps[key] = apps[key];
      }
    }
    // Then add any remaining apps not in the order
    for (const key of appKeys) {
      if (!orderedApps[key]) {
        orderedApps[key] = apps[key];
      }
    }

    // Launch URLs first with shell.openExternal
    for (const [appName, config] of Object.entries(orderedApps)) {
      if (config.enabled && config.isUrl) {
        try {
          console.log(`Opening URL: ${config.path}`);
          await shell.openExternal(config.path);
          results.success.push({
            name: appName,
            path: config.path,
            isUrl: true,
          });
          // Small delay between URL opens
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        } catch (error) {
          console.error(`Failed to open URL ${config.path}:`, error);
          results.failed.push({
            name: appName,
            path: config.path,
            error: error.message,
          });
        }
      }
    }

    // Filter out URLs and launch only executable apps
    const executableApps = {};
    for (const [key, config] of Object.entries(orderedApps)) {
      if (!config.isUrl) {
        executableApps[key] = config;
      }
    }

    const appResults = await launchMultipleApps(executableApps, delay);
    results.success.push(...appResults.success);
    results.failed.push(...appResults.failed);

    if (hubstaffResult) {
      if (hubstaffResult.appLaunched) {
        results.success.push({
          name: "hubstaff",
          timerStarted: hubstaffResult.timerStarted,
        });
      } else {
        results.failed.push({ name: "hubstaff", error: hubstaffResult.error });
      }
    }

    return results;
  });

  // Get app display name
  ipcMain.handle("get-app-display-name", (event, appKey) => {
    return getAppDisplayName(appKey);
  });

  // Hubstaff CLI - Get organizations
  ipcMain.handle("hubstaff-get-organizations", async () => {
    const cliPath = findExecutable(DEFAULT_APP_PATHS.hubstaffCli);
    if (!cliPath) return { error: "Hubstaff CLI not found" };
    return await getHubstaffOrganizations(cliPath);
  });

  // Hubstaff CLI - Get projects
  ipcMain.handle("hubstaff-get-projects", async (event, orgId) => {
    const cliPath = findExecutable(DEFAULT_APP_PATHS.hubstaffCli);
    if (!cliPath) return { error: "Hubstaff CLI not found" };
    return await getHubstaffProjects(cliPath, orgId);
  });

  // Hubstaff CLI - Start tracking a project
  ipcMain.handle("hubstaff-start-project", async (event, projectId) => {
    const cliPath = findExecutable(DEFAULT_APP_PATHS.hubstaffCli);
    if (!cliPath) return { error: "Hubstaff CLI not found" };
    return await startHubstaffProject(cliPath, projectId);
  });

  // Get saved Hubstaff project ID
  ipcMain.handle("get-hubstaff-project", () => {
    return store.get("hubstaffProjectId", null);
  });

  // Save Hubstaff project ID
  ipcMain.handle("save-hubstaff-project", (event, projectId) => {
    store.set("hubstaffProjectId", projectId);
    return true;
  });

  // Get startup dialog setting
  ipcMain.handle("get-show-startup-dialog", () => {
    return store.get("showStartupDialog", true);
  });

  // Toggle startup dialog
  ipcMain.handle("toggle-show-startup-dialog", (event, enabled) => {
    store.set("showStartupDialog", enabled);
    return enabled;
  });

  // Get minimize to tray setting
  ipcMain.handle("get-minimize-to-tray", () => {
    return store.get("minimizeToTray", true);
  });

  // Toggle minimize to tray
  ipcMain.handle("toggle-minimize-to-tray", (event, enabled) => {
    store.set("minimizeToTray", enabled);
    return enabled;
  });

  // Browse for executable file
  ipcMain.handle("browse-for-app", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Select Application",
      filters: [
        { name: "Executables", extensions: ["exe", "bat", "cmd"] },
        { name: "All Files", extensions: ["*"] },
      ],
      properties: ["openFile"],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  });

  // Add custom app
  ipcMain.handle("add-custom-app", (event, { name, path }) => {
    const apps = store.get("apps");
    const customKey = `custom_${Date.now()}`;
    apps[customKey] = {
      path: path,
      enabled: true,
      isCustom: true,
      customName: name,
    };
    store.set("apps", apps);
    return apps;
  });

  // Remove app
  ipcMain.handle("remove-app", (event, appKey) => {
    const apps = store.get("apps");
    if (apps[appKey]) {
      delete apps[appKey];
      store.set("apps", apps);
    }
    return apps;
  });

  // Get theme
  ipcMain.handle("get-theme", () => {
    return store.get("theme", "dark");
  });

  // Set theme
  ipcMain.handle("set-theme", (event, theme) => {
    store.set("theme", theme);
    return theme;
  });

  // Profile management
  ipcMain.handle("get-profiles", () => {
    return store.get("profiles", { default: { name: "Default", apps: {} } });
  });

  ipcMain.handle("get-active-profile", () => {
    return store.get("activeProfile", "default");
  });

  ipcMain.handle("set-active-profile", (event, profileId) => {
    store.set("activeProfile", profileId);
    // Load the profile's app settings
    const profiles = store.get("profiles");
    if (profiles[profileId]) {
      const apps = store.get("apps");
      // Apply profile's enabled states to apps
      for (const [appKey, appConfig] of Object.entries(apps)) {
        if (profiles[profileId].apps[appKey] !== undefined) {
          appConfig.enabled = profiles[profileId].apps[appKey];
        }
      }
      store.set("apps", apps);
    }
    return profileId;
  });

  ipcMain.handle("create-profile", (event, { id, name }) => {
    const profiles = store.get("profiles");
    const apps = store.get("apps");
    // Create new profile with current app enabled states
    const profileApps = {};
    for (const [appKey, appConfig] of Object.entries(apps)) {
      profileApps[appKey] = appConfig.enabled;
    }
    profiles[id] = { name, apps: profileApps };
    store.set("profiles", profiles);
    return profiles;
  });

  ipcMain.handle("update-profile", (event, { id, name }) => {
    const profiles = store.get("profiles");
    if (profiles[id]) {
      profiles[id].name = name;
      store.set("profiles", profiles);
    }
    return profiles;
  });

  ipcMain.handle("delete-profile", (event, profileId) => {
    if (profileId === "default") return store.get("profiles"); // Can't delete default
    const profiles = store.get("profiles");
    delete profiles[profileId];
    store.set("profiles", profiles);
    // If active profile was deleted, switch to default
    if (store.get("activeProfile") === profileId) {
      store.set("activeProfile", "default");
    }
    return profiles;
  });

  ipcMain.handle("save-profile-apps", (event, profileId) => {
    const profiles = store.get("profiles");
    const apps = store.get("apps");
    if (profiles[profileId]) {
      const profileApps = {};
      for (const [appKey, appConfig] of Object.entries(apps)) {
        profileApps[appKey] = appConfig.enabled;
      }
      profiles[profileId].apps = profileApps;
      store.set("profiles", profiles);
    }
    return profiles;
  });

  // Launch delay settings
  ipcMain.handle("get-launch-delay", () => {
    return store.get("launchDelay", 1000);
  });

  ipcMain.handle("set-launch-delay", (event, delay) => {
    store.set("launchDelay", delay);
    return delay;
  });

  // Global shortcut settings
  ipcMain.handle("get-shortcut-enabled", () => {
    return store.get("shortcutEnabled", true);
  });

  ipcMain.handle("set-shortcut-enabled", (event, enabled) => {
    store.set("shortcutEnabled", enabled);
    if (enabled) {
      registerGlobalShortcut();
    } else {
      globalShortcut.unregisterAll();
    }
    return enabled;
  });

  ipcMain.handle("get-global-shortcut", () => {
    return store.get("globalShortcut", "CommandOrControl+Shift+L");
  });

  // App order management
  ipcMain.handle("get-app-order", () => {
    return store.get("appOrder", []);
  });

  ipcMain.handle("set-app-order", (event, order) => {
    store.set("appOrder", order);
    return order;
  });

  // Notes management
  // Helper to ensure notes is always an array (migration from old string format)
  function getNotesArray() {
    const notes = store.get("notes");
    if (!Array.isArray(notes)) {
      // Migrate old string format to new array format
      const newNotes = [];
      if (typeof notes === "string" && notes.trim()) {
        newNotes.push({
          id: `note_migrated_${Date.now()}`,
          title: "Migrated Note",
          content: `<p>${notes.replace(/\n/g, "</p><p>")}</p>`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      store.set("notes", newNotes);
      return newNotes;
    }
    return notes;
  }

  ipcMain.handle("get-notes", () => {
    return getNotesArray();
  });

  ipcMain.handle("get-active-note-id", () => {
    return store.get("activeNoteId", null);
  });

  ipcMain.handle("set-active-note-id", (event, noteId) => {
    store.set("activeNoteId", noteId);
    return noteId;
  });

  ipcMain.handle("create-note", (event, note) => {
    const notes = getNotesArray();
    notes.unshift(note);
    store.set("notes", notes);
    store.set("activeNoteId", note.id);
    return notes;
  });

  ipcMain.handle("update-note", (event, { id, title, content, priority }) => {
    const notes = getNotesArray();
    const index = notes.findIndex((n) => n.id === id);
    if (index !== -1) {
      notes[index].title = title;
      notes[index].content = content;
      if (priority !== undefined) {
        notes[index].priority = priority;
      }
      notes[index].updatedAt = new Date().toISOString();
      store.set("notes", notes);
    }
    return notes;
  });

  // Note order management
  ipcMain.handle("get-note-order", () => {
    return store.get("noteOrder", []);
  });

  ipcMain.handle("set-note-order", (event, order) => {
    store.set("noteOrder", order);
    return order;
  });

  // Update note priority only
  ipcMain.handle("update-note-priority", (event, { id, priority }) => {
    const notes = getNotesArray();
    const index = notes.findIndex((n) => n.id === id);
    if (index !== -1) {
      notes[index].priority = priority;
      notes[index].updatedAt = new Date().toISOString();
      store.set("notes", notes);
    }
    return notes;
  });

  ipcMain.handle("delete-note", (event, noteId) => {
    let notes = getNotesArray();
    notes = notes.filter((n) => n.id !== noteId);
    store.set("notes", notes);
    const activeNoteId = store.get("activeNoteId");
    if (activeNoteId === noteId) {
      store.set("activeNoteId", notes.length > 0 ? notes[0].id : null);
    }
    return notes;
  });

  // Jira integration
  ipcMain.handle("get-jira-config", () => {
    return store.get("jiraConfig", null);
  });

  ipcMain.handle("save-jira-config", (event, config) => {
    store.set("jiraConfig", config);
    return config;
  });

  // Jira API helper function
  async function jiraApiRequest(config, endpoint, method = "GET", body = null) {
    const https = require("https");
    const http = require("http");
    const url = require("url");

    return new Promise((resolve, reject) => {
      const fullUrl = `${config.serverUrl}${endpoint}`;
      const parsedUrl = url.parse(fullUrl);
      const isHttps = parsedUrl.protocol === "https:";
      const client = isHttps ? https : http;

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.path,
        method: method,
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${config.email}:${config.apiToken}`).toString(
              "base64",
            ),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      const req = client.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const jsonData = data ? JSON.parse(data) : {};
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(jsonData);
            } else {
              reject(
                new Error(
                  jsonData.errorMessages?.[0] ||
                    jsonData.message ||
                    `HTTP ${res.statusCode}`,
                ),
              );
            }
          } catch (e) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({});
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }

  // Helper function for Jira attachment upload (multipart/form-data)
  async function jiraUploadAttachment(config, issueKey, fileData, filename) {
    return new Promise((resolve, reject) => {
      console.log(
        `[Jira Attachment] Starting upload for ${filename} to ${issueKey}`,
      );
      console.log(
        `[Jira Attachment] File data length: ${fileData?.length || 0}`,
      );

      const url = new URL(config.serverUrl);
      const isHttps = url.protocol === "https:";
      const httpModule = isHttps ? https : http;

      // Convert base64 data URL to buffer (supports any file type)
      const base64Match = fileData.match(/^data:([^;]+);base64,(.+)$/);
      if (!base64Match) {
        console.error(
          `[Jira Attachment] Invalid data format. Data starts with: ${fileData?.substring(0, 50)}`,
        );
        reject(new Error("Invalid file data format"));
        return;
      }

      const mimeType = base64Match[1];
      const base64Data = base64Match[2];
      console.log(
        `[Jira Attachment] File type: ${mimeType}, base64 length: ${base64Data.length}`,
      );
      const fileBuffer = Buffer.from(base64Data, "base64");

      // Create multipart boundary
      const boundary = "----JiraAttachment" + Date.now();

      // Build multipart body
      const bodyParts = [];
      bodyParts.push(`--${boundary}`);
      bodyParts.push(
        `Content-Disposition: form-data; name="file"; filename="${filename}"`,
      );
      bodyParts.push(`Content-Type: ${mimeType}`);
      bodyParts.push("");

      const headerBuffer = Buffer.from(bodyParts.join("\r\n") + "\r\n");
      const footerBuffer = Buffer.from(`\r\n--${boundary}--\r\n`);
      const fullBody = Buffer.concat([headerBuffer, fileBuffer, footerBuffer]);

      const auth = Buffer.from(`${config.email}:${config.apiToken}`).toString(
        "base64",
      );

      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: `/rest/api/3/issue/${issueKey}/attachments`,
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": fullBody.length,
          "X-Atlassian-Token": "no-check",
        },
      };

      console.log(
        `[Jira Attachment] Making request to: ${options.hostname}${options.path}`,
      );
      console.log(`[Jira Attachment] Body size: ${fullBody.length} bytes`);

      const req = httpModule.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          console.log(`[Jira Attachment] Response status: ${res.statusCode}`);
          console.log(
            `[Jira Attachment] Response data: ${data.substring(0, 500)}`,
          );
          try {
            const jsonData = data ? JSON.parse(data) : {};
            if (res.statusCode >= 200 && res.statusCode < 300) {
              console.log(`[Jira Attachment] Upload successful!`);
              resolve(jsonData);
            } else {
              console.error(
                `[Jira Attachment] Upload failed: ${jsonData.errorMessages?.[0] || jsonData.message || `HTTP ${res.statusCode}`}`,
              );
              reject(
                new Error(
                  jsonData.errorMessages?.[0] ||
                    jsonData.message ||
                    `HTTP ${res.statusCode}`,
                ),
              );
            }
          } catch (e) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              console.log(
                `[Jira Attachment] Upload successful (non-JSON response)`,
              );
              resolve({});
            } else {
              console.error(
                `[Jira Attachment] Upload failed: HTTP ${res.statusCode}: ${data}`,
              );
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.setTimeout(60000, () => {
        req.destroy();
        reject(new Error("Attachment upload timeout"));
      });

      req.write(fullBody);
      req.end();
    });
  }

  // Test Jira connection
  ipcMain.handle("jira-test-connection", async (event, config) => {
    try {
      await jiraApiRequest(config, "/rest/api/3/myself");
      const projects = await jiraApiRequest(config, "/rest/api/3/project");
      return { success: true, projectCount: projects.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Get Jira projects
  ipcMain.handle("jira-get-projects", async (event, config) => {
    try {
      const projects = await jiraApiRequest(config, "/rest/api/3/project");
      return { success: true, projects };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Get Jira project details (including issue types)
  ipcMain.handle("jira-get-project", async (event, config, projectKey) => {
    try {
      const project = await jiraApiRequest(
        config,
        `/rest/api/3/project/${projectKey}`,
      );
      return { success: true, project };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Get Jira users
  ipcMain.handle("jira-get-users", async (event, config, projectKey) => {
    try {
      // Use assignable/search endpoint to get users who can be assigned issues in this project
      const users = await jiraApiRequest(
        config,
        `/rest/api/3/user/assignable/search?project=${projectKey}&maxResults=1000`,
      );
      return { success: true, users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Get Jira sprints for a project
  ipcMain.handle("jira-get-sprints", async (event, config, projectKey) => {
    try {
      // First get the board ID
      const boards = await jiraApiRequest(
        config,
        `/rest/agile/1.0/board?projectKeyOrId=${projectKey}`,
      );
      if (boards.values && boards.values.length > 0) {
        const boardId = boards.values[0].id;
        const sprints = await jiraApiRequest(
          config,
          `/rest/agile/1.0/board/${boardId}/sprint?state=active,future`,
        );
        return { success: true, sprints: sprints.values || [] };
      }
      return { success: true, sprints: [] };
    } catch (error) {
      return { success: false, error: error.message, sprints: [] };
    }
  });

  // Get Jira epics for a project
  ipcMain.handle("jira-get-epics", async (event, config, projectKey) => {
    try {
      // Search for all Epics in the project using new JQL API
      const result = await jiraApiRequest(
        config,
        "/rest/api/3/search/jql",
        "POST",
        {
          jql: `project = ${projectKey} AND issuetype = Epic ORDER BY created DESC`,
          fields: ["summary", "status"],
          maxResults: 100,
        },
      );
      const epics = (result.issues || []).map((issue) => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status?.name || "Unknown",
      }));
      return { success: true, epics };
    } catch (error) {
      console.error("Failed to load epics:", error.message);
      return { success: false, error: error.message, epics: [] };
    }
  });

  // Create Jira issue
  ipcMain.handle("jira-create-issue", async (event, config, issueData) => {
    try {
      const result = await jiraApiRequest(
        config,
        "/rest/api/3/issue",
        "POST",
        issueData,
      );
      return { success: true, issue: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Get Jira issue by key
  ipcMain.handle("jira-get-issue", async (event, config, issueKey) => {
    try {
      const result = await jiraApiRequest(
        config,
        `/rest/api/3/issue/${issueKey}?fields=summary,issuetype,status`,
      );
      return { success: true, issue: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Upload attachment to Jira issue
  ipcMain.handle(
    "jira-upload-attachment",
    async (event, config, issueKey, imageData, filename) => {
      console.log(
        `[IPC] jira-upload-attachment called for ${filename} to ${issueKey}`,
      );
      try {
        const result = await jiraUploadAttachment(
          config,
          issueKey,
          imageData,
          filename,
        );
        console.log(`[IPC] Upload attachment success for ${filename}`);
        return { success: true, attachment: result };
      } catch (error) {
        console.error(
          `[IPC] Upload attachment failed for ${filename}:`,
          error.message,
        );
        return { success: false, error: error.message };
      }
    },
  );

  // Add issue to sprint
  ipcMain.handle(
    "jira-add-to-sprint",
    async (event, config, sprintId, issueKey) => {
      try {
        await jiraApiRequest(
          config,
          `/rest/agile/1.0/sprint/${sprintId}/issue`,
          "POST",
          { issues: [issueKey] },
        );
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
  );

  // Quit app completely
  ipcMain.handle("quit-app", () => {
    app.isQuitting = true;
    app.quit();
  });

  // Check for updates manually
  ipcMain.handle("check-for-updates", async () => {
    if (!app.isPackaged) {
      return {
        updateAvailable: false,
        message: "Updates only work in packaged app",
      };
    }
    try {
      // checkForUpdates() triggers the autoUpdater events
      // which will send IPC messages to the renderer
      await autoUpdater.checkForUpdates();
      // Return empty - let the events handle the UI update
      return { checking: true };
    } catch (error) {
      return { updateAvailable: false, error: error.message };
    }
  });

  // Get current app version
  ipcMain.handle("get-app-version", () => {
    return app.getVersion();
  });

  // Download update
  ipcMain.handle("download-update", () => {
    autoUpdater.downloadUpdate();
  });

  // Install update and restart
  ipcMain.handle("install-update", () => {
    autoUpdater.quitAndInstall(false, true);
  });

  // Get release notes from GitHub
  ipcMain.handle("get-release-notes", async (event, version) => {
    try {
      const https = require("https");
      const fs = require("fs");
      const path = require("path");
      const url = version
        ? `https://api.github.com/repos/Fahim-BAUST/work-launcher/releases/tags/v${version}`
        : "https://api.github.com/repos/Fahim-BAUST/work-launcher/releases/latest";

      // Try to read local CHANGELOG.md as fallback
      const getLocalChangelog = (targetVersion) => {
        try {
          const changelogPaths = [
            path.join(__dirname, "../../CHANGELOG.md"), // Development mode
            path.join(process.resourcesPath, "CHANGELOG.md"), // Packaged app
            path.join(app.getAppPath(), "CHANGELOG.md"), // Alternative location
          ];

          let content = "";
          for (const changelogPath of changelogPaths) {
            if (fs.existsSync(changelogPath)) {
              content = fs.readFileSync(changelogPath, "utf8");
              break;
            }
          }

          if (content && targetVersion) {
            // Extract the section for this version
            const regex = new RegExp(
              `## \\[${targetVersion}\\][^]*?(?=## \\[|$)`,
              "i",
            );
            const match = content.match(regex);
            if (match) {
              return match[0].trim();
            }
          }
          return null;
        } catch (e) {
          console.error("Error reading changelog:", e);
          return null;
        }
      };

      return new Promise((resolve, reject) => {
        const options = {
          headers: {
            "User-Agent": "Work-Launcher-App",
            Accept: "application/vnd.github.v3+json",
          },
        };

        https
          .get(url, options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
              try {
                const release = JSON.parse(data);
                const releaseVersion =
                  release.tag_name?.replace("v", "") || version;
                let body = release.body;

                // If no body from GitHub, try local changelog
                if (!body || body.trim() === "") {
                  body =
                    getLocalChangelog(releaseVersion) ||
                    "No release notes available.";
                }

                resolve({
                  version: releaseVersion,
                  name: release.name || `Version ${releaseVersion}`,
                  body: body,
                  publishedAt: release.published_at,
                  htmlUrl: release.html_url,
                });
              } catch (e) {
                const localNotes = getLocalChangelog(version);
                resolve({
                  version,
                  body: localNotes || "Unable to load release notes.",
                });
              }
            });
          })
          .on("error", (err) => {
            const localNotes = getLocalChangelog(version);
            resolve({
              version,
              body: localNotes || "Unable to load release notes.",
            });
          });
      });
    } catch (error) {
      return { version, body: "Unable to load release notes." };
    }
  });

  // Get all release notes (changelog)
  ipcMain.handle("get-changelog", async () => {
    try {
      const https = require("https");
      const url =
        "https://api.github.com/repos/Fahim-BAUST/work-launcher/releases";

      return new Promise((resolve, reject) => {
        const options = {
          headers: {
            "User-Agent": "Work-Launcher-App",
            Accept: "application/vnd.github.v3+json",
          },
        };

        https
          .get(url, options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
              try {
                const releases = JSON.parse(data);
                const changelog = releases.slice(0, 10).map((release) => ({
                  version: release.tag_name?.replace("v", ""),
                  name: release.name,
                  body: release.body || "No release notes.",
                  publishedAt: release.published_at,
                  htmlUrl: release.html_url,
                }));
                resolve(changelog);
              } catch (e) {
                resolve([]);
              }
            });
          })
          .on("error", (err) => {
            resolve([]);
          });
      });
    } catch (error) {
      return [];
    }
  });

  // ============================================
  // URL Support
  // ============================================
  ipcMain.handle("add-url", (event, { name, url, category }) => {
    const apps = store.get("apps");
    const urlKey = `url_${Date.now()}`;
    apps[urlKey] = {
      path: url,
      enabled: true,
      isUrl: true,
      customName: name,
      category: category || "url",
    };
    store.set("apps", apps);
    return apps;
  });

  ipcMain.handle("open-url", (event, url) => {
    shell.openExternal(url);
  });

  // ============================================
  // Scheduled Launches
  // ============================================
  ipcMain.handle("get-scheduled-launch", () => {
    return store.get("scheduledLaunch");
  });

  ipcMain.handle("set-scheduled-launch", (event, settings) => {
    store.set("scheduledLaunch", settings);
    setupScheduledLaunch();
    return settings;
  });

  // ============================================
  // Day-Based Profiles
  // ============================================
  ipcMain.handle("get-day-based-profiles", () => {
    return store.get("dayBasedProfiles");
  });

  ipcMain.handle("set-day-based-profiles", (event, settings) => {
    store.set("dayBasedProfiles", settings);
    return settings;
  });

  // ============================================
  // Import/Export Settings
  // ============================================
  ipcMain.handle("export-settings", async () => {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: "Export Settings",
      defaultPath: "work-launcher-settings.json",
      filters: [{ name: "JSON Files", extensions: ["json"] }],
    });

    if (result.canceled || !result.filePath) {
      return { success: false, canceled: true };
    }

    try {
      const settings = {
        version: app.getVersion(),
        exportDate: new Date().toISOString(),
        apps: store.get("apps"),
        appOrder: store.get("appOrder"),
        profiles: store.get("profiles"),
        activeProfile: store.get("activeProfile"),
        scheduledLaunch: store.get("scheduledLaunch"),
        dayBasedProfiles: store.get("dayBasedProfiles"),
        launchDelay: store.get("launchDelay"),
        theme: store.get("theme"),
        notes: store.get("notes"),
      };

      fs.writeFileSync(result.filePath, JSON.stringify(settings, null, 2));
      return { success: true, path: result.filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("import-settings", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Import Settings",
      filters: [{ name: "JSON Files", extensions: ["json"] }],
      properties: ["openFile"],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, canceled: true };
    }

    try {
      const content = fs.readFileSync(result.filePaths[0], "utf8");
      const settings = JSON.parse(content);

      // Validate it's a Work Launcher settings file
      if (!settings.apps || !settings.profiles) {
        return { success: false, error: "Invalid settings file" };
      }

      // Import the settings
      if (settings.apps) store.set("apps", settings.apps);
      if (settings.appOrder) store.set("appOrder", settings.appOrder);
      if (settings.profiles) store.set("profiles", settings.profiles);
      if (settings.activeProfile)
        store.set("activeProfile", settings.activeProfile);
      if (settings.scheduledLaunch)
        store.set("scheduledLaunch", settings.scheduledLaunch);
      if (settings.dayBasedProfiles)
        store.set("dayBasedProfiles", settings.dayBasedProfiles);
      if (settings.launchDelay) store.set("launchDelay", settings.launchDelay);
      if (settings.theme) store.set("theme", settings.theme);
      if (settings.notes) store.set("notes", settings.notes);

      // Rebuild scheduled launch
      setupScheduledLaunch();

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // ============================================
  // Notes Import/Export
  // ============================================
  ipcMain.handle("export-notes", async () => {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: "Export Notes",
      defaultPath: "work-launcher-notes.json",
      filters: [{ name: "JSON Files", extensions: ["json"] }],
    });

    if (result.canceled || !result.filePath) {
      return { success: false, canceled: true };
    }

    try {
      const notes = store.get("notes") || [];
      const exportData = {
        version: app.getVersion(),
        exportDate: new Date().toISOString(),
        notesCount: notes.length,
        notes: notes,
      };

      fs.writeFileSync(result.filePath, JSON.stringify(exportData, null, 2));
      return { success: true, path: result.filePath, count: notes.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("import-notes", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Import Notes",
      filters: [{ name: "JSON Files", extensions: ["json"] }],
      properties: ["openFile"],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, canceled: true };
    }

    try {
      const content = fs.readFileSync(result.filePaths[0], "utf8");
      const importData = JSON.parse(content);

      // Validate it's a notes file
      if (!importData.notes || !Array.isArray(importData.notes)) {
        return { success: false, error: "Invalid notes file" };
      }

      // Get existing notes
      const existingNotes = store.get("notes") || [];

      // Generate new IDs for imported notes to avoid conflicts
      const importedNotes = importData.notes.map((note) => ({
        ...note,
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        createdAt: note.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // Merge notes
      const mergedNotes = [...existingNotes, ...importedNotes];
      store.set("notes", mergedNotes);

      return { success: true, count: importedNotes.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle(
    "export-note-to-pdf",
    async (event, { noteId, noteTitle, noteContent }) => {
      const sanitizedTitle = (noteTitle || "note")
        .replace(/[<>:"/\\|?*]/g, "_")
        .substring(0, 50);

      const result = await dialog.showSaveDialog(mainWindow, {
        title: "Save Note as PDF",
        defaultPath: `${sanitizedTitle}.pdf`,
        filters: [{ name: "PDF Files", extensions: ["pdf"] }],
      });

      if (result.canceled || !result.filePath) {
        return { success: false, canceled: true };
      }

      try {
        // Create a hidden window to render the note
        const { BrowserWindow } = require("electron");
        const pdfWindow = new BrowserWindow({
          width: 800,
          height: 600,
          show: false,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
          },
        });

        // Create HTML content for the PDF
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              line-height: 1.6;
              color: #333;
            }
            h1 {
              color: #1a1a1a;
              border-bottom: 2px solid #10b981;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .content {
              font-size: 14px;
              color: #333;
            }
            .content * {
              color: inherit;
            }
            .content ul, .content ol {
              margin: 10px 0;
              padding-left: 24px;
            }
            .content li {
              margin: 4px 0;
              color: #333;
            }
            /* Strikethrough text */
            s, strike, del {
              text-decoration: line-through;
              color: #666;
            }
            /* Bold, italic, underline */
            b, strong {
              font-weight: bold;
            }
            i, em {
              font-style: italic;
            }
            u {
              text-decoration: underline;
            }
            pre, code {
              background: #f4f4f4;
              padding: 10px;
              border-radius: 4px;
              font-family: 'Consolas', monospace;
              overflow-x: auto;
            }
            blockquote {
              border-left: 4px solid #10b981;
              margin: 10px 0;
              padding: 10px 15px;
              background: #f0fdf4;
              border-radius: 0 8px 8px 0;
            }
            /* Inline Priority Tags */
            .inline-priority-tag {
              display: inline-block;
              padding: 2px 8px;
              margin: 0 4px;
              border-radius: 12px;
              font-size: 0.75rem;
              font-weight: 600;
              vertical-align: middle;
            }
            .inline-priority-tag.priority-highest {
              background: #dc2626;
              color: #fff;
            }
            .inline-priority-tag.priority-high {
              background: #ea580c;
              color: #fff;
            }
            .inline-priority-tag.priority-medium {
              background: #eab308;
              color: #000;
            }
            .inline-priority-tag.priority-low {
              background: #22c55e;
              color: #fff;
            }
            .inline-priority-tag.priority-lowest {
              background: #3b82f6;
              color: #fff;
            }
            .inline-priority-tag.priority-done {
              background: #8b5cf6;
              color: #fff;
              text-decoration: line-through;
            }
            /* Images */
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 10px 0;
            }
            .img-resize-wrapper {
              display: inline-block;
            }
            /* Hide image overlay icons in PDF */
            .img-overlay {
              display: none !important;
            }
            /* Code blocks */
            .code-block-wrapper {
              background: #1e1e1e;
              border-radius: 8px;
              margin: 10px 0;
              overflow: hidden;
            }
            .code-block-wrapper pre {
              margin: 0;
              padding: 15px;
              background: #1e1e1e;
              color: #d4d4d4;
            }
            .code-block-header {
              display: none;
            }
            .code-block-delete-btn {
              display: none;
            }
            /* Quote blocks */
            .blockquote-wrapper {
              margin: 10px 0;
            }
            .blockquote-delete-btn {
              display: none;
            }
            /* Override any CSS variable colors that won't work in PDF */
            div, span, p {
              color: #333 !important;
            }
            /* Ensure strikethrough text is visible but slightly muted */
            s, strike, del {
              color: #666 !important;
            }
            /* Don't override tag colors */
            .inline-priority-tag, .inline-priority-tag * {
              color: inherit !important;
            }
            .inline-priority-tag.priority-medium, .inline-priority-tag.priority-medium * {
              color: #000 !important;
            }
            .meta {
              color: #666;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <h1>${noteTitle || "Untitled Note"}</h1>
          <div class="content">__NOTE_CONTENT_PLACEHOLDER__</div>
          <div class="meta">Exported from Work Launcher on ${new Date().toLocaleString()}</div>
        </body>
        </html>
      `;

        // Clean the note content to remove inline color styles that might cause visibility issues
        // This handles CSS variables, font tags with color, and light colors from dark mode
        let cleanedContent = (noteContent || "")
          // Remove CSS variable color references (but not background-color or border-color)
          .replace(/([^-])color:\s*var\([^)]+\);?/gi, "$1")
          // Remove font tags' color attribute but keep the content
          .replace(/<font[^>]*\scolor="[^"]*"[^>]*>/gi, "<span>")
          .replace(/<\/font>/gi, "</span>")
          // Remove inline text color styles (not background-color or border-color)
          .replace(/([;"\s])color:\s*[^;"]+;?/gi, "$1")
          // Clean up empty style attributes
          .replace(/style="\s*;?\s*"/gi, "");

        // Insert cleaned content into template
        const finalHtml = htmlContent.replace(
          "__NOTE_CONTENT_PLACEHOLDER__",
          cleanedContent,
        );

        await pdfWindow.loadURL(
          `data:text/html;charset=utf-8,${encodeURIComponent(finalHtml)}`,
        );

        const pdfData = await pdfWindow.webContents.printToPDF({
          marginType: 0,
          printBackground: true,
          printSelectionOnly: false,
          landscape: false,
          pageSize: "A4",
        });

        fs.writeFileSync(result.filePath, pdfData);
        pdfWindow.close();

        return { success: true, path: result.filePath };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
  );

  // ============================================
  // App Icon Extraction
  // ============================================
  ipcMain.handle("get-app-icon", async (event, exePath) => {
    try {
      const icon = await app.getFileIcon(exePath, { size: "normal" });
      return icon.toDataURL();
    } catch (error) {
      return null;
    }
  });

  // ============================================
  // App Categories
  // ============================================
  ipcMain.handle("get-app-category", (event, appKey) => {
    const apps = store.get("apps");
    if (apps[appKey] && apps[appKey].category) {
      return apps[appKey].category;
    }
    return getDefaultCategory(appKey);
  });

  ipcMain.handle("set-app-category", (event, { appKey, category }) => {
    const apps = store.get("apps");
    if (apps[appKey]) {
      apps[appKey].category = category;
      store.set("apps", apps);
    }
    return apps;
  });

  // ============================================
  // Chrome Profile Management
  // ============================================
  ipcMain.handle("get-chrome-profiles", async () => {
    return getChromeProfiles();
  });

  ipcMain.handle("set-chrome-profile", (event, { appKey, profileDir }) => {
    const apps = store.get("apps");
    if (apps[appKey]) {
      // Set the profile directory and update args
      apps[appKey].chromeProfile = profileDir;
      if (profileDir) {
        apps[appKey].args = [`--profile-directory=${profileDir}`];
      } else {
        apps[appKey].args = [];
      }
      store.set("apps", apps);
    }
    return apps;
  });

  // Launch single app from tray
  ipcMain.handle("launch-single-app", async (event, appKey) => {
    const apps = store.get("apps");
    const appConfig = apps[appKey];

    if (!appConfig) {
      return { success: false, error: "App not found" };
    }

    try {
      if (appConfig.isUrl) {
        await shell.openExternal(appConfig.path);
      } else {
        await launchApp(appConfig.path, appConfig.args || []);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}

// App category detection
const categoryMapping = {
  // Communication
  slack: "communication",
  teams: "communication",
  discord: "communication",
  zoom: "communication",
  skype: "communication",
  // Development
  visualStudio: "development",
  vscode: "development",
  pycharm: "development",
  intellij: "development",
  webstorm: "development",
  sublime: "development",
  atom: "development",
  notepad: "development",
  git: "development",
  postman: "development",
  docker: "development",
  // Browsers
  chrome: "browser",
  firefox: "browser",
  edge: "browser",
  opera: "browser",
  brave: "browser",
  // Productivity
  notion: "productivity",
  obsidian: "productivity",
  todoist: "productivity",
  trello: "productivity",
  asana: "productivity",
  figma: "productivity",
  // Database
  mongodb: "database",
  dbeaver: "database",
  tableplus: "database",
  mysql: "database",
  pgadmin: "database",
  // Media
  spotify: "media",
  vlc: "media",
  // Time tracking
  hubstaff: "productivity",
};

function getDefaultCategory(appKey) {
  const key = appKey.toLowerCase().replace(/[^a-z]/g, "");
  for (const [pattern, category] of Object.entries(categoryMapping)) {
    if (key.includes(pattern.toLowerCase())) {
      return category;
    }
  }
  return "other";
}

/**
 * Get Chrome profiles from the Chrome User Data directory
 * @returns {Array} - Array of profile objects { name, dir, displayName }
 */
function getChromeProfiles() {
  const profiles = [];
  const chromeUserDataPath = path.join(
    process.env.LOCALAPPDATA,
    "Google",
    "Chrome",
    "User Data",
  );

  try {
    if (!fs.existsSync(chromeUserDataPath)) {
      return profiles;
    }

    // Read the Local State file to get profile names
    const localStatePath = path.join(chromeUserDataPath, "Local State");
    if (fs.existsSync(localStatePath)) {
      const localState = JSON.parse(fs.readFileSync(localStatePath, "utf8"));
      const profileInfo = localState.profile?.info_cache || {};

      for (const [profileDir, info] of Object.entries(profileInfo)) {
        profiles.push({
          dir: profileDir,
          name: info.name || profileDir,
          shortcutName: info.shortcut_name || info.name || profileDir,
          avatarIcon: info.avatar_icon || null,
        });
      }
    }

    // If no profiles found from Local State, scan directories
    if (profiles.length === 0) {
      const items = fs.readdirSync(chromeUserDataPath, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory()) {
          // Check for Profile directories (Default, Profile 1, Profile 2, etc.)
          if (item.name === "Default" || item.name.startsWith("Profile ")) {
            const prefsPath = path.join(
              chromeUserDataPath,
              item.name,
              "Preferences",
            );
            let displayName = item.name === "Default" ? "Default" : item.name;

            // Try to read the profile name from Preferences
            if (fs.existsSync(prefsPath)) {
              try {
                const prefs = JSON.parse(fs.readFileSync(prefsPath, "utf8"));
                if (prefs.profile?.name) {
                  displayName = prefs.profile.name;
                }
              } catch (e) {
                // Use default name
              }
            }

            profiles.push({
              dir: item.name,
              name: displayName,
              shortcutName: displayName,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error reading Chrome profiles:", error);
  }

  return profiles;
}

// Scheduled launch timer
let scheduledLaunchTimer = null;

function setupScheduledLaunch() {
  // Clear existing timer
  if (scheduledLaunchTimer) {
    clearInterval(scheduledLaunchTimer);
    scheduledLaunchTimer = null;
  }

  const settings = store.get("scheduledLaunch");
  if (!settings || !settings.enabled) {
    return;
  }

  // Check every minute
  scheduledLaunchTimer = setInterval(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (settings.days.includes(currentDay) && currentTime === settings.time) {
      console.log("Scheduled launch triggered");
      launchAppsFromSchedule();
    }
  }, 60000); // Check every minute

  console.log("Scheduled launch configured:", settings);
}

async function launchAppsFromSchedule() {
  // Check if day-based profiles is enabled
  const dayBasedSettings = store.get("dayBasedProfiles");
  if (dayBasedSettings && dayBasedSettings.enabled) {
    const today = new Date().getDay();
    const profileId = dayBasedSettings.mapping[today];
    if (profileId && profileId !== store.get("activeProfile")) {
      // Switch to the day's profile
      store.set("activeProfile", profileId);
      const profiles = store.get("profiles");
      if (profiles[profileId]) {
        const apps = store.get("apps");
        for (const [appKey, appConfig] of Object.entries(apps)) {
          if (profiles[profileId].apps[appKey] !== undefined) {
            appConfig.enabled = profiles[profileId].apps[appKey];
          }
        }
        store.set("apps", apps);
      }
    }
  }

  const apps = store.get("apps");
  const delay = store.get("launchDelay", 1000);

  // Handle URLs separately
  for (const [key, config] of Object.entries(apps)) {
    if (config.enabled && config.isUrl) {
      try {
        await shell.openExternal(config.path);
      } catch (error) {
        console.error(`Failed to open URL ${config.path}:`, error);
      }
    }
  }

  // Handle Hubstaff specially
  if (apps.hubstaff && apps.hubstaff.enabled) {
    const hubstaffCliPath = findExecutable(DEFAULT_APP_PATHS.hubstaffCli);
    if (hubstaffCliPath) {
      await launchHubstaff(apps.hubstaff.path, hubstaffCliPath);
      delete apps.hubstaff;
    }
  }

  // Launch remaining apps (excluding URLs)
  const appsToLaunch = {};
  for (const [key, config] of Object.entries(apps)) {
    if (!config.isUrl) {
      appsToLaunch[key] = config;
    }
  }

  await launchMultipleApps(appsToLaunch, delay);
}

/**
 * Register global keyboard shortcut to launch apps
 */
function registerGlobalShortcut() {
  globalShortcut.unregisterAll();

  if (!store.get("shortcutEnabled", true)) {
    return;
  }

  const shortcut = store.get("globalShortcut", "CommandOrControl+Shift+L");

  const registered = globalShortcut.register(shortcut, async () => {
    console.log("Global shortcut triggered - launching apps");
    const apps = store.get("apps");
    const appOrder = store.get("appOrder", []);
    const delay = store.get("launchDelay", 1000);

    if (apps.hubstaff && apps.hubstaff.enabled) {
      const hubstaffCliPath = findExecutable(DEFAULT_APP_PATHS.hubstaffCli);
      if (hubstaffCliPath) {
        await launchHubstaff(apps.hubstaff.path, hubstaffCliPath);
        delete apps.hubstaff;
      }
    }

    // Sort apps by saved order
    const orderedApps = {};
    const appKeys = Object.keys(apps).filter((k) => k !== "hubstaffCli");
    for (const key of appOrder) {
      if (apps[key]) {
        orderedApps[key] = apps[key];
      }
    }
    for (const key of appKeys) {
      if (!orderedApps[key]) {
        orderedApps[key] = apps[key];
      }
    }

    const results = await launchMultipleApps(orderedApps, delay);

    // Show notification of results
    const enabledCount = Object.values(orderedApps).filter(
      (a) => a.enabled,
    ).length;
    if (enabledCount > 0) {
      dialog.showMessageBox({
        type: results.failed.length > 0 ? "warning" : "info",
        title: "Work Launcher",
        message: `Launched ${results.success.length} apps`,
        detail:
          results.failed.length > 0
            ? `Failed: ${results.failed.map((f) => f.name).join(", ")}`
            : "All apps launched successfully!",
        buttons: ["OK"],
      });
    }
  });

  if (!registered) {
    console.error("Failed to register global shortcut:", shortcut);
  } else {
    console.log("Global shortcut registered:", shortcut);
  }
}

// Check startup mode early (before app ready)
const isStartupLaunch = process.argv.includes("--startup");
const isSettingsMode = process.argv.includes("--settings") || !app.isPackaged;

// App ready event
app.whenReady().then(async () => {
  setupIpcHandlers();

  // Register global keyboard shortcut
  registerGlobalShortcut();

  // Setup scheduled launch timer
  setupScheduledLaunch();

  if (app.isPackaged) {
    // Migrate from old Startup folder method to Task Scheduler (for existing users)
    const fixResult = await fixBrokenStartupShortcut();
    if (fixResult.fixed) {
      console.log("Migrated to high-priority Task Scheduler startup");
    }

    // First-run setup: Enable auto-launch by default for fresh installations
    // This handles MSI installations that don't have custom install scripts
    if (store.get("firstRun", true)) {
      console.log("First run detected - enabling high-priority auto-launch");
      try {
        await enableAutoLaunch();
        store.set("autoLaunchEnabled", true);
      } catch (err) {
        console.error(
          "Failed to enable auto-launch on first run:",
          err.message,
        );
      }
      store.set("firstRun", false);
    } else {
      // Not first run - ensure XML-based task with Priority 4 is in place
      // This upgrades basic tasks created by installer to high-priority XML tasks
      const autoLaunchSetting = store.get("autoLaunchEnabled", false);
      if (autoLaunchSetting) {
        console.log("Ensuring high-priority XML-based Task Scheduler entry");
        try {
          await enableAutoLaunch();
        } catch (err) {
          console.error("Failed to upgrade auto-launch task:", err.message);
        }
      }
    }

    // Check for updates (after a short delay to not slow down startup)
    setTimeout(() => {
      checkForUpdates();
    }, 5000);
  }

  if (isStartupLaunch) {
    // Launched via Windows startup - show dialog immediately
    await startupFlow();
  } else if (isSettingsMode) {
    // Dev mode or settings flag - just open settings window
    createTray();
    createWindow();
  } else {
    // Manual launch of packaged app - run startup flow and always show settings
    await startupFlow();
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
  }
});

// Don't quit when windows are closed - stay in tray
app.on("window-all-closed", () => {
  // Keep app running in tray
});

// Cleanup on quit
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("activate", () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  } else {
    createWindow();
  }
});
