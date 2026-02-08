# Changelog

All notable changes to Work Launcher will be documented in this file.

## [1.0.18] - 2026-02-08

### Changed
- Automated release


### Fixed
- Insert Link button in Notes now works properly (replaced prompt with modal dialog)

## [1.0.17] - 2026-02-07

### Changed
- Automated release


### Added
- Comprehensive README.md with full documentation
- AGENT.md for AI coding assistant guidance

### Improved
- Better documentation for all features
- Clear installation and usage instructions

## [1.0.14] - 2026-02-07

### Fixed
- "What's New" section now correctly displays release notes
- Release notes are now bundled with the app as fallback

## [1.0.13] - 2026-02-07

### Fixed
- Code blocks in notes are now editable and can be typed in
- Code blocks can now be removed with a delete button (hover to see) or Ctrl+Shift+Backspace
- URL launching now works correctly (fixed spawn ENOENT error)
- Code block no longer appears outside the editor when clicking toolbar button

### Improved
- Application list now auto-adjusts height (min 100px, max 500px) to show more apps
- Removed font size dropdown from notes toolbar for cleaner UI

### Removed
- Edge, Notion, and Discord from default app detection (can still be added manually)

## [1.0.12] - 2026-02-06

### Added
- Release notes display in the app update modal
- "What's New" section showing changelog for each version
- Automatic fetching of release notes from GitHub

### Improved
- Update modal now shows detailed release notes before downloading
- Better user experience during software updates

## [1.0.11] - 2026-02-06

### Fixed
- Version bump for publishing

## [1.0.10] - 2026-02-06

### Added
- Initial stable release features
- Auto-launch on Windows startup
- Multiple profile support for different work setups
- Hubstaff integration for time tracking
- Day-based automatic profile switching
- Scheduled launches
- Global keyboard shortcut (Ctrl+Shift+L)
- System tray support with minimize to tray
- Notes feature for quick reminders
- Custom app support with icon extraction
- URL launcher support
- Import/Export settings
- Dark/Light theme toggle
- Launch delay configuration

### Technical
- Electron 28.3.3
- electron-builder for packaging
- GitHub releases for auto-updates
- NSIS and MSI installer support
