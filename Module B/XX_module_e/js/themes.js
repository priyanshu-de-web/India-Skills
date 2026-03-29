/**
 * Theme Manager - Handles theme switching and dark mode
 */

const Themes = {
    currentTheme: 'A',
    isDarkMode: false,

    /**
     * Initialize themes
     */
    init() {
        const settings = Storage.getSettings();
        this.currentTheme = settings.theme || 'A';
        this.isDarkMode = settings.darkMode || false;

        // Apply initial settings
        this.setSlideTheme(this.currentTheme, false);
        this.setDarkMode(this.isDarkMode, false);

        // Setup event listeners
        this.setupEventListeners();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setSlideTheme(btn.dataset.theme);
            });
        });

        // Dark mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.isDarkMode;
            darkModeToggle.addEventListener('change', () => {
                this.setDarkMode(darkModeToggle.checked);
            });
        }
    },

    /**
     * Set slide theme (A, B, C, D)
     * @param {string} theme 
     * @param {boolean} save 
     */
    setSlideTheme(theme, save = true) {
        this.currentTheme = theme;
        document.body.dataset.slideTheme = theme;

        // Update theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        // Re-render current slide caption for Theme C word animation
        if (Photos.hasPhotos()) {
            const currentPhoto = Photos.getByIndex(Slideshow.currentIndex);
            if (currentPhoto) {
                const slideCaption = document.getElementById('slide-caption');
                if (theme === 'C' || theme === 'D') {
                    slideCaption.innerHTML = Utils.splitIntoWordSpans(currentPhoto.caption, 300);
                } else {
                    slideCaption.textContent = currentPhoto.caption;
                }
            }
        }

        if (save) {
            Storage.updateSetting('theme', theme);
        }
    },

    /**
     * Set dark mode
     * @param {boolean} enabled 
     * @param {boolean} save 
     */
    setDarkMode(enabled, save = true) {
        this.isDarkMode = enabled;
        document.body.dataset.theme = enabled ? 'dark' : 'light';

        // Update toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.checked = enabled;
        }

        if (save) {
            Storage.updateSetting('darkMode', enabled);
        }
    },

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        this.setDarkMode(!this.isDarkMode);
    },

    /**
     * Get current theme
     * @returns {string}
     */
    getTheme() {
        return this.currentTheme;
    },

    /**
     * Check if dark mode is enabled
     * @returns {boolean}
     */
    getDarkMode() {
        return this.isDarkMode;
    }
};

// Export for use in other modules
window.Themes = Themes;
