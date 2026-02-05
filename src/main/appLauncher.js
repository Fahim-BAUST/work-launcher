const { spawn } = require("child_process");
const path = require("path");

/**
 * Launch a single application
 * @param {string} exePath - Path to the executable
 * @param {string[]} args - Command line arguments
 * @returns {Promise<number>} - Process ID of launched app
 */
function launchApp(exePath, args = []) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Launching: ${exePath}`);

      const child = spawn(exePath, args, {
        detached: true,
        stdio: "ignore",
        windowsHide: false,
      });

      child.unref();

      child.on("error", (error) => {
        console.error(`Failed to launch ${exePath}:`, error.message);
        reject(error);
      });

      // Give a small delay to ensure process started
      setTimeout(() => {
        resolve(child.pid);
      }, 500);
    } catch (error) {
      console.error(`Error launching ${exePath}:`, error.message);
      reject(error);
    }
  });
}

/**
 * Launch multiple applications
 * @param {Object} apps - Object with app configurations { appName: { path, enabled } }
 * @param {number} delay - Delay between launches in milliseconds (default: 1000)
 * @returns {Promise<Object>} - Results of launch attempts
 */
async function launchMultipleApps(apps, delay = 1000) {
  const results = {
    success: [],
    failed: [],
  };

  for (const [appName, config] of Object.entries(apps)) {
    if (!config.enabled) {
      console.log(`Skipping disabled app: ${appName}`);
      continue;
    }

    try {
      const pid = await launchApp(config.path, config.args || []);
      results.success.push({
        name: appName,
        path: config.path,
        pid: pid,
      });
      console.log(`Successfully launched ${appName} (PID: ${pid})`);

      // Configurable delay between launches to prevent system overload
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      results.failed.push({
        name: appName,
        path: config.path,
        error: error.message,
      });
    }
  }

  return results;
}

/**
 * Launch Hubstaff with time tracking consideration
 * Uses HubstaffCLI.exe to start the timer automatically
 * @param {string} hubstaffPath - Path to Hubstaff executable
 * @param {string} cliPath - Path to HubstaffCLI.exe
 * @returns {Promise<Object>} - Launch result
 */
async function launchHubstaff(hubstaffPath, cliPath) {
  const result = {
    appLaunched: false,
    timerStarted: false,
    error: null,
  };

  // First launch the Hubstaff client app
  try {
    await launchApp(hubstaffPath, []);
    result.appLaunched = true;
    console.log("Hubstaff client launched");

    // Wait for Hubstaff to start
    await new Promise((resolve) => setTimeout(resolve, 3000));
  } catch (error) {
    result.error = `Failed to launch Hubstaff: ${error.message}`;
    return result;
  }

  // Then try to start the timer using CLI
  if (cliPath) {
    try {
      await startHubstaffTimer(cliPath);
      result.timerStarted = true;
      console.log("Hubstaff timer started via CLI");
    } catch (error) {
      console.log("Could not auto-start timer:", error.message);
      // Not a critical error - app is still launched
    }
  }

  return result;
}

/**
 * Start Hubstaff timer using CLI
 * @param {string} cliPath - Path to HubstaffCLI.exe
 * @returns {Promise<void>}
 */
async function startHubstaffTimer(cliPath) {
  const { execFile } = require("child_process");
  const util = require("util");
  const execFilePromise = util.promisify(execFile);

  try {
    // Try to resume last task/project with --autostart flag
    console.log("Attempting to resume Hubstaff tracking...");
    const resumeResult = await execFilePromise(cliPath, [
      "resume",
      "--autostart",
    ]);
    const resumeJson = extractJson(resumeResult.stdout);

    if (resumeJson && !resumeJson.error) {
      console.log("Resumed Hubstaff tracking successfully");
      return;
    }

    // If resume returned an error, check status
    console.log("Resume result:", resumeJson);
  } catch (error) {
    // Check if we got JSON output in stderr or stdout
    const output = error.stdout || error.stderr || "";
    const jsonData = extractJson(output);

    if (jsonData && jsonData.tracking) {
      console.log("Hubstaff is already tracking");
      return;
    }

    console.log("Hubstaff resume command failed:", error.message);
    throw error;
  }
}

/**
 * Extract JSON from CLI output that may contain debug logs
 * @param {string} output - Raw CLI output
 * @returns {Object|null} - Parsed JSON or null
 */
function extractJson(output) {
  if (!output) return null;

  // Try to find JSON in the output (starts with { or [)
  const lines = output.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        // Continue searching
      }
    }
  }

  // Try parsing the entire output
  try {
    return JSON.parse(output);
  } catch (e) {
    return null;
  }
}

/**
 * Get Hubstaff organizations using CLI
 * @param {string} cliPath - Path to HubstaffCLI.exe
 * @returns {Promise<Array>}
 */
async function getHubstaffOrganizations(cliPath) {
  const { execFile } = require("child_process");
  const util = require("util");
  const execFilePromise = util.promisify(execFile);

  try {
    const result = await execFilePromise(cliPath, [
      "organizations",
      "--autostart",
    ]);
    const jsonData = extractJson(result.stdout);
    return jsonData || [];
  } catch (error) {
    console.error("Failed to get organizations:", error.message);
    const jsonData = extractJson(error.stdout || error.stderr);
    return jsonData || [];
  }
}

/**
 * Get Hubstaff projects using CLI
 * @param {string} cliPath - Path to HubstaffCLI.exe
 * @param {string} orgId - Organization ID
 * @returns {Promise<Array>}
 */
async function getHubstaffProjects(cliPath, orgId) {
  const { execFile } = require("child_process");
  const util = require("util");
  const execFilePromise = util.promisify(execFile);

  try {
    const result = await execFilePromise(cliPath, [
      "projects",
      orgId,
      "--autostart",
    ]);
    const jsonData = extractJson(result.stdout);
    return jsonData || [];
  } catch (error) {
    console.error("Failed to get projects:", error.message);
    const jsonData = extractJson(error.stdout || error.stderr);
    return jsonData || [];
  }
}

/**
 * Start Hubstaff timer for a specific project
 * @param {string} cliPath - Path to HubstaffCLI.exe
 * @param {string} projectId - Project ID to start tracking
 * @returns {Promise<boolean>}
 */
async function startHubstaffProject(cliPath, projectId) {
  const { execFile } = require("child_process");
  const util = require("util");
  const execFilePromise = util.promisify(execFile);

  try {
    const result = await execFilePromise(cliPath, [
      "start_project",
      projectId,
      "--autostart",
    ]);
    const jsonData = extractJson(result.stdout);
    console.log(`Started tracking project: ${projectId}`, jsonData);
    return true;
  } catch (error) {
    console.error("Failed to start project:", error.message);
    // Check if it actually succeeded despite exit code
    const jsonData = extractJson(error.stdout || error.stderr);
    if (jsonData && !jsonData.error) {
      console.log("Project started despite error:", jsonData);
      return true;
    }
    return false;
  }
}

module.exports = {
  launchApp,
  launchMultipleApps,
  launchHubstaff,
  startHubstaffTimer,
  getHubstaffOrganizations,
  getHubstaffProjects,
  startHubstaffProject,
};
