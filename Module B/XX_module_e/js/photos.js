/**
 * Photos Manager - Handles photo loading, ordering, and management
 */

const Photos = {
    photos: [],
    photoHashes: new Set(),
    
    // Sample photos configuration
    samplePhotos: [
        { filename: 'basilique-notre-dame-de-fourviere-lyon.jpg', url: 'sample-photos/basilique-notre-dame-de-fourviere-lyon.jpg' },
        { filename: 'beautiful-view-in-lyon.jpg', url: 'sample-photos/beautiful-view-in-lyon.jpg' },
        { filename: 'place-bellecour-lyon.jpg', url: 'sample-photos/place-bellecour-lyon.jpg' },
        { filename: 'tour-metalique-lyon.jpg', url: 'sample-photos/tour-metalique-lyon.jpg' }
    ],

    /**
     * Initialize photos from storage
     */
    init() {
        const savedPhotos = Storage.getPhotos();
        
        // Restore sample photos if they were saved
        savedPhotos.forEach(photo => {
            if (photo.isSample && photo.url) {
                this.photos.push({
                    ...photo,
                    id: photo.id || Utils.generateId()
                });
                if (photo.hash) {
                    this.photoHashes.add(photo.hash);
                }
            }
        });

        this.renderPhotoList();
    },

    /**
     * Add photos from file input
     * @param {FileList} files 
     */
    async addFromFiles(files) {
        const newPhotos = [];
        
        for (const file of files) {
            if (!Utils.isValidImageFile(file)) {
                console.warn(`Skipping invalid file: ${file.name}`);
                continue;
            }

            try {
                // Calculate hash for duplicate detection
                const hash = await Utils.calculateFileHash(file);
                
                // Check for duplicates
                if (this.photoHashes.has(hash)) {
                    console.log(`Duplicate detected, skipping: ${file.name}`);
                    continue;
                }

                // Read file as data URL
                const dataUrl = await Utils.readFileAsDataURL(file);
                
                // Create photo object
                const photo = {
                    id: Utils.generateId(),
                    filename: file.name,
                    caption: Utils.generateCaptionFromFilename(file.name),
                    url: dataUrl,
                    hash: hash,
                    isSample: false
                };

                newPhotos.push(photo);
                this.photoHashes.add(hash);
            } catch (error) {
                console.error(`Error processing file ${file.name}:`, error);
            }
        }

        if (newPhotos.length > 0) {
            this.photos.push(...newPhotos);
            this.save();
            this.renderPhotoList();
            
            // Dispatch event for slideshow to handle
            window.dispatchEvent(new CustomEvent('photosUpdated', { 
                detail: { photos: this.photos } 
            }));
        }

        return newPhotos.length;
    },

    /**
     * Load sample photos
     */
    async loadSamplePhotos() {
        // Clear existing photos first
        this.clear();

        for (const sample of this.samplePhotos) {
            const photo = {
                id: Utils.generateId(),
                filename: sample.filename,
                caption: Utils.generateCaptionFromFilename(sample.filename),
                url: sample.url,
                hash: `sample-${sample.filename}`,
                isSample: true
            };

            this.photos.push(photo);
            this.photoHashes.add(photo.hash);
        }

        this.save();
        this.renderPhotoList();

        // Dispatch event for slideshow to handle
        window.dispatchEvent(new CustomEvent('photosUpdated', { 
            detail: { photos: this.photos } 
        }));

        return this.photos.length;
    },

    /**
     * Remove a photo by ID
     * @param {string} id 
     */
    remove(id) {
        const index = this.photos.findIndex(p => p.id === id);
        if (index !== -1) {
            const photo = this.photos[index];
            this.photoHashes.delete(photo.hash);
            this.photos.splice(index, 1);
            this.save();
            this.renderPhotoList();

            // Dispatch event
            window.dispatchEvent(new CustomEvent('photosUpdated', { 
                detail: { photos: this.photos } 
            }));
        }
    },

    /**
     * Update caption for a photo
     * @param {string} id 
     * @param {string} caption 
     */
    updateCaption(id, caption) {
        const photo = this.photos.find(p => p.id === id);
        if (photo) {
            photo.caption = caption;
            this.save();

            // Dispatch event
            window.dispatchEvent(new CustomEvent('captionUpdated', { 
                detail: { id, caption } 
            }));
        }
    },

    /**
     * Reorder photos (move photo from one index to another)
     * @param {number} fromIndex 
     * @param {number} toIndex 
     */
    reorder(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;
        
        const [photo] = this.photos.splice(fromIndex, 1);
        this.photos.splice(toIndex, 0, photo);
        this.save();
        this.renderPhotoList();

        // Dispatch event
        window.dispatchEvent(new CustomEvent('photosReordered', { 
            detail: { photos: this.photos } 
        }));
    },

    /**
     * Shuffle photos randomly
     */
    shuffle() {
        this.photos = Utils.shuffleArray(this.photos);
        this.save();
        this.renderPhotoList();

        // Dispatch event
        window.dispatchEvent(new CustomEvent('photosReordered', { 
            detail: { photos: this.photos } 
        }));
    },

    /**
     * Clear all photos
     */
    clear() {
        this.photos = [];
        this.photoHashes.clear();
        Storage.clearPhotos();
        this.renderPhotoList();

        // Dispatch event
        window.dispatchEvent(new CustomEvent('photosUpdated', { 
            detail: { photos: this.photos } 
        }));
    },

    /**
     * Save photos to storage
     */
    save() {
        Storage.savePhotos(this.photos);
    },

    /**
     * Get photo by index
     * @param {number} index 
     * @returns {Object|null}
     */
    getByIndex(index) {
        return this.photos[index] || null;
    },

    /**
     * Get photo count
     * @returns {number}
     */
    count() {
        return this.photos.length;
    },

    /**
     * Check if there are photos
     * @returns {boolean}
     */
    hasPhotos() {
        return this.photos.length > 0;
    },

    /**
     * Render the photo list in the config panel
     */
    renderPhotoList() {
        const photoList = document.getElementById('photo-list');
        if (!photoList) return;

        if (this.photos.length === 0) {
            photoList.innerHTML = '<div class="photo-list-empty">No photos added yet</div>';
            return;
        }

        photoList.innerHTML = this.photos.map((photo, index) => `
            <div class="photo-item" draggable="true" data-id="${photo.id}" data-index="${index}">
                <div class="photo-item-drag-handle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
                        <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                    </svg>
                </div>
                <img class="photo-item-thumbnail" src="${photo.url}" alt="${photo.caption}">
                <div class="photo-item-info">
                    <div class="photo-item-caption" contenteditable="true" data-id="${photo.id}">${photo.caption}</div>
                    <div class="photo-item-index">#${index + 1}</div>
                </div>
                <button class="photo-item-remove" data-id="${photo.id}" title="Remove photo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `).join('');

        // Setup drag and drop handlers
        this.setupDragAndDrop();

        // Setup caption editing
        this.setupCaptionEditing();

        // Setup remove buttons
        this.setupRemoveButtons();
    },

    /**
     * Setup drag and drop for reordering
     */
    setupDragAndDrop() {
        const photoList = document.getElementById('photo-list');
        const items = photoList.querySelectorAll('.photo-item');
        let draggedItem = null;
        let draggedIndex = -1;

        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedItem = item;
                draggedIndex = parseInt(item.dataset.index);
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                items.forEach(i => i.classList.remove('drag-over'));
                draggedItem = null;
                draggedIndex = -1;
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (item !== draggedItem) {
                    item.classList.add('drag-over');
                }
            });

            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');
                
                if (draggedItem && item !== draggedItem) {
                    const toIndex = parseInt(item.dataset.index);
                    this.reorder(draggedIndex, toIndex);
                }
            });
        });
    },

    /**
     * Setup caption editing
     */
    setupCaptionEditing() {
        const captions = document.querySelectorAll('.photo-item-caption');
        
        captions.forEach(caption => {
            caption.addEventListener('blur', () => {
                const id = caption.dataset.id;
                const newCaption = caption.textContent.trim();
                if (newCaption) {
                    this.updateCaption(id, newCaption);
                }
            });

            caption.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    caption.blur();
                }
            });
        });
    },

    /**
     * Setup remove buttons
     */
    setupRemoveButtons() {
        const removeButtons = document.querySelectorAll('.photo-item-remove');
        
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                this.remove(id);
            });
        });
    }
};

// Export for use in other modules
window.Photos = Photos;
