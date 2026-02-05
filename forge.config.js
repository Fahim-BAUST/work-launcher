const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  packagerConfig: {
    asar: true,
    name: "Work Launcher",
    icon: "./assets/icon",
    executableName: "WorkLauncher",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-wix",
      config: {
        name: "Work Launcher",
        manufacturer: "Work Launcher Team",
        description: "Automatically launch work applications on startup",
        exe: "WorkLauncher",
        ui: {
          chooseDirectory: true,
        },
      },
    },
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "WorkLauncher",
        authors: "Work Launcher Team",
        description: "Automatically launch work applications on startup",
        exe: "WorkLauncher.exe",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "win32"],
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
