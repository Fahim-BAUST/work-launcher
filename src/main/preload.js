const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  // Get apps configuration
  getApps: () => ipcRenderer.invoke("get-apps"),

  // Save apps configuration
  saveApps: (apps) => ipcRenderer.invoke("save-apps", apps),

  // Detect installed apps
  detectApps: () => ipcRenderer.invoke("detect-apps"),

  // Get all available/installed apps (for add app modal)
  getAvailableApps: () => ipcRenderer.invoke("get-available-apps"),

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
  getActiveNoteId: () => ipcRenderer.invoke("get-active-note-id"),
  setActiveNoteId: (noteId) => ipcRenderer.invoke("set-active-note-id", noteId),
  createNote: (note) => ipcRenderer.invoke("create-note", note),
  updateNote: (id, title, content) =>
    ipcRenderer.invoke("update-note", { id, title, content }),
  deleteNote: (noteId) => ipcRenderer.invoke("delete-note", noteId),

  // Quit app
  quitApp: () => ipcRenderer.invoke("quit-app"),

  // Updates
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  downloadUpdate: () => ipcRenderer.invoke("download-update"),
  installUpdate: () => ipcRenderer.invoke("install-update"),
  getReleaseNotes: (version) =>
    ipcRenderer.invoke("get-release-notes", version),
  getChangelog: () => ipcRenderer.invoke("get-changelog"),
  onUpdateProgress: (callback) =>
    ipcRenderer.on("update-download-progress", (event, percent) =>
      callback(percent),
    ),
  onUpdateAvailable: (callback) =>
    ipcRenderer.on("update-available", (event, info) => callback(info)),
  onUpdateNotAvailable: (callback) =>
    ipcRenderer.on("update-not-available", (event) => callback()),
  onUpdateDownloaded: (callback) =>
    ipcRenderer.on("update-downloaded", (event, info) => callback(info)),
  onUpdateError: (callback) =>
    ipcRenderer.on("update-error", (event, message) => callback(message)),

  // URL Support
  addUrl: (name, url, category) =>
    ipcRenderer.invoke("add-url", { name, url, category }),
  openUrl: (url) => ipcRenderer.invoke("open-url", url),

  // Scheduled Launches
  getScheduledLaunch: () => ipcRenderer.invoke("get-scheduled-launch"),
  setScheduledLaunch: (settings) =>
    ipcRenderer.invoke("set-scheduled-launch", settings),

  // Day-Based Profiles
  getDayBasedProfiles: () => ipcRenderer.invoke("get-day-based-profiles"),
  setDayBasedProfiles: (settings) =>
    ipcRenderer.invoke("set-day-based-profiles", settings),

  // Import/Export
  exportSettings: () => ipcRenderer.invoke("export-settings"),
  importSettings: () => ipcRenderer.invoke("import-settings"),

  // Notes Import/Export
  exportNotes: () => ipcRenderer.invoke("export-notes"),
  importNotes: () => ipcRenderer.invoke("import-notes"),
  exportNoteToPdf: (noteId, noteTitle, noteContent) =>
    ipcRenderer.invoke("export-note-to-pdf", {
      noteId,
      noteTitle,
      noteContent,
    }),

  // App Icons
  getAppIcon: (exePath) => ipcRenderer.invoke("get-app-icon", exePath),

  // App Categories
  getAppCategory: (appKey) => ipcRenderer.invoke("get-app-category", appKey),
  setAppCategory: (appKey, category) =>
    ipcRenderer.invoke("set-app-category", { appKey, category }),

  // Launch single app
  launchSingleApp: (appKey) => ipcRenderer.invoke("launch-single-app", appKey),
});
