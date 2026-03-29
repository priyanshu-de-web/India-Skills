/**
 * Command Bar - Handles command palette functionality
 */

const CommandBar = {
    isOpen: false,
    selectedIndex: 0,
    commands: [],
    filteredCommands: [],

    // All available commands
    allCommands: [
        {
            id: 'mode-manual',
            title: 'Change to Manual Control Mode',
            description: 'Navigate slides with arrow keys',
            category: 'Mode',
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>`,
            action: () => Slideshow.setMode('manual')
        },
        {
            id: 'mode-auto',
            title: 'Change to Auto-Playing Mode',
            description: 'Slides advance automatically',
            category: 'Mode',
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>`,
            action: () => Slideshow.setMode('auto')
        },
        {
            id: 'mode-random',
            title: 'Change to Random Playing Mode',
            description: 'Random slide order, never ends',
            category: 'Mode',
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 3 21 3 21 8"/>
                <line x1="4" y1="20" x2="21" y2="3"/>
                <polyline points="21 16 21 21 16 21"/>
                <line x1="15" y1="15" x2="21" y2="21"/>
                <line x1="4" y1="4" x2="9" y2="9"/>
            </svg>`,
            action: () => Slideshow.setMode('random')
        },
        {
            id: 'theme-a',
            title: 'Switch to Theme A',
            description: 'No effects, direct display',
            category: 'Theme',
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
            </svg>`,
            action: () => Themes.setSlideTheme('A')
        },
        {
            id: 'theme-b',
            title: 'Switch to Theme B',
            description: 'Left to right animation',
            category: 'Theme',
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
            </svg>`,
            action: () => Themes.setSlideTheme('B')
        },
        {
            id: 'theme-c',
            title: 'Switch to Theme C',
            description: 'Bottom to top with word animation',
            category: 'Theme',
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="19" x2="12" y2="5"/>
                <polyline points="5 12 12 5 19 12"/>
            </svg>`,
            action: () => Themes.setSlideTheme('C')
        },
        {
            id: 'theme-d',
            title: 'Switch to Theme D',
            description: '3D flip with zoom effect',
            category: 'Theme',
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/>
                <path d="M12 12l8-4.5"/>
                <path d="M12 12v9"/>
                <path d="M12 12L4 7.5"/>
            </svg>`,
            action: () => Themes.setSlideTheme('D')
        },
        {
            id: 'toggle-dark-mode',
            title: 'Toggle Light and Dark Mode',
            description: 'Switch between light and dark theme',
            category: 'Display',
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/>
                <path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/>
                <path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
            </svg>`,
            action: () => Themes.toggleDarkMode()
        },
        {
            id: 'shuffle-photos',
            title: 'Shuffle Photos',
            description: 'Randomly reorder all photos',
            category: 'Photos',
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m18 14 4 4-4 4"/>
                <path d="m18 2 4 4-4 4"/>
                <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/>
                <path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/>
                <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/>
            </svg>`,
            action: () => Photos.shuffle()
        },
        {
            id: 'pause-slideshow',
            title: 'Pause Slideshow',
            description: 'Pause the current slideshow',
            category: 'Playback',
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>`,
            action: () => Slideshow.pause()
        },
        {
            id: 'play-slideshow',
            title: 'Play Slideshow',
            description: 'Start or resume the slideshow',
            category: 'Playback',
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>`,
            action: () => Slideshow.play()
        }
    ],

    // DOM Elements
    elements: {
        overlay: null,
        input: null,
        list: null
    },

    /**
     * Initialize command bar
     */
    init() {
        this.elements.overlay = document.getElementById('command-bar-overlay');
        this.elements.input = document.getElementById('command-input');
        this.elements.list = document.getElementById('command-list');

        this.commands = [...this.allCommands];
        this.filteredCommands = [...this.commands];

        this.setupEventListeners();
        this.renderCommands();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Open command bar with Ctrl+K or /
            if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !e.target.isContentEditable && e.target.tagName !== 'INPUT')) {
                e.preventDefault();
                this.open();
            }

            // Close with Escape
            if (e.key === 'Escape' && this.isOpen) {
                e.preventDefault();
                this.close();
            }
        });

        // Input handling
        this.elements.input?.addEventListener('input', () => {
            this.filterCommands(this.elements.input.value);
        });

        this.elements.input?.addEventListener('keydown', (e) => {
            this.handleInputKeydown(e);
        });

        // Click outside to close
        this.elements.overlay?.addEventListener('click', (e) => {
            if (e.target === this.elements.overlay) {
                this.close();
            }
        });

        // Command item clicks
        this.elements.list?.addEventListener('click', (e) => {
            const item = e.target.closest('.command-item');
            if (item) {
                const index = parseInt(item.dataset.index);
                this.executeCommand(index);
            }
        });
    },

    /**
     * Handle input keydown events
     * @param {KeyboardEvent} e 
     */
    handleInputKeydown(e) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectNext();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.selectPrev();
                break;
            case 'Enter':
                e.preventDefault();
                this.executeSelected();
                break;
            case 'Escape':
                e.preventDefault();
                this.close();
                break;
        }
    },

    /**
     * Open command bar
     */
    open() {
        this.isOpen = true;
        this.elements.overlay.classList.remove('hidden');
        this.elements.input.value = '';
        this.elements.input.focus();
        this.filterCommands('');
        this.selectedIndex = 0;
        this.updateSelection();
    },

    /**
     * Close command bar
     */
    close() {
        this.isOpen = false;
        this.elements.overlay.classList.add('hidden');
        this.elements.input.value = '';
        this.selectedIndex = 0;
    },

    /**
     * Filter commands based on search query
     * @param {string} query 
     */
    filterCommands(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredCommands = [...this.commands];
        } else {
            this.filteredCommands = this.commands.filter(cmd => {
                return cmd.title.toLowerCase().includes(searchTerm) ||
                       cmd.description.toLowerCase().includes(searchTerm) ||
                       cmd.category.toLowerCase().includes(searchTerm);
            });
        }

        this.selectedIndex = 0;
        this.renderCommands();
    },

    /**
     * Render commands list
     */
    renderCommands() {
        if (this.filteredCommands.length === 0) {
            this.elements.list.innerHTML = '<li class="command-empty">No commands found</li>';
            return;
        }

        // Group commands by category
        const grouped = {};
        this.filteredCommands.forEach((cmd, index) => {
            if (!grouped[cmd.category]) {
                grouped[cmd.category] = [];
            }
            grouped[cmd.category].push({ ...cmd, index });
        });

        let html = '';
        Object.entries(grouped).forEach(([category, commands]) => {
            html += `<li class="command-section-header">${category}</li>`;
            commands.forEach(cmd => {
                const selectedClass = cmd.index === this.selectedIndex ? 'selected' : '';
                html += `
                    <li class="command-item ${selectedClass}" data-index="${cmd.index}">
                        <div class="command-icon">${cmd.icon}</div>
                        <div class="command-content">
                            <div class="command-title">${cmd.title}</div>
                            <div class="command-description">${cmd.description}</div>
                        </div>
                    </li>
                `;
            });
        });

        this.elements.list.innerHTML = html;
    },

    /**
     * Select next command
     */
    selectNext() {
        if (this.filteredCommands.length === 0) return;
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredCommands.length;
        this.updateSelection();
    },

    /**
     * Select previous command
     */
    selectPrev() {
        if (this.filteredCommands.length === 0) return;
        this.selectedIndex = (this.selectedIndex - 1 + this.filteredCommands.length) % this.filteredCommands.length;
        this.updateSelection();
    },

    /**
     * Update selection visual
     */
    updateSelection() {
        const items = this.elements.list.querySelectorAll('.command-item');
        items.forEach((item, index) => {
            const itemIndex = parseInt(item.dataset.index);
            item.classList.toggle('selected', itemIndex === this.selectedIndex);
            
            // Scroll into view if needed
            if (itemIndex === this.selectedIndex) {
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        });
    },

    /**
     * Execute selected command
     */
    executeSelected() {
        this.executeCommand(this.selectedIndex);
    },

    /**
     * Execute command at index
     * @param {number} index 
     */
    executeCommand(index) {
        const command = this.filteredCommands[index];
        if (command) {
            this.close();
            command.action();
        }
    }
};

// Export for use in other modules
window.CommandBar = CommandBar;
