/**
 * Utility Functions
 */

const Utils = {
    /**
     * Generate caption from filename
     * Removes extension, replaces dashes/underscores with spaces, capitalizes words
     * @param {string} filename 
     * @returns {string}
     */
    generateCaptionFromFilename(filename) {
        // Remove file extension
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
        
        // Replace dashes and underscores with spaces
        const withSpaces = nameWithoutExt.replace(/[-_]/g, ' ');
        
        // Capitalize first letter of each word
        const capitalized = withSpaces.replace(/\b\w/g, char => char.toUpperCase());
        
        return capitalized.trim();
    },

    /**
     * Generate unique ID
     * @returns {string}
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Calculate hash of file content for duplicate detection
     * @param {File} file 
     * @returns {Promise<string>}
     */
    async calculateFileHash(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                    resolve(hashHex);
                } catch (err) {
                    // Fallback to filename + size if crypto fails
                    resolve(`${file.name}-${file.size}`);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    },

    /**
     * Read file as data URL
     * @param {File} file 
     * @returns {Promise<string>}
     */
    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    },

    /**
     * Shuffle array using Fisher-Yates algorithm
     * @param {Array} array 
     * @returns {Array}
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Get random index different from current
     * @param {number} length 
     * @param {number} currentIndex 
     * @returns {number}
     */
    getRandomIndex(length, currentIndex = -1) {
        if (length <= 1) return 0;
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * length);
        } while (newIndex === currentIndex);
        return newIndex;
    },

    /**
     * Debounce function
     * @param {Function} func 
     * @param {number} wait 
     * @returns {Function}
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Split text into word spans for animation
     * @param {string} text 
     * @param {number} delayMs - delay between words in ms
     * @returns {string}
     */
    splitIntoWordSpans(text, delayMs = 300) {
        const words = text.split(/\s+/);
        return words.map((word, index) => {
            const delay = index * delayMs;
            return `<span class="word" style="transition-delay: ${delay}ms">${word}</span>`;
        }).join(' ');
    },

    /**
     * Check if element is valid image file
     * @param {File} file 
     * @returns {boolean}
     */
    isValidImageFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'];
        return validTypes.includes(file.type);
    },

    /**
     * Toggle fullscreen
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Error enabling fullscreen:', err);
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.error('Error exiting fullscreen:', err);
            });
        }
    },

    /**
     * Check if in fullscreen mode
     * @returns {boolean}
     */
    isFullscreen() {
        return !!document.fullscreenElement;
    }
};

// Export for use in other modules
window.Utils = Utils;
