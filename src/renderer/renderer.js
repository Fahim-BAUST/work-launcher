// DOM Elements
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

// Notes DOM Elements
const toggleNotesBtn = document.getElementById("toggleNotesBtn");
const notesContainer = document.getElementById("notesContainer");
const notesTextarea = document.getElementById("notesTextarea");
const notesSaveStatus = document.getElementById("notesSaveStatus");
const notesCharCount = document.getElementById("notesCharCount");

// Current apps configuration
let currentApps = {};
let currentAppOrder = [];
let currentTheme = "dark";
let currentProfiles = {};
let activeProfileId = "default";
let editingProfileId = null;
let notesDebounceTimer = null;
let notesExpanded = true;
let draggedItem = null;

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

/**
 * Show notification message
 */
function showNotification(message, isError = false) {
  notificationText.textContent = message;
  notification.classList.remove("hidden", "error");
  if (isError) {
    notification.classList.add("error");
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

    const isCustom = config.isCustom;
    const icon = isCustom ? "📦" : appIcons[key] || "📦";
    const displayName = isCustom
      ? config.customName
      : appDisplayNames[key] || key;

    // Add special note for Hubstaff
    let extraInfo = "";
    if (key === "hubstaff") {
      extraInfo = '<span class="app-note">Timer will auto-start via CLI</span>';
    }

    // Badge type
    const badgeClass = isCustom ? "custom" : "detected";
    const badgeText = isCustom ? "Custom" : "Detected";

    appItem.innerHTML = `
      <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
      <div class="app-order-num">${index + 1}</div>
      <div class="app-info">
        <div class="app-name">${icon} ${displayName} ${extraInfo}</div>
        <div class="app-path">${config.path}</div>
      </div>
      <div class="app-status">
        <span class="status-badge ${badgeClass}">${badgeText}</span>
        ${isCustom ? `<button class="btn-remove" data-app="${key}" title="Remove">🗑️</button>` : ""}
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
      if (
        confirm(`Remove "${currentApps[appKey].customName}" from the list?`)
      ) {
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
    const savedNotes = await window.electronAPI.getNotes();
    notesTextarea.value = savedNotes;
    notesCharCount.textContent = `${savedNotes.length} characters`;

    // Listen for profile changes from tray menu
    window.electronAPI.onProfileChanged(async (profileId) => {
      activeProfileId = profileId;
      currentAppOrder = await window.electronAPI.getAppOrder();
      currentApps = await window.electronAPI.getApps();
      renderAppsList(currentApps);
      renderProfilesList(currentProfiles, activeProfileId);
    });
  } catch (error) {
    console.error("Failed to initialize:", error);
    showNotification("Failed to load settings", true);
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

// Notes toggle expand/collapse
toggleNotesBtn.addEventListener("click", () => {
  notesExpanded = !notesExpanded;
  notesContainer.classList.toggle("collapsed", !notesExpanded);
  toggleNotesBtn.textContent = notesExpanded ? "▼" : "▶";
});

// Notes textarea - auto-save with debounce
notesTextarea.addEventListener("input", () => {
  // Update character count
  notesCharCount.textContent = `${notesTextarea.value.length} characters`;

  // Show saving status
  notesSaveStatus.textContent = "⏳ Saving...";
  notesSaveStatus.classList.add("saving");

  // Debounce save
  clearTimeout(notesDebounceTimer);
  notesDebounceTimer = setTimeout(async () => {
    try {
      await window.electronAPI.saveNotes(notesTextarea.value);
      notesSaveStatus.textContent = "✓ Saved";
      notesSaveStatus.classList.remove("saving");
    } catch (error) {
      console.error("Failed to save notes:", error);
      notesSaveStatus.textContent = "❌ Error saving";
      notesSaveStatus.classList.remove("saving");
    }
  }, 500);
});

// Add App Modal handlers
function openModal() {
  customAppName.value = "";
  customAppPath.value = "";
  addAppModal.classList.remove("hidden");
}

function closeModal() {
  addAppModal.classList.add("hidden");
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

// Initialize on page load
document.addEventListener("DOMContentLoaded", init);
