/**
 * Storage Manager - Handles localStorage persistence
 */

const Storage = {
    KEYS: {
        SETTINGS: 'slideshow_settings',
        PHOTOS: 'slideshow_photos'
    },

    /**
     * Default settings
     */
    defaultSettings: {
        mode: 'manual',           // manual, auto, random
        theme: 'A',               // A, B, C, D
        slideDuration: 3,         // seconds (1-30)
        transitionSpeed: 0.5,     // seconds
        darkMode: false,
        currentIndex: 0
    },

    /**
     * Get settings from localStorage
     * @returns {Object}
     */
    getSettings() {
        try {
            const stored = localStorage.getItem(this.KEYS.SETTINGS);
            if (stored) {
                const parsed = JSON.parse(stored);
                return { ...this.defaultSettings, ...parsed };
            }
        } catch (e) {
            console.error('Error reading settings:', e);
        }
        return { ...this.defaultSettings };
    },

    /**
     * Save settings to localStorage
     * @param {Object} settings 
     */
    saveSettings(settings) {
        try {
            const current = this.getSettings();
            const updated = { ...current, ...settings };
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(updated));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    },

    /**
     * Update a single setting
     * @param {string} key 
     * @param {*} value 
     */
    updateSetting(key, value) {
        this.saveSettings({ [key]: value });
    },

    /**
     * Get photos from localStorage
     * Note: Due to size limitations, we store photo metadata, not actual images
     * @returns {Array}
     */
    getPhotos() {
        try {
            const stored = localStorage.getItem(this.KEYS.PHOTOS);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error reading photos:', e);
        }
        return [];
    },

    /**
     * Save photos to localStorage
     * @param {Array} photos 
     */
    savePhotos(photos) {
        try {
            // Only save essential metadata to avoid exceeding storage limits
            const photosToSave = photos.map(photo => ({
                id: photo.id,
                caption: photo.caption,
                filename: photo.filename,
                hash: photo.hash,
                // For sample photos, store the URL; for uploaded photos, we can't persist them
                url: photo.isSample ? photo.url : null,
                isSample: photo.isSample || false
            }));
            localStorage.setItem(this.KEYS.PHOTOS, JSON.stringify(photosToSave));
        } catch (e) {
            console.error('Error saving photos:', e);
            // If storage is full, try saving without URLs
            try {
                const minimalPhotos = photos.map(photo => ({
                    id: photo.id,
                    caption: photo.caption,
                    filename: photo.filename,
                    isSample: photo.isSample || false
                }));
                localStorage.setItem(this.KEYS.PHOTOS, JSON.stringify(minimalPhotos));
            } catch (e2) {
                console.error('Error saving minimal photos:', e2);
            }
        }
    },

    /**
     * Clear all stored data
     */
    clearAll() {
        localStorage.removeItem(this.KEYS.SETTINGS);
        localStorage.removeItem(this.KEYS.PHOTOS);
    },

    /**
     * Clear only photos
     */
    clearPhotos() {
        localStorage.removeItem(this.KEYS.PHOTOS);
    }
};

// Export for use in other modules
window.Storage = Storage;
