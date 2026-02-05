const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
  globalShortcut,
} = require("electron");
const path = require("path");
const {
  launchMultipleApps,
  launchHubstaff,
  getHubstaffOrganizations,
  getHubstaffProjects,
  startHubstaffProject,
} = require("./appLauncher");
const {
  detectInstalledApps,
  getAppDisplayName,
  findExecutable,
  DEFAULT_APP_PATHS,
} = require("./appPaths");
const {
  enableAutoLaunch,
  disableAutoLaunch,
  isAutoLaunchEnabled,
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
    notes: "",
  },
});

let mainWindow = null;
let tray = null;

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
    width: 700,
    height: 850,
    resizable: false,
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
 * Update tray menu with current profiles
 */
function updateTrayMenu() {
  const profiles = store.get("profiles");
  const activeProfile = store.get("activeProfile");

  const profileMenuItems = Object.entries(profiles).map(([id, profile]) => ({
    label: `${id === activeProfile ? "✓ " : "   "}${profile.name}`,
    click: async () => {
      store.set("activeProfile", id);
      // Load the profile's app settings
      const apps = store.get("apps");
      for (const [appKey, appConfig] of Object.entries(apps)) {
        if (profile.apps[appKey] !== undefined) {
          appConfig.enabled = profile.apps[appKey];
        }
      }
      store.set("apps", apps);
      updateTrayMenu();
      // Notify renderer if window is open
      if (mainWindow) {
        mainWindow.webContents.send("profile-changed", id);
      }
    },
  }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "🚀 Launch Work Apps",
      click: async () => {
        const apps = store.get("apps");
        const delay = store.get("launchDelay", 1000);
        if (apps.hubstaff && apps.hubstaff.enabled) {
          const hubstaffCliPath = findExecutable(DEFAULT_APP_PATHS.hubstaffCli);
          if (hubstaffCliPath) {
            await launchHubstaff(apps.hubstaff.path, hubstaffCliPath);
            delete apps.hubstaff;
          }
        }
        await launchMultipleApps(apps, delay);
      },
    },
    { type: "separator" },
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

    const delay = store.get("launchDelay", 1000);
    const results = await launchMultipleApps(orderedApps, delay);

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
  ipcMain.handle("get-notes", () => {
    return store.get("notes", "");
  });

  ipcMain.handle("save-notes", (event, notes) => {
    store.set("notes", notes);
    return true;
  });

  // Quit app completely
  ipcMain.handle("quit-app", () => {
    app.isQuitting = true;
    app.quit();
  });
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
