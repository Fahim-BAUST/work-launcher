# Changelog

All notable changes to Work Launcher will be documented in this file.

## [1.0.25] - 2026-02-10


### Added

- **Inline Priority Tags**: Add priority tags directly inside note content
  - Available tags: Highest (🔴), High (🟠), Medium (🟡), Low (🟢), Lowest (🔵), Done (✅)
  - Click on a tag to remove it
  - Done tag appears with purple color and strikethrough style
- **Note Reordering**: Drag and drop notes to reorder them in the sidebar
- **Image Overlay Actions**: Hover over images to see action buttons
  - 👁️ View - Open image in lightbox
  - 📋 Copy - Copy image to clipboard
  - 🗑️ Delete - Remove image from note
- **Image Context Menu**: Right-click on images for quick actions (View, Copy, Cut, Delete)
- **Image Keyboard Shortcuts**: Click to select an image, then use:
  - Ctrl+C to copy
  - Ctrl+X to cut
  - Delete/Backspace to remove
- **Double-click** on image to view in lightbox

### Improved

- **Quote Block Enhancement**: Quote button now creates removable blockquotes with delete button
  - Hover to see delete button (✕)
  - Press Enter twice at end of quote to escape to new paragraph
  - Ctrl+Shift+Backspace to delete entire quote block
- **Image Placement**: Clicking below images/quotes/code blocks now properly creates new paragraph
- **Editor Padding**: Added extra padding at bottom of editor for easier editing after block elements

### Fixed

- Image resize wrapper no longer takes full width
- Cursor can now be placed after images at end of notes

## [1.0.24] - 2026-02-10

### Added

- Chrome Profile Selection: Users can now select which Chrome profile to use when launching Google Chrome
- Automatically detects all available Chrome profiles from the system
- Selected profile is saved and persisted across app restarts

## [1.0.23] - 2026-02-09

### Removed

- Startup Settings section has been removed (Run on Windows Startup, Ask Before Launching, Minimize to Tray)

### Improved

- Reorganized settings UI for better workflow
- Launch Settings, Schedule & Automation, and Backup & Restore sections now appear at the bottom before action buttons
- Cleaner and more intuitive settings layout focusing on application management

## [1.0.22] - 2026-02-09

### Fixed
- Image resize functionality in Notes now works correctly after closing and reopening the app
- Event listeners are properly reattached to image resize handles when notes are reloaded

### Improved
- GitHub Actions workflow now publishes releases immediately (not as drafts)
- Better release notes automation with longer wait time and improved error handling
- Release notes from CHANGELOG are automatically filtered and formatted

## [1.0.21] - 2026-02-09

### Changed
- Automated release

### Fixed
- Profile edit button now works correctly
- Profile delete button now works correctly
- App removal confirmation now works correctly
- "Failed to add application" error no longer shown when adding apps successfully

### Improved
- Profile switching is now faster with immediate UI feedback
- Replaced native Windows dialogs with custom styled modals

## [1.0.20] - 2026-02-09

### Added
- Export Notes: Save all your notes to a JSON file for backup
- Import Notes: Import notes from a previously exported JSON file
- Download as PDF: Export the current note as a beautifully formatted PDF document

### Fixed
- Profile edit button now works correctly
- Profile delete button now works correctly
- App removal confirmation now works correctly
- "Failed to add application" error no longer shown when adding apps successfully

### Improved
- Profile switching is now faster with immediate UI feedback
- Replaced native Windows dialogs with custom styled modals

## [1.0.19] - 2026-02-08

### Improved
- "What's New" release notes now display with better formatting
- Changelog categories (Added, Fixed, Changed) shown as colored badges
- Cleaner list display without redundant version headers

## [1.0.18] - 2026-02-08

### Fixed
- Insert Link button in Notes now works properly (replaced prompt with modal dialog)

## [1.0.17] - 2026-02-07

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
