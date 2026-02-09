// DOM Elements
const splashScreen = document.getElementById("splashScreen");
const autoLaunchToggle = document.getElementById("autoLaunchToggle");
const startupDialogToggle = document.getElementById("startupDialogToggle");
const minimizeToTrayToggle = document.getElementById("minimizeToTrayToggle");
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
const settingsPanel = document.getElementById("settingsPanel");
const notesPanel = document.getElementById("notesPanel");

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
let currentNotes = [];
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
      const confirmed = await showConfirm(`Remove "${appName}" from the list?`, "Remove App");
      if (confirmed) {
        currentApps = await window.electronAPI.removeApp(appKey);
        renderAppsList(currentApps);
        showNotification("App removed");
      }
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
      const confirmed = await showConfirm(`Delete profile "${profileName}"?`, "Delete Profile");
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

    // Load auto-launch status
    const autoLaunchEnabled = await window.electronAPI.getAutoLaunchStatus();
    autoLaunchToggle.checked = autoLaunchEnabled;

    // Load startup dialog setting
    const showStartupDialog = await window.electronAPI.getShowStartupDialog();
    startupDialogToggle.checked = showStartupDialog;

    // Load minimize to tray setting
    const minimizeToTray = await window.electronAPI.getMinimizeToTray();
    minimizeToTrayToggle.checked = minimizeToTray;

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

    // Initialize app version display
    const appVersion = await window.electronAPI.getAppVersion();
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

// Auto-launch toggle
autoLaunchToggle.addEventListener("change", async (e) => {
  try {
    await window.electronAPI.toggleAutoLaunch(e.target.checked);
    showNotification(e.target.checked ? "Startup enabled" : "Startup disabled");
  } catch (error) {
    console.error("Failed to toggle auto-launch:", error);
    showNotification("Failed to change startup setting", true);
    e.target.checked = !e.target.checked; // Revert
  }
});

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

// Startup dialog toggle
startupDialogToggle.addEventListener("change", async (e) => {
  try {
    await window.electronAPI.toggleShowStartupDialog(e.target.checked);
    showNotification(
      e.target.checked
        ? "Startup dialog enabled"
        : "Startup dialog disabled - Apps will launch automatically",
    );
  } catch (error) {
    console.error("Failed to toggle startup dialog:", error);
    showNotification("Failed to change setting", true);
    e.target.checked = !e.target.checked;
  }
});

// Minimize to tray toggle
minimizeToTrayToggle.addEventListener("change", async (e) => {
  try {
    await window.electronAPI.toggleMinimizeToTray(e.target.checked);
    showNotification(
      e.target.checked
        ? "Minimize to tray enabled"
        : "App will close completely when window closed",
    );
  } catch (error) {
    console.error("Failed to toggle minimize to tray:", error);
    showNotification("Failed to change setting", true);
    e.target.checked = !e.target.checked;
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

  filteredNotes.forEach((note) => {
    const noteItem = document.createElement("div");
    const isSelected = selectedNoteIds.has(note.id);
    noteItem.className = `note-item ${note.id === activeNoteId ? "active" : ""} ${isSelected ? "selected" : ""}`;
    noteItem.dataset.noteId = note.id;

    const preview = stripHtml(note.content).substring(0, 50);
    const date = new Date(note.updatedAt || note.createdAt);
    const dateStr = date.toLocaleDateString();

    noteItem.innerHTML = `
      <input type="checkbox" class="note-item-checkbox" ${isSelected ? "checked" : ""} />
      <div class="note-item-title" title="${(note.title || "Untitled").replace(/"/g, "&quot;")}">${note.title || "Untitled"}</div>
      <div class="note-item-preview" title="${(preview || "No content").replace(/"/g, "&quot;")}">${preview || "No content"}...</div>
      <div class="note-item-date">${dateStr}</div>
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
      if (e.target !== checkbox && note.id !== activeNoteId) {
        saveCurrentNote();
        loadNoteToEditor(note.id);
      }
    });

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

  // Update tab panels
  settingsPanel.classList.toggle("active", tabName === "settings");
  notesPanel.classList.toggle("active", tabName === "notes");
}

settingsTab.addEventListener("click", () => switchTab("settings"));
notesTab.addEventListener("click", () => switchTab("notes"));

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

// Handle keyboard events for better code block deletion
noteEditor.addEventListener("keydown", (e) => {
  // Handle Ctrl+Shift+Backspace to delete entire code block
  if (
    (e.key === "Backspace" || e.key === "Delete") &&
    e.ctrlKey &&
    e.shiftKey
  ) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      let node = selection.getRangeAt(0).startContainer;
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
      }

      // Find if we're inside a code block wrapper
      let currentNode = node;
      while (currentNode && currentNode !== noteEditor) {
        if (
          currentNode.classList &&
          currentNode.classList.contains("code-block-wrapper")
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

          // Move cursor after the image
          range.setStartAfter(img);
          range.setEndAfter(img);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          noteEditor.appendChild(img);
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

// Update zoom level display
function updateZoomDisplay() {
  zoomLevelDisplay.textContent = currentZoom + "%";
  lightboxImage.style.transform = `scale(${currentZoom / 100})`;
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
  updateZoomDisplay();
}

// Function to open image in lightbox
function openImageInLightbox(imgSrc) {
  // Reset zoom when opening
  currentZoom = 100;
  updateZoomDisplay();
  lightboxImage.src = imgSrc;
  imageLightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

// Open lightbox when clicking on an image in the note editor
noteEditor.addEventListener("click", (e) => {
  // Don't open lightbox if clicking on resize handle or while resizing
  if (e.target.classList.contains("img-resize-handle") || isResizing) {
    return;
  }
  if (e.target.tagName === "IMG") {
    e.preventDefault();
    openImageInLightbox(e.target.src);
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
  // Reset zoom
  currentZoom = 100;
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
  }
});

// Wrap images with resize handles
function wrapImagesWithResizeHandles() {
  const images = noteEditor.querySelectorAll("img:not(.wrapped)");
  images.forEach((img) => {
    // Skip if already wrapped
    if (
      img.parentElement &&
      img.parentElement.classList.contains("img-resize-wrapper")
    ) {
      return;
    }

    // Create wrapper
    const wrapper = document.createElement("span");
    wrapper.className = "img-resize-wrapper";
    wrapper.contentEditable = "false";

    // Create resize handle
    const handle = document.createElement("span");
    handle.className = "img-resize-handle";

    // Wrap the image
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(handle);
    img.classList.add("wrapped");

    // Add resize event listeners to handle
    handle.addEventListener("mousedown", startResize);
  });
}

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
  if (!markdown) return "<p>No release notes available.</p>";

  // Remove the version header line (e.g., "## [1.0.18] - 2026-02-08")
  let cleaned = markdown.replace(/^## \[[\d.]+\].*$/gm, "").trim();

  // If empty after removing header, return message
  if (!cleaned) return "<p>No release notes available.</p>";

  return (
    cleaned
      // Convert section headers (### Added, ### Fixed, etc.) to styled badges
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
      .replace(/^# (.+)$/gm, '<h3 class="release-notes-h3">$1</h3>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Code
      .replace(/`(.+?)`/g, "<code>$1</code>")
      // Unordered lists - convert to styled list items
      .replace(/^- (.+)$/gm, '<li class="changelog-item">$1</li>')
      // Wrap consecutive <li> tags in <ul>
      .replace(
        /(<li class="changelog-item">.*<\/li>\n?)+/g,
        '<ul class="changelog-list">$&</ul>',
      )
      // Clean up extra whitespace between elements
      .replace(/\n{2,}/g, "\n")
      // Remove empty lines that become <br>
      .replace(/^\s*$/gm, "")
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

// Initialize on page load
document.addEventListener("DOMContentLoaded", init);
