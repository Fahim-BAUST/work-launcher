# Work Launcher 🚀

An Electron desktop application that automatically launches your work applications when your PC starts.

## Features

- **Startup Popup**: Shows a confirmation dialog on Windows startup asking if you want to launch work apps
- **Auto-Detection**: Automatically detects installed applications (Hubstaff, Slack, Visual Studio, VS Code, Chrome)
- **Configurable**: Enable/disable individual apps from the settings UI
- **Windows Startup**: Registers itself to run automatically when Windows starts

## Supported Applications

| App | Description |
|-----|-------------|
| ⏱️ Hubstaff | Time tracking |
| 💬 Slack | Team messaging |
| 💻 Visual Studio | Full IDE |
| 📝 VS Code | Code editor |
| 🌐 Chrome | Web browser |

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup

1. Navigate to the project directory:
   ```bash
   cd "c:\Advance Learning\Desktop application\work-launcher"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm start
   ```

## Building for Production

To create a Windows installer:

```bash
npm run make
```

The installer will be created in the `out/make` folder.

## Usage

### First Run

1. Run the application
2. It will automatically detect installed applications
3. Toggle which apps you want to launch on startup
4. Enable "Run on Windows Startup" to have the app run when your PC boots
5. Click "Save Settings"

### Daily Use

1. When your PC starts, a popup will appear asking if you want to launch your work apps
2. Click "Start Work" to launch all enabled applications
3. Click "Skip" to dismiss without launching

### Access Settings

- During development: Just run `npm start`
- After installation: Run the app with `--settings` flag or right-click the tray icon

## Configuration

Settings are stored in:
```
%APPDATA%\work-launcher\config.json
```

## Note on Hubstaff

The Hubstaff desktop app will be launched, but you'll need to click the "Start" button manually to begin time tracking. The Hubstaff API doesn't support starting the timer programmatically.

## Project Structure

```
work-launcher/
├── src/
│   ├── main/
│   │   ├── main.js         # Main process
│   │   ├── preload.js      # Preload script
│   │   ├── appLauncher.js  # App launching logic
│   │   ├── appPaths.js     # App path detection
│   │   └── autoLaunch.js   # Windows startup config
│   └── renderer/
│       ├── index.html      # Settings UI
│       ├── renderer.js     # UI logic
│       └── styles.css      # Styling
├── assets/
│   └── icon.ico            # App icon (add your own)
├── package.json
├── forge.config.js
└── README.md
```

## Customization

### Adding New Applications

Edit `src/main/appPaths.js` to add new applications:

```javascript
const DEFAULT_APP_PATHS = {
  // Add new app
  newApp: [
    'C:\\Path\\To\\NewApp.exe',
    `${process.env.LOCALAPPDATA}\\NewApp\\NewApp.exe`
  ]
};
```

Then update `getAppDisplayName()` function in the same file.

## License

MIT
