# Changelog

All notable changes to Work Launcher will be documented in this file.


## [1.0.29] - 2026-02-11

### Added

- **Jira Epic Field**: Link issues to Epics with searchable dropdown
  - Enhance Jira link functionality with status updates and styling for resolved issues

## [1.0.28] - 2026-02-11

### Added

- **Jira Epic Field**: Link issues to Epics with searchable dropdown
  - Loads all epics from selected project
  - Shows epic key and summary
  - Optional field - can be left empty

- **Bug-Specific Fields**: Additional fields when creating Bug issues
  - Steps to Reproduce (textarea with placeholder)
  - Expected Result 
  - Actual Result
  - Environment (optional)
  - Fields automatically show/hide based on issue type
  - All fields included in description when creating issue

- **File Attachments in Jira Modal**: Upload any files as attachments
  - "Attach Files" button to select files from system
  - Supports images, PDFs, Word docs, Excel, text, zip files
  - Preview thumbnails for images, file icons for documents
  - Remove individual attachments before creating issue
  - Attachments section always visible with helpful placeholder

- **Auto-scroll to Errors**: Modal scrolls to error message on validation failure

### Improved

- **Jira Link Insertion**: Issue link now prepends before selected text
  - Previously replaced selected text and images
  - Now inserts link before selection, keeping content intact

- **Jira Links Clickable in View Mode**: Links work in both edit and view modes
  - Added document-level click handler
  - Proper CSS pointer-events

- **Toolbar Button Labels**: More descriptive button names
  - "Create" → "Create Jira Issue"
  - "Link" → "Add Jira Link"

- **Modal Design Refresh**: Cleaner, more compact design
  - Subtle header gradient instead of solid blue
  - Smaller Cancel and Create buttons
  - Reduced padding and spacing
  - Better theme support

### Fixed

- **Epic Loading**: Updated to new Jira JQL API endpoint (`/rest/api/3/search/jql`)
- **Attachment Upload**: Added missing `https` and `http` module imports
- **File Type Support**: Attachment upload now handles any file type, not just images

### Removed

- **Default Project Key**: Removed from Jira settings (project selected in modal instead)

## [1.0.27] - 2026-02-11

### Added

- **Help Section Redesign**: Complete overhaul of the Help tab with professional design
  - Hero section with animated icon and gradient title
  - "What is Work Launcher?" introduction explaining the app's purpose
  - "What Problem Does It Solve?" section highlighting 4 key pain points:
    - ⏰ Wasted Time Every Morning
    - 🔄 Context Switching Chaos
    - 🧠 Mental Load & Forgotten Apps
    - ⚙️ Complex Launch Sequences
  - "Key Features" grid showcasing 6 main features
  - Improved visual design with hover effects, gradients, and better spacing
  - Full theme support (dark and light modes)
- **Image Drag & Drop in Notes**: Images can now be reordered by dragging
  - Click and hold on any image to drag it to a new position
  - Drop on another image to insert before/after
  - Drop in empty space to move to end
  - Visual feedback with dashed outline on drop zones
- **Lightbox Pan/Drag**: Images in fullscreen view are now pannable
  - Click and drag to move the image around at any zoom level
  - Smooth panning with proper offset tracking
  - Cursor changes to grab/grabbing during interaction
  - Reset button now resets both zoom and pan position

### Improved

- **Priority Tag Cursor Positioning**: Tags now have proper spacing to allow cursor placement beside them
  - Smart spacing before tags (only adds if needed)
  - Always adds space after tags for better editing
  - Fixed issue where cursor couldn't be positioned next to tags
- **Lightbox Viewport**: Image viewer now uses full window dimensions
  - Expanded from 90vw/95vh to 100% viewport usage
  - Images fit perfectly at 100% zoom
  - Better space utilization for large images
- **Image Overlay Buttons**: Fixed event handling for better reliability
  - Changed from `onclick` to `addEventListener`
  - Added mousedown event prevention to avoid conflicts
  - Buttons now work consistently in edit mode
- **Image Help Documentation**: Updated to reflect new drag functionality

### Removed

- **Image View Button**: Removed eye icon (👁️) from image overlay
  - Simplified to Copy and Delete buttons only
  - Double-click to view in lightbox still available
  - Removed view option from right-click context menu

### Fixed

- Image overlay buttons now respond properly to clicks in edit mode
- Image dragging no longer interferes with resize handles or overlay buttons
- Priority tags no longer block cursor positioning in notes editor

## [1.0.26] - 2026-02-10


### Fixed

- **PDF Export Enhancements**:
  - Fixed inline priority tags not appearing in exported PDFs (now includes proper styling for all tag types)
  - Fixed text content appearing empty in PDFs (removed problematic inline color styles from dark mode)
  - Hidden image overlay icons (view, copy, delete buttons) in PDF exports
  - Added comprehensive CSS styling for lists, blockquotes, code blocks, and images in PDF
  - Improved text visibility by removing CSS variable references and white/light colors

## [1.0.25] - 2026-02-10


### Added

- **Help Tab**: New comprehensive help section with usage guides
  - Application Launcher usage (Profiles, Adding Apps, Reordering, Quick Launch, Scheduling, Backup)
  - Notes Editor guide (Creating, Editing, Priority Tags, Code Blocks, Quote Blocks, Images)
  - Keyboard shortcuts reference
  - System Tray usage instructions
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
