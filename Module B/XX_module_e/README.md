# Photos Slideshow

A feature-rich photo slideshow application with multiple themes, playback modes, and a command bar interface.

## Features

### Loading Photos
- **Drag & Drop**: Drag photo files directly into the drop area
- **File Selection**: Click "Select Files" button to choose photos
- **Sample Photos**: Load pre-configured sample photos for testing
- **Duplicate Detection**: Automatically detects and removes duplicate images

### Playback Modes
1. **Manual Mode**: Navigate with left/right arrow keys
2. **Auto-Playing Mode**: Photos advance automatically at configured intervals (loops back to first)
3. **Random Mode**: Random photo selection, plays indefinitely

### Themes
- **Theme A**: Direct display, no effects
- **Theme B**: Left-to-right slide animation with delayed caption
- **Theme C**: Bottom-to-top animation with word-by-word caption animation
- **Theme D**: 3D flip with zoom effect and floating animation

### Configuration Panel
- Operating mode selection
- Theme switching
- Slide duration (1-30 seconds)
- Transition speed adjustment
- Dark/Light mode toggle
- Photo management (reorder, edit captions, remove)
- Shuffle button

### Command Bar
Open with `Ctrl+K` or `/` key. Navigate with up/down arrows, execute with Enter, close with Escape.

Available commands:
- Change operating modes
- Switch themes
- Toggle dark/light mode
- Shuffle photos
- Play/Pause slideshow

### Additional Features
- **Fullscreen Mode**: Click the fullscreen button to hide browser UI
- **Custom Captions**: Click on captions in the config panel to edit
- **Drag & Drop Reordering**: Drag photos in the config panel to reorder
- **Settings Persistence**: All preferences saved to localStorage

## Project Structure

```
XX_module_e/
├── index.html              # Main HTML file
├── README.md               # This file
├── css/
│   ├── base.css           # Core styles and CSS variables
│   ├── command-bar.css    # Command bar styles
│   ├── config-panel.css   # Configuration panel styles
│   ├── drop-area.css      # Drop zone styles
│   └── themes/
│       ├── theme-a.css    # Theme A - No effects
│       ├── theme-b.css    # Theme B - Left to right
│       ├── theme-c.css    # Theme C - Bottom to top
│       └── theme-d.css    # Theme D - 3D flip
├── js/
│   ├── utils.js           # Utility functions
│   ├── storage.js         # LocalStorage management
│   ├── photos.js          # Photo management
│   ├── slideshow.js       # Slideshow controller
│   ├── themes.js          # Theme management
│   ├── command-bar.js     # Command bar functionality
│   └── app.js             # Main application entry
├── sample-photos/         # Sample photos for testing
│   ├── basilique-notre-dame-de-fourviere-lyon.jpg
│   ├── beautiful-view-in-lyon.jpg
│   ├── place-bellecour-lyon.jpg
│   └── tour-metalique-lyon.jpg
└── icons/                 # SVG icons
```

## How to Run

1. Open `index.html` in a modern web browser (Chrome or Firefox recommended)
2. Or serve with a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. Access at `http://localhost:8000`

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+K` or `/` | Open command bar |
| `Escape` | Close command bar |
| `Arrow Left` | Previous slide |
| `Arrow Right` | Next slide |
| `Space` | Toggle play/pause |
| `Arrow Up/Down` | Navigate command options |
| `Enter` | Execute selected command |

## Browser Support

- Google Chrome (recommended)
- Firefox Developer Edition
- Microsoft Edge
- Safari

## Technical Notes

- Uses CSS custom properties (variables) for theming
- CSS animations for smooth slide transitions
- FileReader API for image loading
- Crypto API for duplicate detection (SHA-256 hash)
- localStorage for settings persistence
- No external dependencies - pure HTML, CSS, and JavaScript
