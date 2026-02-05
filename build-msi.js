const createMsi = require("electron-winstaller");
const path = require("path");

async function build() {
  try {
    console.log("Creating MSI installer...");

    await createMsi.createWindowsInstaller({
      appDirectory: path.join(__dirname, "out", "Work Launcher-win32-x64"),
      outputDirectory: path.join(__dirname, "out", "msi"),
      authors: "Work Launcher Team",
      exe: "Work Launcher.exe",
      name: "WorkLauncher",
      title: "Work Launcher",
      description: "Automatically launch work applications on startup",
      version: "1.0.0",
      noMsi: false,
      setupExe: "Work LauncherSetup.exe",
      setupMsi: "Work LauncherSetup.msi",
      // Icon for installer
      iconUrl:
        "file://" +
        path.join(__dirname, "assets", "icon.ico").replace(/\\/g, "/"),
      setupIcon: path.join(__dirname, "assets", "icon.ico"),
      // Shortcut options
      shortcutLocations: ["Desktop", "StartMenu"],
    });

    console.log("MSI installer created successfully!");
    console.log("Output: out/msi/");
  } catch (e) {
    console.error("Error creating MSI:", e);
    process.exit(1);
  }
}

build();
