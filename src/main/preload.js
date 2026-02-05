const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  // Get apps configuration
  getApps: () => ipcRenderer.invoke("get-apps"),

  // Save apps configuration
  saveApps: (apps) => ipcRenderer.invoke("save-apps", apps),

  // Detect installed apps
  detectApps: () => ipcRenderer.invoke("detect-apps"),

  // Get auto-launch status
  getAutoLaunchStatus: () => ipcRenderer.invoke("get-autolaunch-status"),

  // Toggle auto-launch
  toggleAutoLaunch: (enabled) =>
    ipcRenderer.invoke("toggle-autolaunch", enabled),

  // Launch apps now
  launchAppsNow: () => ipcRenderer.invoke("launch-apps-now"),

  // Get app display name
  getAppDisplayName: (appKey) =>
    ipcRenderer.invoke("get-app-display-name", appKey),

  // Hubstaff CLI APIs
  hubstaffGetOrganizations: () =>
    ipcRenderer.invoke("hubstaff-get-organizations"),
  hubstaffGetProjects: (orgId) =>
    ipcRenderer.invoke("hubstaff-get-projects", orgId),
  hubstaffStartProject: (projectId) =>
    ipcRenderer.invoke("hubstaff-start-project", projectId),
  getHubstaffProject: () => ipcRenderer.invoke("get-hubstaff-project"),
  saveHubstaffProject: (projectId) =>
    ipcRenderer.invoke("save-hubstaff-project", projectId),

  // Startup dialog setting
  getShowStartupDialog: () => ipcRenderer.invoke("get-show-startup-dialog"),
  toggleShowStartupDialog: (enabled) =>
    ipcRenderer.invoke("toggle-show-startup-dialog", enabled),

  // Minimize to tray setting
  getMinimizeToTray: () => ipcRenderer.invoke("get-minimize-to-tray"),
  toggleMinimizeToTray: (enabled) =>
    ipcRenderer.invoke("toggle-minimize-to-tray", enabled),

  // Custom app management
  browseForApp: () => ipcRenderer.invoke("browse-for-app"),
  addCustomApp: (name, path) =>
    ipcRenderer.invoke("add-custom-app", { name, path }),
  removeApp: (appKey) => ipcRenderer.invoke("remove-app", appKey),

  // Theme
  getTheme: () => ipcRenderer.invoke("get-theme"),
  setTheme: (theme) => ipcRenderer.invoke("set-theme", theme),

  // Profile management
  getProfiles: () => ipcRenderer.invoke("get-profiles"),
  getActiveProfile: () => ipcRenderer.invoke("get-active-profile"),
  setActiveProfile: (profileId) =>
    ipcRenderer.invoke("set-active-profile", profileId),
  createProfile: (id, name) =>
    ipcRenderer.invoke("create-profile", { id, name }),
  updateProfile: (id, name) =>
    ipcRenderer.invoke("update-profile", { id, name }),
  deleteProfile: (profileId) => ipcRenderer.invoke("delete-profile", profileId),
  saveProfileApps: (profileId) =>
    ipcRenderer.invoke("save-profile-apps", profileId),

  // Listen for profile changes from tray
  onProfileChanged: (callback) =>
    ipcRenderer.on("profile-changed", (event, profileId) =>
      callback(profileId),
    ),

  // Launch delay
  getLaunchDelay: () => ipcRenderer.invoke("get-launch-delay"),
  setLaunchDelay: (delay) => ipcRenderer.invoke("set-launch-delay", delay),

  // Global shortcut
  getShortcutEnabled: () => ipcRenderer.invoke("get-shortcut-enabled"),
  setShortcutEnabled: (enabled) =>
    ipcRenderer.invoke("set-shortcut-enabled", enabled),
  getGlobalShortcut: () => ipcRenderer.invoke("get-global-shortcut"),

  // App order
  getAppOrder: () => ipcRenderer.invoke("get-app-order"),
  setAppOrder: (order) => ipcRenderer.invoke("set-app-order", order),

  // Notes
  getNotes: () => ipcRenderer.invoke("get-notes"),
  saveNotes: (notes) => ipcRenderer.invoke("save-notes", notes),

  // Quit app
  quitApp: () => ipcRenderer.invoke("quit-app"),
});
