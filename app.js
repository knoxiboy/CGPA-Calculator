/**
 * GPA/CGPA Calculator Application
 * A pure JavaScript application for calculating semester GPA and cumulative CGPA
 * 
 * Module Structure:
 * - GRADE_POINTS: Grade to numeric value conversion
 * - STORAGE_KEY: localStorage key for data persistence
 * - DataManager: State management and persistence
 * - Calculator: Calculation and validation logic
 * - UIController: User interface management and rendering
 */

// ============================================
// 1. CONSTANTS AND CONFIGURATION
// ============================================

/**
 * Grade to points mapping for the 10-point grading scale
 * Used to convert letter grades to numerical values for GPA calculation
 */
const GRADE_POINTS = {
    'O': 10,    // Outstanding
    'A+': 9,    // Excellent
    'A': 8,     // Very Good
    'B+': 7,    // Good
    'B': 6,     // Above Average
    'C': 5,     // Average
    'D': 4,     // Below Average
    'F': 0      // Fail
};

/**
 * localStorage key for persisting application state
 */
const STORAGE_KEY = 'gpa_calculator_data';

// ============================================
// 2. DATA MANAGER MODULE
// ============================================

/**
 * DataManager Module
 * Responsible for managing application state and data persistence
 * 
 * State Structure:
 * - semesters: Array of semester objects with subjects
 * - activeSemesterId: ID of currently displayed semester
 * - whatIfMode: Boolean flag for simulation mode
 * - realSemesters: Backup of real semesters when in what-if mode
 */
const DataManager = {
    // State object containing all application data
    state: {
        semesters: [],
        activeSemesterId: null,
        whatIfMode: false,
        realSemesters: []
    },

    /**
     * Generate a unique ID using timestamp and random number
     * @returns {string} Unique identifier
     */
    _generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Initialize the DataManager
     * Loads data from localStorage or creates default state
     */
    init() {
        try {
            const loaded = this.load();
            if (loaded) {
                this.state = loaded;
            } else {
                // Create default state with one empty semester
                this.state = {
                    semesters: [{
                        id: this._generateId(),
                        name: 'Semester 1',
                        subjects: [],
                        createdAt: Date.now(),
                        isHypothetical: false
                    }],
                    activeSemesterId: null,
                    whatIfMode: false,
                    realSemesters: []
                };
                // Set the first semester as active
                this.state.activeSemesterId = this.state.semesters[0].id;
                this.save();
            }
        } catch (error) {
            console.warn('Failed to initialize DataManager:', error);
            // Fallback to default state in case of errors
            this.state = {
                semesters: [{
                    id: this._generateId(),
                    name: 'Semester 1',
                    subjects: [],
                    createdAt: Date.now(),
                    isHypothetical: false
                }],
                activeSemesterId: null,
                whatIfMode: false,
                realSemesters: []
            };
            this.state.activeSemesterId = this.state.semesters[0].id;
        }
    },

    /**
     * Save current state to localStorage
     */
    save() {
        // Don't persist to localStorage if in what-if mode
        if (this.state.whatIfMode) {
            return;
        }

        try {
            if (localStorage) {
                const jsonString = JSON.stringify(this.state);
                localStorage.setItem(STORAGE_KEY, jsonString);
            }
        } catch (error) {
            console.warn('localStorage is unavailable. Changes will not be persisted.', error);
        }
    },

    /**
     * Load state from localStorage
     * @returns {Object|null} Loaded state or null if not available
     */
    load() {
        try {
            if (localStorage && localStorage.getItem(STORAGE_KEY)) {
                const jsonString = localStorage.getItem(STORAGE_KEY);
                return JSON.parse(jsonString);
            }
        } catch (error) {
            console.warn('Failed to load data from localStorage:', error);
        }
        return null;
    },

    /**
     * Export current state as JSON string
     * @returns {string} JSON representation of application state
     */
    exportData() {
        return JSON.stringify(this.state.semesters, null, 2);
    },

    /**
     * Import data from JSON string
     * @param {string} jsonString - JSON string containing exported data
     * @returns {boolean} True if import successful, false otherwise
     */
    importData(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            
            // Validate data structure
            if (!Array.isArray(imported)) {
                return false;
            }
            
            // Validate each semester and subject
            for (const semester of imported) {
                if (!semester.id || !semester.name || !Array.isArray(semester.subjects)) {
                    return false;
                }
                
                for (const subject of semester.subjects) {
                    if (!subject.id || !subject.name || subject.credits === undefined || !subject.grade) {
                        return false;
                    }
                }
            }
            
            // Replace state with imported data
            this.state.semesters = imported;
            this.state.activeSemesterId = this.state.semesters.length > 0 ? this.state.semesters[0].id : null;
            this.state.whatIfMode = false;
            this.state.realSemesters = [];
            
            this.save();
            return true;
        } catch (error) {
            console.warn('Failed to import data:', error);
            return false;
        }
    },

    /**
     * Clear all data and reset to initial state
     */
    clearAll() {
        try {
            if (localStorage) {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (error) {
            console.warn('Failed to clear localStorage:', error);
        }
        
        // Reset state to initial state
        this.state = {
            semesters: [{
                id: this._generateId(),
                name: 'Semester 1',
                subjects: [],
                createdAt: Date.now(),
                isHypothetical: false
            }],
            activeSemesterId: null,
            whatIfMode: false,
            realSemesters: []
        };
        this.state.activeSemesterId = this.state.semesters[0].id;
    },

    /**
     * Add a new semester to the application
     * @param {boolean} isHypothetical - Whether this semester is for what-if mode
     * @returns {string} ID of the newly created semester
     */
    addSemester(isHypothetical = false) {
        const semesterCount = this.state.semesters.length + 1;
        const semesterId = this._generateId();
        
        const newSemester = {
            id: semesterId,
            name: `Semester ${semesterCount}`,
            subjects: [],
            createdAt: Date.now(),
            isHypothetical: isHypothetical
        };
        
        this.state.semesters.push(newSemester);
        this.state.activeSemesterId = semesterId;
        
        if (!isHypothetical) {
            this.save();
        }
        
        return semesterId;
    },

    /**
     * Delete a semester from the application
     * Prevents deletion if it's the last semester
     * @param {string} id - Semester ID to delete
     * @returns {boolean} True if deleted, false if prevented (last semester)
     */
    deleteSemester(id) {
        // Prevent deletion if this is the last semester
        if (this.state.semesters.length === 1) {
            return false;
        }
        
        // Find and remove the semester
        const index = this.state.semesters.findIndex(s => s.id === id);
        if (index === -1) {
            return false;
        }
        
        this.state.semesters.splice(index, 1);
        
        // If deleted semester was active, set first semester as active
        if (this.state.activeSemesterId === id) {
            this.state.activeSemesterId = this.state.semesters[0].id;
        }
        
        this.save();
        return true;
    },

    /**
     * Add a subject to a specific semester
     * @param {string} semesterId - ID of the semester
     * @param {Object} subject - Subject object with name, credits, grade
     */
    addSubject(semesterId, subject) {
        const semester = this.getSemester(semesterId);
        if (!semester) {
            return;
        }
        
        // Add unique ID to subject
        const subjectWithId = {
            ...subject,
            id: this._generateId()
        };
        
        semester.subjects.push(subjectWithId);
        this.save();
    },

    /**
     * Delete a subject from a specific semester
     * @param {string} semesterId - ID of the semester
     * @param {string} subjectId - ID of the subject to delete
     */
    deleteSubject(semesterId, subjectId) {
        const semester = this.getSemester(semesterId);
        if (!semester) {
            return;
        }
        
        const index = semester.subjects.findIndex(s => s.id === subjectId);
        if (index === -1) {
            return;
        }
        
        semester.subjects.splice(index, 1);
        this.save();
    },

    /**
     * Get a semester by ID
     * @param {string} id - Semester ID
     * @returns {Object|null} Semester object or null if not found
     */
    getSemester(id) {
        return this.state.semesters.find(s => s.id === id) || null;
    },

    /**
     * Get the currently active semester
     * @returns {Object|null} Active semester object or null
     */
    getActiveSemester() {
        return this.getSemester(this.state.activeSemesterId);
    },

    /**
     * Set the active semester
     * @param {string} id - Semester ID to make active
     */
    setActiveSemester(id) {
        if (this.getSemester(id)) {
            this.state.activeSemesterId = id;
        }
    },

    /**
     * Enter what-if mode for semester simulation
     * Backs up current semesters and allows creating hypothetical ones
     */
    enterWhatIfMode() {
        if (!this.state.whatIfMode) {
            // Backup real semesters
            this.state.realSemesters = JSON.parse(JSON.stringify(this.state.semesters));
            this.state.whatIfMode = true;
        }
    },

    /**
     * Exit what-if mode and restore original semesters
     * Discards all hypothetical semesters created during what-if mode
     */
    exitWhatIfMode() {
        if (this.state.whatIfMode) {
            // Restore real semesters
            this.state.semesters = JSON.parse(JSON.stringify(this.state.realSemesters));
            this.state.realSemesters = [];
            this.state.whatIfMode = false;
            
            // Ensure active semester still exists
            if (!this.getSemester(this.state.activeSemesterId)) {
                this.state.activeSemesterId = this.state.semesters[0].id;
            }
            
            this.save();
        }
    },
};

// ============================================
// 3. CALCULATOR MODULE
// ============================================

/**
 * Calculator Module
 * Responsible for all calculation logic and input validation
 */
const Calculator = {
    /**
     * Convert a letter grade to its numeric point value
     * @param {string} grade - Letter grade (O, A+, A, B+, B, C, D, F)
     * @returns {number} Grade point value (0-10)
     */
    gradeToPoints(grade) {
        return GRADE_POINTS[grade] !== undefined ? GRADE_POINTS[grade] : 0;
    },

    /**
     * Validate that credits are in the valid range (1-10) and numeric
     * @param {*} credits - Credit value to validate
     * @returns {boolean} True if valid, false otherwise
     */
    validateCredits(credits) {
        // Check if credits is a number and within the range [1, 10]
        return typeof credits === 'number' && credits >= 1 && credits <= 10 && Number.isInteger(credits);
    },

    /**
     * Validate that a grade is in the valid grade set
     * @param {string} grade - Grade to validate
     * @returns {boolean} True if valid, false otherwise
     */
    validateGrade(grade) {
        // Check if grade is in the valid set of grades
        return Object.keys(GRADE_POINTS).includes(grade);
    },

    /**
     * Validate a complete subject object (all fields filled and valid)
     * @param {Object} subject - Subject object with name, credits, grade
     * @returns {Object} Result object with valid flag and error message
     */
    validateSubject(subject) {
        // Check if subject is provided
        if (!subject) {
            return {
                valid: false,
                error: 'All fields are required'
            };
        }

        // Check if all required fields are present and not empty
        if (!subject.name || subject.name.trim() === '' || subject.credits === undefined || subject.grade === undefined) {
            return {
                valid: false,
                error: 'All fields are required'
            };
        }

        // Validate credits
        if (!this.validateCredits(subject.credits)) {
            return {
                valid: false,
                error: 'Credits must be a number between 1 and 10'
            };
        }

        // Validate grade
        if (!this.validateGrade(subject.grade)) {
            return {
                valid: false,
                error: 'Please select a valid grade'
            };
        }

        // All validations passed
        return {
            valid: true,
            error: ''
        };
    },

    /**
     * Calculate the GPA for a semester
     * Formula: sum(credits * gradePoints) / sum(credits)
     * @param {Array} subjects - Array of subject objects in the semester
     * @returns {string} GPA value (0-10), formatted to 2 decimal places
     */
    calculateSemesterGPA(subjects) {
        // Handle empty subjects array
        if (!subjects || subjects.length === 0) {
            return '0.00';
        }

        // Calculate sum of (credits × grade_points) and sum of credits
        let totalWeightedPoints = 0;
        let totalCredits = 0;

        for (const subject of subjects) {
            const gradePoints = this.gradeToPoints(subject.grade);
            totalWeightedPoints += subject.credits * gradePoints;
            totalCredits += subject.credits;
        }

        // Handle edge case where total credits is zero
        if (totalCredits === 0) {
            return '0.00';
        }

        // Calculate GPA using weighted average formula
        const gpa = totalWeightedPoints / totalCredits;

        // Format to 2 decimal places
        return gpa.toFixed(2);
    },

    /**
     * Calculate the cumulative CGPA across all semesters
     * Formula: sum(all credits * gradePoints) / sum(all credits)
     * @param {Array} semesters - Array of semester objects
     * @returns {number} CGPA value (0-10), formatted to 2 decimal places
     */
    calculateCGPA(semesters) {
        // Handle edge case: empty semesters array
        if (!semesters || semesters.length === 0) {
            return parseFloat('0.00');
        }

        let totalWeightedGradePoints = 0;
        let totalCredits = 0;

        // Iterate through all semesters
        for (let semester of semesters) {
            // Skip if semester or subjects array doesn't exist
            if (!semester || !semester.subjects || semester.subjects.length === 0) {
                continue;
            }

            // Iterate through all subjects in the semester
            for (let subject of semester.subjects) {
                // Skip if subject is invalid
                if (!subject || subject.credits === undefined || !subject.grade) {
                    continue;
                }

                // Convert grade to points
                const gradePoints = this.gradeToPoints(subject.grade);

                // Accumulate weighted grade points and credits
                totalWeightedGradePoints += subject.credits * gradePoints;
                totalCredits += subject.credits;
            }
        }

        // Handle edge case: if no valid subjects found, return 0
        if (totalCredits === 0) {
            return parseFloat('0.00');
        }

        // Calculate CGPA and format to 2 decimal places
        const cgpa = totalWeightedGradePoints / totalCredits;
        return parseFloat(cgpa.toFixed(2));
    }
};

// ============================================
// 4. UI CONTROLLER MODULE
// ============================================

/**
 * UIController Module
 * Responsible for all user interface rendering and event handling
 */
const UIController = {
    /**
     * Initialize the UI controller
     * Bind all event listeners and render initial state
     */
    init() {
        // Render initial state
        this.renderSemesterTabs();
        this.renderSubjects(DataManager.state.activeSemesterId);
        this.updateGPADisplays();
        this.updateModeIndicator();
        
        // Bind event listeners
        this.bindEventListeners();
    },

    /**
     * Bind all event listeners
     */
    bindEventListeners() {
        // Subject form binding
        const addSubjectBtn = document.getElementById('addSubjectBtn');
        if (addSubjectBtn) {
            addSubjectBtn.addEventListener('click', () => this.handleAddSubject());
        }

        // Semester management
        const addSemesterBtn = document.getElementById('addSemesterBtn');
        if (addSemesterBtn) {
            addSemesterBtn.addEventListener('click', () => this.handleAddSemester());
        }

        const deleteSemesterBtn = document.getElementById('deleteSemesterBtn');
        if (deleteSemesterBtn) {
            deleteSemesterBtn.addEventListener('click', () => this.handleDeleteSemester());
        }

        // What-If mode
        const whatIfBtn = document.getElementById('whatIfBtn');
        if (whatIfBtn) {
            whatIfBtn.addEventListener('click', () => this.handleWhatIfMode());
        }

        // Export/Import
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.handleExport());
        }

        const importBtn = document.getElementById('importBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.handleImport());
        }

        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileImport(e));
        }

        // Clear all
        const clearAllBtn = document.getElementById('clearAllBtn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.handleClearAll());
        }

        // Semester tabs delegation with keyboard navigation
        const semesterTabs = document.getElementById('semesterTabs');
        if (semesterTabs) {
            semesterTabs.addEventListener('click', (e) => {
                if (e.target.classList.contains('semester-tab')) {
                    this.handleSemesterSwitch(e.target.dataset.semesterId);
                }
            });

            // Keyboard navigation for semester tabs
            semesterTabs.addEventListener('keydown', (e) => {
                const tabs = Array.from(semesterTabs.querySelectorAll('.semester-tab'));
                const activeTab = semesterTabs.querySelector('.semester-tab.active');
                const currentIndex = tabs.indexOf(activeTab);

                let nextTab = null;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    nextTab = tabs[(currentIndex + 1) % tabs.length];
                    e.preventDefault();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    nextTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
                    e.preventDefault();
                } else if (e.key === 'Home') {
                    nextTab = tabs[0];
                    e.preventDefault();
                } else if (e.key === 'End') {
                    nextTab = tabs[tabs.length - 1];
                    e.preventDefault();
                }

                if (nextTab) {
                    this.handleSemesterSwitch(nextTab.dataset.semesterId);
                    nextTab.focus();
                }
            });
        }

        // Subject list deletion delegation
        const subjectList = document.getElementById('subjectList');
        if (subjectList) {
            subjectList.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-btn')) {
                    this.handleDeleteSubject(e.target.dataset.subjectId);
                }
            });
        }

        // Modal close
        const modal = document.getElementById('confirmModal');
        if (modal) {
            const cancelBtn = modal.querySelector('.cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.closeModal());
            }
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'flex') {
                    this.closeModal();
                }
            });
        }

        // Enter key support for subject form
        const subjectName = document.getElementById('subjectName');
        const subjectCredits = document.getElementById('subjectCredits');
        const subjectGrade = document.getElementById('subjectGrade');
        
        if (subjectName && subjectCredits && subjectGrade) {
            [subjectName, subjectCredits, subjectGrade].forEach(input => {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (addSubjectBtn) {
                            addSubjectBtn.click();
                        }
                    }
                });
            });
        }
    },

    /**
     * Render semester navigation tabs
     * Display all semesters in chronological order
     * Mark the active semester visually
     */
    renderSemesterTabs() {
        const tabsContainer = document.getElementById('semesterTabs');
        if (!tabsContainer) return;

        tabsContainer.innerHTML = '';

        DataManager.state.semesters.forEach((semester, index) => {
            const tab = document.createElement('button');
            tab.classList.add('semester-tab');
            if (semester.id === DataManager.state.activeSemesterId) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.setAttribute('aria-selected', 'false');
            }
            if (semester.isHypothetical) {
                tab.classList.add('hypothetical');
            }
            tab.dataset.semesterId = semester.id;
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-controls', `semester-panel-${semester.id}`);
            tab.textContent = semester.name;
            tabsContainer.appendChild(tab);
        });
    },

    /**
     * Render the subjects list for a specific semester
     * Display all subjects with name, credits, and grade
     * Include delete button for each subject
     * @param {string} semesterId - ID of the semester to render
     */
    renderSubjects(semesterId) {
        const listContainer = document.getElementById('subjectList');
        if (!listContainer) return;

        const semester = DataManager.getSemester(semesterId);
        if (!semester) return;

        listContainer.innerHTML = '';

        if (semester.subjects.length === 0) {
            listContainer.innerHTML = '<p class="no-data">No subjects added yet</p>';
            return;
        }

        semester.subjects.forEach(subject => {
            const item = document.createElement('div');
            item.classList.add('subject-item');
            item.setAttribute('role', 'listitem');
            item.innerHTML = `
                <div class="subject-info">
                    <span class="subject-name">${subject.name}</span>
                    <span class="subject-credits">Credits: ${subject.credits}</span>
                    <span class="subject-grade">Grade: ${subject.grade}</span>
                </div>
                <button class="delete-btn" data-subject-id="${subject.id}" aria-label="Delete ${subject.name}">Delete</button>
            `;
            listContainer.appendChild(item);
        });
    },

    /**
     * Update both semester GPA and cumulative CGPA displays
     * Format values to 2 decimal places
     */
    updateGPADisplays() {
        const activeSemester = DataManager.getActiveSemester();
        
        // Update semester GPA
        const gpaDisplay = document.getElementById('semesterGPA');
        if (gpaDisplay && activeSemester) {
            const gpa = Calculator.calculateSemesterGPA(activeSemester.subjects);
            gpaDisplay.textContent = gpa;
        }

        // Update CGPA
        const cgpaDisplay = document.getElementById('cgpa');
        if (cgpaDisplay) {
            const cgpa = Calculator.calculateCGPA(DataManager.state.semesters);
            cgpaDisplay.textContent = cgpa;
        }
    },

    /**
     * Update the what-if mode indicator
     * Show badge when in what-if mode, hide otherwise
     */
    updateModeIndicator() {
        const indicator = document.getElementById('whatIfIndicator');
        if (!indicator) return;

        if (DataManager.state.whatIfMode) {
            indicator.style.display = 'block';
        } else {
            indicator.style.display = 'none';
        }
    },

    /**
     * Display an error message to the user
     * @param {string} message - Error message to display
     */
    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    },

    /**
     * Clear any displayed error messages
     */
    clearError() {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
    },

    /**
     * Show a confirmation modal dialog
     * @param {string} title - Modal title
     * @param {string} message - Modal message
     * @param {Function} onConfirm - Callback function when user confirms
     */
    showModal(title, message, onConfirm) {
        const modal = document.getElementById('confirmModal');
        if (!modal) return;

        const titleElem = modal.querySelector('.modal-title');
        const messageElem = modal.querySelector('.modal-message');
        const confirmBtn = modal.querySelector('.confirm-btn');

        if (titleElem) titleElem.textContent = title;
        if (messageElem) messageElem.textContent = message;

        // Clear previous event listener
        if (confirmBtn) {
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            newConfirmBtn.addEventListener('click', () => {
                onConfirm();
                this.closeModal();
            });
        }

        modal.style.display = 'flex';
    },

    /**
     * Close the modal dialog
     */
    closeModal() {
        const modal = document.getElementById('confirmModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    /**
     * Handle adding a new subject
     * Validate inputs, add to state, update display
     */
    handleAddSubject() {
        this.clearError();

        // Get form inputs
        const nameInput = document.getElementById('subjectName');
        const creditsInput = document.getElementById('subjectCredits');
        const gradeInput = document.getElementById('subjectGrade');

        if (!nameInput || !creditsInput || !gradeInput) return;

        const subject = {
            name: nameInput.value,
            credits: parseInt(creditsInput.value),
            grade: gradeInput.value
        };

        // Validate
        const validation = Calculator.validateSubject(subject);
        if (!validation.valid) {
            this.showError(validation.error);
            return;
        }

        // Add to state
        const activeSemester = DataManager.getActiveSemester();
        if (activeSemester) {
            DataManager.addSubject(activeSemester.id, subject);
            
            // Clear form
            nameInput.value = '';
            creditsInput.value = '';
            gradeInput.value = '';

            // Re-render
            this.renderSubjects(activeSemester.id);
            this.updateGPADisplays();
        }
    },

    /**
     * Handle deleting a subject
     * @param {string} subjectId - ID of subject to delete
     */
    handleDeleteSubject(subjectId) {
        const activeSemester = DataManager.getActiveSemester();
        if (activeSemester) {
            DataManager.deleteSubject(activeSemester.id, subjectId);
            this.renderSubjects(activeSemester.id);
            this.updateGPADisplays();
        }
    },

    /**
     * Handle adding a new semester
     */
    handleAddSemester() {
        const isHypothetical = DataManager.state.whatIfMode;
        DataManager.addSemester(isHypothetical);
        this.renderSemesterTabs();
        this.renderSubjects(DataManager.state.activeSemesterId);
        this.updateGPADisplays();
    },

    /**
     * Handle deleting the active semester
     */
    handleDeleteSemester() {
        if (DataManager.state.semesters.length === 1) {
            this.showError('Cannot delete the last semester');
            return;
        }

        this.showModal(
            'Delete Semester',
            'Are you sure you want to delete this semester? This action cannot be undone.',
            () => {
                DataManager.deleteSemester(DataManager.state.activeSemesterId);
                this.renderSemesterTabs();
                this.renderSubjects(DataManager.state.activeSemesterId);
                this.updateGPADisplays();
            }
        );
    },

    /**
     * Handle switching to a different semester
     * @param {string} semesterId - ID of semester to switch to
     */
    handleSemesterSwitch(semesterId) {
        DataManager.setActiveSemester(semesterId);
        this.renderSemesterTabs();
        this.renderSubjects(semesterId);
        this.updateGPADisplays();
    },

    /**
     * Handle what-if mode toggle
     * Enter or exit what-if mode with appropriate confirmation
     */
    handleWhatIfMode() {
        if (!DataManager.state.whatIfMode) {
            DataManager.enterWhatIfMode();
            this.updateModeIndicator();
            this.renderSemesterTabs();
        } else {
            this.showModal(
                'Exit What-If Mode',
                'All hypothetical semesters will be discarded. Continue?',
                () => {
                    DataManager.exitWhatIfMode();
                    this.updateModeIndicator();
                    this.renderSemesterTabs();
                    this.renderSubjects(DataManager.state.activeSemesterId);
                    this.updateGPADisplays();
                }
            );
        }
    },

    /**
     * Handle exporting data to JSON file
     */
    handleExport() {
        const data = DataManager.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gpa-calculator-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Handle importing data from JSON file
     */
    handleImport() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    },

    /**
     * Handle file import event
     * @param {Event} event - File input change event
     */
    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = e.target.result;
                if (DataManager.importData(json)) {
                    this.clearError();
                    this.renderSemesterTabs();
                    this.renderSubjects(DataManager.state.activeSemesterId);
                    this.updateGPADisplays();
                    alert('Data imported successfully');
                } else {
                    this.showError('Invalid data format');
                }
            } catch (error) {
                this.showError('Failed to import data');
            }
        };
        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    },

    /**
     * Handle clearing all data with confirmation
     */
    handleClearAll() {
        this.showModal(
            'Clear All Data',
            'This will permanently delete all your data. This action cannot be undone. Are you sure?',
            () => {
                DataManager.clearAll();
                this.renderSemesterTabs();
                this.renderSubjects(DataManager.state.activeSemesterId);
                this.updateGPADisplays();
                this.clearError();
            }
        );
    }
};

// ============================================
// 5. APPLICATION INITIALIZATION
// ============================================

/**
 * DOMContentLoaded Event Listener
 * Initialize the application when the DOM is fully loaded
 */
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize DataManager with persisted data from localStorage
        DataManager.init();

        // Initialize UIController to set up event listeners and render initial state
        UIController.init();
    });
}

// ============================================
// 6. NODE.JS EXPORTS FOR TESTING
// ============================================

// Check if we're running in Node.js (for testing) or in a browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GRADE_POINTS,
        STORAGE_KEY,
        DataManager,
        Calculator,
        UIController
    };
}
