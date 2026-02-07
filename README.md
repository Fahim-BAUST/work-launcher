# Work Launcher 🚀

A powerful Electron desktop application for Windows that automatically launches your work applications on startup. Streamline your workday with one-click app launching, profiles, scheduling, and more.

**Created by [Shiftboolean](https://shiftboolean.com) | Author: Fahim Ashhab**

![Version](https://img.shields.io/github/v/release/Fahim-BAUST/work-launcher)
![Platform](https://img.shields.io/badge/platform-Windows-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Features
- **Auto-Launch Apps** - Launch all your work apps with a single click or automatically on startup
- **Auto-Detection** - Automatically detects 15+ popular applications installed on your system
- **Custom Apps** - Add any executable or URL to your launcher
- **URL Launcher** - Open websites/web apps alongside desktop applications
- **System Tray** - Runs minimized in system tray for quick access

### Organization
- **Multiple Profiles** - Create different profiles for different work setups (e.g., "Development", "Meetings")
- **Day-Based Profiles** - Automatically switch profiles based on the day of the week
- **App Categories** - Apps organized by category (Communication, Development, Browsers, etc.)
- **Drag & Drop Reorder** - Customize the launch order of your apps

### Scheduling & Automation
- **Scheduled Launches** - Set specific times to auto-launch apps
- **Windows Startup Integration** - Optionally run when Windows starts
- **Launch Delay** - Configurable delay between app launches to prevent system overload
- **Global Shortcut** - Launch all apps with `Ctrl+Shift+L`

### Productivity
- **Notes Feature** - Built-in rich text notes with formatting, code blocks, and images
- **Import/Export** - Backup and restore your settings
- **Dark/Light Theme** - Choose your preferred theme

### Auto-Updates
- **Automatic Updates** - Get notified of new versions with release notes
- **What's New** - See changelog before updating

## 📦 Supported Applications

| Category | Applications |
|----------|--------------|
| ⏱️ Time Tracking | Hubstaff (with CLI timer support) |
| 💬 Communication | Slack, Microsoft Teams |
| 💻 Development | Visual Studio, VS Code, PyCharm, Postman, Docker |
| 🌐 Browsers | Chrome, Firefox |
| 🗄️ Database | MongoDB Compass, DBeaver, TablePlus |
| 🎨 Design | Figma |
| 🎵 Media | Spotify |
| 🔗 URLs | Any website or web application |

*Plus support for manually adding any Windows application!*

## 🚀 Installation

### Download Installer (Recommended)

1. Go to [Releases](https://github.com/Fahim-BAUST/work-launcher/releases)
2. Download the latest `Work Launcher Setup x.x.x.exe` or `Work Launcher x.x.x.msi`
3. Run the installer
4. The app will auto-update when new versions are available

### Build from Source

#### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
- Windows 10/11

#### Steps

```bash
# Clone the repository
git clone https://github.com/Fahim-BAUST/work-launcher.git
cd work-launcher

# Install dependencies
npm install

# Run in development mode
npm start

# Build installers
npm run build
```

## 📖 Usage

### First Time Setup

1. **Launch the app** - It will automatically detect installed applications
2. **Toggle apps** - Enable/disable applications you want to launch
3. **Add custom apps** - Click "Add App" or "Add URL" for additional applications
4. **Configure startup** - Enable "Run on Windows Startup" if desired
5. **Save settings** - Click "Save Settings"

### Daily Use

- **Launch All Apps**: Click "Launch All Apps Now" button or use `Ctrl+Shift+L`
- **Quick Launch**: Right-click the tray icon for quick access to individual apps
- **System Tray**: The app minimizes to the system tray for easy access

### Profiles

1. Go to the **Profiles** section
2. Click **Add Profile** to create a new profile
3. Configure which apps are enabled for each profile
4. Switch profiles from the dropdown or tray menu

### Day-Based Automation

1. Enable **Day-Based Profiles** in settings
2. Assign profiles to specific days of the week
3. The app will automatically switch profiles based on the day

### Notes

1. Switch to the **Notes** tab
2. Create notes with rich text formatting
3. Add code blocks with the `</>` button
4. Insert images by pasting or drag & drop

## ⚙️ Configuration

Settings are stored in:
```
%APPDATA%\work-launcher\config.json
```

### Hubstaff Integration

Work Launcher has special integration with Hubstaff:
- Automatically launches the Hubstaff desktop app
- Can start the timer automatically using Hubstaff CLI
- Configure your organization and project in the Hubstaff settings section

## 🛠️ Development

### Project Structure

```
work-launcher/
├── src/
│   ├── main/                # Main process (Node.js)
│   │   ├── main.js          # Entry point, IPC handlers
│   │   ├── appLauncher.js   # App spawning logic
│   │   ├── appPaths.js      # App path detection
│   │   ├── autoLaunch.js    # Windows startup
│   │   └── preload.js       # Context bridge
│   └── renderer/            # Renderer process (Browser)
│       ├── index.html       # UI structure
│       ├── renderer.js      # UI logic
│       └── styles.css       # Styling
├── assets/                  # Icons and images
├── build/                   # Build configuration
├── release/                 # Build output
├── package.json
├── CHANGELOG.md            # Version history
├── AGENT.md                # AI agent documentation
└── README.md
```

### Scripts

```bash
npm start          # Run in development
npm run build      # Build NSIS + MSI installers
npm run build:nsis # Build NSIS installer only
npm run build:msi  # Build MSI installer only
npm run publish    # Build and publish to GitHub releases
```

### Adding New Default Applications

1. Edit `src/main/appPaths.js`:

```javascript
const DEFAULT_APP_PATHS = {
  // Add new app with possible installation paths
  newApp: [
    'C:\\Program Files\\NewApp\\NewApp.exe',
    `${process.env.LOCALAPPDATA}\\NewApp\\NewApp.exe`
  ]
};
```

2. Add display name in `getAppDisplayName()`:

```javascript
const names = {
  newApp: "New Application",
  // ...
};
```

3. Add category in `src/main/main.js` (`categoryMapping`):

```javascript
const categoryMapping = {
  newApp: "development",  // or other category
  // ...
};
```

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 📧 Contact

- **Organization**: Shiftboolean
- **Author**: Fahim Ashhab
- **Email**: f.ashhab@shiftboolean.com

---

Made with ❤️ by [Shiftboolean](https://shiftboolean.com)
