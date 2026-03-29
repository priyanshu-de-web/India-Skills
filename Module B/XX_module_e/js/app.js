/**
 * Main Application - Initializes and coordinates all modules
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        // Initialize all modules
        Themes.init();
        Photos.init();
        Slideshow.init();
        CommandBar.init();

        // Setup UI event listeners
        this.setupDropArea();
        this.setupConfigPanel();
        this.setupFullscreen();
        this.setupFileInputs();
        this.setupPlaybackSettings();

        console.log('Photos Slideshow initialized');
    },

    /**
     * Setup drop area for drag and drop
     */
    setupDropArea() {
        const dropArea = document.getElementById('drop-area');
        const selectFilesBtn = document.getElementById('select-files-btn');
        const loadSamplesBtn = document.getElementById('load-samples-btn');
        const fileInput = document.getElementById('file-input');

        // Prevent default drag behaviors on document
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Highlight drop area when dragging over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea?.addEventListener(eventName, () => {
                dropArea.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea?.addEventListener(eventName, () => {
                dropArea.classList.remove('drag-over');
            });
        });

        // Handle dropped files
        dropArea?.addEventListener('drop', async (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const added = await Photos.addFromFiles(files);
                console.log(`Added ${added} photos`);
            }
        });

        // Handle global drop (when slideshow is visible)
        document.addEventListener('drop', async (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const added = await Photos.addFromFiles(files);
                console.log(`Added ${added} photos`);
            }
        });

        // Select files button
        selectFilesBtn?.addEventListener('click', () => {
            fileInput?.click();
        });

        // File input change
        fileInput?.addEventListener('change', async () => {
            if (fileInput.files.length > 0) {
                const added = await Photos.addFromFiles(fileInput.files);
                console.log(`Added ${added} photos`);
                fileInput.value = ''; // Reset input
            }
        });

        // Load sample photos button
        loadSamplesBtn?.addEventListener('click', async () => {
            const added = await Photos.loadSamplePhotos();
            console.log(`Loaded ${added} sample photos`);
        });
    },

    /**
     * Setup configuration panel
     */
    setupConfigPanel() {
        const configPanel = document.getElementById('config-panel');
        const configToggleBtn = document.getElementById('config-toggle-btn');
        const configCloseBtn = document.getElementById('config-close-btn');

        // Toggle panel
        configToggleBtn?.addEventListener('click', () => {
            configPanel?.classList.toggle('open');
        });

        // Close panel
        configCloseBtn?.addEventListener('click', () => {
            configPanel?.classList.remove('open');
        });

        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                Slideshow.setMode(btn.dataset.mode);
            });
        });

        // Set initial active mode
        const settings = Storage.getSettings();
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === settings.mode);
        });

        // Photo action buttons
        const addPhotosBtn = document.getElementById('add-photos-btn');
        const addFileInput = document.getElementById('add-file-input');
        const shufflePhotosBtn = document.getElementById('shuffle-photos-btn');
        const clearPhotosBtn = document.getElementById('clear-photos-btn');

        addPhotosBtn?.addEventListener('click', () => {
            addFileInput?.click();
        });

        addFileInput?.addEventListener('change', async () => {
            if (addFileInput.files.length > 0) {
                const added = await Photos.addFromFiles(addFileInput.files);
                console.log(`Added ${added} photos`);
                addFileInput.value = ''; // Reset input
            }
        });

        shufflePhotosBtn?.addEventListener('click', () => {
            Photos.shuffle();
        });

        clearPhotosBtn?.addEventListener('click', () => {
            if (confirm('Are you sure you want to remove all photos?')) {
                Photos.clear();
            }
        });
    },

    /**
     * Setup fullscreen functionality
     */
    setupFullscreen() {
        const fullscreenBtn = document.getElementById('fullscreen-btn');

        fullscreenBtn?.addEventListener('click', () => {
            Utils.toggleFullscreen();
        });

        // Update button icon on fullscreen change
        document.addEventListener('fullscreenchange', () => {
            const isFullscreen = Utils.isFullscreen();
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = isFullscreen
                    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                       </svg>`
                    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                       </svg>`;
            }
        });
    },

    /**
     * Setup file inputs
     */
    setupFileInputs() {
        // Already handled in setupDropArea and setupConfigPanel
    },

    /**
     * Setup playback settings
     */
    setupPlaybackSettings() {
        const durationSlider = document.getElementById('slide-duration');
        const durationValue = document.getElementById('duration-value');
        const speedSlider = document.getElementById('transition-speed');
        const speedValue = document.getElementById('speed-value');

        // Load saved settings
        const settings = Storage.getSettings();

        // Duration slider
        if (durationSlider && durationValue) {
            durationSlider.value = settings.slideDuration;
            durationValue.textContent = settings.slideDuration;

            durationSlider.addEventListener('input', () => {
                const value = parseFloat(durationSlider.value);
                durationValue.textContent = value;
                Slideshow.setDuration(value);
            });
        }

        // Speed slider
        if (speedSlider && speedValue) {
            speedSlider.value = settings.transitionSpeed;
            speedValue.textContent = settings.transitionSpeed;

            speedSlider.addEventListener('input', () => {
                const value = parseFloat(speedSlider.value);
                speedValue.textContent = value;
                Slideshow.setTransitionSpeed(value);
            });
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for use in other modules
window.App = App;
