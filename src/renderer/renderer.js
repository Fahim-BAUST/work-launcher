// DOM Elements
const splashScreen = document.getElementById("splashScreen");
const detectAppsBtn = document.getElementById("detectAppsBtn");
const appsList = document.getElementById("appsList");
const noAppsMessage = document.getElementById("noAppsMessage");
const launchNowBtn = document.getElementById("launchNowBtn");
const saveBtn = document.getElementById("saveBtn");
const notification = document.getElementById("notification");
const notificationText = document.getElementById("notificationText");
const themeToggle = document.getElementById("themeToggle");
const addAppBtn = document.getElementById("addAppBtn");
const addAppModal = document.getElementById("addAppModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelAddBtn = document.getElementById("cancelAddBtn");
const confirmAddBtn = document.getElementById("confirmAddBtn");
const browseBtn = document.getElementById("browseBtn");
const customAppName = document.getElementById("customAppName");
const customAppPath = document.getElementById("customAppPath");

// URL Modal DOM Elements
const addUrlBtn = document.getElementById("addUrlBtn");
const addUrlModal = document.getElementById("addUrlModal");
const closeUrlModalBtn = document.getElementById("closeUrlModalBtn");
const cancelUrlBtn = document.getElementById("cancelUrlBtn");
const confirmUrlBtn = document.getElementById("confirmUrlBtn");
const urlName = document.getElementById("urlName");
const urlPath = document.getElementById("urlPath");
const urlCategory = document.getElementById("urlCategory");

// Search and Filter DOM Elements
const appSearchInput = document.getElementById("appSearchInput");
const categoryFilter = document.getElementById("categoryFilter");

// Schedule DOM Elements
const scheduleToggle = document.getElementById("scheduleToggle");
const scheduleSettingsPanel = document.getElementById("scheduleSettings");
const scheduleTime = document.getElementById("scheduleTime");

// Day-Based Profiles DOM Elements
const dayBasedProfilesToggle = document.getElementById(
  "dayBasedProfilesToggle",
);
const dayProfileSettings = document.getElementById("dayProfileSettings");

// Import/Export DOM Elements
const exportSettingsBtn = document.getElementById("exportSettingsBtn");
const importSettingsBtn = document.getElementById("importSettingsBtn");

// Profile DOM Elements
const addProfileBtn = document.getElementById("addProfileBtn");
const profilesList = document.getElementById("profilesList");
const profileModal = document.getElementById("profileModal");
const profileModalTitle = document.getElementById("profileModalTitle");
const closeProfileModalBtn = document.getElementById("closeProfileModalBtn");
const cancelProfileBtn = document.getElementById("cancelProfileBtn");
const confirmProfileBtn = document.getElementById("confirmProfileBtn");
const profileNameInput = document.getElementById("profileName");

// Launch Settings DOM Elements
const launchDelaySlider = document.getElementById("launchDelaySlider");
const delayValue = document.getElementById("delayValue");
const shortcutToggle = document.getElementById("shortcutToggle");
const shortcutDisplay = document.getElementById("shortcutDisplay");

// Tab Navigation DOM Elements
const settingsTab = document.getElementById("settingsTab");
const notesTab = document.getElementById("notesTab");
const helpTab = document.getElementById("helpTab");
const settingsPanel = document.getElementById("settingsPanel");
const notesPanel = document.getElementById("notesPanel");
const helpPanel = document.getElementById("helpPanel");

// Notes DOM Elements
const notesContainer = document.getElementById("notesContainer");
const notesList = document.getElementById("notesList");
const noNotesMessage = document.getElementById("noNotesMessage");
const noteEditorPanel = document.getElementById("noteEditorPanel");
const noteTitleInput = document.getElementById("noteTitleInput");
const noteEditor = document.getElementById("noteEditor");
const noteReadView = document.getElementById("noteReadView");
const editorToolbar = document.getElementById("editorToolbar");
const toggleEditModeBtn = document.getElementById("toggleEditModeBtn");
const notesSaveStatus = document.getElementById("notesSaveStatus");
const noteUpdatedAt = document.getElementById("noteUpdatedAt");
const addNoteBtn = document.getElementById("addNoteBtn");
const deleteNoteBtn = document.getElementById("deleteNoteBtn");
const toggleNotesSidebarBtn = document.getElementById("toggleNotesSidebarBtn");
const toggleNotesFullscreenBtn = document.getElementById(
  "toggleNotesFullscreenBtn",
);

// Edit mode state
let isEditMode = true;

// Update Modal DOM Elements
const updateBtn = document.getElementById("updateBtn");
const updateDot = document.getElementById("updateDot");
const updateModal = document.getElementById("updateModal");
const closeUpdateModalBtn = document.getElementById("closeUpdateModalBtn");
const checkUpdateBtn = document.getElementById("checkUpdateBtn");
const currentVersionEl = document.getElementById("currentVersion");
const newVersionBadge = document.getElementById("newVersionBadge");
const newVersionNumber = document.getElementById("newVersionNumber");
const updateIcon = document.getElementById("updateIcon");
const updateStatusText = document.getElementById("updateStatusText");
const updateProgressContainer = document.getElementById(
  "updateProgressContainer",
);
const updateProgressBar = document.getElementById("updateProgressBar");
const updatePercentage = document.getElementById("updatePercentage");
const downloadUpdateBtn = document.getElementById("downloadUpdateBtn");
const installUpdateBtn = document.getElementById("installUpdateBtn");
const releaseNotesContainer = document.getElementById("releaseNotesContainer");
const releaseNotesContent = document.getElementById("releaseNotesContent");

// Image Lightbox DOM Elements
const imageLightbox = document.getElementById("imageLightbox");
const lightboxBackdrop = document.getElementById("lightboxBackdrop");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxImageContainer = document.getElementById(
  "lightboxImageContainer",
);
const closeLightbox = document.getElementById("closeLightbox");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const zoomResetBtn = document.getElementById("zoomResetBtn");
const zoomLevelDisplay = document.getElementById("zoomLevel");

// Current apps configuration
let currentApps = {};
let currentAppOrder = [];
let currentTheme = "dark";
let currentProfiles = {};
let activeProfileId = "default";
let editingProfileId = null;
let notesDebounceTimer = null;
let draggedItem = null;
let draggedNoteItem = null;
let currentNotes = [];
let currentNoteOrder = [];
let activeNoteId = null;

// Search and filter state
let currentSearchTerm = "";
let currentCategoryFilter = "all";

// Schedule state
let scheduleSettings = {
  enabled: false,
  time: "09:00",
  days: [1, 2, 3, 4, 5],
};

// Day-based profiles state
let dayBasedProfilesSettings = {
  enabled: false,
  mapping: {
    0: "default",
    1: "default",
    2: "default",
    3: "default",
    4: "default",
    5: "default",
    6: "default",
  },
};

// App icons cache
const appIconsCache = {};

// Chrome profiles cache
let chromeProfilesCache = null;

// App category mapping
const categoryMapping = {
  slack: "communication",
  teams: "communication",
  discord: "communication",
  zoom: "communication",
  skype: "communication",
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
  chrome: "browser",
  firefox: "browser",
  edge: "browser",
  opera: "browser",
  brave: "browser",
  notion: "productivity",
  obsidian: "productivity",
  todoist: "productivity",
  trello: "productivity",
  asana: "productivity",
  figma: "productivity",
  hubstaff: "productivity",
  mongodb: "database",
  dbeaver: "database",
  tableplus: "database",
  mysql: "database",
  pgadmin: "database",
  spotify: "media",
  vlc: "media",
};

function getAppCategory(appKey, config) {
  if (config && config.category) return config.category;
  if (config && config.isUrl) return "url";
  const key = appKey.toLowerCase().replace(/[^a-z]/g, "");
  for (const [pattern, category] of Object.entries(categoryMapping)) {
    if (key.includes(pattern.toLowerCase())) {
      return category;
    }
  }
  return "other";
}

// App display names mapping
const appDisplayNames = {
  hubstaff: "Hubstaff",
  hubstaffCli: "Hubstaff CLI (internal)",
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

// App icons mapping (generic icon for all apps)
const defaultAppIcon =
  '<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>';

const appIcons = {
  hubstaff: defaultAppIcon,
  hubstaffCli: defaultAppIcon,
  slack: defaultAppIcon,
  teams: defaultAppIcon,
  discord: defaultAppIcon,
  notion: defaultAppIcon,
  figma: defaultAppIcon,
  postman: defaultAppIcon,
  docker: defaultAppIcon,
  visualStudio: defaultAppIcon,
  vscode: defaultAppIcon,
  pycharm: defaultAppIcon,
  chrome: defaultAppIcon,
  firefox: defaultAppIcon,
  edge: defaultAppIcon,
  mongodb: defaultAppIcon,
  dbeaver: defaultAppIcon,
  tableplus: defaultAppIcon,
  spotify: defaultAppIcon,
};

// Icon SVG templates
const icons = {
  trash:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M20 6 9 17l-5-5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  rocket:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  download:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
  refresh:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
  error:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
  success:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  loader:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
};

// Custom confirm modal elements
const confirmModal = document.getElementById("confirmModal");
const confirmModalTitle = document.getElementById("confirmModalTitle");
const confirmModalMessage = document.getElementById("confirmModalMessage");
const confirmModalCancel = document.getElementById("confirmModalCancel");
const confirmModalOk = document.getElementById("confirmModalOk");

let confirmResolve = null;

/**
 * Show custom confirm dialog (returns Promise)
 */
function showConfirm(message, title = "Confirm") {
  return new Promise((resolve) => {
    confirmResolve = resolve;
    confirmModalTitle.textContent = title;
    confirmModalMessage.textContent = message;
    confirmModal.classList.remove("hidden");
    confirmModalOk.focus();
  });
}

// Confirm modal event handlers
confirmModalOk.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
  if (confirmResolve) confirmResolve(true);
  confirmResolve = null;
});

confirmModalCancel.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
  if (confirmResolve) confirmResolve(false);
  confirmResolve = null;
});

// Close modal when clicking backdrop (the modal itself, not its content)
confirmModal.addEventListener("click", (e) => {
  if (e.target === confirmModal) {
    confirmModal.classList.add("hidden");
    if (confirmResolve) confirmResolve(false);
    confirmResolve = null;
  }
});

/**
 * Show notification message
 */
function showNotification(message, type = "success") {
  notificationText.textContent = message;
  notification.classList.remove("hidden", "error", "warning");
  if (type === "error" || type === true) {
    notification.classList.add("error");
  } else if (type === "warning") {
    notification.classList.add("warning");
  }

  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
}

/**
 * Get ordered app entries based on saved order
 */
function getOrderedAppEntries(apps) {
  // Filter out internal apps like hubstaffCli
  const appEntries = Object.entries(apps).filter(
    ([key, _]) => key !== "hubstaffCli",
  );

  // Sort by saved order, then alphabetically for new apps
  return appEntries.sort((a, b) => {
    const orderA = currentAppOrder.indexOf(a[0]);
    const orderB = currentAppOrder.indexOf(b[0]);

    // If both are in order array, sort by order
    if (orderA !== -1 && orderB !== -1) {
      return orderA - orderB;
    }
    // If only one is in order, prioritize the one in order
    if (orderA !== -1) return -1;
    if (orderB !== -1) return 1;
    // If neither is in order, sort alphabetically
    return a[0].localeCompare(b[0]);
  });
}

/**
 * Save current app order
 */
async function saveAppOrder() {
  const appItems = document.querySelectorAll(".app-item");
  const order = [];
  appItems.forEach((item) => {
    const appKey = item.dataset.appKey;
    if (appKey) order.push(appKey);
  });
  currentAppOrder = order;
  await window.electronAPI.setAppOrder(order);
}

/**
 * Filter apps based on search term and category
 */
function filterApps(apps) {
  return Object.entries(apps).filter(([key, config]) => {
    // Always filter out internal apps
    if (key === "hubstaffCli") return false;

    // Search filter
    if (currentSearchTerm) {
      const searchLower = currentSearchTerm.toLowerCase();
      const displayName = (
        config.customName ||
        appDisplayNames[key] ||
        key
      ).toLowerCase();
      const path = config.path.toLowerCase();
      if (!displayName.includes(searchLower) && !path.includes(searchLower)) {
        return false;
      }
    }

    // Category filter
    if (currentCategoryFilter !== "all") {
      const category = getAppCategory(key, config);
      if (category !== currentCategoryFilter) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Load app icon from exe path
 */
async function loadAppIcon(appKey, exePath, imgElement) {
  // Check cache first
  if (appIconsCache[exePath]) {
    imgElement.src = appIconsCache[exePath];
    imgElement.classList.remove("hidden");
    return;
  }

  try {
    const iconDataUrl = await window.electronAPI.getAppIcon(exePath);
    if (iconDataUrl) {
      appIconsCache[exePath] = iconDataUrl;
      imgElement.src = iconDataUrl;
      imgElement.classList.remove("hidden");
    }
  } catch (error) {
    // Keep default icon
  }
}

/**
 * Render the apps list with drag-and-drop support and filtering
 */
function renderAppsList(apps) {
  appsList.innerHTML = "";

  // Get filtered entries
  const filteredEntries = filterApps(apps);
  const appEntries = filteredEntries.sort((a, b) => {
    const orderA = currentAppOrder.indexOf(a[0]);
    const orderB = currentAppOrder.indexOf(b[0]);
    if (orderA !== -1 && orderB !== -1) return orderA - orderB;
    if (orderA !== -1) return -1;
    if (orderB !== -1) return 1;
    return a[0].localeCompare(b[0]);
  });

  if (appEntries.length === 0) {
    if (currentSearchTerm || currentCategoryFilter !== "all") {
      noAppsMessage.style.display = "block";
      noAppsMessage.textContent = "No apps match the current filter.";
    } else {
      noAppsMessage.style.display = "block";
      noAppsMessage.textContent =
        'No applications detected. Click "Re-detect Apps" to scan for installed applications.';
    }
    return;
  }

  noAppsMessage.style.display = "none";

  appEntries.forEach(([key, config], index) => {
    const appItem = document.createElement("div");
    appItem.className = "app-item";
    appItem.dataset.appKey = key;
    appItem.draggable = true;

    // Check if it's a custom/scanned app, URL, or a pre-defined one
    const isCustomOrScanned =
      config.isCustom ||
      key.startsWith("scanned_") ||
      key.startsWith("url_") ||
      key.startsWith("custom_");
    const isUrl = config.isUrl;
    const displayName = config.customName || appDisplayNames[key] || key;
    const category = getAppCategory(key, config);

    // Add special note for Hubstaff
    let extraInfo = "";
    if (key === "hubstaff") {
      extraInfo = '<span class="app-note">Timer will auto-start via CLI</span>';
    }

    // Check if this is Chrome - we'll add profile selector
    const isChrome = key === "chrome";
    const chromeProfileHtml = isChrome
      ? `<div class="chrome-profile-selector" data-app="${key}">
          <span class="icon icon-sm">${icons.user}</span>
          <select class="chrome-profile-select" data-app="${key}">
            <option value="">Default Profile</option>
          </select>
        </div>`
      : "";

    // Badge type
    let badgeClass = isCustomOrScanned ? "custom" : "detected";
    let badgeText = isCustomOrScanned ? "Custom" : "Detected";
    if (isUrl) {
      badgeClass = "url";
      badgeText = "URL";
    }

    // Icon - use image placeholder for real icons, fallback to SVG
    const iconId = `icon-${key}`;
    const defaultIcon = isUrl
      ? '<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
      : defaultAppIcon;

    appItem.innerHTML = `
      <div class="drag-handle" title="Drag to reorder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
      </div>
      <div class="app-order-num">${index + 1}</div>
      <div class="app-icon-container">
        <img id="${iconId}" class="app-icon-img hidden" alt="" />
        <span class="app-icon-fallback icon icon-sm">${defaultIcon}</span>
      </div>
      <div class="app-info">
        <div class="app-name">${displayName} ${extraInfo}</div>
        <div class="app-path">${config.path}</div>
        <span class="category-tag category-${category}">${category}</span>
        ${chromeProfileHtml}
      </div>
      <div class="app-status">
        <span class="status-badge ${badgeClass}">${badgeText}</span>
        ${isCustomOrScanned ? `<button class="btn-remove" data-app="${key}" title="Remove"><span class="icon icon-sm">${icons.trash}</span></button>` : ""}
        <label class="switch">
          <input type="checkbox" data-app="${key}" ${config.enabled ? "checked" : ""}>
          <span class="slider"></span>
        </label>
      </div>
    `;

    // Load real icon for non-URL apps
    if (!isUrl && config.path) {
      const imgEl = appItem.querySelector(`#${iconId}`);
      const fallbackEl = appItem.querySelector(".app-icon-fallback");
      loadAppIcon(key, config.path, imgEl).then(() => {
        if (!imgEl.classList.contains("hidden")) {
          fallbackEl.classList.add("hidden");
        }
      });
    }

    // Drag and drop events
    appItem.addEventListener("dragstart", handleDragStart);
    appItem.addEventListener("dragend", handleDragEnd);
    appItem.addEventListener("dragover", handleDragOver);
    appItem.addEventListener("dragenter", handleDragEnter);
    appItem.addEventListener("dragleave", handleDragLeave);
    appItem.addEventListener("drop", handleDrop);

    appsList.appendChild(appItem);
  });

  // Add event listeners to toggles
  document
    .querySelectorAll('.app-item input[type="checkbox"]')
    .forEach((toggle) => {
      toggle.addEventListener("change", (e) => {
        const appKey = e.target.dataset.app;
        currentApps[appKey].enabled = e.target.checked;
      });
    });

  // Add event listeners to remove buttons
  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const appKey = e.currentTarget.dataset.app;
      const appName =
        currentApps[appKey]?.customName || appDisplayNames[appKey] || appKey;
      const confirmed = await showConfirm(
        `Remove "${appName}" from the list?`,
        "Remove App",
      );
      if (confirmed) {
        currentApps = await window.electronAPI.removeApp(appKey);
        renderAppsList(currentApps);
        showNotification("App removed");
      }
    });
  });

  // Load Chrome profiles for Chrome app
  loadChromeProfiles();
}

/**
 * Load Chrome profiles and populate the profile selector
 */
async function loadChromeProfiles() {
  const chromeSelectors = document.querySelectorAll(".chrome-profile-select");
  if (chromeSelectors.length === 0) return;

  // Use cached profiles if available
  if (!chromeProfilesCache) {
    try {
      chromeProfilesCache = await window.electronAPI.getChromeProfiles();
    } catch (error) {
      console.error("Failed to load Chrome profiles:", error);
      chromeProfilesCache = [];
    }
  }

  chromeSelectors.forEach((select) => {
    const appKey = select.dataset.app;
    const currentProfile = currentApps[appKey]?.chromeProfile || "";

    // Clear existing options except the first one
    select.innerHTML = '<option value="">Default Profile</option>';

    // Add profile options
    chromeProfilesCache.forEach((profile) => {
      const option = document.createElement("option");
      option.value = profile.dir;
      option.textContent = profile.name;
      if (profile.dir === currentProfile) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    // Add event listener for profile change
    select.addEventListener("change", async (e) => {
      const selectedProfile = e.target.value;
      currentApps = await window.electronAPI.setChromeProfile(
        appKey,
        selectedProfile,
      );
      showNotification(
        selectedProfile
          ? `Chrome profile set to "${chromeProfilesCache.find((p) => p.dir === selectedProfile)?.name || selectedProfile}"`
          : "Chrome will use default profile",
      );
    });
  });
}

// Drag and drop handlers
function handleDragStart(e) {
  draggedItem = this;
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
}

function handleDragEnd(e) {
  this.classList.remove("dragging");
  document.querySelectorAll(".app-item").forEach((item) => {
    item.classList.remove("drag-over");
  });
  draggedItem = null;
  // Update order numbers
  updateOrderNumbers();
  // Save the new order
  saveAppOrder();
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function handleDragEnter(e) {
  e.preventDefault();
  if (this !== draggedItem) {
    this.classList.add("drag-over");
  }
}

function handleDragLeave(e) {
  this.classList.remove("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  if (this !== draggedItem && draggedItem) {
    const allItems = [...appsList.querySelectorAll(".app-item")];
    const draggedIndex = allItems.indexOf(draggedItem);
    const dropIndex = allItems.indexOf(this);

    if (draggedIndex < dropIndex) {
      this.parentNode.insertBefore(draggedItem, this.nextSibling);
    } else {
      this.parentNode.insertBefore(draggedItem, this);
    }
  }
  this.classList.remove("drag-over");
}

function updateOrderNumbers() {
  const items = document.querySelectorAll(".app-item");
  items.forEach((item, index) => {
    const orderNum = item.querySelector(".app-order-num");
    if (orderNum) {
      orderNum.textContent = index + 1;
    }
  });
}

// ============================================
// Note Drag and Drop Handlers
// ============================================
function handleNoteDragStart(e) {
  draggedNoteItem = this;
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
}

function handleNoteDragEnd(e) {
  this.classList.remove("dragging");
  document.querySelectorAll(".note-item").forEach((item) => {
    item.classList.remove("drag-over");
  });
  draggedNoteItem = null;
  // Update order numbers
  updateNoteOrderNumbers();
  // Save the new order
  saveNoteOrder();
}

function handleNoteDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function handleNoteDragEnter(e) {
  e.preventDefault();
  if (this !== draggedNoteItem) {
    this.classList.add("drag-over");
  }
}

function handleNoteDragLeave(e) {
  this.classList.remove("drag-over");
}

function handleNoteDrop(e) {
  e.preventDefault();
  if (this !== draggedNoteItem && draggedNoteItem) {
    const allItems = [...notesList.querySelectorAll(".note-item")];
    const draggedIndex = allItems.indexOf(draggedNoteItem);
    const dropIndex = allItems.indexOf(this);

    if (draggedIndex < dropIndex) {
      this.parentNode.insertBefore(draggedNoteItem, this.nextSibling);
    } else {
      this.parentNode.insertBefore(draggedNoteItem, this);
    }
  }
  this.classList.remove("drag-over");
}

function updateNoteOrderNumbers() {
  const items = document.querySelectorAll(".note-item");
  items.forEach((item, index) => {
    const orderNum = item.querySelector(".note-order-num");
    if (orderNum) {
      orderNum.textContent = index + 1;
    }
  });
}

async function saveNoteOrder() {
  const items = document.querySelectorAll(".note-item");
  const order = [];
  items.forEach((item) => {
    if (item.dataset.noteId) {
      order.push(item.dataset.noteId);
    }
  });
  currentNoteOrder = order;
  await window.electronAPI.setNoteOrder(order);
}

/**
 * Apply theme to the page
 */
function applyTheme(theme) {
  currentTheme = theme;
  document.body.classList.remove("light-theme", "dark-theme");
  document.body.classList.add(`${theme}-theme`);
  themeToggle.innerHTML =
    theme === "dark"
      ? `<span class="icon">${icons.sun}</span>`
      : `<span class="icon">${icons.moon}</span>`;
  themeToggle.title =
    theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
}

/**
 * Render the profiles list
 */
function renderProfilesList(profiles, activeId) {
  profilesList.innerHTML = "";

  for (const [id, profile] of Object.entries(profiles)) {
    const profileItem = document.createElement("div");
    profileItem.className = `profile-item ${id === activeId ? "active" : ""}`;
    profileItem.dataset.profileId = id;

    const appCount = Object.values(profile.apps || {}).filter(
      (enabled) => enabled,
    ).length;

    profileItem.innerHTML = `
      <div class="profile-info" data-profile-id="${id}">
        <span class="profile-name">${id === activeId ? `<span class="icon icon-sm">${icons.check}</span> ` : ""}${profile.name}</span>
        <span class="profile-apps-count">${appCount} apps enabled</span>
      </div>
      <div class="profile-actions">
        ${id !== "default" ? `<button class="btn-icon-sm btn-edit-profile" data-profile-id="${id}" title="Edit"><span class="icon icon-sm">${icons.edit}</span></button>` : ""}
        ${id !== "default" ? `<button class="btn-icon-sm btn-delete-profile" data-profile-id="${id}" title="Delete"><span class="icon icon-sm">${icons.trash}</span></button>` : ""}
      </div>
    `;

    profilesList.appendChild(profileItem);
  }

  // Add click listeners for profile selection
  document.querySelectorAll(".profile-info").forEach((el) => {
    el.addEventListener("click", async (e) => {
      const profileId = e.currentTarget.dataset.profileId;
      if (profileId !== activeProfileId) {
        await switchProfile(profileId);
      }
    });
  });

  // Add edit listeners
  document.querySelectorAll(".btn-edit-profile").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const profileId = e.currentTarget.dataset.profileId;
      if (profileId) {
        openEditProfileModal(profileId);
      }
    });
  });

  // Add delete listeners
  document.querySelectorAll(".btn-delete-profile").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const profileId = e.currentTarget.dataset.profileId;
      if (!profileId || !currentProfiles[profileId]) return;
      const profileName = currentProfiles[profileId].name;
      const confirmed = await showConfirm(
        `Delete profile "${profileName}"?`,
        "Delete Profile",
      );
      if (confirmed) {
        currentProfiles = await window.electronAPI.deleteProfile(profileId);
        if (activeProfileId === profileId) {
          activeProfileId = "default";
          currentApps = await window.electronAPI.getApps();
          renderAppsList(currentApps);
        }
        renderProfilesList(currentProfiles, activeProfileId);
        showNotification(`Profile "${profileName}" deleted`);
      }
    });
  });
}

/**
 * Switch to a different profile
 */
async function switchProfile(profileId) {
  const profileName = currentProfiles[profileId]?.name || profileId;
  const previousProfileId = activeProfileId;

  // Update UI immediately for responsiveness
  activeProfileId = profileId;
  renderProfilesList(currentProfiles, activeProfileId);

  // Save previous profile (can be done in background)
  window.electronAPI.saveProfileApps(previousProfileId);

  // Switch to new profile and get apps
  await window.electronAPI.setActiveProfile(profileId);
  currentApps = await window.electronAPI.getApps();
  renderAppsList(currentApps);

  showNotification(`Switched to "${profileName}" profile`);
}

/**
 * Open the profile modal for creating
 */
function openCreateProfileModal() {
  editingProfileId = null;
  profileModalTitle.innerHTML = `<span class="icon icon-sm">${icons.plus}</span> Create New Profile`;
  confirmProfileBtn.textContent = "Create Profile";
  profileNameInput.value = "";
  profileModal.classList.remove("hidden");
}

/**
 * Open the profile modal for editing
 */
function openEditProfileModal(profileId) {
  editingProfileId = profileId;
  profileModalTitle.innerHTML = `<span class="icon icon-sm">${icons.edit}</span> Edit Profile`;
  confirmProfileBtn.textContent = "Save Changes";
  profileNameInput.value = currentProfiles[profileId].name;
  profileModal.classList.remove("hidden");
}

/**
 * Close the profile modal
 */
function closeProfileModal() {
  profileModal.classList.add("hidden");
  editingProfileId = null;
}

/**
 * Initialize the settings page
 */
async function init() {
  try {
    // Load and display app version
    const appVersion = await window.electronAPI.getAppVersion();
    const appVersionElement = document.getElementById("appVersion");
    if (appVersionElement) {
      appVersionElement.textContent = `Work Launcher v${appVersion}`;
    }

    // Load theme
    const savedTheme = await window.electronAPI.getTheme();
    applyTheme(savedTheme);

    // Load profiles
    currentProfiles = await window.electronAPI.getProfiles();
    activeProfileId = await window.electronAPI.getActiveProfile();
    renderProfilesList(currentProfiles, activeProfileId);

    // Load app order
    currentAppOrder = await window.electronAPI.getAppOrder();

    // Load current apps configuration
    currentApps = await window.electronAPI.getApps();
    renderAppsList(currentApps);

    // Load launch delay setting
    const launchDelay = await window.electronAPI.getLaunchDelay();
    launchDelaySlider.value = launchDelay;
    delayValue.textContent = launchDelay;

    // Load global shortcut settings
    const shortcutEnabled = await window.electronAPI.getShortcutEnabled();
    shortcutToggle.checked = shortcutEnabled;
    const globalShortcut = await window.electronAPI.getGlobalShortcut();
    shortcutDisplay.textContent = globalShortcut.replace(
      "CommandOrControl",
      "Ctrl",
    );

    // Load notes
    currentNotes = await window.electronAPI.getNotes();
    currentNoteOrder = await window.electronAPI.getNoteOrder();
    activeNoteId = await window.electronAPI.getActiveNoteId();
    renderNotesList();
    if (activeNoteId) {
      loadNoteToEditor(activeNoteId);
    } else if (currentNotes.length > 0) {
      loadNoteToEditor(currentNotes[0].id);
    } else {
      showEmptyEditor();
    }

    // Load scheduled launch settings
    scheduleSettings = await window.electronAPI.getScheduledLaunch();
    if (scheduleToggle) {
      scheduleToggle.checked = scheduleSettings.enabled;
      if (scheduleSettings.enabled && scheduleTime) {
        scheduleTime.value = scheduleSettings.time || "09:00";
        if (scheduleSettingsPanel)
          scheduleSettingsPanel.classList.remove("hidden");
      }
      updateScheduleUI();
    }

    // Load day-based profiles settings
    dayBasedProfilesSettings = await window.electronAPI.getDayBasedProfiles();
    if (dayBasedProfilesToggle) {
      dayBasedProfilesToggle.checked = dayBasedProfilesSettings.enabled;
      updateDayBasedProfilesUI();
    }
    // Listen for profile changes from tray menu
    window.electronAPI.onProfileChanged(async (profileId) => {
      activeProfileId = profileId;
      currentAppOrder = await window.electronAPI.getAppOrder();
      currentApps = await window.electronAPI.getApps();
      renderAppsList(currentApps);
      renderProfilesList(currentProfiles, activeProfileId);
    });

    // Initialize update version display
    currentVersionEl.textContent = `v${appVersion}`;

    // Setup update event listeners
    setupUpdateListeners();

    // Hide splash screen after initialization (4 seconds)
    setTimeout(() => {
      splashScreen.classList.add("hidden");
    }, 4000);
  } catch (error) {
    console.error("Failed to initialize:", error);
    showNotification("Failed to load settings", true);
    // Hide splash even on error
    splashScreen.classList.add("hidden");
  }
}

// Event Listeners

// Detect apps button
detectAppsBtn.addEventListener("click", async () => {
  try {
    detectAppsBtn.disabled = true;
    detectAppsBtn.innerHTML = `<span class="icon icon-sm">${icons.search}</span> Scanning...`;

    currentApps = await window.electronAPI.detectApps();
    renderAppsList(currentApps);

    // Count visible apps (exclude internal apps like hubstaffCli)
    const count = Object.keys(currentApps).filter(
      (key) => key !== "hubstaffCli",
    ).length;
    showNotification(`Found ${count} application(s)`);
  } catch (error) {
    console.error("Failed to detect apps:", error);
    showNotification("Failed to detect applications", true);
  } finally {
    detectAppsBtn.disabled = false;
    detectAppsBtn.innerHTML = `<span class="icon icon-sm">${icons.search}</span> Re-detect`;
  }
});

// Launch now button
launchNowBtn.addEventListener("click", async () => {
  try {
    launchNowBtn.disabled = true;
    launchNowBtn.innerHTML = `<span class="icon icon-sm">${icons.rocket}</span> Launching...`;

    // Save current settings first
    await window.electronAPI.saveApps(currentApps);

    // Launch apps
    const results = await window.electronAPI.launchAppsNow();

    if (results.success.length > 0) {
      showNotification(
        `Launched ${results.success.length} app(s) successfully!`,
      );
    }

    if (results.failed.length > 0) {
      const failedNames = results.failed.map((f) => f.name).join(", ");
      setTimeout(() => {
        showNotification(`Failed to launch: ${failedNames}`, true);
      }, 3500);
    }
  } catch (error) {
    console.error("Failed to launch apps:", error);
    showNotification("Failed to launch applications", true);
  } finally {
    launchNowBtn.disabled = false;
    launchNowBtn.innerHTML = `<span class="icon icon-sm">${icons.rocket}</span> Launch All Apps Now`;
  }
});

// Theme toggle
themeToggle.addEventListener("click", async () => {
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  await window.electronAPI.setTheme(newTheme);
  applyTheme(newTheme);
});

// Launch delay slider
launchDelaySlider.addEventListener("input", (e) => {
  delayValue.textContent = e.target.value;
});

launchDelaySlider.addEventListener("change", async (e) => {
  try {
    const delay = parseInt(e.target.value);
    await window.electronAPI.setLaunchDelay(delay);
    showNotification(`Launch delay set to ${delay}ms`);
  } catch (error) {
    console.error("Failed to set launch delay:", error);
    showNotification("Failed to change launch delay", true);
  }
});

// Global shortcut toggle
shortcutToggle.addEventListener("change", async (e) => {
  try {
    await window.electronAPI.setShortcutEnabled(e.target.checked);
    showNotification(
      e.target.checked ? "Global shortcut enabled" : "Global shortcut disabled",
    );
  } catch (error) {
    console.error("Failed to toggle shortcut:", error);
    showNotification("Failed to change shortcut setting", true);
    e.target.checked = !e.target.checked;
  }
});

// ========== Notes Feature ==========

// Notes state variables
let selectedNoteIds = new Set();
let notesSearchQuery = "";

// Notes DOM elements for search and multi-select
const notesSearchInput = document.getElementById("notesSearchInput");
const deleteSelectedNotes = document.getElementById("deleteSelectedNotes");
const selectedNotesCount = document.getElementById("selectedNotesCount");
const exportNotesBtn = document.getElementById("exportNotesBtn");
const importNotesBtn = document.getElementById("importNotesBtn");
const downloadNotesPdfBtn = document.getElementById("downloadNotesPdfBtn");

// Render the notes list
function renderNotesList() {
  notesList.innerHTML = "";

  // Filter notes based on search query
  let filteredNotes = currentNotes;
  if (notesSearchQuery) {
    const query = notesSearchQuery.toLowerCase();
    filteredNotes = currentNotes.filter((note) => {
      const title = (note.title || "").toLowerCase();
      const content = stripHtml(note.content || "").toLowerCase();
      return title.includes(query) || content.includes(query);
    });
  }

  // Sort notes by saved order
  filteredNotes = [...filteredNotes].sort((a, b) => {
    const orderA = currentNoteOrder.indexOf(a.id);
    const orderB = currentNoteOrder.indexOf(b.id);
    // Notes not in order array go to end
    if (orderA === -1 && orderB === -1) return 0;
    if (orderA === -1) return 1;
    if (orderB === -1) return -1;
    return orderA - orderB;
  });

  if (filteredNotes.length === 0) {
    noNotesMessage.style.display = "block";
    noNotesMessage.textContent = notesSearchQuery
      ? "No notes match your search."
      : 'No notes yet. Click "New Note" to create one.';
    if (currentNotes.length === 0) {
      noteEditorPanel.style.display = "none";
    }
    return;
  }

  noNotesMessage.style.display = "none";
  if (currentNotes.length > 0) {
    noteEditorPanel.style.display = "flex";
  }

  filteredNotes.forEach((note, index) => {
    const noteItem = document.createElement("div");
    const isSelected = selectedNoteIds.has(note.id);
    noteItem.className = `note-item ${note.id === activeNoteId ? "active" : ""} ${isSelected ? "selected" : ""}`;
    noteItem.dataset.noteId = note.id;
    noteItem.draggable = true;

    const preview = stripHtml(note.content).substring(0, 50);
    const date = new Date(note.updatedAt || note.createdAt);
    const dateStr = date.toLocaleDateString();

    noteItem.innerHTML = `
      <div class="note-drag-handle" title="Drag to reorder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="8" y1="6" x2="16" y2="6"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
          <line x1="8" y1="18" x2="16" y2="18"/>
        </svg>
      </div>
      <div class="note-item-content">
        <input type="checkbox" class="note-item-checkbox" ${isSelected ? "checked" : ""} />
        <div class="note-item-header">
          <span class="note-order-num">${index + 1}</span>
          <span class="note-item-title" title="${(note.title || "Untitled").replace(/"/g, "&quot;")}">${note.title || "Untitled"}</span>
        </div>
        <div class="note-item-preview" title="${(preview || "No content").replace(/"/g, "&quot;")}">${preview || "No content"}...</div>
        <div class="note-item-date">${dateStr}</div>
      </div>
    `;

    // Checkbox click handler
    const checkbox = noteItem.querySelector(".note-item-checkbox");
    checkbox.addEventListener("click", (e) => {
      e.stopPropagation();
      if (checkbox.checked) {
        selectedNoteIds.add(note.id);
        noteItem.classList.add("selected");
      } else {
        selectedNoteIds.delete(note.id);
        noteItem.classList.remove("selected");
      }
      updateSelectedCount();
    });

    // Note item click handler - clicking loads the note
    noteItem.addEventListener("click", (e) => {
      if (
        e.target !== checkbox &&
        !e.target.closest(".note-drag-handle") &&
        note.id !== activeNoteId
      ) {
        saveCurrentNote();
        loadNoteToEditor(note.id);
      }
    });

    // Drag and drop events for notes
    noteItem.addEventListener("dragstart", handleNoteDragStart);
    noteItem.addEventListener("dragend", handleNoteDragEnd);
    noteItem.addEventListener("dragover", handleNoteDragOver);
    noteItem.addEventListener("dragenter", handleNoteDragEnter);
    noteItem.addEventListener("dragleave", handleNoteDragLeave);
    noteItem.addEventListener("drop", handleNoteDrop);

    notesList.appendChild(noteItem);
  });
}

// Update selected count display
function updateSelectedCount() {
  const count = selectedNoteIds.size;
  selectedNotesCount.textContent = `${count} selected`;
  selectedNotesCount.classList.toggle("hidden", count === 0);
  deleteSelectedNotes.classList.toggle("hidden", count === 0);
}

// Strip HTML for preview
function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// Load note into editor
function loadNoteToEditor(noteId) {
  const note = currentNotes.find((n) => n.id === noteId);
  if (!note) return;

  activeNoteId = noteId;
  window.electronAPI.setActiveNoteId(noteId);

  // Make sure editor panel is visible
  noteEditorPanel.style.display = "flex";

  // Default to Read mode when loading an existing note
  isEditMode = false;
  toggleEditModeBtn.innerHTML = `<span class="icon icon-sm">${icons.edit}</span> Edit`;
  toggleEditModeBtn.title = "Switch to Edit Mode";
  noteEditor.classList.add("hidden");
  editorToolbar.classList.add("hidden");
  noteReadView.classList.remove("hidden");
  notesSaveStatus.classList.add("hidden");
  noteTitleInput.readOnly = true;

  // Ensure fields are enabled for editing (but title will be readonly in read mode)
  noteTitleInput.disabled = false;
  noteEditor.contentEditable = "true";

  noteTitleInput.value = note.title || "";
  noteEditor.innerHTML = note.content || "";
  noteReadView.innerHTML = note.content || "";

  if (note.updatedAt) {
    const date = new Date(note.updatedAt);
    noteUpdatedAt.textContent = `Last updated: ${date.toLocaleString()}`;
  } else {
    noteUpdatedAt.textContent = "";
  }

  notesSaveStatus.textContent = "Saved";
  notesSaveStatus.classList.remove("warning", "error");

  // Update active state in list
  document.querySelectorAll(".note-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.noteId === noteId);
  });

  // Wrap images with resize handles
  setTimeout(wrapImagesWithResizeHandles, 100);

  // Add title tooltips to existing priority tags
  setTimeout(() => {
    noteEditor.querySelectorAll(".inline-priority-tag").forEach((tag) => {
      tag.title = "Click to remove";
    });
  }, 100);

  // Update Jira link statuses
  setTimeout(updateJiraLinkStatuses, 100);

  // Add remove buttons to existing jira-inserted-tag elements
  setTimeout(addRemoveButtonsToExistingTags, 100);
}

// Show empty editor state
function showEmptyEditor() {
  noteEditorPanel.style.display = "none";
}

// Save current note
async function saveCurrentNote() {
  if (!activeNoteId) return;

  const title = noteTitleInput.value.trim();
  const content = noteEditor.innerHTML;
  const contentText = stripHtml(content).trim();

  // Don't save empty notes - just skip silently
  if (!title && !contentText) {
    notesSaveStatus.textContent = "";
    notesSaveStatus.classList.remove("saving", "warning");
    return;
  }

  try {
    currentNotes = await window.electronAPI.updateNote(
      activeNoteId,
      title,
      content,
    );
    notesSaveStatus.textContent = "Saved";
    notesSaveStatus.classList.remove("saving", "warning");
    renderNotesList();
  } catch (error) {
    console.error("Failed to save note:", error);
    notesSaveStatus.textContent = "Error";
    notesSaveStatus.classList.add("error");
  }
}

// Check if current note is empty (for reference only)
function isCurrentNoteEmpty() {
  if (!activeNoteId) return false;
  const title = noteTitleInput.value.trim();
  const content = noteEditor.innerHTML;
  const contentText = stripHtml(content).trim();
  return !title && !contentText;
}

// Create new note
async function createNewNote() {
  // Save current note first if it exists
  if (activeNoteId) {
    await saveCurrentNote();
  }

  const newNote = {
    id: `note_${Date.now()}`,
    title: "",
    content: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  currentNotes = await window.electronAPI.createNote(newNote);
  activeNoteId = newNote.id;
  renderNotesList();
  loadNoteToEditor(newNote.id);

  // Switch to Edit mode for new notes
  isEditMode = true;
  toggleEditModeBtn.innerHTML = `<span class="icon icon-sm">${icons.eye}</span> Read`;
  toggleEditModeBtn.title = "Switch to Read Mode";
  noteEditor.classList.remove("hidden");
  editorToolbar.classList.remove("hidden");
  noteReadView.classList.add("hidden");
  notesSaveStatus.classList.remove("hidden");
  noteTitleInput.readOnly = false;

  noteTitleInput.focus();
}

// Delete current note
async function deleteCurrentNote() {
  if (!activeNoteId) return;

  const note = currentNotes.find((n) => n.id === activeNoteId);
  const title = note?.title || "Untitled";

  // Use custom confirm modal instead of native confirm
  const confirmed = await showConfirm(
    `Are you sure you want to delete "${title}"?`,
    "Delete Note",
  );
  if (!confirmed) return;

  const deletedNoteId = activeNoteId;
  activeNoteId = null;

  currentNotes = await window.electronAPI.deleteNote(deletedNoteId);
  renderNotesList();

  if (currentNotes.length > 0) {
    loadNoteToEditor(currentNotes[0].id);
  } else {
    showEmptyEditor();
  }

  // Restore focus to the app
  setTimeout(() => {
    if (currentNotes.length > 0) {
      noteTitleInput.focus();
    } else {
      notesSearchInput.focus();
    }
  }, 100);

  showNotification("Note deleted");
}

// Tab switching functionality
function switchTab(tabName) {
  // Update tab buttons
  settingsTab.classList.toggle("active", tabName === "settings");
  notesTab.classList.toggle("active", tabName === "notes");
  helpTab.classList.toggle("active", tabName === "help");

  // Update tab panels
  settingsPanel.classList.toggle("active", tabName === "settings");
  notesPanel.classList.toggle("active", tabName === "notes");
  helpPanel.classList.toggle("active", tabName === "help");
}

settingsTab.addEventListener("click", () => switchTab("settings"));
notesTab.addEventListener("click", () => switchTab("notes"));
helpTab.addEventListener("click", () => switchTab("help"));

// Add note button
addNoteBtn.addEventListener("click", createNewNote);

// Delete note button
deleteNoteBtn.addEventListener("click", deleteCurrentNote);

// Toggle Edit/Read mode
toggleEditModeBtn.addEventListener("click", () => {
  isEditMode = !isEditMode;

  if (isEditMode) {
    // Switch to Edit mode
    toggleEditModeBtn.innerHTML = `<span class="icon icon-sm">${icons.eye}</span> Read`;
    toggleEditModeBtn.title = "Switch to Read Mode";
    noteEditor.classList.remove("hidden");
    editorToolbar.classList.remove("hidden");
    noteReadView.classList.add("hidden");
    noteTitleInput.readOnly = false;
    notesSaveStatus.classList.remove("hidden");
    // Apply resize handles to images
    setTimeout(wrapImagesWithResizeHandles, 100);
  } else {
    // Switch to Read mode - save first
    saveCurrentNote();
    toggleEditModeBtn.innerHTML = `<span class="icon icon-sm">${icons.edit}</span> Edit`;
    toggleEditModeBtn.title = "Switch to Edit Mode";
    noteEditor.classList.add("hidden");
    editorToolbar.classList.add("hidden");
    noteReadView.classList.remove("hidden");
    noteReadView.innerHTML = noteEditor.innerHTML;
    noteTitleInput.readOnly = true;
    notesSaveStatus.classList.add("hidden");
  }
});

// Toggle notes sidebar
if (toggleNotesSidebarBtn) {
  toggleNotesSidebarBtn.addEventListener("click", () => {
    const notesLayout = document.querySelector(".notes-layout");
    if (notesLayout) {
      const isCollapsed = notesLayout.classList.toggle("sidebar-collapsed");

      // Update button state class
      if (isCollapsed) {
        toggleNotesSidebarBtn.classList.add("collapsed");
      } else {
        toggleNotesSidebarBtn.classList.remove("collapsed");
      }

      // Update button icon
      const icon = toggleNotesSidebarBtn.querySelector(".icon svg");
      if (icon) {
        if (isCollapsed) {
          // Show right-pointing bars icon when collapsed (to indicate expand action)
          icon.innerHTML =
            '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" x2="15" y1="3" y2="21"/>';
        } else {
          // Show left-pointing bars icon when expanded (to indicate collapse action)
          icon.innerHTML =
            '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" x2="9" y1="3" y2="21"/>';
        }
      }
      toggleNotesSidebarBtn.title = isCollapsed
        ? "Show Sidebar"
        : "Hide Sidebar";
    }
  });
}

// Toggle notes fullscreen
if (toggleNotesFullscreenBtn) {
  toggleNotesFullscreenBtn.addEventListener("click", () => {
    const notesSection = document.querySelector(".notes-tab-section");
    if (notesSection) {
      const isFullscreen = notesSection.classList.toggle("fullscreen");

      // Update button icon/title
      const icon = toggleNotesFullscreenBtn.querySelector(".icon svg");
      if (icon) {
        if (isFullscreen) {
          // Show minimize/exit fullscreen icon
          icon.innerHTML =
            '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>';
        } else {
          // Show maximize/fullscreen icon
          icon.innerHTML =
            '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>';
        }
      }
      toggleNotesFullscreenBtn.title = isFullscreen
        ? "Exit Fullscreen"
        : "Toggle Fullscreen";
    }
  });
}

// Search notes
notesSearchInput.addEventListener("input", (e) => {
  notesSearchQuery = e.target.value.trim();
  renderNotesList();
});

// Delete selected notes
deleteSelectedNotes.addEventListener("click", async () => {
  const count = selectedNoteIds.size;
  if (count === 0) return;

  const confirmed = await showConfirm(
    `Are you sure you want to delete ${count} selected note${count > 1 ? "s" : ""}?`,
    "Delete Notes",
  );
  if (!confirmed) return;

  // Delete all selected notes
  for (const noteId of selectedNoteIds) {
    currentNotes = await window.electronAPI.deleteNote(noteId);
  }

  // Clear selection
  selectedNoteIds.clear();
  updateSelectedCount();

  // Update active note if it was deleted
  if (!currentNotes.find((n) => n.id === activeNoteId)) {
    if (currentNotes.length > 0) {
      loadNoteToEditor(currentNotes[0].id);
    } else {
      activeNoteId = null;
      showEmptyEditor();
    }
  }

  renderNotesList();
  showNotification(`${count} note${count > 1 ? "s" : ""} deleted`);
});

// Export notes
exportNotesBtn.addEventListener("click", async () => {
  try {
    exportNotesBtn.disabled = true;
    exportNotesBtn.innerHTML = `<span class="icon icon-sm">${icons.loader}</span> Exporting...`;

    const result = await window.electronAPI.exportNotes();

    if (result.success) {
      showNotification(
        `Exported ${result.count} note${result.count !== 1 ? "s" : ""} successfully`,
      );
    } else if (!result.canceled) {
      showNotification(result.error || "Export failed", "error");
    }
  } catch (error) {
    showNotification("Export failed: " + error.message, "error");
  } finally {
    exportNotesBtn.disabled = false;
    exportNotesBtn.innerHTML = `<span class="icon icon-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg></span> Export`;
  }
});

// Import notes
importNotesBtn.addEventListener("click", async () => {
  try {
    importNotesBtn.disabled = true;
    importNotesBtn.innerHTML = `<span class="icon icon-sm">${icons.loader}</span> Importing...`;

    const result = await window.electronAPI.importNotes();

    if (result.success) {
      // Reload notes
      currentNotes = await window.electronAPI.getNotes();
      renderNotesList();
      showNotification(
        `Imported ${result.count} note${result.count !== 1 ? "s" : ""} successfully`,
      );
    } else if (!result.canceled) {
      showNotification(result.error || "Import failed", "error");
    }
  } catch (error) {
    showNotification("Import failed: " + error.message, "error");
  } finally {
    importNotesBtn.disabled = false;
    importNotesBtn.innerHTML = `<span class="icon icon-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg></span> Import`;
  }
});

// Download current note as PDF
downloadNotesPdfBtn.addEventListener("click", async () => {
  if (!activeNoteId) {
    showNotification("Please select a note to download", "warning");
    return;
  }

  const note = currentNotes.find((n) => n.id === activeNoteId);
  if (!note) {
    showNotification("Note not found", "error");
    return;
  }

  try {
    downloadNotesPdfBtn.disabled = true;
    downloadNotesPdfBtn.innerHTML = `<span class="icon icon-sm">${icons.loader}</span> Saving...`;

    const result = await window.electronAPI.exportNoteToPdf(
      note.id,
      note.title || "Untitled Note",
      note.content || "",
    );

    if (result.success) {
      showNotification("PDF saved successfully");
    } else if (!result.canceled) {
      showNotification(result.error || "PDF export failed", "error");
    }
  } catch (error) {
    showNotification("PDF export failed: " + error.message, "error");
  } finally {
    downloadNotesPdfBtn.disabled = false;
    downloadNotesPdfBtn.innerHTML = `<span class="icon icon-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg></span> PDF`;
  }
});

// Note title input - auto-save with debounce
noteTitleInput.addEventListener("input", () => {
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");

  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
});

// Note editor - auto-save with debounce
noteEditor.addEventListener("input", () => {
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");

  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
});

// Handle keyboard events for code block and blockquote
noteEditor.addEventListener("keydown", (e) => {
  const selection = window.getSelection();

  // Handle Ctrl+Shift+Backspace to delete entire code block or blockquote
  if (
    (e.key === "Backspace" || e.key === "Delete") &&
    e.ctrlKey &&
    e.shiftKey
  ) {
    if (selection.rangeCount > 0) {
      let node = selection.getRangeAt(0).startContainer;
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
      }

      // Find if we're inside a code block or blockquote wrapper
      let currentNode = node;
      while (currentNode && currentNode !== noteEditor) {
        if (
          currentNode.classList &&
          (currentNode.classList.contains("code-block-wrapper") ||
            currentNode.classList.contains("blockquote-wrapper"))
        ) {
          e.preventDefault();
          currentNode.remove();
          noteEditor.focus();
          // Trigger save
          notesSaveStatus.textContent = "Saving...";
          notesSaveStatus.classList.add("saving");
          clearTimeout(notesDebounceTimer);
          notesDebounceTimer = setTimeout(saveCurrentNote, 500);
          return;
        }
        currentNode = currentNode.parentNode;
      }
    }
  }

  // Handle Enter key to escape from blockquote (when cursor at end)
  if (e.key === "Enter" && !e.shiftKey) {
    if (selection.rangeCount > 0) {
      let node = selection.getRangeAt(0).startContainer;
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
      }

      // Find if we're inside a blockquote-wrapper
      let blockquoteWrapper = null;
      let currentNode = node;
      while (currentNode && currentNode !== noteEditor) {
        if (
          currentNode.classList &&
          currentNode.classList.contains("blockquote-wrapper")
        ) {
          blockquoteWrapper = currentNode;
          break;
        }
        currentNode = currentNode.parentNode;
      }

      // If in blockquote and cursor is at the end, escape to new paragraph
      if (blockquoteWrapper) {
        const blockquote = blockquoteWrapper.querySelector("blockquote");
        if (blockquote) {
          const range = selection.getRangeAt(0);
          const blockquoteContent = blockquote.textContent;

          // Check if cursor is at the end of blockquote
          // or if the blockquote ends with an empty line (Enter was pressed before)
          const isAtEnd =
            range.endContainer === blockquote ||
            (range.endContainer.nodeType === Node.TEXT_NODE &&
              range.endOffset === range.endContainer.textContent.length &&
              range.endContainer.parentNode === blockquote);

          // Check if content ends with newline (user pressed Enter once)
          const endsWithNewline =
            blockquoteContent.endsWith("\n") ||
            blockquote.innerHTML.endsWith("<br>") ||
            blockquote.innerHTML.endsWith("<br><br>");

          if (isAtEnd && endsWithNewline) {
            e.preventDefault();

            // Remove trailing br/newline from blockquote
            blockquote.innerHTML = blockquote.innerHTML
              .replace(/<br>$/i, "")
              .trim();
            if (blockquote.innerHTML === "") {
              blockquote.innerHTML = "&nbsp;";
            }

            // Create new paragraph after blockquote wrapper
            const p = document.createElement("p");
            p.innerHTML = "<br>";
            blockquoteWrapper.parentNode.insertBefore(
              p,
              blockquoteWrapper.nextSibling,
            );

            // Move cursor to new paragraph
            const newRange = document.createRange();
            newRange.setStart(p, 0);
            newRange.setEnd(p, 0);
            selection.removeAllRanges();
            selection.addRange(newRange);

            // Trigger save
            notesSaveStatus.textContent = "Saving...";
            notesSaveStatus.classList.add("saving");
            clearTimeout(notesDebounceTimer);
            notesDebounceTimer = setTimeout(saveCurrentNote, 500);
            return;
          }
        }
      }
    }
  }
});

// Rich text toolbar commands
document
  .querySelectorAll(".editor-toolbar button[data-command]")
  .forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const command = btn.dataset.command;
      const value = btn.dataset.value || null;

      if (command === "formatBlock") {
        document.execCommand(command, false, `<${value}>`);
      } else {
        document.execCommand(command, false, value);
      }

      noteEditor.focus();

      // Trigger save after formatting
      notesSaveStatus.textContent = "Saving...";
      notesSaveStatus.classList.add("saving");
      clearTimeout(notesDebounceTimer);
      notesDebounceTimer = setTimeout(saveCurrentNote, 500);
    });
  });

// Code block button handler
document.getElementById("insertCodeBlockBtn").addEventListener("click", (e) => {
  e.preventDefault();

  // Ensure editor has focus
  noteEditor.focus();

  const selection = window.getSelection();
  const selectedText = selection.toString() || "// Your code here";

  // Create code block element with delete button
  const codeBlockWrapper = document.createElement("div");
  codeBlockWrapper.className = "code-block-wrapper";

  const pre = document.createElement("pre");
  pre.contentEditable = "true"; // Make pre editable
  const code = document.createElement("code");
  code.textContent = selectedText;
  pre.appendChild(code);

  // Add delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "code-block-delete";
  deleteBtn.contentEditable = "false"; // Keep button non-editable
  deleteBtn.innerHTML = "✕";
  deleteBtn.title = "Remove code block";
  deleteBtn.onclick = function (event) {
    event.stopPropagation();
    event.preventDefault();
    codeBlockWrapper.remove();
    noteEditor.focus();
    // Trigger save
    notesSaveStatus.textContent = "Saving...";
    notesSaveStatus.classList.add("saving");
    clearTimeout(notesDebounceTimer);
    notesDebounceTimer = setTimeout(saveCurrentNote, 500);
  };

  codeBlockWrapper.appendChild(deleteBtn);
  codeBlockWrapper.appendChild(pre);

  // Insert at cursor position in the editor
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    // Check if the range is inside the note editor
    let container = range.commonAncestorContainer;
    let isInsideEditor = false;
    while (container) {
      if (container === noteEditor) {
        isInsideEditor = true;
        break;
      }
      container = container.parentNode;
    }

    if (isInsideEditor) {
      range.deleteContents();
      range.insertNode(codeBlockWrapper);
      // Add a space after the code block for easier editing
      const space = document.createTextNode("\u00A0");
      range.setStartAfter(codeBlockWrapper);
      range.insertNode(space);
      range.setStartAfter(space);
      range.setEndAfter(space);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // If not inside editor, append to editor
      noteEditor.appendChild(codeBlockWrapper);
      noteEditor.appendChild(document.createTextNode("\u00A0"));
    }
  } else {
    noteEditor.appendChild(codeBlockWrapper);
    noteEditor.appendChild(document.createTextNode("\u00A0"));
  }

  noteEditor.focus();

  // Trigger save
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
});

// Quote (blockquote) button handler with delete button
document.getElementById("insertQuoteBtn").addEventListener("click", (e) => {
  e.preventDefault();

  // Ensure editor has focus
  noteEditor.focus();

  const selection = window.getSelection();

  // Check if we're currently inside a blockquote-wrapper - if so, remove it
  if (selection.rangeCount > 0) {
    let node = selection.getRangeAt(0).startContainer;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    // Find if we're inside a blockquote wrapper
    let currentNode = node;
    while (currentNode && currentNode !== noteEditor) {
      if (
        currentNode.classList &&
        currentNode.classList.contains("blockquote-wrapper")
      ) {
        // Extract content and remove wrapper
        const blockquote = currentNode.querySelector("blockquote");
        const content = blockquote ? blockquote.innerHTML : "";
        const p = document.createElement("p");
        p.innerHTML = content || "&nbsp;";
        currentNode.parentNode.replaceChild(p, currentNode);

        // Trigger save
        notesSaveStatus.textContent = "Saving...";
        notesSaveStatus.classList.add("saving");
        clearTimeout(notesDebounceTimer);
        notesDebounceTimer = setTimeout(saveCurrentNote, 500);
        return;
      }
      currentNode = currentNode.parentNode;
    }
  }

  const selectedText = selection.toString() || "Your quote here...";

  // Create blockquote element with delete button
  const blockquoteWrapper = document.createElement("div");
  blockquoteWrapper.className = "blockquote-wrapper";

  const blockquote = document.createElement("blockquote");
  blockquote.contentEditable = "true";
  blockquote.innerHTML = selectedText;

  // Add delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "blockquote-delete";
  deleteBtn.contentEditable = "false";
  deleteBtn.innerHTML = "✕";
  deleteBtn.title = "Remove quote";
  deleteBtn.onclick = function (event) {
    event.stopPropagation();
    event.preventDefault();
    blockquoteWrapper.remove();
    noteEditor.focus();
    // Trigger save
    notesSaveStatus.textContent = "Saving...";
    notesSaveStatus.classList.add("saving");
    clearTimeout(notesDebounceTimer);
    notesDebounceTimer = setTimeout(saveCurrentNote, 500);
  };

  blockquoteWrapper.appendChild(deleteBtn);
  blockquoteWrapper.appendChild(blockquote);

  // Insert at cursor position in the editor
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    // Check if the range is inside the note editor
    let container = range.commonAncestorContainer;
    let isInsideEditor = false;
    while (container) {
      if (container === noteEditor) {
        isInsideEditor = true;
        break;
      }
      container = container.parentNode;
    }

    if (isInsideEditor) {
      range.deleteContents();
      range.insertNode(blockquoteWrapper);
      // Add a paragraph after for easier editing
      const p = document.createElement("p");
      p.innerHTML = "<br>";
      range.setStartAfter(blockquoteWrapper);
      range.insertNode(p);
      // Move cursor to the new paragraph
      range.setStart(p, 0);
      range.setEnd(p, 0);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // If not inside editor, append to editor
      noteEditor.appendChild(blockquoteWrapper);
      const p = document.createElement("p");
      p.innerHTML = "<br>";
      noteEditor.appendChild(p);
    }
  } else {
    noteEditor.appendChild(blockquoteWrapper);
    const p = document.createElement("p");
    p.innerHTML = "<br>";
    noteEditor.appendChild(p);
  }

  noteEditor.focus();

  // Trigger save
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
});

// Text color picker handler
const textColorBtn = document.getElementById("textColorBtn");
const textColorPicker = document.getElementById("textColorPicker");

textColorBtn.addEventListener("click", (e) => {
  e.preventDefault();
  textColorPicker.click();
});

textColorPicker.addEventListener("input", (e) => {
  const color = e.target.value;

  // Update button indicator color
  textColorBtn.style.borderBottomColor = color;

  // Apply color to selected text
  document.execCommand("foreColor", false, color);

  noteEditor.focus();

  // Trigger save
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
});

// Highlight color picker handler
const highlightBtn = document.getElementById("highlightBtn");
const highlightColorPicker = document.getElementById("highlightColorPicker");

highlightBtn.addEventListener("click", (e) => {
  e.preventDefault();
  highlightColorPicker.click();
});

highlightColorPicker.addEventListener("input", (e) => {
  const color = e.target.value;
  document.execCommand("hiliteColor", false, color);
  noteEditor.focus();

  // Trigger save
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
});

// Insert link modal elements
const insertLinkModal = document.getElementById("insertLinkModal");
const insertLinkText = document.getElementById("insertLinkText");
const insertLinkUrl = document.getElementById("insertLinkUrl");
const confirmInsertLinkBtn = document.getElementById("confirmInsertLinkBtn");
const cancelInsertLinkBtn = document.getElementById("cancelInsertLinkBtn");
const closeInsertLinkModalBtn = document.getElementById(
  "closeInsertLinkModalBtn",
);

let savedSelection = null;

// Insert link handler - open modal
document.getElementById("insertLinkBtn").addEventListener("click", (e) => {
  e.preventDefault();

  // Save current selection
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    savedSelection = selection.getRangeAt(0).cloneRange();
    insertLinkText.value = selection.toString() || "";
  } else {
    savedSelection = null;
    insertLinkText.value = "";
  }

  insertLinkUrl.value = "https://";
  insertLinkModal.classList.remove("hidden");
  insertLinkUrl.focus();
});

// Confirm insert link
confirmInsertLinkBtn.addEventListener("click", () => {
  const url = insertLinkUrl.value.trim();
  const text = insertLinkText.value.trim() || url;

  if (url && url !== "https://") {
    noteEditor.focus();

    // Restore selection if we had one
    if (savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }

    const selection = window.getSelection();
    if (selection.toString()) {
      // If text is selected, wrap it in a link
      document.execCommand("createLink", false, url);
    } else {
      // Insert a new link at cursor
      const link = document.createElement("a");
      link.href = url;
      link.textContent = text;
      link.target = "_blank";

      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(link);
        range.setStartAfter(link);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    // Trigger save
    notesSaveStatus.textContent = "Saving...";
    notesSaveStatus.classList.add("saving");
    clearTimeout(notesDebounceTimer);
    notesDebounceTimer = setTimeout(saveCurrentNote, 500);
  }

  insertLinkModal.classList.add("hidden");
  savedSelection = null;
});

// Cancel/close insert link modal
cancelInsertLinkBtn.addEventListener("click", () => {
  insertLinkModal.classList.add("hidden");
  savedSelection = null;
  noteEditor.focus();
});

closeInsertLinkModalBtn.addEventListener("click", () => {
  insertLinkModal.classList.add("hidden");
  savedSelection = null;
  noteEditor.focus();
});

// Handle Enter key in URL input
insertLinkUrl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    confirmInsertLinkBtn.click();
  }
});

// Insert horizontal rule handler
document.getElementById("insertHrBtn").addEventListener("click", (e) => {
  e.preventDefault();
  document.execCommand("insertHorizontalRule", false, null);
  noteEditor.focus();

  // Trigger save
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
});

// Clear formatting handler
document.getElementById("clearFormattingBtn").addEventListener("click", (e) => {
  e.preventDefault();
  document.execCommand("removeFormat", false, null);
  noteEditor.focus();

  // Trigger save
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
});

// ============================================
// Priority Tag Insertion
// ============================================
const insertPriorityBtn = document.getElementById("insertPriorityBtn");
const priorityTagsMenu = document.getElementById("priorityTagsMenu");

// Priority tag colors and labels
const priorityTagStyles = {
  highest: { bg: "#dc2626", color: "#fff", label: "Highest Priority" },
  high: { bg: "#ea580c", color: "#fff", label: "High Priority" },
  medium: { bg: "#eab308", color: "#000", label: "Medium Priority" },
  low: { bg: "#22c55e", color: "#fff", label: "Low Priority" },
  lowest: { bg: "#3b82f6", color: "#fff", label: "Lowest Priority" },
  done: { bg: "#8b5cf6", color: "#fff", label: "Done" },
};

// Toggle priority menu
insertPriorityBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  priorityTagsMenu.classList.toggle("show");
});

// Close priority menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".priority-tags-dropdown")) {
    priorityTagsMenu.classList.remove("show");
  }
});

// Handle priority tag insertion
priorityTagsMenu.addEventListener("click", (e) => {
  const btn = e.target.closest(".priority-tag-option");
  if (!btn) return;

  e.preventDefault();
  const priority = btn.dataset.priority;
  const style = priorityTagStyles[priority];

  if (!style) return;

  noteEditor.focus();

  // Create priority tag element
  const tag = document.createElement("span");
  tag.className = `inline-priority-tag priority-${priority}`;
  tag.contentEditable = "false";
  tag.style.cssText = `
    display: inline-block;
    padding: 2px 8px;
    margin: 0 4px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    background: ${style.bg};
    color: ${style.color};
    user-select: none;
    cursor: pointer;
  `;
  tag.textContent = style.label;
  tag.dataset.priority = priority;
  tag.title = "Click to remove";

  // Insert at cursor position
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();

    // Check if we need to add a space before
    const needsSpaceBefore =
      range.startContainer.nodeType === Node.TEXT_NODE &&
      range.startOffset > 0 &&
      range.startContainer.textContent[range.startOffset - 1] !== " ";

    if (
      needsSpaceBefore ||
      (range.startContainer.nodeType === Node.ELEMENT_NODE &&
        range.startOffset === 0)
    ) {
      const spaceBefore = document.createTextNode(" ");
      range.insertNode(spaceBefore);
      range.setStartAfter(spaceBefore);
    }

    // Insert the tag
    range.insertNode(tag);
    range.setStartAfter(tag);

    // Always add a space after the tag to ensure cursor can be placed after it
    const spaceAfter = document.createTextNode(" ");
    range.insertNode(spaceAfter);
    range.setStartAfter(spaceAfter);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Close menu
  priorityTagsMenu.classList.remove("show");

  // Trigger save
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
});

// Handle clicking on inline priority tags to remove them
noteEditor.addEventListener("click", (e) => {
  const tag = e.target.closest(".inline-priority-tag");
  if (tag && isEditMode) {
    e.preventDefault();
    e.stopPropagation();

    // Show confirmation or just remove directly
    tag.remove();

    // Trigger save
    notesSaveStatus.textContent = "Saving...";
    notesSaveStatus.classList.add("saving");
    clearTimeout(notesDebounceTimer);
    notesDebounceTimer = setTimeout(saveCurrentNote, 500);

    showNotification("Priority tag removed");
  }
});

// Handle paste event for images (copy/paste from clipboard)
noteEditor.addEventListener("paste", async (e) => {
  const clipboardData = e.clipboardData || window.clipboardData;
  const items = clipboardData.items;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      e.preventDefault();
      const file = items[i].getAsFile();

      // Convert image to base64 data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target.result;
        img.style.maxWidth = "100%";

        // Insert at cursor position
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);

          // Add a paragraph after the image for easier editing
          const p = document.createElement("p");
          p.innerHTML = "<br>";
          if (img.nextSibling) {
            img.parentNode.insertBefore(p, img.nextSibling);
          } else {
            img.parentNode.appendChild(p);
          }

          // Move cursor to the new paragraph
          range.setStart(p, 0);
          range.setEnd(p, 0);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          noteEditor.appendChild(img);
          // Add a paragraph after the image
          const p = document.createElement("p");
          p.innerHTML = "<br>";
          noteEditor.appendChild(p);
        }

        // Observe the new image for resize
        setTimeout(wrapImagesWithResizeHandles, 100);

        // Trigger save
        notesSaveStatus.textContent = "Saving...";
        notesSaveStatus.classList.add("saving");
        clearTimeout(notesDebounceTimer);
        notesDebounceTimer = setTimeout(saveCurrentNote, 500);
      };
      reader.readAsDataURL(file);
      return;
    }
  }
});

// ========== Image Lightbox Feature ==========

// Variables for image resizing
let isResizing = false;
let currentResizeImg = null;
let startX, startY, startWidth, startHeight;

// Zoom variables
let currentZoom = 100;
const ZOOM_MIN = 25;
const ZOOM_MAX = 400;
const ZOOM_STEP = 25;

// Pan/drag variables
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let panOffsetX = 0;
let panOffsetY = 0;

// Update zoom level display
function updateZoomDisplay() {
  zoomLevelDisplay.textContent = currentZoom + "%";
  updateImageTransform();
}

// Update image transform (zoom + pan)
function updateImageTransform() {
  const scale = currentZoom / 100;
  lightboxImage.style.transform = `translate(${panOffsetX}px, ${panOffsetY}px) scale(${scale})`;

  // Update cursor
  lightboxImage.style.cursor = isPanning ? "grabbing" : "grab";
}

// Zoom in
function zoomIn() {
  if (currentZoom < ZOOM_MAX) {
    currentZoom = Math.min(ZOOM_MAX, currentZoom + ZOOM_STEP);
    updateZoomDisplay();
  }
}

// Zoom out
function zoomOut() {
  if (currentZoom > ZOOM_MIN) {
    currentZoom = Math.max(ZOOM_MIN, currentZoom - ZOOM_STEP);
    updateZoomDisplay();
  }
}

// Reset zoom
function resetZoom() {
  currentZoom = 100;
  panOffsetX = 0;
  panOffsetY = 0;
  updateZoomDisplay();
}

// Function to open image in lightbox
function openImageInLightbox(imgSrc) {
  // Reset zoom and pan when opening
  currentZoom = 100;
  panOffsetX = 0;
  panOffsetY = 0;
  updateZoomDisplay();
  lightboxImage.src = imgSrc;
  imageLightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

// Note: Image click handling is done in the click handler that also manages selection
// The overlay view button is used to open the lightbox

// Handle clicking at the bottom of editor to add new line after images/blockquotes
noteEditor.addEventListener("click", (e) => {
  // Only in edit mode
  if (!isEditMode) return;

  // Check if click is directly on the editor (not on a child element)
  if (e.target === noteEditor) {
    // Get click position relative to editor
    const editorRect = noteEditor.getBoundingClientRect();
    const clickY = e.clientY - editorRect.top;

    // Check if there's content and if clicking below it
    const lastChild = noteEditor.lastElementChild;
    if (lastChild) {
      const lastChildRect = lastChild.getBoundingClientRect();
      const lastChildBottom = lastChildRect.bottom - editorRect.top;

      // If clicking below the last element, create a new paragraph
      if (clickY > lastChildBottom) {
        // Check if last child is an image, blockquote-wrapper, code-block-wrapper, or img-wrapper
        const isBlockElement =
          lastChild.tagName === "IMG" ||
          lastChild.classList?.contains("blockquote-wrapper") ||
          lastChild.classList?.contains("code-block-wrapper") ||
          lastChild.classList?.contains("img-resize-wrapper") ||
          lastChild.tagName === "BLOCKQUOTE" ||
          lastChild.tagName === "PRE";

        if (
          isBlockElement ||
          lastChild.tagName !== "P" ||
          lastChild.innerHTML.trim() === "<br>"
        ) {
          // Create new paragraph
          const p = document.createElement("p");
          p.innerHTML = "<br>";
          noteEditor.appendChild(p);

          // Move cursor to new paragraph
          const range = document.createRange();
          const selection = window.getSelection();
          range.setStart(p, 0);
          range.setEnd(p, 0);
          selection.removeAllRanges();
          selection.addRange(range);

          // Trigger save
          notesSaveStatus.textContent = "Saving...";
          notesSaveStatus.classList.add("saving");
          clearTimeout(notesDebounceTimer);
          notesDebounceTimer = setTimeout(saveCurrentNote, 500);
        }
      }
    } else {
      // Editor is empty, create initial paragraph
      const p = document.createElement("p");
      p.innerHTML = "<br>";
      noteEditor.appendChild(p);

      // Move cursor to new paragraph
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(p, 0);
      range.setEnd(p, 0);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});

// Open lightbox when clicking on an image in read mode
noteReadView.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
    openImageInLightbox(e.target.src);
  }
});

// Close lightbox function
function closeImageLightbox() {
  imageLightbox.classList.add("hidden");
  lightboxImage.src = "";
  document.body.style.overflow = ""; // Restore scroll
  // Reset zoom and pan
  currentZoom = 100;
  panOffsetX = 0;
  panOffsetY = 0;
  updateZoomDisplay();
}

// Close lightbox on close button click
closeLightbox.addEventListener("click", closeImageLightbox);

// Close lightbox on backdrop click
lightboxBackdrop.addEventListener("click", closeImageLightbox);

// Zoom button event listeners
zoomInBtn.addEventListener("click", zoomIn);
zoomOutBtn.addEventListener("click", zoomOut);
zoomResetBtn.addEventListener("click", resetZoom);

// Mouse wheel zoom
lightboxImageContainer.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
});

// Pan/drag functionality for images
lightboxImage.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isPanning = true;
  panStartX = e.clientX - panOffsetX;
  panStartY = e.clientY - panOffsetY;
  updateImageTransform();
});

document.addEventListener("mousemove", (e) => {
  if (isPanning) {
    e.preventDefault();
    panOffsetX = e.clientX - panStartX;
    panOffsetY = e.clientY - panStartY;
    updateImageTransform();
  }
});

document.addEventListener("mouseup", (e) => {
  if (isPanning) {
    isPanning = false;
    updateImageTransform();
  }
});

// Close lightbox on Escape key, zoom with +/-
document.addEventListener("keydown", (e) => {
  if (!imageLightbox.classList.contains("hidden")) {
    if (e.key === "Escape") {
      closeImageLightbox();
    } else if (e.key === "+" || e.key === "=") {
      zoomIn();
    } else if (e.key === "-" || e.key === "_") {
      zoomOut();
    } else if (e.key === "0") {
      resetZoom();
    }
  } else if (e.key === "Escape") {
    // Exit fullscreen mode for notes
    const notesSection = document.querySelector(".notes-tab-section");
    if (notesSection && notesSection.classList.contains("fullscreen")) {
      notesSection.classList.remove("fullscreen");
      if (toggleNotesFullscreenBtn) {
        toggleNotesFullscreenBtn.title = "Toggle Fullscreen";
        // Reset icon to maximize/fullscreen
        const icon = toggleNotesFullscreenBtn.querySelector(".icon svg");
        if (icon) {
          icon.innerHTML =
            '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>';
        }
      }
    }
  }
});

// Selected image for clipboard operations
let selectedImage = null;

// Wrap images with resize handles and overlay buttons
function wrapImagesWithResizeHandles() {
  const images = noteEditor.querySelectorAll("img");
  images.forEach((img) => {
    const parent = img.parentElement;

    // Check if already properly wrapped with handle
    if (parent && parent.classList.contains("img-resize-wrapper")) {
      // Verify the resize handle exists
      let handle = parent.querySelector(".img-resize-handle");

      if (!handle) {
        // Wrapper exists but no handle - create one
        handle = document.createElement("span");
        handle.className = "img-resize-handle";
        parent.appendChild(handle);
      }

      // Always recreate overlay to ensure event listeners are attached
      let overlay = parent.querySelector(".img-overlay");
      if (overlay) {
        overlay.remove();
      }
      overlay = createImageOverlay(img, parent);
      parent.appendChild(overlay);

      // Always reattach event listener (in case it was lost on reload)
      // Remove old listener first by cloning and replacing
      const newHandle = handle.cloneNode(true);
      handle.parentNode.replaceChild(newHandle, handle);
      newHandle.addEventListener("mousedown", startResize);

      // Setup drag handlers if not already set
      if (!parent.hasAttribute("data-drag-setup")) {
        parent.setAttribute("data-drag-setup", "true");
        setupImageDragAndDrop(parent);
      }

      img.classList.add("wrapped");
      return;
    }

    // Not wrapped - create wrapper and handle
    const wrapper = document.createElement("span");
    wrapper.className = "img-resize-wrapper";
    wrapper.contentEditable = "false";

    // Create resize handle
    const handle = document.createElement("span");
    handle.className = "img-resize-handle";

    // Prevent resize handle from initiating drag
    handle.addEventListener("dragstart", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    // Create overlay with buttons
    const overlay = createImageOverlay(img, wrapper);

    // Wrap the image
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(handle);
    wrapper.appendChild(overlay);
    img.classList.add("wrapped");

    // Add resize event listeners to handle
    handle.addEventListener("mousedown", startResize);

    // Add drag event listeners for moving images
    setupImageDragAndDrop(wrapper);
  });
}

// Create image overlay with copy/delete buttons
function createImageOverlay(img, wrapper) {
  const overlay = document.createElement("div");
  overlay.className = "img-overlay";
  overlay.contentEditable = "false";

  // Prevent overlay from initiating drag
  overlay.addEventListener("dragstart", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  // Copy button
  const copyBtn = document.createElement("button");
  copyBtn.className = "img-overlay-btn img-copy-btn";
  copyBtn.innerHTML = "📋";
  copyBtn.title = "Copy image";
  copyBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  copyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    copyImageToClipboard(img);
  });

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "img-overlay-btn img-delete-btn";
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.title = "Delete image";
  deleteBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteImage(wrapper);
  });

  overlay.appendChild(copyBtn);
  overlay.appendChild(deleteBtn);

  return overlay;
}

// Copy image to clipboard
async function copyImageToClipboard(img) {
  try {
    // For data URLs, convert to blob
    if (img.src.startsWith("data:")) {
      const response = await fetch(img.src);
      const blob = await response.blob();

      // Check if clipboard supports this type
      const clipboardItem = new ClipboardItem({
        [blob.type]: blob,
      });

      await navigator.clipboard.write([clipboardItem]);
      showNotification("Image copied to clipboard");
      return true;
    } else {
      // For external URLs, we can't copy the actual image directly
      // Copy the URL instead
      await navigator.clipboard.writeText(img.src);
      showNotification("Image URL copied to clipboard");
      return true;
    }
  } catch (err) {
    console.error("Failed to copy image:", err);

    // Try alternative approach: create a temporary canvas
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Wait for image to load if needed
      if (!img.complete) {
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Convert canvas to blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        showNotification("Image copied to clipboard");
        return true;
      }
    } catch (canvasErr) {
      console.error("Canvas fallback failed:", canvasErr);
    }

    // Final fallback: just select the image
    selectImage(img);
    showNotification("Please use Ctrl+C to copy", true);
    return false;
  }
}

// Cut image (copy + delete)
async function cutImage(img, wrapper) {
  const success = await copyImageToClipboard(img);
  if (success) {
    deleteImage(wrapper);
    showNotification("Image cut to clipboard");
  } else {
    showNotification("Failed to cut image", true);
  }
}

// Delete image
function deleteImage(wrapper) {
  wrapper.remove();
  // Trigger save
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
  showNotification("Image deleted");
}

// Select image for keyboard operations
function selectImage(img) {
  selectedImage = img;
  // Visual feedback
  document
    .querySelectorAll(".img-resize-wrapper.selected")
    .forEach((w) => w.classList.remove("selected"));
  const wrapper = img.closest(".img-resize-wrapper");
  if (wrapper) {
    wrapper.classList.add("selected");
  }
}

// Image context menu
const imageContextMenu = document.createElement("div");
imageContextMenu.className = "image-context-menu";
imageContextMenu.innerHTML = `
  <button class="context-menu-item" data-action="copy">📋 Copy</button>
  <button class="context-menu-item" data-action="cut">✂️ Cut</button>
  <div class="context-menu-divider"></div>
  <button class="context-menu-item context-menu-danger" data-action="delete">🗑️ Delete</button>
`;
document.body.appendChild(imageContextMenu);

let contextMenuTargetImg = null;
let contextMenuTargetWrapper = null;

// Show context menu on right-click
noteEditor.addEventListener("contextmenu", (e) => {
  const img = e.target.closest("img");
  if (img && isEditMode) {
    e.preventDefault();
    contextMenuTargetImg = img;
    contextMenuTargetWrapper = img.closest(".img-resize-wrapper");

    // Position menu
    imageContextMenu.style.left = e.clientX + "px";
    imageContextMenu.style.top = e.clientY + "px";
    imageContextMenu.classList.add("show");

    // Select the image
    selectImage(img);
  }
});

// Handle context menu clicks
imageContextMenu.addEventListener("click", async (e) => {
  const menuItem = e.target.closest(".context-menu-item");
  if (!menuItem) return;

  const action = menuItem.dataset.action;
  if (!action || !contextMenuTargetImg) return;

  switch (action) {
    case "copy":
      await copyImageToClipboard(contextMenuTargetImg);
      break;
    case "cut":
      await cutImage(contextMenuTargetImg, contextMenuTargetWrapper);
      break;
    case "delete":
      deleteImage(contextMenuTargetWrapper);
      break;
  }

  hideImageContextMenu();
});

// Hide context menu
function hideImageContextMenu() {
  imageContextMenu.classList.remove("show");
  contextMenuTargetImg = null;
  contextMenuTargetWrapper = null;
}

// Hide context menu on click outside
document.addEventListener("click", (e) => {
  if (!imageContextMenu.contains(e.target)) {
    hideImageContextMenu();
  }
});

// Hide context menu on scroll
noteEditor.addEventListener("scroll", hideImageContextMenu);

// Keyboard shortcuts for images (Ctrl+C, Ctrl+X)
noteEditor.addEventListener("keydown", async (e) => {
  // Check if an image wrapper is selected
  const selectedWrapper = noteEditor.querySelector(
    ".img-resize-wrapper.selected",
  );
  if (!selectedWrapper) return;

  const img = selectedWrapper.querySelector("img");
  if (!img) return;

  if (e.ctrlKey && e.key === "c") {
    e.preventDefault();
    await copyImageToClipboard(img);
  } else if (e.ctrlKey && e.key === "x") {
    e.preventDefault();
    await cutImage(img, selectedWrapper);
  } else if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault();
    deleteImage(selectedWrapper);
  }
});

// Click on image to select it (for keyboard operations)
noteEditor.addEventListener("click", (e) => {
  const wrapper = e.target.closest(".img-resize-wrapper");
  if (wrapper && isEditMode) {
    // Don't select if clicking overlay buttons
    if (e.target.closest(".img-overlay")) return;
    if (e.target.classList.contains("img-resize-handle")) return;

    selectImage(wrapper.querySelector("img"));
  } else {
    // Deselect when clicking elsewhere
    document
      .querySelectorAll(".img-resize-wrapper.selected")
      .forEach((w) => w.classList.remove("selected"));
    selectedImage = null;
  }
});

// Double-click on image to view in lightbox
noteEditor.addEventListener("dblclick", (e) => {
  const img = e.target.closest("img");
  if (img) {
    e.preventDefault();
    openImageInLightbox(img.src);
  }
});

// Start resize
function startResize(e) {
  e.preventDefault();
  e.stopPropagation();

  const wrapper = e.target.parentElement;
  currentResizeImg = wrapper.querySelector("img");

  if (!currentResizeImg) return;

  isResizing = true;
  wrapper.classList.add("resizing");

  startX = e.clientX;
  startY = e.clientY;
  startWidth = currentResizeImg.offsetWidth;
  startHeight = currentResizeImg.offsetHeight;

  document.addEventListener("mousemove", doResize);
  document.addEventListener("mouseup", stopResize);
}

// Perform resize
function doResize(e) {
  if (!isResizing || !currentResizeImg) return;

  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;

  // Calculate new dimensions maintaining aspect ratio
  const aspectRatio = startWidth / startHeight;
  let newWidth = Math.max(50, startWidth + deltaX);
  let newHeight = newWidth / aspectRatio;

  // Apply dimensions
  currentResizeImg.style.width = newWidth + "px";
  currentResizeImg.style.height = newHeight + "px";
}

// Stop resize
function stopResize() {
  if (!isResizing) return;

  isResizing = false;

  if (currentResizeImg) {
    const wrapper = currentResizeImg.parentElement;
    if (wrapper) {
      wrapper.classList.remove("resizing");
    }
  }

  currentResizeImg = null;

  document.removeEventListener("mousemove", doResize);
  document.removeEventListener("mouseup", stopResize);

  // Save after resize
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
}

// Image drag and drop for repositioning
let draggedImageWrapper = null;

function setupImageDragAndDrop(wrapper) {
  const img = wrapper.querySelector("img");

  // Make img draggable to initiate drag from the image itself
  if (img) {
    img.draggable = true;
    img.addEventListener("dragstart", (e) => {
      // Don't allow drag if resizing or clicking buttons
      if (isResizing) {
        e.preventDefault();
        return;
      }
      e.stopPropagation();
      draggedImageWrapper = wrapper;
      wrapper.style.opacity = "0.5";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "image");
    });

    img.addEventListener("dragend", (e) => {
      wrapper.style.opacity = "1";
      draggedImageWrapper = null;
      // Remove any drop indicators
      document
        .querySelectorAll(".img-resize-wrapper.drag-over")
        .forEach((w) => {
          w.classList.remove("drag-over");
        });
      noteEditor.classList.remove("drag-over");
    });
  }

  wrapper.addEventListener("dragover", (e) => {
    if (draggedImageWrapper && draggedImageWrapper !== wrapper) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "move";
      wrapper.classList.add("drag-over");
      return false;
    }
  });

  wrapper.addEventListener("dragleave", (e) => {
    // Only remove if actually leaving the wrapper
    if (!wrapper.contains(e.relatedTarget)) {
      wrapper.classList.remove("drag-over");
    }
  });

  wrapper.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();

    wrapper.classList.remove("drag-over");

    if (draggedImageWrapper && draggedImageWrapper !== wrapper) {
      // Get the position to insert
      const rect = wrapper.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;

      // Insert before or after based on drop position
      if (e.clientY < midpoint) {
        wrapper.parentNode.insertBefore(draggedImageWrapper, wrapper);
      } else {
        wrapper.parentNode.insertBefore(
          draggedImageWrapper,
          wrapper.nextSibling,
        );
      }

      // Save after moving
      notesSaveStatus.textContent = "Saving...";
      notesSaveStatus.classList.add("saving");
      clearTimeout(notesDebounceTimer);
      notesDebounceTimer = setTimeout(saveCurrentNote, 500);

      showNotification("Image moved");
    }
  });
}

// Setup noteEditor as a drop zone for images
if (noteEditor) {
  noteEditor.addEventListener("dragover", (e) => {
    if (draggedImageWrapper) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      return false;
    }
  });

  noteEditor.addEventListener("drop", (e) => {
    if (draggedImageWrapper) {
      e.preventDefault();
      e.stopPropagation();

      // If dropping in empty space, append to end
      const target = e.target;
      if (
        target === noteEditor ||
        (target.closest(".note-editor") &&
          !target.closest(".img-resize-wrapper"))
      ) {
        noteEditor.appendChild(draggedImageWrapper);

        // Save after moving
        notesSaveStatus.textContent = "Saving...";
        notesSaveStatus.classList.add("saving");
        clearTimeout(notesDebounceTimer);
        notesDebounceTimer = setTimeout(saveCurrentNote, 500);

        showNotification("Image moved");
      }
    }
  });
}

// ========== End Image Lightbox Feature ==========

// ========== End Notes Feature ==========

// Add App Modal handlers
const selectFromListTab = document.getElementById("selectFromListTab");
const browseManualTab = document.getElementById("browseManualTab");
const selectFromListPanel = document.getElementById("selectFromListPanel");
const browseManualPanel = document.getElementById("browseManualPanel");
const installedAppsList = document.getElementById("installedAppsList");
const installedAppsSearch = document.getElementById("installedAppsSearch");
const noInstalledAppsMsg = document.getElementById("noInstalledAppsMsg");
const installedAppsLoading = document.getElementById("installedAppsLoading");

let availableApps = {};
let selectedInstalledApp = null;

// App display names mapping
const APP_DISPLAY_NAMES = {
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

// App icons mapping - use generic icon
const APP_ICONS = {
  hubstaff: defaultAppIcon,
  hubstaffCli: defaultAppIcon,
  slack: defaultAppIcon,
  teams: defaultAppIcon,
  discord: defaultAppIcon,
  notion: defaultAppIcon,
  figma: defaultAppIcon,
  postman: defaultAppIcon,
  docker: defaultAppIcon,
  visualStudio: defaultAppIcon,
  vscode: defaultAppIcon,
  pycharm: defaultAppIcon,
  chrome: defaultAppIcon,
  firefox: defaultAppIcon,
  edge: defaultAppIcon,
  mongodb: defaultAppIcon,
  dbeaver: defaultAppIcon,
  tableplus: defaultAppIcon,
  spotify: defaultAppIcon,
};

function switchAddAppTab(tab) {
  selectFromListTab.classList.toggle("active", tab === "list");
  browseManualTab.classList.toggle("active", tab === "manual");
  selectFromListPanel.classList.toggle("active", tab === "list");
  browseManualPanel.classList.toggle("active", tab === "manual");

  // Reset selection when switching tabs
  selectedInstalledApp = null;
  document.querySelectorAll(".installed-app-item.selected").forEach((el) => {
    el.classList.remove("selected");
  });
}

selectFromListTab.addEventListener("click", () => switchAddAppTab("list"));
browseManualTab.addEventListener("click", () => switchAddAppTab("manual"));

async function loadAvailableApps() {
  // Show loading, hide list
  installedAppsLoading.classList.remove("hidden");
  installedAppsList.style.display = "none";
  noInstalledAppsMsg.style.display = "none";

  try {
    availableApps = await window.electronAPI.getAvailableApps();
    renderInstalledAppsList();
  } catch (error) {
    console.error("Failed to load available apps:", error);
    noInstalledAppsMsg.textContent =
      "Failed to load apps. Try browsing manually.";
    noInstalledAppsMsg.style.display = "block";
  } finally {
    // Hide loading, show list
    installedAppsLoading.classList.add("hidden");
    installedAppsList.style.display = "flex";
  }
}

function renderInstalledAppsList(filter = "") {
  installedAppsList.innerHTML = "";
  const filterLower = filter.toLowerCase();

  const appEntries = Object.entries(availableApps);
  const filteredApps = appEntries.filter(([key, app]) => {
    // Use displayName from app if available (for scanned apps), otherwise use mapping
    const displayName = app.displayName || APP_DISPLAY_NAMES[key] || key;
    return (
      displayName.toLowerCase().includes(filterLower) ||
      key.toLowerCase().includes(filterLower) ||
      app.path.toLowerCase().includes(filterLower)
    );
  });

  // Sort: pre-defined apps first, then alphabetically by display name
  filteredApps.sort(([keyA, appA], [keyB, appB]) => {
    const isScannedA = appA.scanned || false;
    const isScannedB = appB.scanned || false;
    if (isScannedA !== isScannedB) return isScannedA ? 1 : -1;
    const nameA = appA.displayName || APP_DISPLAY_NAMES[keyA] || keyA;
    const nameB = appB.displayName || APP_DISPLAY_NAMES[keyB] || keyB;
    return nameA.localeCompare(nameB);
  });

  if (filteredApps.length === 0) {
    noInstalledAppsMsg.style.display = "block";
    return;
  }

  noInstalledAppsMsg.style.display = "none";

  filteredApps.forEach(([key, app]) => {
    // Use displayName from app if available (for scanned apps)
    const displayName = app.displayName || APP_DISPLAY_NAMES[key] || key;
    const icon = APP_ICONS[key] || defaultAppIcon;
    const isAlreadyAdded = currentApps[key] !== undefined;

    const item = document.createElement("div");
    item.className = `installed-app-item${isAlreadyAdded ? " already-added" : ""}`;
    item.dataset.appKey = key;
    item.innerHTML = `
      <span class="installed-app-icon">${icon}</span>
      <div class="installed-app-info">
        <div class="installed-app-name">${displayName}</div>
        <div class="installed-app-path">${app.path}</div>
      </div>
      ${isAlreadyAdded ? '<span class="installed-app-badge">Added</span>' : ""}
    `;

    if (!isAlreadyAdded) {
      item.addEventListener("click", () => {
        // Deselect previous
        document
          .querySelectorAll(".installed-app-item.selected")
          .forEach((el) => {
            el.classList.remove("selected");
          });
        // Select this one
        item.classList.add("selected");
        selectedInstalledApp = { key, ...app, displayName };
      });
    }

    installedAppsList.appendChild(item);
  });
}

installedAppsSearch.addEventListener("input", (e) => {
  renderInstalledAppsList(e.target.value);
});

async function openModal() {
  customAppName.value = "";
  customAppPath.value = "";
  installedAppsSearch.value = "";
  selectedInstalledApp = null;

  // Reset to first tab
  switchAddAppTab("list");

  // Show modal first so user sees the loader
  addAppModal.classList.remove("hidden");

  // Then load available apps (loader will be visible)
  await loadAvailableApps();
}

function closeModal() {
  addAppModal.classList.add("hidden");
  selectedInstalledApp = null;
}

addAppBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cancelAddBtn.addEventListener("click", closeModal);

// Close modal when clicking outside
addAppModal.addEventListener("click", (e) => {
  if (e.target === addAppModal) {
    closeModal();
  }
});

// Browse for app
browseBtn.addEventListener("click", async () => {
  const filePath = await window.electronAPI.browseForApp();
  if (filePath) {
    customAppPath.value = filePath;
    // Auto-fill name from executable name if empty
    if (!customAppName.value) {
      const fileName = filePath.split("\\").pop().replace(".exe", "");
      customAppName.value =
        fileName.charAt(0).toUpperCase() + fileName.slice(1);
    }
  }
});

// Confirm add app
confirmAddBtn.addEventListener("click", async () => {
  // Check if we're on the "Select from Installed" tab
  const isSelectFromList = selectFromListPanel.classList.contains("active");

  if (isSelectFromList) {
    // Add selected installed app
    if (!selectedInstalledApp) {
      showNotification("Please select an application from the list", true);
      return;
    }

    try {
      // Add the app with its detected path
      // For scanned apps, mark as custom so user can delete them
      const isScanned = selectedInstalledApp.key.startsWith("scanned_");
      const appDisplayName = selectedInstalledApp.displayName; // Save before closeModal nullifies it
      currentApps[selectedInstalledApp.key] = {
        path: selectedInstalledApp.path,
        enabled: true,
        isCustom: isScanned,
        customName: selectedInstalledApp.displayName,
      };
      await window.electronAPI.saveApps(currentApps);
      renderAppsList(currentApps);
      closeModal();
      showNotification(`Added "${appDisplayName}" successfully!`);
    } catch (error) {
      console.error("Failed to add app:", error);
      showNotification("Failed to add application", true);
    }
  } else {
    // Manual browse method
    const name = customAppName.value.trim();
    const path = customAppPath.value.trim();

    if (!name) {
      showNotification("Please enter an application name", true);
      return;
    }

    if (!path) {
      showNotification("Please select an executable file", true);
      return;
    }

    try {
      currentApps = await window.electronAPI.addCustomApp(name, path);
      renderAppsList(currentApps);
      closeModal();
      showNotification(`Added "${name}" successfully!`);
    } catch (error) {
      console.error("Failed to add app:", error);
      showNotification("Failed to add application", true);
    }
  }
});

// Profile Modal handlers
addProfileBtn.addEventListener("click", openCreateProfileModal);
closeProfileModalBtn.addEventListener("click", closeProfileModal);
cancelProfileBtn.addEventListener("click", closeProfileModal);

profileModal.addEventListener("click", (e) => {
  if (e.target === profileModal) {
    closeProfileModal();
  }
});

// Confirm create/edit profile
confirmProfileBtn.addEventListener("click", async () => {
  const name = profileNameInput.value.trim();

  if (!name) {
    showNotification("Please enter a profile name", true);
    return;
  }

  try {
    if (editingProfileId) {
      // Editing existing profile
      currentProfiles = await window.electronAPI.updateProfile(
        editingProfileId,
        name,
      );
      showNotification(`Profile "${name}" updated!`);
    } else {
      // Creating new profile
      const profileId = `profile_${Date.now()}`;
      currentProfiles = await window.electronAPI.createProfile(profileId, name);
      // Switch to the new profile
      await switchProfile(profileId);
      showNotification(`Profile "${name}" created!`);
    }
    renderProfilesList(currentProfiles, activeProfileId);
    closeProfileModal();
  } catch (error) {
    console.error("Failed to save profile:", error);
    showNotification("Failed to save profile", true);
  }
});

// Update save button to also save current profile
saveBtn.addEventListener("click", async () => {
  try {
    await window.electronAPI.saveApps(currentApps);
    await window.electronAPI.saveProfileApps(activeProfileId);
    // Update profiles list to reflect new app counts
    currentProfiles = await window.electronAPI.getProfiles();
    renderProfilesList(currentProfiles, activeProfileId);
    showNotification("Settings saved");
  } catch (error) {
    console.error("Failed to save settings:", error);
    showNotification("Failed to save settings", true);
  }
});

// ============================================
// Update Handling
// ============================================

/**
 * Convert markdown to simple HTML for release notes
 */
function markdownToHtml(markdown) {
  if (!markdown)
    return "<p class='release-notes-empty'>No release notes available.</p>";

  // Remove the version header line (e.g., "## [1.0.18] - 2026-02-08")
  let cleaned = markdown.replace(/^## \[[\d.]+\].*$/gm, "").trim();

  // If empty after removing header, return message
  if (!cleaned)
    return "<p class='release-notes-empty'>No release notes available.</p>";

  return (
    cleaned
      // Line breaks to paragraphs (handle both single and multiple breaks)
      .split(/\n\n+/)
      .map((section) => {
        // Convert section headers (### Added, ### Fixed, etc.) to styled badges
        section = section
          .replace(
            /^### (Added)$/gm,
            '<div class="changelog-category changelog-added">✨ Added</div>',
          )
          .replace(
            /^### (Fixed)$/gm,
            '<div class="changelog-category changelog-fixed">🔧 Fixed</div>',
          )
          .replace(
            /^### (Changed)$/gm,
            '<div class="changelog-category changelog-changed">🔄 Changed</div>',
          )
          .replace(
            /^### (Removed)$/gm,
            '<div class="changelog-category changelog-removed">🗑️ Removed</div>',
          )
          .replace(
            /^### (Improved)$/gm,
            '<div class="changelog-category changelog-improved">⚡ Improved</div>',
          )
          .replace(
            /^### (Security)$/gm,
            '<div class="changelog-category changelog-security">🔒 Security</div>',
          )
          .replace(/^### (.+)$/gm, '<div class="changelog-category">$1</div>')
          // Other headers
          .replace(/^## (.+)$/gm, '<h4 class="release-notes-h4">$1</h4>')
          .replace(/^# (.+)$/gm, '<h3 class="release-notes-h3">$1</h3>');

        // Handle lists
        const hasListItems = /^- /m.test(section);
        if (hasListItems) {
          section = section
            .replace(/^- (.+)$/gm, '<li class="changelog-item">$1</li>')
            .replace(
              /(<li class="changelog-item">.*?<\/li>)/s,
              '<ul class="changelog-list">$1</ul>',
            );
        }

        // Bold
        section = section.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        // Italic
        section = section.replace(/\*(.+?)\*/g, "<em>$1</em>");
        // Code
        section = section.replace(/`(.+?)`/g, "<code>$1</code>");
        // Links
        section = section.replace(
          /\[(.+?)\]\((.+?)\)/g,
          '<a href="$2" class="release-notes-link" target="_blank">$1</a>',
        );

        // If section is not a list or badge, wrap in paragraph
        if (
          !section.includes("<ul") &&
          !section.includes('<div class="changelog-category') &&
          !section.includes("<h")
        ) {
          section = `<p class="release-notes-p">${section}</p>`;
        }

        return section;
      })
      .join("")
  );
}

/**
 * Setup update event listeners
 */
function setupUpdateListeners() {
  // Listen for update available
  window.electronAPI.onUpdateAvailable(async (info) => {
    updateIcon.innerHTML = `<span class="icon">${icons.download}</span>`;
    updateStatusText.textContent = `New version available!`;
    newVersionBadge.classList.remove("hidden");
    newVersionNumber.textContent = `v${info.version}`;
    updateProgressContainer.classList.add("hidden");
    checkUpdateBtn.classList.add("hidden");
    downloadUpdateBtn.classList.remove("hidden");
    downloadUpdateBtn.disabled = false;
    downloadUpdateBtn.innerHTML = `<span class="icon icon-sm">${icons.download}</span> Download Update`;
    installUpdateBtn.classList.add("hidden");

    // Show notification dot on update button
    updateDot.classList.remove("hidden");

    // Fetch and display release notes
    try {
      const releaseInfo = await window.electronAPI.getReleaseNotes(
        info.version,
      );
      if (releaseInfo && releaseInfo.body) {
        releaseNotesContainer.classList.remove("hidden");
        releaseNotesContent.innerHTML = markdownToHtml(releaseInfo.body);
      } else {
        releaseNotesContainer.classList.add("hidden");
      }
    } catch (error) {
      console.error("Failed to fetch release notes:", error);
      releaseNotesContainer.classList.add("hidden");
    }

    // Auto-open the modal
    updateModal.classList.remove("hidden");
  });

  // Listen for no update available
  window.electronAPI.onUpdateNotAvailable(() => {
    updateIcon.innerHTML = `<span class="icon">${icons.success}</span>`;
    updateStatusText.textContent = "You're up to date!";
    newVersionBadge.classList.add("hidden");
    updateProgressContainer.classList.add("hidden");
    releaseNotesContainer.classList.add("hidden");
    checkUpdateBtn.classList.remove("hidden");
    checkUpdateBtn.disabled = false;
    checkUpdateBtn.innerHTML = `<span class="icon icon-sm">${icons.search}</span> Check for Updates`;
    downloadUpdateBtn.classList.add("hidden");
    installUpdateBtn.classList.add("hidden");

    // Hide notification dot
    updateDot.classList.add("hidden");
  });

  // Listen for download progress
  window.electronAPI.onUpdateProgress((percent) => {
    const roundedPercent = Math.round(percent);
    updateIcon.innerHTML = `<span class="icon">${icons.download}</span>`;
    updateStatusText.textContent = "Downloading update...";
    updateProgressContainer.classList.remove("hidden");
    updatePercentage.textContent = `${roundedPercent}%`;
    updateProgressBar.style.width = `${roundedPercent}%`;
    checkUpdateBtn.classList.add("hidden");
    downloadUpdateBtn.classList.add("hidden");
    installUpdateBtn.classList.add("hidden");
  });

  // Listen for update downloaded
  window.electronAPI.onUpdateDownloaded((info) => {
    updateIcon.innerHTML = `<span class="icon">${icons.rocket}</span>`;
    updateStatusText.textContent = "Update ready to install!";
    updateProgressContainer.classList.add("hidden");
    updateProgressBar.style.width = "100%";
    checkUpdateBtn.classList.add("hidden");
    downloadUpdateBtn.classList.add("hidden");
    installUpdateBtn.classList.remove("hidden");
    installUpdateBtn.disabled = false;
    installUpdateBtn.innerHTML = `<span class="icon icon-sm">${icons.refresh}</span> Install & Restart`;
  });

  // Listen for update error
  window.electronAPI.onUpdateError((message) => {
    updateIcon.innerHTML = `<span class="icon">${icons.error}</span>`;
    updateStatusText.textContent = `Error: ${message}`;
    updateProgressContainer.classList.add("hidden");
    newVersionBadge.classList.add("hidden");
    checkUpdateBtn.classList.remove("hidden");
    checkUpdateBtn.disabled = false;
    checkUpdateBtn.innerHTML = `<span class="icon icon-sm">${icons.search}</span> Check for Updates`;
    downloadUpdateBtn.classList.add("hidden");
    installUpdateBtn.classList.add("hidden");

    // Hide notification dot on error
    updateDot.classList.add("hidden");
  });
}

// Open update modal
updateBtn.addEventListener("click", () => {
  updateModal.classList.remove("hidden");
});

// Close update modal
closeUpdateModalBtn.addEventListener("click", () => {
  updateModal.classList.add("hidden");
});

// Close modal on backdrop click
updateModal.addEventListener("click", (e) => {
  if (e.target === updateModal) {
    updateModal.classList.add("hidden");
  }
});

// Check for updates button
checkUpdateBtn.addEventListener("click", async () => {
  checkUpdateBtn.disabled = true;
  checkUpdateBtn.innerHTML = `<span class="icon icon-sm">${icons.loader}</span> Checking...`;
  updateIcon.innerHTML = `<span class="icon">${icons.search}</span>`;
  updateStatusText.textContent = "Checking for updates...";
  updateProgressContainer.classList.add("hidden");
  newVersionBadge.classList.add("hidden");

  try {
    const result = await window.electronAPI.checkForUpdates();

    // Handle the response directly (for dev mode or fallback)
    if (result) {
      if (result.error) {
        updateIcon.innerHTML = `<span class="icon">${icons.error}</span>`;
        updateStatusText.textContent = `Error: ${result.error}`;
        checkUpdateBtn.disabled = false;
        checkUpdateBtn.innerHTML = `<span class="icon icon-sm">${icons.search}</span> Check for Updates`;
      } else if (result.message) {
        // Dev mode message
        updateIcon.innerHTML = `<span class="icon">${icons.info}</span>`;
        updateStatusText.textContent = result.message;
        checkUpdateBtn.disabled = false;
        checkUpdateBtn.innerHTML = `<span class="icon icon-sm">${icons.search}</span> Check for Updates`;
      }
      // If updateAvailable is in result, the autoUpdater events will handle UI
    }
  } catch (error) {
    updateIcon.innerHTML = `<span class="icon">${icons.error}</span>`;
    updateStatusText.textContent = `Error: ${error.message}`;
    checkUpdateBtn.disabled = false;
    checkUpdateBtn.innerHTML = `<span class="icon icon-sm">${icons.search}</span> Check for Updates`;
  }
});

// Download update button
downloadUpdateBtn.addEventListener("click", async () => {
  downloadUpdateBtn.disabled = true;
  downloadUpdateBtn.innerHTML = `<span class="icon icon-sm">${icons.loader}</span> Starting...`;
  updateIcon.innerHTML = `<span class="icon">${icons.download}</span>`;
  updateStatusText.textContent = "Starting download...";
  updateProgressContainer.classList.remove("hidden");
  updatePercentage.textContent = "0%";
  updateProgressBar.style.width = "0%";

  try {
    await window.electronAPI.downloadUpdate();
  } catch (error) {
    updateIcon.innerHTML = `<span class="icon">${icons.error}</span>`;
    updateStatusText.textContent = `Error: ${error.message}`;
    downloadUpdateBtn.disabled = false;
    downloadUpdateBtn.innerHTML = `<span class="icon icon-sm">${icons.download}</span> Download Update`;
    downloadUpdateBtn.classList.remove("hidden");
  }
});

// Install update button
installUpdateBtn.addEventListener("click", async () => {
  installUpdateBtn.disabled = true;
  installUpdateBtn.innerHTML = `<span class="icon icon-sm">${icons.loader}</span> Installing...`;
  updateIcon.innerHTML = `<span class="icon">${icons.refresh}</span>`;
  updateStatusText.textContent = "Installing and restarting...";

  await window.electronAPI.installUpdate();
});

// ========================================
// New Features Event Handlers
// ========================================

// App Search
if (appSearchInput) {
  appSearchInput.addEventListener("input", (e) => {
    currentSearchTerm = e.target.value;
    renderAppsList(currentApps);
  });
}

// Category Filter
if (categoryFilter) {
  categoryFilter.addEventListener("change", (e) => {
    currentCategoryFilter = e.target.value;
    renderAppsList(currentApps);
  });
}

// URL Modal Handlers
if (addUrlBtn) {
  addUrlBtn.addEventListener("click", () => {
    addUrlModal.classList.remove("hidden");
    urlName.value = "";
    urlPath.value = "";
    urlCategory.value = "url";
  });
}

if (closeUrlModalBtn) {
  closeUrlModalBtn.addEventListener("click", () => {
    addUrlModal.classList.add("hidden");
  });
}

if (cancelUrlBtn) {
  cancelUrlBtn.addEventListener("click", () => {
    addUrlModal.classList.add("hidden");
  });
}

if (confirmUrlBtn) {
  confirmUrlBtn.addEventListener("click", async () => {
    const name = urlName.value.trim();
    const url = urlPath.value.trim();
    const category = urlCategory.value;

    if (!name || !url) {
      showNotification("Please enter both name and URL", "error");
      return;
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      showNotification("Please enter a valid URL", "error");
      return;
    }

    try {
      currentApps = await window.electronAPI.addUrl(name, url, category);
      renderAppsList(currentApps);
      addUrlModal.classList.add("hidden");
      showNotification(`Added "${name}"`);
    } catch (error) {
      showNotification("Failed to add URL", "error");
    }
  });
}

// Close URL modal on backdrop click
if (addUrlModal) {
  addUrlModal.addEventListener("click", (e) => {
    if (e.target === addUrlModal) {
      addUrlModal.classList.add("hidden");
    }
  });
}

// Schedule Toggle Handler
function updateScheduleUI() {
  if (!scheduleSettings) return;

  // Update time input
  if (scheduleTime && scheduleSettings.time) {
    scheduleTime.value = scheduleSettings.time;
  }

  // Update toggle
  if (scheduleToggle) {
    scheduleToggle.checked = scheduleSettings.enabled || false;
  }

  // Show/hide settings panel
  if (scheduleSettingsPanel) {
    if (scheduleSettings.enabled) {
      scheduleSettingsPanel.classList.remove("hidden");
    } else {
      scheduleSettingsPanel.classList.add("hidden");
    }
  }

  // Update day buttons
  const dayBtns = document.querySelectorAll(".day-btn");
  dayBtns.forEach((btn) => {
    const day = parseInt(btn.dataset.day);
    if (scheduleSettings.days && scheduleSettings.days.includes(day)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

if (scheduleToggle) {
  scheduleToggle.addEventListener("change", async (e) => {
    scheduleSettings.enabled = e.target.checked;
    updateScheduleUI();
    await window.electronAPI.setScheduledLaunch(scheduleSettings);
    showNotification(
      e.target.checked
        ? "Scheduled launch enabled"
        : "Scheduled launch disabled",
    );
  });
}

if (scheduleTime) {
  scheduleTime.addEventListener("change", async (e) => {
    scheduleSettings.time = e.target.value;
    await window.electronAPI.setScheduledLaunch(scheduleSettings);
    showNotification(`Launch time set to ${e.target.value}`);
  });
}

// Day buttons for schedule
document.querySelectorAll(".day-btn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const day = parseInt(e.target.dataset.day);
    const index = scheduleSettings.days.indexOf(day);

    if (index > -1) {
      scheduleSettings.days.splice(index, 1);
      e.target.classList.remove("active");
    } else {
      scheduleSettings.days.push(day);
      scheduleSettings.days.sort();
      e.target.classList.add("active");
    }

    await window.electronAPI.setScheduledLaunch(scheduleSettings);
  });
});

// Day-Based Profiles Handlers
function updateDayBasedProfilesUI() {
  if (!dayBasedProfilesSettings) return;

  // Show/hide settings panel
  const panel = document.getElementById("dayProfileSettings");
  if (panel) {
    if (dayBasedProfilesSettings.enabled) {
      panel.classList.remove("hidden");
    } else {
      panel.classList.add("hidden");
    }
  }

  // Populate profile selects
  const selects = document.querySelectorAll(".day-profile-select");
  selects.forEach((select) => {
    const day = select.dataset.day;
    select.innerHTML = "";

    for (const [id, profile] of Object.entries(currentProfiles)) {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = profile.name;
      if (
        dayBasedProfilesSettings.mapping &&
        dayBasedProfilesSettings.mapping[day] === id
      ) {
        option.selected = true;
      }
      select.appendChild(option);
    }
  });
}

if (dayBasedProfilesToggle) {
  dayBasedProfilesToggle.addEventListener("change", async (e) => {
    dayBasedProfilesSettings.enabled = e.target.checked;
    updateDayBasedProfilesUI();
    await window.electronAPI.setDayBasedProfiles(dayBasedProfilesSettings);
    showNotification(
      e.target.checked
        ? "Day-based profiles enabled"
        : "Day-based profiles disabled",
    );
  });
}

// Day profile select handlers
document.querySelectorAll(".day-profile-select").forEach((select) => {
  select.addEventListener("change", async (e) => {
    const day = e.target.dataset.day;
    dayBasedProfilesSettings.mapping[day] = e.target.value;
    await window.electronAPI.setDayBasedProfiles(dayBasedProfilesSettings);
  });
});

// Import/Export Handlers
if (exportSettingsBtn) {
  exportSettingsBtn.addEventListener("click", async () => {
    try {
      exportSettingsBtn.disabled = true;
      exportSettingsBtn.innerHTML = `<span class="icon icon-sm">${icons.loader}</span> Exporting...`;

      const result = await window.electronAPI.exportSettings();

      if (result.success) {
        showNotification("Settings exported successfully");
      } else if (!result.canceled) {
        showNotification(result.error || "Export failed", "error");
      }
    } catch (error) {
      showNotification("Export failed", "error");
    } finally {
      exportSettingsBtn.disabled = false;
      exportSettingsBtn.innerHTML = `<span class="icon icon-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg></span> Export Settings`;
    }
  });
}

if (importSettingsBtn) {
  importSettingsBtn.addEventListener("click", async () => {
    try {
      importSettingsBtn.disabled = true;
      importSettingsBtn.innerHTML = `<span class="icon icon-sm">${icons.loader}</span> Importing...`;

      const result = await window.electronAPI.importSettings();

      if (result.success) {
        showNotification("Settings imported successfully. Reloading...");
        // Reload the UI
        setTimeout(async () => {
          currentApps = await window.electronAPI.getApps();
          currentProfiles = await window.electronAPI.getProfiles();
          activeProfileId = await window.electronAPI.getActiveProfile();
          scheduleSettings = await window.electronAPI.getScheduledLaunch();
          dayBasedProfilesSettings =
            await window.electronAPI.getDayBasedProfiles();

          renderAppsList(currentApps);
          renderProfilesList(currentProfiles, activeProfileId);
          updateScheduleUI();
          updateDayBasedProfilesUI();
        }, 500);
      } else if (!result.canceled) {
        showNotification(result.error || "Import failed", "error");
      }
    } catch (error) {
      showNotification("Import failed", "error");
    } finally {
      importSettingsBtn.disabled = false;
      importSettingsBtn.innerHTML = `<span class="icon icon-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg></span> Import Settings`;
    }
  });
}

// Collapsible Section Toggles
document
  .querySelectorAll(".setting-section.collapsible .section-toggle")
  .forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const section = toggle.closest(".setting-section");
      section.classList.toggle("collapsed");
    });
  });

// ========== Jira Integration ==========

// Jira DOM Elements
const jiraServerUrl = document.getElementById("jiraServerUrl");
const jiraEmail = document.getElementById("jiraEmail");
const jiraApiToken = document.getElementById("jiraApiToken");
const toggleJiraToken = document.getElementById("toggleJiraToken");
const testJiraConnectionBtn = document.getElementById("testJiraConnectionBtn");
const saveJiraConfigBtn = document.getElementById("saveJiraConfigBtn");
const jiraConnectionStatus = document.getElementById("jiraConnectionStatus");
const jiraHelpLink = document.getElementById("jiraHelpLink");
const jiraTokenHint = document.getElementById("jiraTokenHint");
const createTokenLink = document.getElementById("createTokenLink");
const createJiraIssueBtn = document.getElementById("createJiraIssueBtn");
const linkJiraIssueBtn = document.getElementById("linkJiraIssueBtn");
const linkJiraIssueModal = document.getElementById("linkJiraIssueModal");
const closeLinkJiraModalBtn = document.getElementById("closeLinkJiraModalBtn");
const cancelLinkJiraBtn = document.getElementById("cancelLinkJiraBtn");
const confirmLinkJiraBtn = document.getElementById("confirmLinkJiraBtn");
const linkJiraIssueKey = document.getElementById("linkJiraIssueKey");
const linkJiraModalError = document.getElementById("linkJiraModalError");
const linkJiraPreview = document.getElementById("linkJiraPreview");
const previewIssueKey = document.getElementById("previewIssueKey");
const previewIssueSummary = document.getElementById("previewIssueSummary");
const previewIssueType = document.getElementById("previewIssueType");
const previewIssueStatus = document.getElementById("previewIssueStatus");
const previewIssueAssignee = document.getElementById("previewIssueAssignee");
const previewIssueProject = document.getElementById("previewIssueProject");
const previewIssueEpic = document.getElementById("previewIssueEpic");
const previewIssueDescription = document.getElementById(
  "previewIssueDescription",
);
const createJiraIssueModal = document.getElementById("createJiraIssueModal");
const closeJiraModalBtn = document.getElementById("closeJiraModalBtn");
const cancelJiraBtn = document.getElementById("cancelJiraBtn");
const confirmJiraBtn = document.getElementById("confirmJiraBtn");
const jiraHelpModal = document.getElementById("jiraHelpModal");
const closeJiraHelpModalBtn = document.getElementById("closeJiraHelpModalBtn");
const closeJiraHelpBtn = document.getElementById("closeJiraHelpBtn");
const jiraModalError = document.getElementById("jiraModalError");

// Jira form fields
const jiraProject = document.getElementById("jiraProject");
const jiraIssueType = document.getElementById("jiraIssueType");
const jiraSummary = document.getElementById("jiraSummary");
const jiraDescription = document.getElementById("jiraDescription");
const jiraPriority = document.getElementById("jiraPriority");
const jiraAssignee = document.getElementById("jiraAssignee");
const jiraLabels = document.getElementById("jiraLabels");
const jiraEpic = document.getElementById("jiraEpic");
const jiraSprint = document.getElementById("jiraSprint");
const jiraStoryPoints = document.getElementById("jiraStoryPoints");
const insertJiraLink = document.getElementById("insertJiraLink");

// Jira quick-insert dropdown elements
const insertProjectBtn = document.getElementById("insertProjectBtn");
const projectInsertMenu = document.getElementById("projectInsertMenu");
const projectInsertSearch = document.getElementById("projectInsertSearch");
const projectInsertList = document.getElementById("projectInsertList");
const insertAssigneeBtn = document.getElementById("insertAssigneeBtn");
const assigneeInsertMenu = document.getElementById("assigneeInsertMenu");
const assigneeInsertSearch = document.getElementById("assigneeInsertSearch");
const assigneeInsertList = document.getElementById("assigneeInsertList");
const insertEpicBtn = document.getElementById("insertEpicBtn");
const epicInsertMenu = document.getElementById("epicInsertMenu");
const epicInsertSearch = document.getElementById("epicInsertSearch");
const epicInsertList = document.getElementById("epicInsertList");

// Bug-specific fields
const jiraBugFields = document.getElementById("jiraBugFields");
const jiraStepsToReproduce = document.getElementById("jiraStepsToReproduce");
const jiraExpectedResult = document.getElementById("jiraExpectedResult");
const jiraActualResult = document.getElementById("jiraActualResult");
const jiraEnvironment = document.getElementById("jiraEnvironment");

// Attachment preview elements
const jiraAttachmentsSection = document.getElementById(
  "jiraAttachmentsSection",
);
const jiraAttachmentsPreview = document.getElementById(
  "jiraAttachmentsPreview",
);
const jiraAttachmentCount = document.getElementById("jiraAttachmentCount");
const jiraAttachFileBtn = document.getElementById("jiraAttachFileBtn");
const jiraFileInput = document.getElementById("jiraFileInput");
const jiraNoAttachments = document.getElementById("jiraNoAttachments");

// Searchable dropdown elements
const jiraProjectSearch = document.getElementById("jiraProjectSearch");
const jiraProjectList = document.getElementById("jiraProjectList");
const jiraIssueTypeSearch = document.getElementById("jiraIssueTypeSearch");
const jiraIssueTypeList = document.getElementById("jiraIssueTypeList");
const jiraPrioritySearch = document.getElementById("jiraPrioritySearch");
const jiraPriorityList = document.getElementById("jiraPriorityList");
const jiraAssigneeSearch = document.getElementById("jiraAssigneeSearch");
const jiraAssigneeList = document.getElementById("jiraAssigneeList");
const jiraEpicSearch = document.getElementById("jiraEpicSearch");
const jiraEpicList = document.getElementById("jiraEpicList");
const jiraSprintSearch = document.getElementById("jiraSprintSearch");
const jiraSprintList = document.getElementById("jiraSprintList");

// Jira state
let jiraConfig = {};
let jiraProjects = [];
let jiraUsers = [];
let selectedText = "";
let selectedImages = []; // Store images from selection for Jira upload
let savedSelectionRange = null; // Store selection range for link insertion

// Helper to extract selection content including images
function getSelectionWithImages() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return { text: "", html: "", images: [] };

  const range = selection.getRangeAt(0);
  const container = document.createElement("div");
  container.appendChild(range.cloneContents());

  const images = [];

  // Remove image overlay buttons from the cloned content
  container
    .querySelectorAll(".img-overlay, .img-resize-handle")
    .forEach((el) => el.remove());

  // Also handle img-resize-wrapper elements
  container.querySelectorAll(".img-resize-wrapper").forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    if (img) {
      wrapper.parentNode.insertBefore(img, wrapper);
    }
    wrapper.remove();
  });

  const imgs = container.querySelectorAll("img");
  imgs.forEach((img, index) => {
    const src = img.src;
    console.log(
      `[Image Selection] Found image ${index}: src starts with "${src.substring(0, 50)}..."`,
    );
    console.log(`[Image Selection] Full src length: ${src.length}`);

    if (src.startsWith("data:image/")) {
      // Extract image type from data URL
      const typeMatch = src.match(/^data:image\/(\w+)/);
      const imageType = typeMatch ? typeMatch[1] : "png";
      const filename = `image_${Date.now()}_${index}.${imageType}`;
      console.log(
        `[Image Selection] Adding image: ${filename}, data length: ${src.length}`,
      );
      images.push({ data: src, filename });
      // Replace image with placeholder in text
      img.replaceWith(`[Image: ${filename}]`);
    } else {
      console.log(
        `[Image Selection] Skipping non-data-URL image: ${src.substring(0, 100)}`,
      );
    }
  });

  // Get text content (with image placeholders)
  let text = container.textContent.trim();
  // Clean up any remaining overlay button text (👁️📋🗑️)
  text = text.replace(/[👁️📋🗑️✂️]+/g, "").trim();

  const html = container.innerHTML;

  console.log(
    `Selection: ${images.length} images, text: "${text.substring(0, 100)}..."`,
  );
  return { text, html, images };
}

// Update attachment preview in modal
function updateAttachmentPreview() {
  if (!jiraAttachmentsPreview) return;

  if (selectedImages.length === 0) {
    jiraAttachmentCount.textContent = "";
    jiraAttachmentsPreview.innerHTML =
      '<div class="jira-no-attachments">No attachments. Select text with images or click "Attach Files" to add.</div>';
    return;
  }

  jiraAttachmentCount.textContent = `(${selectedImages.length})`;

  jiraAttachmentsPreview.innerHTML = selectedImages
    .map((img, index) => {
      // Check if it's an image or other file type
      const isImage = img.data && img.data.startsWith("data:image/");
      const fileIcon = getFileIcon(img.filename);

      if (isImage) {
        return `
          <div class="jira-attachment-item" data-index="${index}">
            <img src="${img.data}" alt="${img.filename}" />
            <button class="remove-attachment" title="Remove" onclick="removeJiraAttachment(${index})">×</button>
            <div class="jira-attachment-filename">${img.filename}</div>
          </div>
        `;
      } else {
        return `
          <div class="jira-attachment-item jira-attachment-file" data-index="${index}">
            <div class="jira-file-icon">${fileIcon}</div>
            <button class="remove-attachment" title="Remove" onclick="removeJiraAttachment(${index})">×</button>
            <div class="jira-attachment-filename">${img.filename}</div>
          </div>
        `;
      }
    })
    .join("");
}

// Get file icon based on extension
function getFileIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const icons = {
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    xls: "📊",
    xlsx: "📊",
    txt: "📃",
    zip: "📦",
    rar: "📦",
    "7z": "📦",
  };
  return icons[ext] || "📎";
}

// Handle file attachment button click
if (jiraAttachFileBtn && jiraFileInput) {
  jiraAttachFileBtn.addEventListener("click", () => {
    jiraFileInput.click();
  });

  jiraFileInput.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (const file of files) {
      try {
        const data = await fileToBase64(file);
        selectedImages.push({
          data: data,
          filename: file.name,
        });
      } catch (error) {
        console.error(`Failed to read file ${file.name}:`, error);
      }
    }

    updateAttachmentPreview();
    // Reset file input so same file can be selected again
    jiraFileInput.value = "";
  });
}

// Convert file to base64 data URL
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Remove attachment from list
window.removeJiraAttachment = function (index) {
  selectedImages.splice(index, 1);
  updateAttachmentPreview();
  // Update description text
  if (selectedImages.length > 0) {
    const descText = jiraDescription.value.replace(
      /\n\n---\n📎 \d+ (image|attachment)\(s\) will be attached/,
      `\n\n---\n📎 ${selectedImages.length} attachment(s) will be attached`,
    );
    jiraDescription.value = descText;
  } else {
    jiraDescription.value = jiraDescription.value.replace(
      /\n\n---\n📎 \d+ (image|attachment)\(s\) will be attached/,
      "",
    );
  }
};

// Convert selection HTML to markdown for description
function htmlToMarkdown(html) {
  if (!html) return "";

  const container = document.createElement("div");
  container.innerHTML = html;

  let markdown = "";

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const tag = node.tagName.toLowerCase();
    let content = "";

    // Process children first
    for (const child of node.childNodes) {
      content += processNode(child);
    }

    switch (tag) {
      case "b":
      case "strong":
        return `**${content}**`;
      case "i":
      case "em":
        return `*${content}*`;
      case "u":
        return content; // No underline in Jira markdown
      case "code":
        return `\`${content}\``;
      case "pre":
        return `\n\`\`\`\n${content}\n\`\`\`\n`;
      case "h1":
        return `\n# ${content}\n`;
      case "h2":
        return `\n## ${content}\n`;
      case "h3":
        return `\n### ${content}\n`;
      case "h4":
      case "h5":
      case "h6":
        return `\n#### ${content}\n`;
      case "p":
        return `\n${content}\n`;
      case "br":
        return "\n";
      case "ul":
        return `\n${content}`;
      case "ol":
        return `\n${content}`;
      case "li":
        const parent = node.parentElement;
        if (parent && parent.tagName.toLowerCase() === "ol") {
          return `1. ${content}\n`;
        }
        return `- ${content}\n`;
      case "a":
        const href = node.getAttribute("href");
        return href ? `[${content}](${href})` : content;
      case "img":
        // Images will be handled separately as attachments
        const src = node.getAttribute("src");
        if (src && src.startsWith("data:image/")) {
          return "[Attached Image]";
        }
        return `![image](${src || ""})`;
      case "blockquote":
        return content
          .split("\n")
          .map((line) => `> ${line}`)
          .join("\n");
      case "div":
      case "span":
      default:
        return content;
    }
  }

  markdown = processNode(container);

  // Clean up extra newlines
  markdown = markdown.replace(/\n{3,}/g, "\n\n").trim();

  return markdown;
}

// ===== Searchable Dropdown Implementation =====
class SearchableDropdown {
  constructor(searchInput, select, dropdown, options = {}) {
    this.searchInput = searchInput;
    this.select = select;
    this.dropdown = dropdown;
    this.options = options;
    this.items = [];
    this.selectedValue = "";
    this.highlightedIndex = -1;

    if (this.searchInput && this.dropdown) {
      this.init();
    }
  }

  init() {
    const wrapper = this.searchInput.closest(".jira-searchable-select");

    // Focus/click opens dropdown
    this.searchInput.addEventListener("focus", () => this.open());
    this.searchInput.addEventListener("click", () => this.open());

    // Input filtering
    this.searchInput.addEventListener("input", () => this.filter());

    // Keyboard navigation
    this.searchInput.addEventListener("keydown", (e) => this.handleKeydown(e));

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        this.close();
      }
    });
  }

  setItems(items) {
    this.items = items;
    this.render();
  }

  render(filteredItems = null) {
    const itemsToRender = filteredItems || this.items;

    if (itemsToRender.length === 0) {
      this.dropdown.innerHTML =
        '<div class="jira-dropdown-empty">No results found</div>';
      return;
    }

    this.dropdown.innerHTML = itemsToRender
      .map(
        (item, index) => `
      <div class="jira-dropdown-item ${item.value === this.selectedValue ? "selected" : ""}" 
           data-value="${item.value}" 
           data-index="${index}">
        ${item.icon ? `<span class="item-icon">${item.icon}</span>` : ""}${item.label}
      </div>
    `,
      )
      .join("");

    // Add click handlers
    this.dropdown.querySelectorAll(".jira-dropdown-item").forEach((el) => {
      el.addEventListener("click", () => {
        this.selectItem(el.dataset.value);
      });
    });
  }

  filter() {
    const query = this.searchInput.value.toLowerCase();
    const filtered = this.items.filter((item) =>
      item.label.toLowerCase().includes(query),
    );
    this.render(filtered);
    this.highlightedIndex = -1;
  }

  open() {
    const wrapper = this.searchInput.closest(".jira-searchable-select");
    wrapper.classList.add("open");
    this.dropdown.classList.remove("hidden");
    this.render();
  }

  close() {
    const wrapper = this.searchInput.closest(".jira-searchable-select");
    wrapper.classList.remove("open");
    this.dropdown.classList.add("hidden");
    this.highlightedIndex = -1;
  }

  selectItem(value) {
    const item = this.items.find((i) => i.value === value);
    if (item) {
      this.selectedValue = value;
      this.searchInput.value = item.label;
      this.select.value = value;

      // Trigger change event
      const event = new Event("change", { bubbles: true });
      this.select.dispatchEvent(event);
    }
    this.close();
  }

  handleKeydown(e) {
    const items = this.dropdown.querySelectorAll(".jira-dropdown-item");

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.highlightedIndex = Math.min(
          this.highlightedIndex + 1,
          items.length - 1,
        );
        this.updateHighlight(items);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        this.updateHighlight(items);
        break;
      case "Enter":
        e.preventDefault();
        if (this.highlightedIndex >= 0 && items[this.highlightedIndex]) {
          this.selectItem(items[this.highlightedIndex].dataset.value);
        }
        break;
      case "Escape":
        this.close();
        break;
    }
  }

  updateHighlight(items) {
    items.forEach((item, index) => {
      item.classList.toggle("highlighted", index === this.highlightedIndex);
    });
    if (items[this.highlightedIndex]) {
      items[this.highlightedIndex].scrollIntoView({ block: "nearest" });
    }
  }

  setValue(value) {
    const item = this.items.find((i) => i.value === value);
    if (item) {
      this.selectedValue = value;
      this.searchInput.value = item.label;
      this.select.value = value;
    }
  }

  reset() {
    this.selectedValue = "";
    this.searchInput.value = "";
    this.items = [];
    this.dropdown.innerHTML = "";
  }
}

// ===== Markdown to ADF Converter =====
function markdownToADF(markdown) {
  if (!markdown || !markdown.trim()) return null;

  const content = [];
  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const language = line.slice(3).trim() || "plain";
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      content.push({
        type: "codeBlock",
        attrs: { language },
        content: [{ type: "text", text: codeLines.join("\n") }],
      });
      i++;
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      content.push({
        type: "heading",
        attrs: { level: headingMatch[1].length },
        content: parseInlineMarkdown(headingMatch[2]),
      });
      i++;
      continue;
    }

    // Bullet list
    if (line.match(/^[\-\*]\s+.+$/)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^[\-\*]\s+.+$/)) {
        const itemText = lines[i].replace(/^[\-\*]\s+/, "");
        listItems.push({
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: parseInlineMarkdown(itemText),
            },
          ],
        });
        i++;
      }
      content.push({ type: "bulletList", content: listItems });
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\.\s+.+$/)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s+.+$/)) {
        const itemText = lines[i].replace(/^\d+\.\s+/, "");
        listItems.push({
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: parseInlineMarkdown(itemText),
            },
          ],
        });
        i++;
      }
      content.push({ type: "orderedList", content: listItems });
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      content.push({ type: "rule" });
      i++;
      continue;
    }

    // Empty line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Regular paragraph
    content.push({
      type: "paragraph",
      content: parseInlineMarkdown(line),
    });
    i++;
  }

  return {
    type: "doc",
    version: 1,
    content:
      content.length > 0 ? content : [{ type: "paragraph", content: [] }],
  };
}

function parseInlineMarkdown(text) {
  const result = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Bold **text** or __text__
    let match = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)$/s);
    if (!match) match = remaining.match(/^(.*?)__(.+?)__(.*)$/s);
    if (match && match[1] !== undefined) {
      if (match[1]) {
        result.push(...parseInlineMarkdown(match[1]));
      }
      const boldContent = parseInlineMarkdown(match[2]);
      boldContent.forEach((node) => {
        node.marks = [...(node.marks || []), { type: "strong" }];
      });
      result.push(...boldContent);
      remaining = match[3];
      continue;
    }

    // Italic *text* or _text_ (but not inside words)
    match = remaining.match(/^(.*?)\*([^*]+?)\*(.*)$/s);
    if (!match)
      match = remaining.match(
        /^(.*?)(?:^|[^a-zA-Z])_([^_]+?)_(?:[^a-zA-Z]|$)(.*)$/s,
      );
    if (match && match[1] !== undefined && !remaining.match(/^\*\*/)) {
      if (match[1]) {
        result.push(...parseInlineMarkdown(match[1]));
      }
      const italicContent = parseInlineMarkdown(match[2]);
      italicContent.forEach((node) => {
        node.marks = [...(node.marks || []), { type: "em" }];
      });
      result.push(...italicContent);
      remaining = match[3];
      continue;
    }

    // Inline code `text`
    match = remaining.match(/^(.*?)`([^`]+?)`(.*)$/s);
    if (match && match[1] !== undefined) {
      if (match[1]) {
        result.push({ type: "text", text: match[1] });
      }
      result.push({
        type: "text",
        text: match[2],
        marks: [{ type: "code" }],
      });
      remaining = match[3];
      continue;
    }

    // Link [text](url)
    match = remaining.match(/^(.*?)\[([^\]]+?)\]\(([^)]+?)\)(.*)$/s);
    if (match && match[1] !== undefined) {
      if (match[1]) {
        result.push({ type: "text", text: match[1] });
      }
      result.push({
        type: "text",
        text: match[2],
        marks: [{ type: "link", attrs: { href: match[3] } }],
      });
      remaining = match[4];
      continue;
    }

    // Plain text
    result.push({ type: "text", text: remaining });
    break;
  }

  return result.filter((node) => node.text && node.text.length > 0);
}

// ===== Markdown Toolbar =====
function initMarkdownToolbar() {
  const toolbar = document.querySelector(".jira-markdown-toolbar");
  if (!toolbar || !jiraDescription) return;

  toolbar.addEventListener("click", (e) => {
    const btn = e.target.closest(".jira-md-btn");
    if (!btn) return;

    const action = btn.dataset.md;
    applyMarkdownFormat(action);
  });

  // Keyboard shortcuts
  jiraDescription.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          applyMarkdownFormat("bold");
          break;
        case "i":
          e.preventDefault();
          applyMarkdownFormat("italic");
          break;
      }
    }
  });
}

function applyMarkdownFormat(action) {
  const textarea = jiraDescription;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.substring(start, end);

  let before = "",
    after = "",
    newText = "",
    cursorOffset = 0;

  switch (action) {
    case "bold":
      before = "**";
      after = "**";
      newText = selected || "bold text";
      cursorOffset = selected ? 0 : -9;
      break;
    case "italic":
      before = "*";
      after = "*";
      newText = selected || "italic text";
      cursorOffset = selected ? 0 : -11;
      break;
    case "code":
      before = "`";
      after = "`";
      newText = selected || "code";
      cursorOffset = selected ? 0 : -4;
      break;
    case "heading":
      // Add at line start
      const lineStart = text.lastIndexOf("\n", start - 1) + 1;
      textarea.value =
        text.substring(0, lineStart) + "# " + text.substring(lineStart);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      textarea.focus();
      return;
    case "bullet":
      const bulletLineStart = text.lastIndexOf("\n", start - 1) + 1;
      textarea.value =
        text.substring(0, bulletLineStart) +
        "- " +
        text.substring(bulletLineStart);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      textarea.focus();
      return;
    case "number":
      const numLineStart = text.lastIndexOf("\n", start - 1) + 1;
      textarea.value =
        text.substring(0, numLineStart) + "1. " + text.substring(numLineStart);
      textarea.selectionStart = textarea.selectionEnd = start + 3;
      textarea.focus();
      return;
    case "codeblock":
      before = "```\n";
      after = "\n```";
      newText = selected || "code here";
      cursorOffset = selected ? 0 : -9;
      break;
    case "link":
      before = "[";
      after = "](url)";
      newText = selected || "link text";
      cursorOffset = selected ? -1 : -10;
      break;
    default:
      return;
  }

  textarea.value =
    text.substring(0, start) + before + newText + after + text.substring(end);
  const newPos =
    start + before.length + newText.length + after.length + cursorOffset;
  textarea.selectionStart = selected ? start : start + before.length;
  textarea.selectionEnd = selected
    ? newPos
    : start + before.length + newText.length;
  textarea.focus();
}

// Initialize searchable dropdowns
let projectDropdown,
  issueTypeDropdown,
  priorityDropdown,
  assigneeDropdown,
  epicDropdown,
  sprintDropdown;

function initSearchableDropdowns() {
  if (jiraProjectSearch && jiraProject && jiraProjectList) {
    projectDropdown = new SearchableDropdown(
      jiraProjectSearch,
      jiraProject,
      jiraProjectList,
    );
  }
  if (jiraIssueTypeSearch && jiraIssueType && jiraIssueTypeList) {
    issueTypeDropdown = new SearchableDropdown(
      jiraIssueTypeSearch,
      jiraIssueType,
      jiraIssueTypeList,
    );
  }
  if (jiraPrioritySearch && jiraPriority && jiraPriorityList) {
    priorityDropdown = new SearchableDropdown(
      jiraPrioritySearch,
      jiraPriority,
      jiraPriorityList,
    );
    // Set priority items immediately
    priorityDropdown.setItems([
      { value: "", label: "None", icon: "" },
      { value: "1", label: "Highest", icon: "🔴" },
      { value: "2", label: "High", icon: "🟠" },
      { value: "3", label: "Medium", icon: "🟡" },
      { value: "4", label: "Low", icon: "🟢" },
      { value: "5", label: "Lowest", icon: "⚪" },
    ]);
  }
  if (jiraAssigneeSearch && jiraAssignee && jiraAssigneeList) {
    assigneeDropdown = new SearchableDropdown(
      jiraAssigneeSearch,
      jiraAssignee,
      jiraAssigneeList,
    );
  }
  if (jiraSprintSearch && jiraSprint && jiraSprintList) {
    sprintDropdown = new SearchableDropdown(
      jiraSprintSearch,
      jiraSprint,
      jiraSprintList,
    );
  }
  if (jiraEpicSearch && jiraEpic && jiraEpicList) {
    epicDropdown = new SearchableDropdown(
      jiraEpicSearch,
      jiraEpic,
      jiraEpicList,
    );
  }
}

// Initialize on DOM ready
function initJiraUI() {
  initSearchableDropdowns();
  initMarkdownToolbar();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initJiraUI);
} else {
  initJiraUI();
}

// Load Jira configuration
async function loadJiraConfig() {
  try {
    const config = await window.electronAPI.getJiraConfig();
    if (config) {
      jiraConfig = config;
      jiraServerUrl.value = config.serverUrl || "";
      jiraEmail.value = config.email || "";
      jiraApiToken.value = config.apiToken || "";
      updateTokenHint();
    }
  } catch (error) {
    console.error("Failed to load Jira config:", error);
  }
}

// Update token hint and link based on server URL
function updateTokenHint() {
  const serverUrl = jiraServerUrl.value.trim();

  if (serverUrl && jiraTokenHint && createTokenLink) {
    // Determine the token creation URL based on Jira type
    let tokenUrl;
    if (serverUrl.includes("atlassian.net")) {
      // Jira Cloud
      tokenUrl = "https://id.atlassian.com/manage-profile/security/api-tokens";
    } else {
      // Jira Server/Data Center
      tokenUrl = `${serverUrl}/secure/ViewProfile.jspa`;
    }

    createTokenLink.href = tokenUrl;
    jiraTokenHint.classList.add("visible");
  } else if (jiraTokenHint) {
    jiraTokenHint.classList.remove("visible");
  }
}

// Listen for server URL changes to update token hint
if (jiraServerUrl) {
  jiraServerUrl.addEventListener("input", updateTokenHint);
  jiraServerUrl.addEventListener("blur", updateTokenHint);
}

// Open token creation link in external browser
if (createTokenLink) {
  createTokenLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const url = createTokenLink.href;
    if (url && url !== "#") {
      try {
        await window.electronAPI.openUrl(url);
      } catch (error) {
        console.error("Failed to open URL:", error);
      }
    }
  });
}

// Save Jira configuration
saveJiraConfigBtn.addEventListener("click", async () => {
  const config = {
    serverUrl: jiraServerUrl.value.trim(),
    email: jiraEmail.value.trim(),
    apiToken: jiraApiToken.value.trim(),
  };

  if (!config.serverUrl || !config.email || !config.apiToken) {
    showNotification("Please fill in all required fields", "error");
    return;
  }

  try {
    await window.electronAPI.saveJiraConfig(config);
    jiraConfig = config;
    showNotification("Jira configuration saved successfully");
  } catch (error) {
    showNotification("Failed to save Jira configuration", "error");
  }
});

// Toggle API token visibility
toggleJiraToken.addEventListener("click", () => {
  const type = jiraApiToken.type === "password" ? "text" : "password";
  jiraApiToken.type = type;
  toggleJiraToken.textContent = type === "password" ? "👁️" : "🙈";
});

// Test Jira connection
testJiraConnectionBtn.addEventListener("click", async () => {
  const config = {
    serverUrl: jiraServerUrl.value.trim(),
    email: jiraEmail.value.trim(),
    apiToken: jiraApiToken.value.trim(),
  };

  if (!config.serverUrl || !config.email || !config.apiToken) {
    jiraConnectionStatus.textContent = "⚠️ Please fill in all required fields";
    jiraConnectionStatus.className = "connection-status error";
    jiraConnectionStatus.classList.remove("hidden");
    return;
  }

  testJiraConnectionBtn.disabled = true;
  testJiraConnectionBtn.textContent = "Testing...";
  jiraConnectionStatus.classList.add("hidden");

  try {
    const result = await testJiraConnection(config);
    if (result.success) {
      jiraConnectionStatus.textContent = `✓ Connected successfully! Found ${result.projectCount || 0} projects`;
      jiraConnectionStatus.className = "connection-status success";
    } else {
      jiraConnectionStatus.textContent = `✗ Connection failed: ${result.error}`;
      jiraConnectionStatus.className = "connection-status error";
    }
    jiraConnectionStatus.classList.remove("hidden");
  } catch (error) {
    jiraConnectionStatus.textContent = `✗ Connection failed: ${error.message}`;
    jiraConnectionStatus.className = "connection-status error";
    jiraConnectionStatus.classList.remove("hidden");
  } finally {
    testJiraConnectionBtn.disabled = false;
    testJiraConnectionBtn.innerHTML = `<span class="icon icon-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Test Connection`;
  }
});

// Test Jira connection function
async function testJiraConnection(config) {
  return await window.electronAPI.jiraTestConnection(config);
}

// Open Jira help modal
jiraHelpLink.addEventListener("click", (e) => {
  e.preventDefault();
  jiraHelpModal.classList.remove("hidden");
});

closeJiraHelpModalBtn.addEventListener("click", () => {
  jiraHelpModal.classList.add("hidden");
});

closeJiraHelpBtn.addEventListener("click", () => {
  jiraHelpModal.classList.add("hidden");
});

// ===== Link Jira Issue Modal =====
let linkIssueDebounceTimer = null;
let linkedIssueData = null;

// Open link Jira issue modal
if (linkJiraIssueBtn) {
  linkJiraIssueBtn.addEventListener("click", () => {
    if (!isEditMode) return;

    // Save the current selection/cursor position
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      savedSelectionRange = selection.getRangeAt(0).cloneRange();
    } else {
      savedSelectionRange = null;
    }

    if (!jiraConfig.serverUrl || !jiraConfig.email || !jiraConfig.apiToken) {
      showNotification(
        "Please configure Jira integration in Settings first",
        "error",
      );
      return;
    }

    // Reset and show modal
    resetLinkJiraModal();
    linkJiraIssueModal.classList.remove("hidden");
    linkJiraIssueKey.focus();
  });
}

function resetLinkJiraModal() {
  if (linkJiraIssueKey) linkJiraIssueKey.value = "";
  if (linkJiraModalError) linkJiraModalError.classList.add("hidden");
  if (linkJiraPreview) linkJiraPreview.classList.add("hidden");
  if (confirmLinkJiraBtn) confirmLinkJiraBtn.disabled = true;
  linkedIssueData = null;
}

function closeLinkJiraModal() {
  linkJiraIssueModal.classList.add("hidden");
  resetLinkJiraModal();
}

if (closeLinkJiraModalBtn) {
  closeLinkJiraModalBtn.addEventListener("click", closeLinkJiraModal);
}

if (cancelLinkJiraBtn) {
  cancelLinkJiraBtn.addEventListener("click", closeLinkJiraModal);
}

// Fetch issue details on input
if (linkJiraIssueKey) {
  linkJiraIssueKey.addEventListener("input", (e) => {
    const value = e.target.value.trim().toUpperCase();

    // Clear previous timer
    clearTimeout(linkIssueDebounceTimer);

    // Hide preview and disable button
    if (linkJiraPreview) linkJiraPreview.classList.add("hidden");
    if (confirmLinkJiraBtn) confirmLinkJiraBtn.disabled = true;
    if (linkJiraModalError) linkJiraModalError.classList.add("hidden");
    linkedIssueData = null;

    // Check for valid issue key format (PROJECT-123)
    if (!value || !value.match(/^[A-Z]+-\d+$/)) {
      return;
    }

    // Debounce the API call
    linkIssueDebounceTimer = setTimeout(async () => {
      await fetchIssuePreview(value);
    }, 500);
  });

  // Allow pressing Enter to confirm
  linkJiraIssueKey.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !confirmLinkJiraBtn.disabled) {
      e.preventDefault();
      confirmLinkJiraBtn.click();
    }
  });
}

async function fetchIssuePreview(issueKey) {
  linkJiraPreview.classList.remove("hidden");
  linkJiraPreview.classList.add("loading");
  linkJiraPreview.classList.remove("error");

  previewIssueKey.textContent = issueKey;
  previewIssueSummary.textContent = "Loading...";
  previewIssueType.textContent = "";
  previewIssueStatus.textContent = "";
  if (previewIssueAssignee) previewIssueAssignee.textContent = "Loading...";
  if (previewIssueProject) previewIssueProject.textContent = "Loading...";
  if (previewIssueEpic) previewIssueEpic.textContent = "Loading...";
  if (previewIssueDescription)
    previewIssueDescription.textContent = "Loading...";

  try {
    const result = await window.electronAPI.jiraGetIssue(jiraConfig, issueKey);

    if (!result.success) {
      throw new Error(result.error || "Issue not found");
    }

    const issue = result.issue;

    // Extract description from ADF format
    let descriptionText = "No description";
    if (issue.fields.description) {
      descriptionText = extractTextFromADF(issue.fields.description);
    }

    // Extract assignee name
    const assigneeName = issue.fields.assignee?.displayName || "Unassigned";

    // Extract project name
    const projectName = issue.fields.project?.name || "-";

    // Extract epic (parent) info
    let epicInfo = "None";
    if (issue.fields.parent) {
      epicInfo = `${issue.fields.parent.key}: ${issue.fields.parent.fields?.summary || ""}`;
    }

    linkedIssueData = {
      key: issue.key,
      summary: issue.fields.summary,
      type: issue.fields.issuetype?.name || "Unknown",
      status: issue.fields.status?.name || "Unknown",
      assignee: assigneeName,
      project: projectName,
      epic: epicInfo,
      description: descriptionText,
    };

    previewIssueKey.textContent = issue.key;
    previewIssueSummary.textContent = issue.fields.summary;
    previewIssueType.textContent = linkedIssueData.type;
    previewIssueStatus.textContent = linkedIssueData.status;
    if (previewIssueAssignee)
      previewIssueAssignee.textContent = linkedIssueData.assignee;
    if (previewIssueProject)
      previewIssueProject.textContent = linkedIssueData.project;
    if (previewIssueEpic) previewIssueEpic.textContent = linkedIssueData.epic;
    if (previewIssueDescription) {
      // Truncate long descriptions
      const maxLength = 200;
      const displayDesc =
        descriptionText.length > maxLength
          ? descriptionText.substring(0, maxLength) + "..."
          : descriptionText;
      previewIssueDescription.textContent = displayDesc;
    }

    linkJiraPreview.classList.remove("loading");
    confirmLinkJiraBtn.disabled = false;
  } catch (error) {
    linkJiraPreview.classList.remove("loading");
    linkJiraPreview.classList.add("error");
    previewIssueSummary.textContent = error.message || "Issue not found";
    previewIssueType.textContent = "";
    previewIssueStatus.textContent = "";
    if (previewIssueAssignee) previewIssueAssignee.textContent = "";
    if (previewIssueProject) previewIssueProject.textContent = "";
    if (previewIssueEpic) previewIssueEpic.textContent = "";
    if (previewIssueDescription) previewIssueDescription.textContent = "";
    linkedIssueData = null;
    confirmLinkJiraBtn.disabled = true;
  }
}

// Helper function to extract plain text from Jira ADF format
function extractTextFromADF(adf) {
  if (!adf || typeof adf === "string") {
    return adf || "";
  }

  let text = "";

  function processNode(node) {
    if (!node) return;

    if (node.type === "text") {
      text += node.text || "";
    } else if (node.type === "hardBreak") {
      text += "\n";
    } else if (node.type === "paragraph") {
      if (node.content) {
        node.content.forEach(processNode);
      }
      text += "\n";
    } else if (node.content && Array.isArray(node.content)) {
      node.content.forEach(processNode);
    }
  }

  if (adf.content && Array.isArray(adf.content)) {
    adf.content.forEach(processNode);
  }

  return text.trim() || "No description";
}

// Add remove buttons to existing jira-inserted-tag elements (for loaded notes)
function addRemoveButtonsToExistingTags() {
  const containers = [noteEditor, noteReadView];

  containers.forEach((container) => {
    if (!container) return;

    const tags = container.querySelectorAll(".jira-inserted-tag");
    tags.forEach((tag) => {
      // Check if this tag already has a remove button
      if (tag.querySelector(".jira-tag-remove")) return;

      // Get the existing text content
      const existingText = tag.textContent;

      // Clear the tag
      tag.innerHTML = "";

      // Create text wrapper
      const textSpan = document.createElement("span");
      textSpan.className = "jira-tag-text";
      textSpan.textContent = existingText;

      // Create remove button (only for editor, not read view)
      if (container === noteEditor) {
        const removeBtn = document.createElement("span");
        removeBtn.className = "jira-tag-remove";
        removeBtn.innerHTML = "&times;";
        removeBtn.title = "Remove tag";
        removeBtn.contentEditable = "false";

        // Add click handler
        removeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Hide epic tooltip if this is an epic tag
          if (tag.classList.contains("jira-epic-tag")) {
            hideEpicTooltip();
          }
          tag.remove();

          // Trigger save
          notesSaveStatus.textContent = "Saving...";
          notesSaveStatus.classList.add("saving");
          clearTimeout(notesDebounceTimer);
          notesDebounceTimer = setTimeout(saveCurrentNote, 500);
        });

        // Append elements
        tag.appendChild(textSpan);
        tag.appendChild(removeBtn);
      } else {
        // Read view - just append text
        tag.appendChild(textSpan);
      }
    });
  });
}

// ===== Jira Quick-Insert Dropdowns =====
let insertProjectsCache = [];
let insertUsersCache = [];
let insertEpicsCache = [];
let selectedInsertProject = null;
let activeInsertMenu = null;

// Close all insert menus
function closeAllInsertMenus() {
  [projectInsertMenu, assigneeInsertMenu, epicInsertMenu].forEach((menu) => {
    if (menu) menu.classList.remove("show");
  });
  activeInsertMenu = null;
}

// Toggle dropdown menu
function toggleInsertMenu(menu, btn) {
  const isOpen = menu.classList.contains("show");
  closeAllInsertMenus();
  if (!isOpen) {
    menu.classList.add("show");
    activeInsertMenu = menu;
    const searchInput = menu.querySelector("input");
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus({ preventScroll: true });
    }
  }
}

// Load projects for insert dropdown
async function loadInsertProjects() {
  if (!jiraConfig.serverUrl || !jiraConfig.email || !jiraConfig.apiToken) {
    if (projectInsertList) {
      projectInsertList.innerHTML =
        '<div class="jira-insert-loading">Configure Jira first</div>';
    }
    return;
  }

  if (projectInsertList) {
    projectInsertList.innerHTML =
      '<div class="jira-insert-loading">Loading...</div>';
  }

  try {
    const result = await window.electronAPI.jiraGetProjects(jiraConfig);
    if (result.success && result.projects) {
      insertProjectsCache = result.projects;
      renderInsertProjects(insertProjectsCache);
    } else {
      if (projectInsertList) {
        projectInsertList.innerHTML =
          '<div class="jira-insert-loading">Failed to load</div>';
      }
    }
  } catch (error) {
    console.error("Failed to load projects:", error);
    if (projectInsertList) {
      projectInsertList.innerHTML =
        '<div class="jira-insert-loading">Error loading projects</div>';
    }
  }
}

function renderInsertProjects(projects, filter = "") {
  if (!projectInsertList) return;

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.key.toLowerCase().includes(filter.toLowerCase()),
  );

  if (filtered.length === 0) {
    projectInsertList.innerHTML =
      '<div class="jira-insert-loading">No projects found</div>';
    return;
  }

  projectInsertList.innerHTML = filtered
    .map(
      (project) => `
    <button type="button" class="jira-insert-item" data-key="${project.key}" data-name="${project.name}">
      <span class="jira-insert-icon">📁</span>
      <span class="jira-insert-text">${project.name} (${project.key})</span>
    </button>
  `,
    )
    .join("");

  // Add click handlers
  projectInsertList.querySelectorAll(".jira-insert-item").forEach((item) => {
    // Prevent mousedown from stealing focus and causing scroll
    item.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    item.addEventListener("click", async () => {
      const key = item.dataset.key;
      const name = item.dataset.name;
      insertTextAtCursor(`📁 ${name} (${key})`, "project", null);
      closeAllInsertMenus();

      // Store selected project and load assignees/epics
      selectedInsertProject = key;

      // Enable assignee and epic buttons
      if (insertAssigneeBtn) {
        insertAssigneeBtn.disabled = false;
        insertAssigneeBtn.title = "Insert Assignee";
      }
      if (insertEpicBtn) {
        insertEpicBtn.disabled = false;
        insertEpicBtn.title = "Insert Epic";
      }

      await Promise.all([loadInsertUsers(key), loadInsertEpics(key)]);
    });
  });
}

// Load users for insert dropdown
async function loadInsertUsers(projectKey) {
  if (!projectKey) {
    if (assigneeInsertList) {
      assigneeInsertList.innerHTML =
        '<div class="jira-insert-loading">Select a project first</div>';
    }
    return;
  }

  if (assigneeInsertList) {
    assigneeInsertList.innerHTML =
      '<div class="jira-insert-loading">Loading...</div>';
  }

  try {
    const result = await window.electronAPI.jiraGetUsers(
      jiraConfig,
      projectKey,
    );
    if (result.success && result.users) {
      insertUsersCache = result.users;
      renderInsertUsers(insertUsersCache);
    } else {
      if (assigneeInsertList) {
        assigneeInsertList.innerHTML =
          '<div class="jira-insert-loading">Failed to load</div>';
      }
    }
  } catch (error) {
    console.error("Failed to load users:", error);
    if (assigneeInsertList) {
      assigneeInsertList.innerHTML =
        '<div class="jira-insert-loading">Error loading users</div>';
    }
  }
}

function renderInsertUsers(users, filter = "") {
  if (!assigneeInsertList) return;

  const filtered = users.filter((u) =>
    u.displayName.toLowerCase().includes(filter.toLowerCase()),
  );

  if (filtered.length === 0) {
    assigneeInsertList.innerHTML =
      '<div class="jira-insert-loading">No assignees found</div>';
    return;
  }

  assigneeInsertList.innerHTML = filtered
    .map(
      (user) => `
    <button type="button" class="jira-insert-item" data-id="${user.accountId}" data-name="${user.displayName}">
      <span class="jira-insert-icon">👤</span>
      <span class="jira-insert-text">${user.displayName}</span>
    </button>
  `,
    )
    .join("");

  // Add click handlers
  assigneeInsertList.querySelectorAll(".jira-insert-item").forEach((item) => {
    // Prevent mousedown from stealing focus and causing scroll
    item.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    item.addEventListener("click", () => {
      const name = item.dataset.name;
      insertTextAtCursor(`👤 ${name}`, "assignee", null);
      closeAllInsertMenus();
    });
  });
}

// Load epics for insert dropdown
async function loadInsertEpics(projectKey) {
  if (!projectKey) {
    if (epicInsertList) {
      epicInsertList.innerHTML =
        '<div class="jira-insert-loading">Select a project first</div>';
    }
    return;
  }

  if (epicInsertList) {
    epicInsertList.innerHTML =
      '<div class="jira-insert-loading">Loading...</div>';
  }

  try {
    const result = await window.electronAPI.jiraGetEpics(
      jiraConfig,
      projectKey,
    );
    if (result.success && result.epics) {
      insertEpicsCache = result.epics;
      renderInsertEpics(insertEpicsCache);
    } else {
      if (epicInsertList) {
        epicInsertList.innerHTML =
          '<div class="jira-insert-loading">No epics found</div>';
      }
    }
  } catch (error) {
    console.error("Failed to load epics:", error);
    if (epicInsertList) {
      epicInsertList.innerHTML =
        '<div class="jira-insert-loading">Error loading epics</div>';
    }
  }
}

function renderInsertEpics(epics, filter = "") {
  if (!epicInsertList) return;

  const filtered = epics.filter(
    (e) =>
      e.key.toLowerCase().includes(filter.toLowerCase()) ||
      e.summary.toLowerCase().includes(filter.toLowerCase()),
  );

  if (filtered.length === 0) {
    epicInsertList.innerHTML =
      '<div class="jira-insert-loading">No epics found</div>';
    return;
  }

  epicInsertList.innerHTML = filtered
    .map((epic) => {
      const epicData = JSON.stringify(epic).replace(/"/g, "&quot;");
      return `
      <button type="button" class="jira-insert-item" data-key="${epic.key}" data-summary="${epic.summary}" data-epic="${epicData}">
        <span class="jira-insert-icon">🎯</span>
        <span class="jira-insert-text">${epic.key}: ${epic.summary}</span>
      </button>
    `;
    })
    .join("");

  // Add click handlers
  epicInsertList.querySelectorAll(".jira-insert-item").forEach((item) => {
    // Prevent mousedown from stealing focus and causing scroll
    item.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    item.addEventListener("click", () => {
      const key = item.dataset.key;
      const summary = item.dataset.summary;
      const epicData = JSON.parse(item.dataset.epic.replace(/&quot;/g, '"'));
      insertTextAtCursor(`🎯 ${key}: ${summary}`, "epic", epicData);
      closeAllInsertMenus();
    });
  });
}

// Insert text at cursor in note editor
function insertTextAtCursor(text, type = "default", extraData = null) {
  if (!noteEditor || !isEditMode) return;

  // Save scroll position before focusing
  const scrollTop = noteEditor.scrollTop;
  const parentScrollTop = noteEditor.parentElement
    ? noteEditor.parentElement.scrollTop
    : 0;

  // Ensure we're inserting into the noteEditor only (prevent scroll on focus)
  noteEditor.focus({ preventScroll: true });

  const selection = window.getSelection();
  let range;

  // Validate savedSelectionRange is within noteEditor
  if (
    savedSelectionRange &&
    noteEditor.contains(savedSelectionRange.commonAncestorContainer)
  ) {
    range = savedSelectionRange;
  } else if (selection.rangeCount > 0) {
    range = selection.getRangeAt(0);
    // Ensure range is within noteEditor
    if (!noteEditor.contains(range.commonAncestorContainer)) {
      range = document.createRange();
      range.selectNodeContents(noteEditor);
      range.collapse(false);
    }
  } else {
    // Create range at end of noteEditor
    range = document.createRange();
    range.selectNodeContents(noteEditor);
    range.collapse(false);
  }

  // Double-check the range is within noteEditor before proceeding
  if (!noteEditor.contains(range.commonAncestorContainer)) {
    console.warn("Attempted to insert outside noteEditor, aborting");
    savedSelectionRange = null;
    return;
  }

  // Create styled span for the inserted text
  const span = document.createElement("span");
  span.className = "jira-inserted-tag";
  span.contentEditable = "false";
  span.dataset.type = type;

  // Create text content wrapper
  const textSpan = document.createElement("span");
  textSpan.className = "jira-tag-text";
  textSpan.textContent = text;

  // Create remove button
  const removeBtn = document.createElement("span");
  removeBtn.className = "jira-tag-remove";
  removeBtn.innerHTML = "&times;";
  removeBtn.title = "Remove tag";
  removeBtn.contentEditable = "false";

  // Add click handler to remove the tag
  removeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Hide epic tooltip if this is an epic tag
    if (span.classList.contains("jira-epic-tag")) {
      hideEpicTooltip();
    }
    span.remove();
    // Trigger save
    notesSaveStatus.textContent = "Saving...";
    notesSaveStatus.classList.add("saving");
    clearTimeout(notesDebounceTimer);
    notesDebounceTimer = setTimeout(saveCurrentNote, 500);
  });

  span.appendChild(textSpan);
  span.appendChild(removeBtn);

  // Store epic details for tooltip
  if (type === "epic" && extraData) {
    span.dataset.epicKey = extraData.key;
    span.dataset.epicSummary = extraData.summary;
    if (extraData.status) span.dataset.epicStatus = extraData.status;
    if (extraData.assignee) span.dataset.epicAssignee = extraData.assignee;
    if (extraData.description)
      span.dataset.epicDescription = extraData.description;
    span.classList.add("jira-epic-tag");
  }

  const spaceBefore = document.createTextNode(" ");
  const spaceAfter = document.createTextNode(" ");

  range.deleteContents();
  range.insertNode(spaceAfter);
  range.insertNode(span);
  range.insertNode(spaceBefore);

  range.setStartAfter(spaceAfter);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);

  // Restore scroll position (selection.addRange may have scrolled)
  noteEditor.scrollTop = scrollTop;
  if (noteEditor.parentElement) {
    noteEditor.parentElement.scrollTop = parentScrollTop;
  }

  savedSelectionRange = null;

  // Trigger save
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
}

// Event listeners for insert dropdown buttons
if (insertProjectBtn) {
  // Prevent button from stealing focus
  insertProjectBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });

  insertProjectBtn.addEventListener("click", () => {
    if (!isEditMode) return;

    // Save selection only if it's within noteEditor
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (noteEditor && noteEditor.contains(range.commonAncestorContainer)) {
        savedSelectionRange = range.cloneRange();
      } else {
        savedSelectionRange = null;
      }
    } else {
      savedSelectionRange = null;
    }

    toggleInsertMenu(projectInsertMenu, insertProjectBtn);
    if (
      projectInsertMenu.classList.contains("show") &&
      insertProjectsCache.length === 0
    ) {
      loadInsertProjects();
    }
  });
}

if (insertAssigneeBtn) {
  // Prevent button from stealing focus
  insertAssigneeBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });

  insertAssigneeBtn.addEventListener("click", () => {
    if (!isEditMode) return;

    // Save selection only if it's within noteEditor
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (noteEditor && noteEditor.contains(range.commonAncestorContainer)) {
        savedSelectionRange = range.cloneRange();
      } else {
        savedSelectionRange = null;
      }
    } else {
      savedSelectionRange = null;
    }

    toggleInsertMenu(assigneeInsertMenu, insertAssigneeBtn);

    if (!selectedInsertProject) {
      if (assigneeInsertList) {
        assigneeInsertList.innerHTML =
          '<div class="jira-insert-loading">Select a project first</div>';
      }
    }
  });
}

if (insertEpicBtn) {
  // Prevent button from stealing focus
  insertEpicBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });

  insertEpicBtn.addEventListener("click", () => {
    if (!isEditMode) return;

    // Save selection only if it's within noteEditor
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (noteEditor && noteEditor.contains(range.commonAncestorContainer)) {
        savedSelectionRange = range.cloneRange();
      } else {
        savedSelectionRange = null;
      }
    } else {
      savedSelectionRange = null;
    }

    toggleInsertMenu(epicInsertMenu, insertEpicBtn);

    if (!selectedInsertProject) {
      if (epicInsertList) {
        epicInsertList.innerHTML =
          '<div class="jira-insert-loading">Select a project first</div>';
      }
    }
  });
}

// Search handlers
if (projectInsertSearch) {
  projectInsertSearch.addEventListener("input", (e) => {
    renderInsertProjects(insertProjectsCache, e.target.value);
  });
}

if (assigneeInsertSearch) {
  assigneeInsertSearch.addEventListener("input", (e) => {
    renderInsertUsers(insertUsersCache, e.target.value);
  });
}

if (epicInsertSearch) {
  epicInsertSearch.addEventListener("input", (e) => {
    renderInsertEpics(insertEpicsCache, e.target.value);
  });
}

// Close menus when clicking outside
document.addEventListener("click", (e) => {
  if (activeInsertMenu) {
    const isInsideMenu = e.target.closest(".jira-insert-dropdown");
    if (!isInsideMenu) {
      closeAllInsertMenus();
    }
  }
});

// Close menus on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && activeInsertMenu) {
    closeAllInsertMenus();
  }
});

// Epic tooltip functionality
let epicTooltip = null;

function createEpicTooltip() {
  if (epicTooltip) return epicTooltip;

  epicTooltip = document.createElement("div");
  epicTooltip.className = "epic-tooltip hidden";
  document.body.appendChild(epicTooltip);
  return epicTooltip;
}

function showEpicTooltip(epicTag, x, y) {
  const tooltip = createEpicTooltip();

  const key = epicTag.dataset.epicKey || "N/A";
  const summary = epicTag.dataset.epicSummary || "N/A";
  const status = epicTag.dataset.epicStatus || "Unknown";
  const assignee = epicTag.dataset.epicAssignee || "Unassigned";
  const description = epicTag.dataset.epicDescription || "No description";

  tooltip.innerHTML = `
    <div class="epic-tooltip-header">
      <strong>🎯 ${key}</strong>
    </div>
    <div class="epic-tooltip-body">
      <div class="epic-tooltip-row">
        <span class="epic-tooltip-label">Summary:</span>
        <span class="epic-tooltip-value">${summary}</span>
      </div>
      <div class="epic-tooltip-row">
        <span class="epic-tooltip-label">Status:</span>
        <span class="epic-tooltip-value">${status}</span>
      </div>
      <div class="epic-tooltip-row">
        <span class="epic-tooltip-label">Assignee:</span>
        <span class="epic-tooltip-value">${assignee}</span>
      </div>
      <div class="epic-tooltip-row">
        <span class="epic-tooltip-label">Description:</span>
        <div class="epic-tooltip-description">${description}</div>
      </div>
    </div>
  `;

  tooltip.classList.remove("hidden");

  // Position tooltip
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = x + 10;
  let top = y + 10;

  // Adjust if tooltip goes off-screen
  if (left + tooltipRect.width > viewportWidth) {
    left = x - tooltipRect.width - 10;
  }
  if (top + tooltipRect.height > viewportHeight) {
    top = y - tooltipRect.height - 10;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideEpicTooltip() {
  if (epicTooltip) {
    epicTooltip.classList.add("hidden");
  }
}

// Add hover listeners to epic tags (use event delegation)
if (noteEditor) {
  noteEditor.addEventListener("mouseover", (e) => {
    const epicTag = e.target.closest(".jira-epic-tag");
    if (epicTag && epicTag.dataset.epicKey) {
      showEpicTooltip(epicTag, e.pageX, e.pageY);
    }
  });

  noteEditor.addEventListener("mouseout", (e) => {
    const epicTag = e.target.closest(".jira-epic-tag");
    if (epicTag) {
      hideEpicTooltip();
    }
  });
}

// Also handle for read view
if (noteReadView) {
  noteReadView.addEventListener("mouseover", (e) => {
    const epicTag = e.target.closest(".jira-epic-tag");
    if (epicTag && epicTag.dataset.epicKey) {
      showEpicTooltip(epicTag, e.pageX, e.pageY);
    }
  });

  noteReadView.addEventListener("mouseout", (e) => {
    const epicTag = e.target.closest(".jira-epic-tag");
    if (epicTag) {
      hideEpicTooltip();
    }
  });
}

// Issue tooltip functionality
let issueTooltip = null;
let currentIssueKey = null; // Track current issue to prevent duplicate fetches
let isTooltipSticky = false; // Track if tooltip is in sticky (pinned) mode
let issueTransitionsCache = {}; // Cache transitions for each issue
let issueAssigneesCache = {}; // Cache assignable users per project

function createIssueTooltip() {
  if (issueTooltip) return issueTooltip;

  issueTooltip = document.createElement("div");
  issueTooltip.className = "issue-tooltip hidden";
  document.body.appendChild(issueTooltip);

  // Add mouseenter/mouseleave handlers for sticky tooltip
  issueTooltip.addEventListener("mouseenter", () => {
    // Keep tooltip visible when hovering over it
  });

  issueTooltip.addEventListener("mouseleave", () => {
    // Only hide if not in sticky mode
    if (!isTooltipSticky) {
      hideIssueTooltip();
    }
  });

  return issueTooltip;
}

async function showIssueTooltip(issueLink, x, y, sticky = false) {
  const tooltip = createIssueTooltip();

  // If sticky mode requested, set the flag
  if (sticky) {
    isTooltipSticky = true;
    tooltip.classList.add("issue-tooltip-sticky");
  }

  // Extract issue key from the link text or href
  let issueKey = issueLink.textContent.trim();
  if (!issueKey || !issueKey.match(/^[A-Z]+-\d+$/)) {
    // Try to extract from href if text doesn't match pattern
    const href = issueLink.href || issueLink.dataset.jiraUrl || "";
    const match = href.match(/browse\/([A-Z]+-\d+)/);
    if (match) {
      issueKey = match[1];
    } else {
      return; // Can't determine issue key
    }
  }

  // Prevent duplicate fetches (but allow if switching to sticky mode)
  if (
    currentIssueKey === issueKey &&
    !tooltip.classList.contains("hidden") &&
    !sticky
  ) {
    return;
  }

  currentIssueKey = issueKey;

  // Show loading state
  const closeBtn = sticky
    ? '<button class="issue-tooltip-close" title="Close">&times;</button>'
    : "";
  tooltip.innerHTML = `
    <div class="issue-tooltip-header">
      <strong>🔄 ${issueKey}</strong>
      ${closeBtn}
    </div>
    <div class="issue-tooltip-body">
      <div class="issue-tooltip-loading">Loading...</div>
    </div>
  `;
  tooltip.classList.remove("hidden");

  // Add close button handler if sticky
  if (sticky) {
    const closeBtnEl = tooltip.querySelector(".issue-tooltip-close");
    if (closeBtnEl) {
      closeBtnEl.addEventListener("click", (e) => {
        e.stopPropagation();
        hideIssueTooltip(true);
      });
    }
  }

  // Position tooltip (initial position)
  positionIssueTooltip(tooltip, x, y);

  // Fetch issue details
  try {
    const result = await window.electronAPI.jiraGetIssue(jiraConfig, issueKey);

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch issue");
    }

    // Check if we're still hovering over the same issue
    if (currentIssueKey !== issueKey) {
      return;
    }

    const issue = result.issue;
    const summary = issue.fields.summary || "N/A";
    const issueType = issue.fields.issuetype?.name || "N/A";
    const status = issue.fields.status?.name || "Unknown";
    const assignee = issue.fields.assignee?.displayName || "Unassigned";
    const project = issue.fields.project?.name || "N/A";
    const parent = issue.fields.parent?.key || "None";

    // Extract description
    let description = "No description";
    if (issue.fields.description) {
      if (typeof issue.fields.description === "string") {
        description = issue.fields.description;
      } else if (issue.fields.description.content) {
        // Handle ADF format
        description = extractADFText(issue.fields.description);
      }
    }

    // Truncate description if too long
    if (description.length > 300) {
      description = description.substring(0, 300) + "...";
    }

    // Build status section - if sticky, show searchable dropdown for status change
    let statusSection = "";
    if (isTooltipSticky) {
      statusSection = `
        <div class="issue-tooltip-item issue-tooltip-status-item">
          <span class="issue-tooltip-label">Status</span>
          <div class="issue-tooltip-searchable-dropdown" data-type="status" data-issue-key="${issueKey}">
            <button class="issue-tooltip-dropdown-trigger issue-tooltip-status-trigger" data-current-status="${status}">
              <span class="dropdown-trigger-text">${status}</span>
              <svg class="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="issue-tooltip-dropdown-panel hidden">
              <div class="issue-tooltip-dropdown-search-wrap">
                <input type="text" class="issue-tooltip-dropdown-search" placeholder="Search status..." />
              </div>
              <div class="issue-tooltip-dropdown-list">
                <div class="issue-tooltip-dropdown-loading">Loading...</div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      statusSection = `
        <div class="issue-tooltip-item">
          <span class="issue-tooltip-label">Status</span>
          <span class="issue-tooltip-badge issue-status-badge">${status}</span>
        </div>
      `;
    }

    // Build assignee section - if sticky, show searchable dropdown for assignee change
    const projectKey = issue.fields.project?.key || "";
    const currentAssigneeId = issue.fields.assignee?.accountId || "";
    let assigneeSection = "";
    if (isTooltipSticky) {
      assigneeSection = `
        <div class="issue-tooltip-item issue-tooltip-assignee-item">
          <span class="issue-tooltip-label">Assignee</span>
          <div class="issue-tooltip-searchable-dropdown" data-type="assignee" data-issue-key="${issueKey}" data-project-key="${projectKey}" data-current-id="${currentAssigneeId}">
            <button class="issue-tooltip-dropdown-trigger issue-tooltip-assignee-trigger" data-current-id="${currentAssigneeId}">
              <span class="dropdown-trigger-text">${assignee}</span>
              <svg class="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="issue-tooltip-dropdown-panel hidden">
              <div class="issue-tooltip-dropdown-search-wrap">
                <input type="text" class="issue-tooltip-dropdown-search" placeholder="Search assignee..." />
              </div>
              <div class="issue-tooltip-dropdown-list">
                <div class="issue-tooltip-dropdown-loading">Loading...</div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      assigneeSection = `
        <div class="issue-tooltip-item">
          <span class="issue-tooltip-label">Assignee</span>
          <span class="issue-tooltip-value">${assignee}</span>
        </div>
      `;
    }

    const closeBtnHtml = isTooltipSticky
      ? '<button class="issue-tooltip-close" title="Close">&times;</button>'
      : "";

    tooltip.innerHTML = `
      <div class="issue-tooltip-header">
        <div class="issue-tooltip-title">
          <span class="issue-tooltip-icon">🎫</span>
          <strong class="issue-tooltip-key">${issueKey}</strong>
        </div>
        <div class="issue-tooltip-header-right">
          <span class="issue-tooltip-type">${issueType}</span>
          ${closeBtnHtml}
        </div>
      </div>
      <div class="issue-tooltip-body">
        <div class="issue-tooltip-summary">${summary}</div>
        
        <div class="issue-tooltip-grid">
          ${statusSection}
          ${assigneeSection}
          <div class="issue-tooltip-item">
            <span class="issue-tooltip-label">Project</span>
            <span class="issue-tooltip-value">${project}</span>
          </div>
          ${
            parent !== "None"
              ? `
          <div class="issue-tooltip-item">
            <span class="issue-tooltip-label">Epic</span>
            <span class="issue-tooltip-value issue-epic-value">${parent}</span>
          </div>
          `
              : ""
          }
        </div>
        
        ${
          description !== "No description"
            ? `
        <div class="issue-tooltip-description-section">
          <span class="issue-tooltip-label">Description</span>
          <div class="issue-tooltip-description">${description}</div>
        </div>
        `
            : ""
        }
      </div>
    `;

    // Add close button handler if sticky
    if (isTooltipSticky) {
      const closeBtnEl = tooltip.querySelector(".issue-tooltip-close");
      if (closeBtnEl) {
        closeBtnEl.addEventListener("click", (e) => {
          e.stopPropagation();
          hideIssueTooltip(true);
        });
      }

      // Initialize searchable dropdowns
      initSearchableDropdowns(tooltip, issueKey);
    }

    // Reposition after content loaded
    positionIssueTooltip(tooltip, x, y);
  } catch (error) {
    console.error("Failed to fetch issue details:", error);
    const closeBtnHtml = isTooltipSticky
      ? '<button class="issue-tooltip-close" title="Close">&times;</button>'
      : "";
    tooltip.innerHTML = `
      <div class="issue-tooltip-header issue-tooltip-error-header">
        <div class="issue-tooltip-title">
          <span class="issue-tooltip-icon">❌</span>
          <strong class="issue-tooltip-key">${issueKey}</strong>
        </div>
        ${closeBtnHtml}
      </div>
      <div class="issue-tooltip-body">
        <div class="issue-tooltip-error">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#ef4444" stroke-width="2" fill="none"/>
            <path d="M10 6v4M10 13v1" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Failed to load issue details</span>
        </div>
      </div>
    `;

    if (isTooltipSticky) {
      const closeBtnEl = tooltip.querySelector(".issue-tooltip-close");
      if (closeBtnEl) {
        closeBtnEl.addEventListener("click", (e) => {
          e.stopPropagation();
          hideIssueTooltip(true);
        });
      }
    }

    positionIssueTooltip(tooltip, x, y);
  }
}

// Initialize all searchable dropdowns in the tooltip
function initSearchableDropdowns(tooltip, issueKey) {
  const dropdowns = tooltip.querySelectorAll(
    ".issue-tooltip-searchable-dropdown",
  );

  dropdowns.forEach((dropdown) => {
    const type = dropdown.dataset.type; // 'status' or 'assignee'
    const trigger = dropdown.querySelector(".issue-tooltip-dropdown-trigger");
    const panel = dropdown.querySelector(".issue-tooltip-dropdown-panel");
    const searchInput = dropdown.querySelector(
      ".issue-tooltip-dropdown-search",
    );
    const listContainer = dropdown.querySelector(
      ".issue-tooltip-dropdown-list",
    );

    // Load options on first open
    let optionsLoaded = false;
    let allOptions = [];

    // Toggle dropdown
    trigger.addEventListener("click", async (e) => {
      e.stopPropagation();
      const isHidden = panel.classList.contains("hidden");

      // Close other dropdowns first
      tooltip.querySelectorAll(".issue-tooltip-dropdown-panel").forEach((p) => {
        if (p !== panel) p.classList.add("hidden");
      });

      panel.classList.toggle("hidden");

      if (isHidden && !optionsLoaded) {
        // Load options
        if (type === "status") {
          allOptions = await loadStatusOptions(issueKey, listContainer);
        } else if (type === "assignee") {
          const projectKey = dropdown.dataset.projectKey;
          const currentId = dropdown.dataset.currentId;
          allOptions = await loadAssigneeOptions(
            projectKey,
            currentId,
            listContainer,
          );
        }
        optionsLoaded = true;

        // Attach click handlers to options
        attachOptionClickHandlers(dropdown, trigger, panel, issueKey, type);
      }

      if (isHidden) {
        searchInput.value = "";
        searchInput.focus();
        filterDropdownOptions(listContainer, "", allOptions, type);
      }
    });

    // Search filtering
    searchInput.addEventListener("input", (e) => {
      e.stopPropagation();
      const query = searchInput.value.toLowerCase();
      filterDropdownOptions(listContainer, query, allOptions, type);
      attachOptionClickHandlers(dropdown, trigger, panel, issueKey, type);
    });

    // Prevent clicks inside panel from closing it
    panel.addEventListener("click", (e) => e.stopPropagation());
    searchInput.addEventListener("click", (e) => e.stopPropagation());
  });

  // Close dropdowns when clicking outside
  document.addEventListener(
    "click",
    (e) => {
      if (!tooltip.contains(e.target)) {
        tooltip
          .querySelectorAll(".issue-tooltip-dropdown-panel")
          .forEach((p) => {
            p.classList.add("hidden");
          });
      }
    },
    { once: true },
  );
}

// Load status transitions for the dropdown
async function loadStatusOptions(issueKey, listContainer) {
  listContainer.innerHTML =
    '<div class="issue-tooltip-dropdown-loading">Loading...</div>';

  try {
    let transitions;
    if (issueTransitionsCache[issueKey]) {
      transitions = issueTransitionsCache[issueKey];
    } else {
      const result = await window.electronAPI.jiraGetTransitions(
        jiraConfig,
        issueKey,
      );
      if (!result.success) {
        listContainer.innerHTML =
          '<div class="issue-tooltip-dropdown-error">Failed to load</div>';
        return [];
      }
      transitions = result.transitions;
      issueTransitionsCache[issueKey] = transitions;
    }

    renderDropdownOptions(
      listContainer,
      transitions.map((t) => ({ id: t.id, name: t.name })),
      "status",
    );
    return transitions.map((t) => ({ id: t.id, name: t.name }));
  } catch (error) {
    console.error("Failed to load transitions:", error);
    listContainer.innerHTML =
      '<div class="issue-tooltip-dropdown-error">Error loading</div>';
    return [];
  }
}

// Load assignable users for the dropdown
async function loadAssigneeOptions(projectKey, currentId, listContainer) {
  listContainer.innerHTML =
    '<div class="issue-tooltip-dropdown-loading">Loading...</div>';

  try {
    let users;
    if (issueAssigneesCache[projectKey]) {
      users = issueAssigneesCache[projectKey];
    } else {
      const result = await window.electronAPI.jiraGetUsers(
        jiraConfig,
        projectKey,
      );
      if (!result.success) {
        listContainer.innerHTML =
          '<div class="issue-tooltip-dropdown-error">Failed to load</div>';
        return [];
      }
      users = result.users || [];
      issueAssigneesCache[projectKey] = users;
    }

    // Add Unassigned option at the beginning
    const options = [
      { id: "", name: "Unassigned" },
      ...users.map((u) => ({ id: u.accountId, name: u.displayName })),
    ];

    renderDropdownOptions(listContainer, options, "assignee", currentId);
    return options;
  } catch (error) {
    console.error("Failed to load assignees:", error);
    listContainer.innerHTML =
      '<div class="issue-tooltip-dropdown-error">Error loading</div>';
    return [];
  }
}

// Render dropdown options
function renderDropdownOptions(listContainer, options, type, selectedId = "") {
  if (options.length === 0) {
    listContainer.innerHTML =
      '<div class="issue-tooltip-dropdown-empty">No options available</div>';
    return;
  }

  listContainer.innerHTML = options
    .map(
      (opt) => `
    <button class="issue-tooltip-dropdown-option ${opt.id === selectedId ? "selected" : ""}" 
            data-id="${opt.id}" data-name="${opt.name}" data-type="${type}">
      ${type === "status" ? '<span class="option-status-dot"></span>' : ""}
      <span class="option-name">${opt.name}</span>
      ${opt.id === selectedId ? '<span class="option-check">✓</span>' : ""}
    </button>
  `,
    )
    .join("");
}

// Filter dropdown options by search query
function filterDropdownOptions(listContainer, query, allOptions, type) {
  const filtered = query
    ? allOptions.filter((opt) => opt.name.toLowerCase().includes(query))
    : allOptions;

  renderDropdownOptions(listContainer, filtered, type);
}

// Attach click handlers to dropdown options
function attachOptionClickHandlers(dropdown, trigger, panel, issueKey, type) {
  const options = dropdown.querySelectorAll(".issue-tooltip-dropdown-option");

  options.forEach((option) => {
    option.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = option.dataset.id;
      const name = option.dataset.name;

      // Disable all options during operation
      options.forEach((o) => (o.disabled = true));
      option.classList.add("loading");

      try {
        let success = false;
        let errorMsg = "";

        if (type === "status") {
          const result = await window.electronAPI.jiraTransitionIssue(
            jiraConfig,
            issueKey,
            id,
          );
          success = result.success;
          errorMsg = result.error || "Failed to update status";

          if (success) {
            // Update trigger text
            trigger.querySelector(".dropdown-trigger-text").textContent = name;
            trigger.dataset.currentStatus = name;

            // Update link styling and clear cache
            delete issueTransitionsCache[issueKey];
            updateJiraLinkStatusStyling(issueKey, name);
            showNotification(`Status updated to "${name}"`);
          }
        } else if (type === "assignee") {
          const result = await window.electronAPI.jiraAssignIssue(
            jiraConfig,
            issueKey,
            id || null,
          );
          success = result.success;
          errorMsg = result.error || "Failed to update assignee";

          if (success) {
            // Update trigger text
            trigger.querySelector(".dropdown-trigger-text").textContent = name;
            trigger.dataset.currentId = id;
            dropdown.dataset.currentId = id;
            showNotification(`Assignee updated to "${name}"`);
          }
        }

        if (success) {
          panel.classList.add("hidden");
        } else {
          showNotification(errorMsg, true);
        }
      } catch (error) {
        console.error(`Failed to update ${type}:`, error);
        showNotification(`Failed to update ${type}`, true);
      }

      // Re-enable options
      options.forEach((o) => (o.disabled = false));
      option.classList.remove("loading");
    });
  });
}

function positionIssueTooltip(tooltip, x, y) {
  // Position tooltip
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = x + 10;
  let top = y + 10;

  // Adjust if tooltip goes off-screen
  if (left + tooltipRect.width > viewportWidth) {
    left = x - tooltipRect.width - 10;
  }
  if (top + tooltipRect.height > viewportHeight) {
    top = y - tooltipRect.height - 10;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideIssueTooltip(forceClose = false) {
  if (issueTooltip) {
    // Don't hide if in sticky mode unless force close
    if (isTooltipSticky && !forceClose) {
      return;
    }

    issueTooltip.classList.add("hidden");
    issueTooltip.classList.remove("issue-tooltip-sticky");
    currentIssueKey = null;
    isTooltipSticky = false;
  }
}

// Update all jira-issue-link elements with the given issue key to reflect status change
function updateJiraLinkStatusStyling(issueKey, status) {
  const statusLower = status.toLowerCase();

  // Find all links with this issue key in both editor and read view
  const allLinks = [...document.querySelectorAll(".jira-issue-link")];

  // Status-to-class mapping for different visual states
  const statusClasses = {
    resolved: "jira-issue-resolved",
    done: "jira-issue-done",
    closed: "jira-issue-closed",
    "in progress": "jira-issue-in-progress",
    "in review": "jira-issue-in-review",
    testing: "jira-issue-testing",
    blocked: "jira-issue-blocked",
    "to do": "jira-issue-todo",
    open: "jira-issue-open",
    backlog: "jira-issue-backlog",
    "dev complete": "jira-issue-dev-complete",
    validation: "jira-issue-validation",
    "qa testing passed": "jira-issue-qa-passed",
    "qa testing failed": "jira-issue-qa-failed",
  };

  // All possible status classes to remove
  const allStatusClasses = [
    "jira-issue-resolved",
    "jira-issue-done",
    "jira-issue-closed",
    "jira-issue-in-progress",
    "jira-issue-in-review",
    "jira-issue-testing",
    "jira-issue-blocked",
    "jira-issue-todo",
    "jira-issue-open",
    "jira-issue-backlog",
    "jira-issue-dev-complete",
    "jira-issue-validation",
    "jira-issue-qa-passed",
    "jira-issue-qa-failed",
  ];

  for (const link of allLinks) {
    // Check if this link matches the issue key
    const linkText = link.textContent.trim();
    if (linkText === issueKey) {
      // Update the data attribute
      link.dataset.jiraStatus = status;

      // Remove all status classes first
      link.classList.remove(...allStatusClasses);

      // Add the appropriate status class
      const statusClass = statusClasses[statusLower];
      if (statusClass) {
        link.classList.add(statusClass);
      }
    }
  }
}

// Helper function to extract text from ADF (duplicated from main process for frontend use)
function extractADFText(adf) {
  if (!adf || !adf.content) return "";

  let text = "";
  for (const node of adf.content) {
    if (node.type === "paragraph" && node.content) {
      for (const child of node.content) {
        if (child.text) {
          text += child.text + " ";
        }
      }
      text += "\n";
    } else if (node.type === "text" && node.text) {
      text += node.text + " ";
    }
  }
  return text.trim();
}

// Add hover listeners to issue links (use event delegation)
if (noteEditor) {
  noteEditor.addEventListener("mouseover", (e) => {
    const issueLink = e.target.closest(".jira-issue-link");
    if (issueLink) {
      // If Ctrl is held, make it sticky
      const sticky = e.ctrlKey;
      showIssueTooltip(issueLink, e.pageX, e.pageY, sticky);
    }
  });

  noteEditor.addEventListener("mouseout", (e) => {
    const issueLink = e.target.closest(".jira-issue-link");
    if (issueLink) {
      // Check if we're moving to the tooltip itself
      const relatedTarget = e.relatedTarget;
      if (
        issueTooltip &&
        (issueTooltip === relatedTarget || issueTooltip.contains(relatedTarget))
      ) {
        return; // Don't hide if moving to tooltip
      }
      hideIssueTooltip();
    }
  });
}

// Also handle for read view
if (noteReadView) {
  noteReadView.addEventListener("mouseover", (e) => {
    const issueLink = e.target.closest(".jira-issue-link");
    if (issueLink) {
      // If Ctrl is held, make it sticky
      const sticky = e.ctrlKey;
      showIssueTooltip(issueLink, e.pageX, e.pageY, sticky);
    }
  });

  noteReadView.addEventListener("mouseout", (e) => {
    const issueLink = e.target.closest(".jira-issue-link");
    if (issueLink) {
      // Check if we're moving to the tooltip itself
      const relatedTarget = e.relatedTarget;
      if (
        issueTooltip &&
        (issueTooltip === relatedTarget || issueTooltip.contains(relatedTarget))
      ) {
        return; // Don't hide if moving to tooltip
      }
      hideIssueTooltip();
    }
  });
}

// Close sticky tooltip when clicking outside
document.addEventListener("click", (e) => {
  if (isTooltipSticky && issueTooltip) {
    // Check if click is outside the tooltip
    if (
      !issueTooltip.contains(e.target) &&
      !e.target.closest(".jira-issue-link")
    ) {
      hideIssueTooltip(true);
    }
  }
});

// Close sticky tooltip on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isTooltipSticky) {
    hideIssueTooltip(true);
  }
});

// Confirm link issue
if (confirmLinkJiraBtn) {
  confirmLinkJiraBtn.addEventListener("click", () => {
    if (!linkedIssueData) return;

    const issueUrl = `${jiraConfig.serverUrl}/browse/${linkedIssueData.key}`;

    // Insert the link at cursor position
    insertJiraLinkAtCursor(
      linkedIssueData.key,
      issueUrl,
      linkedIssueData.summary,
      linkedIssueData.status,
    );

    showNotification(`Linked ${linkedIssueData.key}`);
    closeLinkJiraModal();
  });
}

// Insert Jira link at cursor (without replacing content)
function insertJiraLinkAtCursor(issueKey, issueUrl, summary, status) {
  if (!noteEditor || !isEditMode) return;

  // Store current scroll position
  const scrollTop = noteEditor.scrollTop;
  const scrollLeft = noteEditor.scrollLeft;

  const link = document.createElement("a");
  link.href = issueUrl;
  link.className = "jira-issue-link";
  link.textContent = `${issueKey}`;
  // Removed title attribute to prevent duplicate tooltips (custom issue tooltip is shown on hover)
  link.target = "_blank";
  link.contentEditable = "false";
  link.dataset.jiraUrl = issueUrl;
  link.dataset.jiraStatus = status || "";

  // Apply status-based styling using the shared function
  if (status) {
    applyJiraLinkStatusClass(link, status);
  }

  // Use saved selection range if available
  if (savedSelectionRange) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedSelectionRange);

    const range = savedSelectionRange;
    range.collapse(false); // Move to end of selection

    // Insert space + link + space
    const spaceBefore = document.createTextNode(" ");
    range.insertNode(spaceBefore);
    range.setStartAfter(spaceBefore);

    range.insertNode(link);
    range.setStartAfter(link);

    const spaceAfter = document.createTextNode(" ");
    range.insertNode(spaceAfter);
    range.setStartAfter(spaceAfter);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    savedSelectionRange = null;

    // Restore scroll position
    noteEditor.scrollTop = scrollTop;
    noteEditor.scrollLeft = scrollLeft;

    // Ensure the link is visible without jumping
    link.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  } else {
    // Fallback: append at end
    const spaceBefore = document.createTextNode(" ");
    noteEditor.appendChild(spaceBefore);
    noteEditor.appendChild(link);
    const spaceAfter = document.createTextNode(" ");
    noteEditor.appendChild(spaceAfter);

    // Restore scroll position for fallback case too
    noteEditor.scrollTop = scrollTop;
    noteEditor.scrollLeft = scrollLeft;
  }

  // Trigger save
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
}

// Open create Jira issue modal
createJiraIssueBtn.addEventListener("click", () => {
  if (!isEditMode) return;

  // Save the current selection range before it's lost
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    savedSelectionRange = selection.getRangeAt(0).cloneRange();
  } else {
    savedSelectionRange = null;
  }

  // Get selected content including images
  const selectionData = getSelectionWithImages();
  selectedText = selectionData.text;
  selectedImages = selectionData.images;

  if (selectedText || selectedImages.length > 0) {
    // Create summary from text (without image placeholders)
    const summaryText = selectedText.replace(/\[Image: [^\]]+\]/g, "").trim();
    jiraSummary.value = summaryText.substring(0, 255); // Jira summary max length

    // Convert HTML to markdown for description
    const markdownDesc = htmlToMarkdown(selectionData.html);
    jiraDescription.value = markdownDesc || selectedText;

    // Show attachment count if any
    if (selectedImages.length > 0) {
      jiraDescription.value += `\n\n---\n📎 ${selectedImages.length} attachment(s) will be attached`;
    }
  }

  // Update attachment preview
  updateAttachmentPreview();

  openJiraIssueModal();
});

// Context menu for creating Jira issue from selected text
noteEditor.addEventListener("contextmenu", (e) => {
  if (!isEditMode) return;

  const selectionData = getSelectionWithImages();

  if (selectionData.text || selectionData.images.length > 0) {
    selectedText = selectionData.text;
    selectedImages = selectionData.images;
    // You can add a custom context menu item here if needed
  }
});

async function openJiraIssueModal() {
  if (!jiraConfig.serverUrl || !jiraConfig.email || !jiraConfig.apiToken) {
    showNotification(
      "Please configure Jira integration in Settings first",
      "error",
    );
    return;
  }

  jiraModalError.classList.add("hidden");
  createJiraIssueModal.classList.remove("hidden");

  // Load projects
  await loadJiraProjects();

  // Set default project if configured
  if (
    jiraConfig.defaultProject &&
    jiraProject.querySelector(`option[value="${jiraConfig.defaultProject}"]`)
  ) {
    jiraProject.value = jiraConfig.defaultProject;
    await loadIssueTypes(jiraConfig.defaultProject);
  }
}

async function loadJiraProjects() {
  jiraProject.innerHTML = '<option value="">Loading projects...</option>';
  if (jiraProjectSearch) jiraProjectSearch.placeholder = "Loading projects...";

  try {
    const result = await window.electronAPI.jiraGetProjects(jiraConfig);

    if (!result.success) {
      throw new Error(result.error || "Failed to load projects");
    }

    jiraProjects = result.projects;

    jiraProject.innerHTML = '<option value="">Select a project</option>';
    const projectItems = [{ value: "", label: "Select a project", icon: "" }];

    jiraProjects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.key;
      option.textContent = `${project.name} (${project.key})`;
      jiraProject.appendChild(option);
      projectItems.push({
        value: project.key,
        label: `${project.name} (${project.key})`,
        icon: "📁",
      });
    });

    // Update searchable dropdown
    if (projectDropdown) {
      projectDropdown.setItems(projectItems);
      if (jiraProjectSearch)
        jiraProjectSearch.placeholder = "Search projects...";
    }
  } catch (error) {
    jiraProject.innerHTML = '<option value="">Error loading projects</option>';
    if (jiraProjectSearch)
      jiraProjectSearch.placeholder = "Error loading projects";
    showJiraModalError("Failed to load projects: " + error.message);
  }
}

async function loadIssueTypes(projectKey) {
  jiraIssueType.innerHTML = '<option value="">Loading...</option>';
  if (jiraIssueTypeSearch) jiraIssueTypeSearch.placeholder = "Loading...";

  try {
    const result = await window.electronAPI.jiraGetProject(
      jiraConfig,
      projectKey,
    );

    if (!result.success) {
      throw new Error(result.error || "Failed to load issue types");
    }

    const project = result.project;
    const issueTypes = project.issueTypes || [];

    jiraIssueType.innerHTML = '<option value="">Select issue type</option>';
    const typeItems = [{ value: "", label: "Select issue type", icon: "" }];

    issueTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.id;
      option.textContent = type.name;
      jiraIssueType.appendChild(option);

      // Map issue type to icon
      let icon = "📋";
      const typeLower = type.name.toLowerCase();
      if (typeLower.includes("bug")) icon = "🐛";
      else if (typeLower.includes("task")) icon = "✅";
      else if (typeLower.includes("story")) icon = "📖";
      else if (typeLower.includes("epic")) icon = "⚡";
      else if (typeLower.includes("improvement")) icon = "💡";
      else if (typeLower.includes("feature")) icon = "🚀";

      typeItems.push({ value: type.id, label: type.name, icon });
    });

    // Update searchable dropdown
    if (issueTypeDropdown) {
      issueTypeDropdown.setItems(typeItems);
      if (jiraIssueTypeSearch)
        jiraIssueTypeSearch.placeholder = "Search issue types...";
    }

    // Load sprints, assignees, and epics for the project in parallel
    await Promise.all([
      loadSprints(projectKey),
      loadJiraUsers(projectKey),
      loadEpics(projectKey),
    ]);
  } catch (error) {
    jiraIssueType.innerHTML = '<option value="">Error loading types</option>';
    showJiraModalError("Failed to load issue types: " + error.message);
  }
}

async function loadJiraUsers(projectKey) {
  if (!projectKey) return;

  jiraAssignee.innerHTML = '<option value="">Loading assignees...</option>';
  if (assigneeDropdown && jiraAssigneeSearch) {
    jiraAssigneeSearch.placeholder = "Loading assignees...";
  }

  try {
    const result = await window.electronAPI.jiraGetUsers(
      jiraConfig,
      projectKey,
    );

    if (!result.success) {
      throw new Error(result.error || "Failed to load users");
    }

    jiraUsers = result.users;

    jiraAssignee.innerHTML = '<option value="">Unassigned</option>';
    const userItems = [{ value: "", label: "Unassigned", icon: "👤" }];

    jiraUsers.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.accountId;
      option.textContent = user.displayName;
      jiraAssignee.appendChild(option);
      userItems.push({
        value: user.accountId,
        label: user.displayName,
        icon: "👤",
      });
    });

    // Update searchable dropdown
    if (assigneeDropdown) {
      assigneeDropdown.setItems(userItems);
      if (jiraAssigneeSearch)
        jiraAssigneeSearch.placeholder = "Search assignees...";
    }
  } catch (error) {
    jiraAssignee.innerHTML = '<option value="">Unassigned</option>';
    if (assigneeDropdown) {
      assigneeDropdown.setItems([
        { value: "", label: "Unassigned", icon: "👤" },
      ]);
    }
    console.error("Failed to load users:", error);
  }
}

async function loadSprints(projectKey) {
  jiraSprint.innerHTML = '<option value="">Loading...</option>';
  if (jiraSprintSearch) jiraSprintSearch.placeholder = "Loading...";

  try {
    const result = await window.electronAPI.jiraGetSprints(
      jiraConfig,
      projectKey,
    );

    jiraSprint.innerHTML = '<option value="">None</option>';
    const sprintItems = [{ value: "", label: "None", icon: "" }];

    if (result.success && result.sprints && result.sprints.length > 0) {
      result.sprints.forEach((sprint) => {
        const option = document.createElement("option");
        option.value = sprint.id;
        option.textContent = sprint.name;
        jiraSprint.appendChild(option);
        sprintItems.push({
          value: sprint.id.toString(),
          label: sprint.name,
          icon: "🏃",
        });
      });
    }

    // Update searchable dropdown
    if (sprintDropdown) {
      sprintDropdown.setItems(sprintItems);
      if (jiraSprintSearch) jiraSprintSearch.placeholder = "Select sprint...";
    }
  } catch (error) {
    jiraSprint.innerHTML = '<option value="">None</option>';
    if (sprintDropdown)
      sprintDropdown.setItems([{ value: "", label: "None", icon: "" }]);
    console.error("Failed to load sprints:", error);
  }
}

async function loadEpics(projectKey) {
  if (!jiraEpic) return;

  jiraEpic.innerHTML = '<option value="">Loading...</option>';
  if (jiraEpicSearch) jiraEpicSearch.placeholder = "Loading...";

  try {
    const result = await window.electronAPI.jiraGetEpics(
      jiraConfig,
      projectKey,
    );
    console.log("Epics result:", result);

    jiraEpic.innerHTML = '<option value="">None</option>';
    const epicItems = [{ value: "", label: "None", icon: "" }];

    if (result.success && result.epics && result.epics.length > 0) {
      result.epics.forEach((epic) => {
        const option = document.createElement("option");
        option.value = epic.key;
        option.textContent = `${epic.key}: ${epic.summary}`;
        jiraEpic.appendChild(option);
        epicItems.push({
          value: epic.key,
          label: `${epic.key}: ${epic.summary}`,
          icon: "⚡",
        });
      });
    } else if (!result.success) {
      console.error("Failed to load epics:", result.error);
    }

    // Update searchable dropdown
    if (epicDropdown) {
      epicDropdown.setItems(epicItems);
      if (jiraEpicSearch)
        jiraEpicSearch.placeholder = "Search or select epic...";
    }
  } catch (error) {
    jiraEpic.innerHTML = '<option value="">None</option>';
    if (epicDropdown)
      epicDropdown.setItems([{ value: "", label: "None", icon: "" }]);
    console.error("Failed to load epics:", error);
  }
}

// Project selection change
jiraProject.addEventListener("change", async (e) => {
  const projectKey = e.target.value;
  if (projectKey) {
    // Reset issue type, sprint, and epic dropdowns
    if (issueTypeDropdown) {
      issueTypeDropdown.reset();
      if (jiraIssueTypeSearch) jiraIssueTypeSearch.value = "";
    }
    if (sprintDropdown) {
      sprintDropdown.reset();
      if (jiraSprintSearch) jiraSprintSearch.value = "";
    }
    if (epicDropdown) {
      epicDropdown.reset();
      if (jiraEpicSearch) jiraEpicSearch.value = "";
    }
    await loadIssueTypes(projectKey);
  } else {
    jiraIssueType.innerHTML = '<option value="">Select project first</option>';
    jiraSprint.innerHTML = '<option value="">None</option>';
    if (jiraEpic) jiraEpic.innerHTML = '<option value="">None</option>';
    if (issueTypeDropdown)
      issueTypeDropdown.setItems([
        { value: "", label: "Select project first", icon: "" },
      ]);
    if (sprintDropdown)
      sprintDropdown.setItems([{ value: "", label: "None", icon: "" }]);
    if (epicDropdown)
      epicDropdown.setItems([{ value: "", label: "None", icon: "" }]);
  }
});

// Issue type selection change - show/hide bug-specific fields
jiraIssueType.addEventListener("change", (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const typeName = selectedOption
    ? selectedOption.textContent.toLowerCase()
    : "";

  if (jiraBugFields) {
    if (typeName.includes("bug")) {
      jiraBugFields.classList.remove("hidden");
    } else {
      jiraBugFields.classList.add("hidden");
    }
  }
});

// Close Jira modal
function closeJiraModal() {
  createJiraIssueModal.classList.add("hidden");
  resetJiraForm();
}

closeJiraModalBtn.addEventListener("click", closeJiraModal);
cancelJiraBtn.addEventListener("click", closeJiraModal);

function resetJiraForm() {
  jiraSummary.value = "";
  jiraDescription.value = "";
  jiraPriority.value = "";
  jiraAssignee.value = "";
  jiraLabels.value = "";
  jiraStoryPoints.value = "";
  insertJiraLink.checked = true;
  jiraModalError.classList.add("hidden");
  selectedText = "";
  selectedImages = [];

  // Reset file input
  if (jiraFileInput) jiraFileInput.value = "";

  // Reset attachment preview
  updateAttachmentPreview();

  // Reset bug-specific fields
  if (jiraBugFields) jiraBugFields.classList.add("hidden");
  if (jiraStepsToReproduce) jiraStepsToReproduce.value = "";
  if (jiraExpectedResult) jiraExpectedResult.value = "";
  if (jiraActualResult) jiraActualResult.value = "";
  if (jiraEnvironment) jiraEnvironment.value = "";

  // Reset searchable dropdowns
  if (jiraProjectSearch) jiraProjectSearch.value = "";
  if (jiraIssueTypeSearch) jiraIssueTypeSearch.value = "";
  if (jiraPrioritySearch) jiraPrioritySearch.value = "";
  if (jiraAssigneeSearch) jiraAssigneeSearch.value = "";
  if (jiraEpicSearch) jiraEpicSearch.value = "";
  if (jiraSprintSearch) jiraSprintSearch.value = "";

  if (projectDropdown) projectDropdown.selectedValue = "";
  if (issueTypeDropdown) issueTypeDropdown.selectedValue = "";
  if (priorityDropdown) priorityDropdown.selectedValue = "";
  if (assigneeDropdown) assigneeDropdown.selectedValue = "";
  if (epicDropdown) epicDropdown.selectedValue = "";
  if (sprintDropdown) sprintDropdown.selectedValue = "";
}

function showJiraModalError(message) {
  jiraModalError.textContent = message;
  jiraModalError.classList.remove("hidden");
  // Scroll to error message
  jiraModalError.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Create Jira issue
confirmJiraBtn.addEventListener("click", async () => {
  const projectKey = jiraProject.value;
  const issueTypeId = jiraIssueType.value;
  const summary = jiraSummary.value.trim();

  if (!projectKey || !issueTypeId || !summary) {
    showJiraModalError(
      "Please fill in all required fields (Project, Issue Type, Summary)",
    );
    return;
  }

  confirmJiraBtn.disabled = true;
  confirmJiraBtn.innerHTML = '<span class="btn-icon">⏳</span> Creating...';
  jiraModalError.classList.add("hidden");

  try {
    const issueData = {
      fields: {
        project: { key: projectKey },
        summary: summary,
        issuetype: { id: issueTypeId },
      },
    };

    // Add optional fields - build description with bug fields if applicable
    let descText = jiraDescription.value.trim();
    descText = descText
      .replace(/\n---\n📎 \d+ image\(s\) will be attached$/, "")
      .trim();

    // Check if this is a bug type and append bug-specific fields to description
    const selectedOption = jiraIssueType.options[jiraIssueType.selectedIndex];
    const typeName = selectedOption
      ? selectedOption.textContent.toLowerCase()
      : "";

    if (typeName.includes("bug")) {
      const stepsText = jiraStepsToReproduce?.value.trim() || "";
      const expectedText = jiraExpectedResult?.value.trim() || "";
      const actualText = jiraActualResult?.value.trim() || "";
      const envText = jiraEnvironment?.value.trim() || "";

      let bugSection = "";

      if (stepsText) {
        bugSection += "\n\n## Steps to Reproduce\n" + stepsText;
      }
      if (expectedText) {
        bugSection += "\n\n## Expected Result\n" + expectedText;
      }
      if (actualText) {
        bugSection += "\n\n## Actual Result\n" + actualText;
      }
      if (envText) {
        bugSection += "\n\n## Environment\n" + envText;
      }

      descText = descText + bugSection;
    }

    if (descText) {
      const adfDescription = markdownToADF(descText);
      if (adfDescription) {
        issueData.fields.description = adfDescription;
      }
    }

    if (jiraPriority.value) {
      issueData.fields.priority = { id: jiraPriority.value };
    }

    if (jiraAssignee.value) {
      issueData.fields.assignee = { accountId: jiraAssignee.value };
    }

    if (jiraLabels.value.trim()) {
      issueData.fields.labels = jiraLabels.value
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l);
    }

    if (jiraStoryPoints.value) {
      // Custom field for story points (may vary by Jira instance)
      issueData.fields.customfield_10016 = parseFloat(jiraStoryPoints.value);
    }

    // Add Epic link if selected (parent field for next-gen, customfield_10014 for classic)
    if (jiraEpic && jiraEpic.value) {
      // Try parent field first (works for next-gen projects)
      issueData.fields.parent = { key: jiraEpic.value };
    }

    const result = await window.electronAPI.jiraCreateIssue(
      jiraConfig,
      issueData,
    );

    if (!result.success) {
      throw new Error(result.error || "Failed to create issue");
    }

    const issueKey = result.issue.key;
    const issueUrl = `${jiraConfig.serverUrl}/browse/${issueKey}`;

    // Fetch issue details to get status
    let issueStatus = "Open"; // Default status
    try {
      const issueDetails = await window.electronAPI.jiraGetIssue(
        jiraConfig,
        issueKey,
      );
      if (issueDetails.success && issueDetails.issue.fields.status) {
        issueStatus = issueDetails.issue.fields.status.name;
      }
    } catch (statusError) {
      console.error("Failed to fetch issue status:", statusError);
    }

    // Upload images as attachments
    if (selectedImages.length > 0) {
      confirmJiraBtn.innerHTML = `<span class="btn-icon">📎</span> Uploading ${selectedImages.length} file(s)...`;
      console.log(
        `[Jira Upload] Starting upload of ${selectedImages.length} files`,
      );
      console.log(`[Jira Upload] selectedImages array:`, selectedImages);

      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
        console.log(`[Jira Upload] Processing file ${i}:`, file);
        try {
          confirmJiraBtn.innerHTML = `<span class="btn-icon">📎</span> Uploading file ${i + 1}/${selectedImages.length}...`;
          console.log(`[Jira Upload] File ${i}: filename=${file.filename}`);
          console.log(`[Jira Upload] File ${i}: data type=${typeof file.data}`);
          console.log(
            `[Jira Upload] File ${i}: data length=${file.data?.length || 0}`,
          );
          console.log(
            `[Jira Upload] File ${i}: data starts with=${file.data?.substring(0, 50)}`,
          );

          if (!file.data || !file.data.startsWith("data:")) {
            console.error(
              `[Jira Upload] Invalid file data for ${file.filename}`,
            );
            continue;
          }

          const uploadResult = await window.electronAPI.jiraUploadAttachment(
            jiraConfig,
            issueKey,
            file.data,
            file.filename,
          );
          console.log(
            `[Jira Upload] Upload result for ${file.filename}:`,
            uploadResult,
          );
          if (!uploadResult.success) {
            console.error(
              `[Jira Upload] Failed to upload ${file.filename}:`,
              uploadResult.error,
            );
          }
        } catch (attachError) {
          console.error(
            `[Jira Upload] Exception uploading file ${file.filename}:`,
            attachError,
          );
        }
      }
    } else {
      console.log(
        `[Jira Upload] No files to upload (selectedImages.length = 0)`,
      );
    }

    // Add to sprint if selected
    if (jiraSprint.value) {
      try {
        await window.electronAPI.jiraAddToSprint(
          jiraConfig,
          jiraSprint.value,
          issueKey,
        );
      } catch (sprintError) {
        console.error("Failed to add issue to sprint:", sprintError);
      }
    }

    // Insert link in note if checked
    if (insertJiraLink.checked && isEditMode) {
      insertJiraLinkInNote(issueKey, issueUrl, summary, issueStatus);
    }

    const attachmentMsg =
      selectedImages.length > 0
        ? ` with ${selectedImages.length} attachment(s)`
        : "";
    showNotification(`Jira issue ${issueKey} created${attachmentMsg}!`);
    closeJiraModal();
  } catch (error) {
    showJiraModalError(error.message || "Failed to create Jira issue");
  } finally {
    confirmJiraBtn.disabled = false;
    confirmJiraBtn.innerHTML = '<span class="btn-icon">✓</span> Create Issue';
  }
});

function insertJiraLinkInNote(issueKey, issueUrl, summary, status) {
  if (!noteEditor || !isEditMode) return;

  // Store current scroll position
  const scrollTop = noteEditor.scrollTop;
  const scrollLeft = noteEditor.scrollLeft;

  const link = document.createElement("a");
  link.href = issueUrl;
  link.className = "jira-issue-link";
  link.textContent = `${issueKey}`;
  // Removed title attribute to prevent duplicate tooltips (custom issue tooltip is shown on hover)
  link.target = "_blank";
  link.contentEditable = "false";
  link.dataset.jiraUrl = issueUrl;
  link.dataset.jiraStatus = status || "";

  // Apply status-based styling using the shared function
  if (status) {
    applyJiraLinkStatusClass(link, status);
  }

  // Use saved selection range if available
  if (savedSelectionRange) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedSelectionRange);

    const range = savedSelectionRange;

    // Insert link BEFORE the selection (don't delete content)
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;

    // Create a new range at the start of selection
    const insertRange = document.createRange();
    insertRange.setStart(startContainer, startOffset);
    insertRange.collapse(true);

    // Insert the link at the beginning
    insertRange.insertNode(link);

    // Add space after link
    const spaceAfter = document.createTextNode(" ");
    link.after(spaceAfter);

    // Move cursor after the space
    const newRange = document.createRange();
    newRange.setStartAfter(spaceAfter);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    savedSelectionRange = null;

    // Restore scroll position
    noteEditor.scrollTop = scrollTop;
    noteEditor.scrollLeft = scrollLeft;

    // Ensure the link is visible without jumping
    link.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  } else {
    // Fallback: append at end of editor content
    const spaceBefore = document.createTextNode(" ");
    noteEditor.appendChild(spaceBefore);
    noteEditor.appendChild(link);
    const spaceAfter = document.createTextNode(" ");
    noteEditor.appendChild(spaceAfter);

    // Restore scroll position for fallback case too
    noteEditor.scrollTop = scrollTop;
    noteEditor.scrollLeft = scrollLeft;
  }

  // Trigger save
  notesSaveStatus.textContent = "Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
}

// Update Jira link statuses when loading a note
async function updateJiraLinkStatuses() {
  const jiraConfig = await window.electronAPI.getJiraConfig();
  if (!jiraConfig.serverUrl || !jiraConfig.email || !jiraConfig.apiToken) {
    return; // Jira not configured
  }

  // Find all Jira links in both editor and read view
  const links = [
    ...noteEditor.querySelectorAll(".jira-issue-link"),
    ...noteReadView.querySelectorAll(".jira-issue-link"),
  ];

  for (const link of links) {
    try {
      // Skip if status already cached and already styled
      if (link.dataset.jiraStatus) {
        // Apply styling based on cached status
        applyJiraLinkStatusClass(link, link.dataset.jiraStatus);
        continue;
      }

      // Extract issue key from link text or href
      const issueKey = link.textContent.trim();
      if (!issueKey) continue;

      // Fetch issue status
      const result = await window.electronAPI.jiraGetIssue(
        jiraConfig,
        issueKey,
      );
      if (result.success && result.issue.fields.status) {
        const status = result.issue.fields.status.name;
        link.dataset.jiraStatus = status;

        // Update title to include status
        const currentTitle = link.title || "";
        if (!currentTitle.includes("Status:")) {
          link.title = currentTitle.replace(
            /\\nClick to open/,
            `\\nStatus: ${status}\\nClick to open`,
          );
        }

        // Apply styling based on status
        applyJiraLinkStatusClass(link, status);
      }
    } catch (error) {
      console.error("Failed to update Jira link status:", error);
    }
  }
}

// Apply the appropriate status class to a jira-issue-link
function applyJiraLinkStatusClass(link, status) {
  const statusLower = status.toLowerCase();

  // All possible status classes to remove
  const allStatusClasses = [
    "jira-issue-resolved",
    "jira-issue-done",
    "jira-issue-closed",
    "jira-issue-in-progress",
    "jira-issue-in-review",
    "jira-issue-testing",
    "jira-issue-blocked",
    "jira-issue-todo",
    "jira-issue-open",
    "jira-issue-backlog",
    "jira-issue-dev-complete",
    "jira-issue-validation",
    "jira-issue-qa-passed",
    "jira-issue-qa-failed",
  ];

  // Status-to-class mapping for different visual states
  const statusClasses = {
    resolved: "jira-issue-resolved",
    done: "jira-issue-done",
    closed: "jira-issue-closed",
    "in progress": "jira-issue-in-progress",
    "in review": "jira-issue-in-review",
    testing: "jira-issue-testing",
    blocked: "jira-issue-blocked",
    "to do": "jira-issue-todo",
    open: "jira-issue-open",
    backlog: "jira-issue-backlog",
    "dev complete": "jira-issue-dev-complete",
    validation: "jira-issue-validation",
    "qa testing passed": "jira-issue-qa-passed",
    "qa testing failed": "jira-issue-qa-failed",
  };

  // Remove all status classes first
  link.classList.remove(...allStatusClasses);

  // Add the appropriate status class
  const statusClass = statusClasses[statusLower];
  if (statusClass) {
    link.classList.add(statusClass);
  }
}

// Handle Jira link clicks - open in external browser
if (noteEditor) {
  noteEditor.addEventListener("click", async (e) => {
    const jiraLink = e.target.closest(".jira-issue-link");
    if (jiraLink) {
      e.preventDefault();
      e.stopPropagation();
      const url = jiraLink.href || jiraLink.dataset.jiraUrl;
      if (url) {
        try {
          await window.electronAPI.openUrl(url);
        } catch (error) {
          console.error("Failed to open Jira link:", error);
        }
      }
    }
  });
}

// Also handle Jira link clicks at document level (works in view mode)
document.addEventListener("click", async (e) => {
  const jiraLink = e.target.closest(".jira-issue-link");
  if (jiraLink) {
    e.preventDefault();
    e.stopPropagation();
    const url = jiraLink.href || jiraLink.dataset.jiraUrl;
    if (url) {
      try {
        await window.electronAPI.openUrl(url);
      } catch (error) {
        console.error("Failed to open Jira link:", error);
      }
    }
  }
});

// Load Jira config on page load
if (jiraServerUrl) {
  loadJiraConfig();
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", init);
