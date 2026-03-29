/**
 * Slideshow Controller - Handles slideshow playback and navigation
 */

const Slideshow = {
    currentIndex: 0,
    isPlaying: false,
    isPaused: false,
    playInterval: null,
    mode: 'manual', // manual, auto, random
    slideDuration: 3000, // ms
    transitionSpeed: 0.5, // seconds
    isTransitioning: false,

    // DOM Elements
    elements: {
        container: null,
        dropArea: null,
        slide: null,
        slideImage: null,
        slideCaption: null,
        currentSlide: null,
        totalSlides: null,
        playBtn: null,
        pauseBtn: null,
        prevBtn: null,
        nextBtn: null
    },

    /**
     * Initialize the slideshow
     */
    init() {
        // Get DOM elements
        this.elements.container = document.getElementById('slideshow-container');
        this.elements.dropArea = document.getElementById('drop-area');
        this.elements.slide = document.getElementById('slide');
        this.elements.slideImage = document.getElementById('slide-image');
        this.elements.slideCaption = document.getElementById('slide-caption');
        this.elements.currentSlide = document.getElementById('current-slide');
        this.elements.totalSlides = document.getElementById('total-slides');
        this.elements.playBtn = document.getElementById('play-btn');
        this.elements.pauseBtn = document.getElementById('pause-btn');
        this.elements.prevBtn = document.getElementById('prev-btn');
        this.elements.nextBtn = document.getElementById('next-btn');

        // Load settings
        const settings = Storage.getSettings();
        this.mode = settings.mode;
        this.slideDuration = settings.slideDuration * 1000;
        this.transitionSpeed = settings.transitionSpeed;
        this.currentIndex = settings.currentIndex || 0;

        // Set CSS variable for transition speed
        this.updateTransitionSpeed();

        // Setup event listeners
        this.setupEventListeners();

        // Check if we have photos and show appropriate view
        this.updateView();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation buttons
        this.elements.prevBtn?.addEventListener('click', () => this.prev());
        this.elements.nextBtn?.addEventListener('click', () => this.next());

        // Play/Pause buttons
        this.elements.playBtn?.addEventListener('click', () => this.play());
        this.elements.pauseBtn?.addEventListener('click', () => this.pause());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Listen for photo updates
        window.addEventListener('photosUpdated', () => this.onPhotosUpdated());
        window.addEventListener('photosReordered', () => this.onPhotosReordered());
        window.addEventListener('captionUpdated', (e) => this.onCaptionUpdated(e.detail));
    },

    /**
     * Handle keyboard events
     */
    handleKeydown(e) {
        // Don't handle if command bar is open or typing in input
        if (!document.getElementById('command-bar-overlay').classList.contains('hidden')) return;
        if (e.target.tagName === 'INPUT' || e.target.isContentEditable) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.next();
                break;
            case ' ':
                e.preventDefault();
                if (this.isPlaying && !this.isPaused) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
        }
    },

    /**
     * Update the view based on photo availability
     */
    updateView() {
        const hasPhotos = Photos.hasPhotos();
        
        if (hasPhotos) {
            this.elements.dropArea.classList.add('hidden');
            this.elements.container.classList.remove('hidden');
            this.elements.totalSlides.textContent = Photos.count();
            
            // Validate current index
            if (this.currentIndex >= Photos.count()) {
                this.currentIndex = 0;
            }
            
            this.showSlide(this.currentIndex, false);
        } else {
            this.elements.dropArea.classList.remove('hidden');
            this.elements.container.classList.add('hidden');
            this.stop();
        }
    },

    /**
     * Show a specific slide
     * @param {number} index 
     * @param {boolean} animate 
     */
    showSlide(index, animate = true) {
        if (this.isTransitioning) return;
        
        const photo = Photos.getByIndex(index);
        if (!photo) return;

        const currentTheme = document.body.dataset.slideTheme;

        if (animate && currentTheme !== 'A') {
            this.isTransitioning = true;
            
            // Exit animation
            this.elements.slide.classList.remove('slide-enter', 'slide-enter-active', 'slide-active');
            this.elements.slide.classList.add('slide-exit');
            
            requestAnimationFrame(() => {
                this.elements.slide.classList.add('slide-exit-active');
            });

            // Wait for exit animation, then show new slide
            const exitDuration = this.transitionSpeed * 1000;
            setTimeout(() => {
                this.updateSlideContent(photo, index);
                
                // Enter animation
                this.elements.slide.classList.remove('slide-exit', 'slide-exit-active');
                this.elements.slide.classList.add('slide-enter');
                
                requestAnimationFrame(() => {
                    this.elements.slide.classList.add('slide-enter-active');
                });

                // After enter animation, set to active
                setTimeout(() => {
                    this.elements.slide.classList.remove('slide-enter', 'slide-enter-active');
                    this.elements.slide.classList.add('slide-active');
                    this.isTransitioning = false;
                }, exitDuration);
            }, exitDuration);
        } else {
            // No animation (Theme A or initial load)
            this.updateSlideContent(photo, index);
            this.elements.slide.classList.remove('slide-enter', 'slide-enter-active', 'slide-exit', 'slide-exit-active');
            this.elements.slide.classList.add('slide-active');
        }

        this.currentIndex = index;
        this.elements.currentSlide.textContent = index + 1;
        
        // Save current index
        Storage.updateSetting('currentIndex', index);
    },

    /**
     * Update slide content
     * @param {Object} photo 
     * @param {number} index 
     */
    updateSlideContent(photo, index) {
        this.elements.slideImage.src = photo.url;
        this.elements.slideImage.alt = photo.caption;
        
        // For Theme C, split caption into words
        const currentTheme = document.body.dataset.slideTheme;
        if (currentTheme === 'C' || currentTheme === 'D') {
            this.elements.slideCaption.innerHTML = Utils.splitIntoWordSpans(photo.caption, 300);
        } else {
            this.elements.slideCaption.textContent = photo.caption;
        }
    },

    /**
     * Go to next slide
     */
    next() {
        if (!Photos.hasPhotos() || this.isTransitioning) return;

        let nextIndex;
        if (this.mode === 'random') {
            nextIndex = Utils.getRandomIndex(Photos.count(), this.currentIndex);
        } else {
            nextIndex = (this.currentIndex + 1) % Photos.count();
        }

        this.showSlide(nextIndex);
    },

    /**
     * Go to previous slide
     */
    prev() {
        if (!Photos.hasPhotos() || this.isTransitioning) return;

        let prevIndex;
        if (this.mode === 'random') {
            prevIndex = Utils.getRandomIndex(Photos.count(), this.currentIndex);
        } else {
            prevIndex = (this.currentIndex - 1 + Photos.count()) % Photos.count();
        }

        this.showSlide(prevIndex);
    },

    /**
     * Start auto-playing
     */
    play() {
        if (!Photos.hasPhotos()) return;
        if (this.mode === 'manual') {
            // In manual mode, just go to next slide
            this.next();
            return;
        }

        this.isPlaying = true;
        this.isPaused = false;
        this.updatePlayPauseButtons();

        // Clear any existing interval
        this.clearInterval();

        // Start the interval
        this.playInterval = setInterval(() => {
            if (!this.isPaused) {
                this.next();
            }
        }, this.slideDuration);
    },

    /**
     * Pause playback
     */
    pause() {
        this.isPaused = true;
        this.updatePlayPauseButtons();
    },

    /**
     * Stop playback
     */
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.clearInterval();
        this.updatePlayPauseButtons();
    },

    /**
     * Clear interval
     */
    clearInterval() {
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    },

    /**
     * Update play/pause button visibility
     */
    updatePlayPauseButtons() {
        if (this.mode === 'manual') {
            this.elements.playBtn?.classList.add('hidden');
            this.elements.pauseBtn?.classList.add('hidden');
        } else if (this.isPlaying && !this.isPaused) {
            this.elements.playBtn?.classList.add('hidden');
            this.elements.pauseBtn?.classList.remove('hidden');
        } else {
            this.elements.playBtn?.classList.remove('hidden');
            this.elements.pauseBtn?.classList.add('hidden');
        }
    },

    /**
     * Set operating mode
     * @param {string} mode - manual, auto, random
     */
    setMode(mode) {
        this.mode = mode;
        Storage.updateSetting('mode', mode);

        // Stop current playback when changing modes
        this.stop();

        // Update UI
        this.updatePlayPauseButtons();

        // Update mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Auto-start if switching to auto or random mode
        if (mode === 'auto' || mode === 'random') {
            this.play();
        }
    },

    /**
     * Set slide duration
     * @param {number} seconds 
     */
    setDuration(seconds) {
        this.slideDuration = seconds * 1000;
        Storage.updateSetting('slideDuration', seconds);

        // Restart interval if playing
        if (this.isPlaying) {
            this.clearInterval();
            this.playInterval = setInterval(() => {
                if (!this.isPaused) {
                    this.next();
                }
            }, this.slideDuration);
        }
    },

    /**
     * Set transition speed
     * @param {number} seconds 
     */
    setTransitionSpeed(seconds) {
        this.transitionSpeed = seconds;
        Storage.updateSetting('transitionSpeed', seconds);
        this.updateTransitionSpeed();
    },

    /**
     * Update CSS variable for transition speed
     */
    updateTransitionSpeed() {
        document.documentElement.style.setProperty('--slide-transition-speed', `${this.transitionSpeed}s`);
    },

    /**
     * Handle photos updated event
     */
    onPhotosUpdated() {
        this.elements.totalSlides.textContent = Photos.count();
        this.updateView();
    },

    /**
     * Handle photos reordered event
     */
    onPhotosReordered() {
        // Update the current photo if it moved
        const currentPhoto = Photos.getByIndex(this.currentIndex);
        if (!currentPhoto) {
            this.currentIndex = 0;
            this.showSlide(0, false);
        }
    },

    /**
     * Handle caption updated event
     */
    onCaptionUpdated(detail) {
        const currentPhoto = Photos.getByIndex(this.currentIndex);
        if (currentPhoto && currentPhoto.id === detail.id) {
            const currentTheme = document.body.dataset.slideTheme;
            if (currentTheme === 'C' || currentTheme === 'D') {
                this.elements.slideCaption.innerHTML = Utils.splitIntoWordSpans(detail.caption, 300);
            } else {
                this.elements.slideCaption.textContent = detail.caption;
            }
        }
    },

    /**
     * Go to specific slide index
     * @param {number} index 
     */
    goTo(index) {
        if (index >= 0 && index < Photos.count()) {
            this.showSlide(index);
        }
    }
};

// Export for use in other modules
window.Slideshow = Slideshow;
