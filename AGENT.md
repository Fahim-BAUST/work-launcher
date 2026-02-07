# Agent Guide for Work Launcher

This document helps AI coding agents understand and work with the Work Launcher project effectively.

## Project Overview

**Work Launcher** is an Electron desktop application for Windows that automatically launches configured applications on startup. It's designed for developers and professionals who need to start their workday with multiple apps.

- **Author**: Fahim Ashhab (Shiftboolean)
- **Repository**: `Fahim-BAUST/work-launcher`
- **Platform**: Windows only
- **Framework**: Electron 28.x

## Technology Stack

- **Runtime**: Electron 28.3.3
- **Package Manager**: npm
- **Builder**: electron-builder 26.7.0
- **Auto-updates**: electron-updater (GitHub releases)
- **Storage**: electron-store (persistent JSON config)
- **Installer Types**: NSIS (.exe) and MSI

## Project Structure

```
work-launcher/
├── src/
│   ├── main/           # Main process (Node.js)
│   │   ├── main.js     # Entry point, IPC handlers, auto-updater
│   │   ├── appLauncher.js   # App spawning logic
│   │   ├── appPaths.js      # Default app paths, detection
│   │   ├── autoLaunch.js    # Windows startup registration
│   │   └── preload.js       # Context bridge for renderer
│   └── renderer/       # Renderer process (Browser)
│       ├── index.html  # Main UI structure
│       ├── renderer.js # UI logic, event handlers
│       └── styles.css  # All styling
├── assets/             # Icons and images
├── build/              # Build configuration (installer.nsh)
├── release/            # Build output directory
├── package.json        # Dependencies and build config
├── CHANGELOG.md        # Version history (shown in app)
└── .env                # GitHub token for publishing (GH_TOKEN)
```

## Key Files

### `src/main/main.js`
- Application entry point
- All IPC handlers (`ipcMain.handle`)
- Auto-updater configuration
- System tray setup
- Global shortcuts
- Scheduled launches

### `src/main/appPaths.js`
- `DEFAULT_APP_PATHS`: Object with app names and their possible installation paths
- `findExecutable()`: Locates installed apps
- `getAppDisplayName()`: Human-readable app names
- `detectInstalledApps()`: Scans for installed applications

### `src/main/appLauncher.js`
- `launchApp()`: Spawns a single application
- `launchMultipleApps()`: Launches multiple apps with delay
- Handles Hubstaff special integration

### `src/renderer/renderer.js`
- All UI event handlers
- Notes feature with rich text editor
- Profile management
- Settings persistence

### `src/renderer/styles.css`
- Complete styling (2800+ lines)
- Dark theme (default) and light theme
- CSS variables for theming

## Common Tasks

### Adding a New Default App
1. Add paths to `DEFAULT_APP_PATHS` in `src/main/appPaths.js`
2. Add display name in `getAppDisplayName()` function
3. Add category mapping in `src/main/main.js` (`categoryMapping` object)

### Removing a Default App
1. Remove from `DEFAULT_APP_PATHS` in `src/main/appPaths.js`
2. Remove from `getAppDisplayName()` (optional, keeps manual add working)

### Modifying UI
- HTML structure: `src/renderer/index.html`
- Styling: `src/renderer/styles.css`
- Behavior: `src/renderer/renderer.js`

### Adding IPC Communication
1. Add handler in `src/main/main.js`: `ipcMain.handle('channel-name', async (event, args) => {...})`
2. Expose in `src/main/preload.js`: `channelName: (...args) => ipcRenderer.invoke('channel-name', ...args)`
3. Call from renderer: `await window.electronAPI.channelName(args)`

## Build & Publish Commands

```bash
# Development
npm start                 # Run in development mode

# Build (local only)
npm run build            # Build NSIS + MSI installers
npm run build:nsis       # Build NSIS only
npm run build:msi        # Build MSI only

# Publish to GitHub Releases (requires GH_TOKEN in .env)
npm run publish          # Build and publish to GitHub
npm run release          # Same as publish
```

## Version Bumping & Release

1. Update version in `package.json`
2. Add changelog entry in `CHANGELOG.md` (format: `## [x.x.x] - YYYY-MM-DD`)
3. Run `npm run publish`

The changelog is displayed in the app's "What's New" section.

## Important Patterns

### URL vs Executable Apps
Apps can be either executables or URLs. Always check `config.isUrl`:
```javascript
if (config.isUrl) {
  await shell.openExternal(config.path);  // Opens in browser
} else {
  await launchApp(config.path, config.args);  // Spawns process
}
```

### Storing Data
Use electron-store (already initialized as `store`):
```javascript
store.get('key', defaultValue);
store.set('key', value);
```

### Triggering Save in Notes
After any note modification:
```javascript
notesSaveStatus.textContent = "Saving...";
notesSaveStatus.classList.add("saving");
clearTimeout(notesDebounceTimer);
notesDebounceTimer = setTimeout(saveCurrentNote, 500);
```

## CSS Theming

CSS variables are defined in `:root` (dark theme) and `body.light-theme`:
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`: Background colors
- `--text-color`, `--text-muted`: Text colors
- `--accent-primary`, `--accent-secondary`: Accent colors
- `--glass-bg`, `--glass-border`: Glassmorphism effects

## Things to Watch Out For

1. **URL Launching**: URLs must use `shell.openExternal()`, not `spawn()`
2. **Content Editable**: Code blocks in notes need careful `contentEditable` handling
3. **App Detection**: Windows paths vary by user; use environment variables like `%LOCALAPPDATA%`
4. **Auto-updater**: Only works with signed/published builds, not in development
5. **Hubstaff**: Has special handling with CLI for timer start
6. **CHANGELOG.md**: Must follow exact format for in-app display

## Testing Checklist

Before publishing:
- [ ] App launches correctly (`npm start`)
- [ ] Apps can be detected and added
- [ ] URLs open in browser (not spawn error)
- [ ] Notes save and load correctly
- [ ] Code blocks are editable and deletable
- [ ] Profiles work
- [ ] Theme toggle works
- [ ] System tray works

## Environment Variables

Create `.env` file in root:
```
GH_TOKEN=your_github_personal_access_token
```

Token needs `repo` scope for publishing releases.
