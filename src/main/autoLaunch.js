const { app } = require("electron");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const TASK_NAME = "WorkLauncherStartup";
const SHORTCUT_NAME = "Work Launcher.lnk"; // For legacy cleanup

/**
 * Get the Windows Startup folder path (for legacy cleanup)
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
 * Enable auto-launch using Windows Task Scheduler with Priority 4 (highest for normal apps)
 * Uses two-step approach: create basic task, then update settings
 * @returns {Promise<void>}
 */
async function enableAutoLaunch() {
  return new Promise((resolve, reject) => {
    try {
      // Prevent enabling auto-launch in development mode
      if (!app.isPackaged) {
        console.warn("Auto-launch can only be enabled in packaged app");
        reject(
          new Error(
            "Auto-launch is only available in the installed version of the app",
          ),
        );
        return;
      }

      const exePath = app.getPath("exe");

      // Step 1: Create basic task with schtasks (works without special permissions)
      try {
        execSync(`schtasks /delete /tn "${TASK_NAME}" /f`, {
          windowsHide: true,
          stdio: "ignore",
        });
      } catch (e) {
        // Task might not exist, ignore error
      }

      execSync(
        `schtasks /create /tn "${TASK_NAME}" /tr "\\"${exePath}\\" --startup" /sc ONLOGON /rl LIMITED /f`,
        {
          windowsHide: true,
        },
      );

      // Step 2: Update task settings for high priority using PowerShell
      // Priority 4 is highest for normal apps, runs before other startup items
      const psCommand = `$task = Get-ScheduledTask -TaskName '${TASK_NAME}' -ErrorAction SilentlyContinue; if ($task) { $task.Settings.Priority = 4; $task.Settings.DisallowStartIfOnBatteries = $false; $task.Settings.StopIfGoingOnBatteries = $false; $task.Settings.StartWhenAvailable = $true; $task.Settings.ExecutionTimeLimit = 'PT0S'; Set-ScheduledTask -InputObject $task }`;

      try {
        execSync(`powershell -ExecutionPolicy Bypass -Command "${psCommand}"`, {
          windowsHide: true,
          stdio: "pipe",
        });
      } catch (e) {
        // Settings update failed, but basic task still works
        console.warn("Could not update task priority settings:", e.message);
      }

      // Also remove any old Startup folder shortcut (migration from old method)
      try {
        const startupFolder = getStartupFolder();
        const shortcutPath = path.join(startupFolder, SHORTCUT_NAME);
        if (fs.existsSync(shortcutPath)) {
          fs.unlinkSync(shortcutPath);
          console.log(
            "Removed old Startup folder shortcut (migrated to Task Scheduler)",
          );
        }
      } catch (e) {
        // Ignore cleanup errors
      }

      console.log("Auto-launch enabled via Task Scheduler (Priority 4)");
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
      // Remove Task Scheduler entry (primary method)
      try {
        execSync(`schtasks /delete /tn "${TASK_NAME}" /f`, {
          windowsHide: true,
          stdio: "ignore",
        });
      } catch (e) {
        // Task might not exist
      }

      // Also clean up old Startup folder shortcut (legacy)
      try {
        const startupFolder = getStartupFolder();
        const shortcutPath = path.join(startupFolder, SHORTCUT_NAME);
        if (fs.existsSync(shortcutPath)) {
          fs.unlinkSync(shortcutPath);
        }
      } catch (e) {}

      // Also clean up old Registry entries (legacy)
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
 * Check if auto-launch is enabled (checks Task Scheduler)
 * @returns {Promise<boolean>}
 */
async function isAutoLaunchEnabled() {
  try {
    // Check if Task Scheduler entry exists
    execSync(`schtasks /query /tn "${TASK_NAME}"`, {
      windowsHide: true,
      stdio: "ignore",
    });
    return true;
  } catch (error) {
    // Task doesn't exist, also check legacy Startup folder shortcut
    try {
      const startupFolder = getStartupFolder();
      const shortcutPath = path.join(startupFolder, SHORTCUT_NAME);
      return fs.existsSync(shortcutPath);
    } catch (e) {
      return false;
    }
  }
}

/**
 * Migrate from old Startup folder shortcut to Task Scheduler
 * This upgrades existing users to the high-priority startup method
 * @returns {Promise<{fixed: boolean, message: string}>}
 */
async function migrateToTaskScheduler() {
  return new Promise((resolve) => {
    try {
      // Only run in packaged app
      if (!app.isPackaged) {
        resolve({ fixed: false, message: "Not packaged app" });
        return;
      }

      const startupFolder = getStartupFolder();
      const shortcutPath = path.join(startupFolder, SHORTCUT_NAME);

      // Check if old Startup folder shortcut exists
      if (!fs.existsSync(shortcutPath)) {
        resolve({ fixed: false, message: "No legacy shortcut to migrate" });
        return;
      }

      console.log(
        "Found legacy Startup folder shortcut, migrating to Task Scheduler...",
      );

      const exePath = app.getPath("exe");

      // Step 1: Create basic task with schtasks
      try {
        execSync(`schtasks /delete /tn "${TASK_NAME}" /f`, {
          windowsHide: true,
          stdio: "ignore",
        });
      } catch (e) {}

      execSync(
        `schtasks /create /tn "${TASK_NAME}" /tr "\\"${exePath}\\" --startup" /sc ONLOGON /rl LIMITED /f`,
        {
          windowsHide: true,
        },
      );

      // Step 2: Update task settings for high priority
      const psCommand = `$task = Get-ScheduledTask -TaskName '${TASK_NAME}' -ErrorAction SilentlyContinue; if ($task) { $task.Settings.Priority = 4; $task.Settings.DisallowStartIfOnBatteries = $false; $task.Settings.StopIfGoingOnBatteries = $false; $task.Settings.StartWhenAvailable = $true; Set-ScheduledTask -InputObject $task }`;

      try {
        execSync(`powershell -ExecutionPolicy Bypass -Command "${psCommand}"`, {
          windowsHide: true,
          stdio: "pipe",
        });
      } catch (e) {
        console.warn("Could not update task priority settings:", e.message);
      }

      // Remove old shortcut
      try {
        fs.unlinkSync(shortcutPath);
      } catch (e) {}

      console.log(
        "Migration complete: Now using Task Scheduler with Priority 4",
      );
      resolve({ fixed: true, message: "Migrated to Task Scheduler" });
    } catch (error) {
      console.error("Error during migration:", error.message);
      resolve({ fixed: false, message: error.message });
    }
  });
}

/**
 * Legacy function name for backwards compatibility
 * @returns {Promise<{fixed: boolean, message: string}>}
 */
async function fixBrokenStartupShortcut() {
  return migrateToTaskScheduler();
}

module.exports = {
  enableAutoLaunch,
  disableAutoLaunch,
  isAutoLaunchEnabled,
  fixBrokenStartupShortcut,
  migrateToTaskScheduler,
};
