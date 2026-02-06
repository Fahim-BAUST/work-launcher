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
const quitBtn = document.getElementById("quitBtn");
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

// App icons mapping
const appIcons = {
  hubstaff: "⏱️",
  hubstaffCli: "🔧",
  slack: "💬",
  teams: "👥",
  discord: "🎮",
  notion: "📓",
  figma: "🎨",
  postman: "📮",
  docker: "🐳",
  visualStudio: "💻",
  vscode: "📝",
  pycharm: "🐍",
  chrome: "🌐",
  firefox: "🦊",
  edge: "🌊",
  mongodb: "🍃",
  dbeaver: "🗄️",
  tableplus: "📊",
  spotify: "🎵",
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
 * Render the apps list with drag-and-drop support
 */
function renderAppsList(apps) {
  appsList.innerHTML = "";

  const appEntries = getOrderedAppEntries(apps);

  if (appEntries.length === 0) {
    noAppsMessage.style.display = "block";
    return;
  }

  noAppsMessage.style.display = "none";

  appEntries.forEach(([key, config], index) => {
    const appItem = document.createElement("div");
    appItem.className = "app-item";
    appItem.dataset.appKey = key;
    appItem.draggable = true;

    // Check if it's a custom/scanned app or a pre-defined one
    const isCustomOrScanned = config.isCustom || key.startsWith("scanned_");
    const icon = isCustomOrScanned ? "📦" : appIcons[key] || "📦";
    const displayName = config.customName || appDisplayNames[key] || key;

    // Add special note for Hubstaff
    let extraInfo = "";
    if (key === "hubstaff") {
      extraInfo = '<span class="app-note">Timer will auto-start via CLI</span>';
    }

    // Badge type
    const badgeClass = isCustomOrScanned ? "custom" : "detected";
    const badgeText = isCustomOrScanned ? "Custom" : "Detected";

    appItem.innerHTML = `
      <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
      <div class="app-order-num">${index + 1}</div>
      <div class="app-info">
        <div class="app-name">${icon} ${displayName} ${extraInfo}</div>
        <div class="app-path">${config.path}</div>
      </div>
      <div class="app-status">
        <span class="status-badge ${badgeClass}">${badgeText}</span>
        ${isCustomOrScanned ? `<button class="btn-remove" data-app="${key}" title="Remove">🗑️</button>` : ""}
        <label class="switch">
          <input type="checkbox" data-app="${key}" ${config.enabled ? "checked" : ""}>
          <span class="slider"></span>
        </label>
      </div>
    `;

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
      const appKey = e.target.dataset.app;
      const appName =
        currentApps[appKey].customName || appDisplayNames[appKey] || appKey;
      if (confirm(`Remove "${appName}" from the list?`)) {
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
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
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
        <span class="profile-name">${id === activeId ? "✓ " : ""}${profile.name}</span>
        <span class="profile-apps-count">${appCount} apps enabled</span>
      </div>
      <div class="profile-actions">
        ${id !== "default" ? `<button class="btn-icon-sm btn-edit-profile" data-profile-id="${id}" title="Edit">✏️</button>` : ""}
        ${id !== "default" ? `<button class="btn-icon-sm btn-delete-profile" data-profile-id="${id}" title="Delete">🗑️</button>` : ""}
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
      const profileId = e.target.dataset.profileId;
      openEditProfileModal(profileId);
    });
  });

  // Add delete listeners
  document.querySelectorAll(".btn-delete-profile").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const profileId = e.target.dataset.profileId;
      const profileName = currentProfiles[profileId].name;
      if (confirm(`Delete profile "${profileName}"?`)) {
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
  // Save current profile's app states first
  await window.electronAPI.saveProfileApps(activeProfileId);

  // Switch to new profile
  await window.electronAPI.setActiveProfile(profileId);
  activeProfileId = profileId;

  // Reload apps with new profile's settings
  currentApps = await window.electronAPI.getApps();
  renderAppsList(currentApps);
  renderProfilesList(currentProfiles, activeProfileId);

  showNotification(`Switched to "${currentProfiles[profileId].name}" profile`);
}

/**
 * Open the profile modal for creating
 */
function openCreateProfileModal() {
  editingProfileId = null;
  profileModalTitle.textContent = "➕ Create New Profile";
  confirmProfileBtn.textContent = "Create Profile";
  profileNameInput.value = "";
  profileModal.classList.remove("hidden");
}

/**
 * Open the profile modal for editing
 */
function openEditProfileModal(profileId) {
  editingProfileId = profileId;
  profileModalTitle.textContent = "✏️ Edit Profile";
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
    showNotification(
      e.target.checked ? "Startup enabled ✓" : "Startup disabled",
    );
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
    detectAppsBtn.textContent = "🔍 Scanning...";

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
    detectAppsBtn.textContent = "🔍 Re-detect";
  }
});

// Launch now button
launchNowBtn.addEventListener("click", async () => {
  try {
    launchNowBtn.disabled = true;
    launchNowBtn.textContent = "🚀 Launching...";

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
    launchNowBtn.textContent = "🚀 Launch All Apps Now";
  }
});

// Startup dialog toggle
startupDialogToggle.addEventListener("change", async (e) => {
  try {
    await window.electronAPI.toggleShowStartupDialog(e.target.checked);
    showNotification(
      e.target.checked
        ? "Startup dialog enabled ✓"
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
        ? "Minimize to tray enabled ✓"
        : "App will close completely when window closed",
    );
  } catch (error) {
    console.error("Failed to toggle minimize to tray:", error);
    showNotification("Failed to change setting", true);
    e.target.checked = !e.target.checked;
  }
});

// Quit button
quitBtn.addEventListener("click", async () => {
  if (confirm("Are you sure you want to quit Work Launcher completely?")) {
    await window.electronAPI.quitApp();
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
      e.target.checked
        ? "Global shortcut enabled ✓"
        : "Global shortcut disabled",
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
  toggleEditModeBtn.textContent = "✏️ Edit";
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

  notesSaveStatus.textContent = "✓ Saved";
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
    notesSaveStatus.textContent = "✓ Saved";
    notesSaveStatus.classList.remove("saving", "warning");
    renderNotesList();
  } catch (error) {
    console.error("Failed to save note:", error);
    notesSaveStatus.textContent = "❌ Error";
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
  toggleEditModeBtn.textContent = "👁️ Read";
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
    toggleEditModeBtn.textContent = "👁️ Read";
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
    toggleEditModeBtn.textContent = "✏️ Edit";
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

// Note title input - auto-save with debounce
noteTitleInput.addEventListener("input", () => {
  notesSaveStatus.textContent = "⏳ Saving...";
  notesSaveStatus.classList.add("saving");

  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
});

// Note editor - auto-save with debounce
noteEditor.addEventListener("input", () => {
  notesSaveStatus.textContent = "⏳ Saving...";
  notesSaveStatus.classList.add("saving");

  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
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
      notesSaveStatus.textContent = "⏳ Saving...";
      notesSaveStatus.classList.add("saving");
      clearTimeout(notesDebounceTimer);
      notesDebounceTimer = setTimeout(saveCurrentNote, 500);
    });
  });

// Code block button handler
document.getElementById("insertCodeBlockBtn").addEventListener("click", (e) => {
  e.preventDefault();

  const selection = window.getSelection();
  const selectedText = selection.toString() || "// Your code here";

  // Create code block element
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.textContent = selectedText;
  pre.appendChild(code);

  // Insert at cursor position
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(pre);

    // Move cursor after the code block
    range.setStartAfter(pre);
    range.setEndAfter(pre);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    noteEditor.appendChild(pre);
  }

  noteEditor.focus();

  // Trigger save
  notesSaveStatus.textContent = "⏳ Saving...";
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
  notesSaveStatus.textContent = "⏳ Saving...";
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
  notesSaveStatus.textContent = "⏳ Saving...";
  notesSaveStatus.classList.add("saving");
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(saveCurrentNote, 500);
});

// Font size select handler
document.getElementById("fontSizeSelect").addEventListener("change", (e) => {
  const size = e.target.value;
  if (size) {
    document.execCommand("fontSize", false, size);
    noteEditor.focus();

    // Trigger save
    notesSaveStatus.textContent = "⏳ Saving...";
    notesSaveStatus.classList.add("saving");
    clearTimeout(notesDebounceTimer);
    notesDebounceTimer = setTimeout(saveCurrentNote, 500);
  }
  e.target.value = ""; // Reset select
});

// Insert link handler
document
  .getElementById("insertLinkBtn")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    const selection = window.getSelection();
    const selectedText = selection.toString() || "";

    // Simple prompt for URL (could be replaced with a modal)
    const url = prompt("Enter URL:", "https://");
    if (url && url !== "https://") {
      if (selectedText) {
        document.execCommand("createLink", false, url);
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.textContent = url;
        link.target = "_blank";

        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.insertNode(link);
          range.setStartAfter(link);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }

      noteEditor.focus();

      // Trigger save
      notesSaveStatus.textContent = "⏳ Saving...";
      notesSaveStatus.classList.add("saving");
      clearTimeout(notesDebounceTimer);
      notesDebounceTimer = setTimeout(saveCurrentNote, 500);
    }
  });

// Insert horizontal rule handler
document.getElementById("insertHrBtn").addEventListener("click", (e) => {
  e.preventDefault();
  document.execCommand("insertHorizontalRule", false, null);
  noteEditor.focus();

  // Trigger save
  notesSaveStatus.textContent = "⏳ Saving...";
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
  notesSaveStatus.textContent = "⏳ Saving...";
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
        notesSaveStatus.textContent = "⏳ Saving...";
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
  notesSaveStatus.textContent = "⏳ Saving...";
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

// App icons mapping
const APP_ICONS = {
  hubstaff: "⏱️",
  hubstaffCli: "⌨️",
  slack: "💬",
  teams: "👥",
  discord: "🎮",
  notion: "📝",
  figma: "🎨",
  postman: "📮",
  docker: "🐳",
  visualStudio: "💻",
  vscode: "📘",
  pycharm: "🐍",
  chrome: "🌐",
  firefox: "🦊",
  edge: "🌊",
  mongodb: "🍃",
  dbeaver: "🦫",
  tableplus: "📊",
  spotify: "🎵",
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
    const icon = APP_ICONS[key] || "📦";
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

  // Load available apps
  await loadAvailableApps();

  addAppModal.classList.remove("hidden");
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
      currentApps[selectedInstalledApp.key] = {
        path: selectedInstalledApp.path,
        enabled: true,
        isCustom: isScanned,
        customName: selectedInstalledApp.displayName,
      };
      await window.electronAPI.saveApps(currentApps);
      renderAppsList(currentApps);
      closeModal();
      showNotification(
        `Added "${selectedInstalledApp.displayName}" successfully!`,
      );
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
    showNotification("Settings saved ✓");
  } catch (error) {
    console.error("Failed to save settings:", error);
    showNotification("Failed to save settings", true);
  }
});

// ============================================
// Update Handling
// ============================================

/**
 * Setup update event listeners
 */
function setupUpdateListeners() {
  // Listen for update available
  window.electronAPI.onUpdateAvailable((info) => {
    updateIcon.textContent = "🎉";
    updateStatusText.textContent = `New version available!`;
    newVersionBadge.classList.remove("hidden");
    newVersionNumber.textContent = `v${info.version}`;
    updateProgressContainer.classList.add("hidden");
    checkUpdateBtn.classList.add("hidden");
    downloadUpdateBtn.classList.remove("hidden");
    downloadUpdateBtn.disabled = false;
    downloadUpdateBtn.textContent = "⬇️ Download Update";
    installUpdateBtn.classList.add("hidden");

    // Show notification dot on update button
    updateDot.classList.remove("hidden");

    // Auto-open the modal
    updateModal.classList.remove("hidden");
  });

  // Listen for no update available
  window.electronAPI.onUpdateNotAvailable(() => {
    updateIcon.textContent = "✅";
    updateStatusText.textContent = "You're up to date!";
    newVersionBadge.classList.add("hidden");
    updateProgressContainer.classList.add("hidden");
    checkUpdateBtn.classList.remove("hidden");
    checkUpdateBtn.disabled = false;
    checkUpdateBtn.textContent = "🔍 Check for Updates";
    downloadUpdateBtn.classList.add("hidden");
    installUpdateBtn.classList.add("hidden");

    // Hide notification dot
    updateDot.classList.add("hidden");
  });

  // Listen for download progress
  window.electronAPI.onUpdateProgress((percent) => {
    const roundedPercent = Math.round(percent);
    updateIcon.textContent = "⬇️";
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
    updateIcon.textContent = "🚀";
    updateStatusText.textContent = "Update ready to install!";
    updateProgressContainer.classList.add("hidden");
    updateProgressBar.style.width = "100%";
    checkUpdateBtn.classList.add("hidden");
    downloadUpdateBtn.classList.add("hidden");
    installUpdateBtn.classList.remove("hidden");
    installUpdateBtn.disabled = false;
    installUpdateBtn.textContent = "🔄 Install & Restart";
  });

  // Listen for update error
  window.electronAPI.onUpdateError((message) => {
    updateIcon.textContent = "❌";
    updateStatusText.textContent = `Error: ${message}`;
    updateProgressContainer.classList.add("hidden");
    newVersionBadge.classList.add("hidden");
    checkUpdateBtn.classList.remove("hidden");
    checkUpdateBtn.disabled = false;
    checkUpdateBtn.textContent = "🔍 Check for Updates";
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
  checkUpdateBtn.textContent = "⏳ Checking...";
  updateIcon.textContent = "🔍";
  updateStatusText.textContent = "Checking for updates...";
  updateProgressContainer.classList.add("hidden");
  newVersionBadge.classList.add("hidden");

  try {
    await window.electronAPI.checkForUpdates();
  } catch (error) {
    updateIcon.textContent = "❌";
    updateStatusText.textContent = `Error: ${error.message}`;
    checkUpdateBtn.disabled = false;
    checkUpdateBtn.textContent = "🔍 Check for Updates";
  }
});

// Download update button
downloadUpdateBtn.addEventListener("click", async () => {
  downloadUpdateBtn.disabled = true;
  downloadUpdateBtn.textContent = "⏳ Starting...";
  updateIcon.textContent = "⬇️";
  updateStatusText.textContent = "Starting download...";
  updateProgressContainer.classList.remove("hidden");
  updatePercentage.textContent = "0%";
  updateProgressBar.style.width = "0%";

  try {
    await window.electronAPI.downloadUpdate();
  } catch (error) {
    updateIcon.textContent = "❌";
    updateStatusText.textContent = `Error: ${error.message}`;
    downloadUpdateBtn.disabled = false;
    downloadUpdateBtn.textContent = "⬇️ Download Update";
    downloadUpdateBtn.classList.remove("hidden");
  }
});

// Install update button
installUpdateBtn.addEventListener("click", async () => {
  installUpdateBtn.disabled = true;
  installUpdateBtn.textContent = "⏳ Installing...";
  updateIcon.textContent = "🔄";
  updateStatusText.textContent = "Installing and restarting...";

  await window.electronAPI.installUpdate();
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", init);
