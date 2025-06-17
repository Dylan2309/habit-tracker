import { Calendar } from './Calendar.js';
import { HabitManager } from './habitManager.js';

export class HabitTracker {
    constructor() {
        console.log('HabitTracker constructor called');
        this.calendar = new Calendar();
        this.habitManager = new HabitManager();
        this.isEditMode = false;
        this.predefinedHabits = [
            'Eat Fruit',
            'Go for Walk',
            'Read Book',
            'Drink Water',
            'Exercise',
            'Meditate',
            'Custom'
        ];
        
        this.initializeUI();
        this.setupEventListeners();
        this.loadAndRenderHabits();
        this.updateTitle();
    }

    async loadAndRenderHabits() {
        await this.habitManager.loadHabits();
        this.renderHabits();
    }

    initializeUI() {
        console.log('Initializing UI');
        this.habitsList = document.getElementById('habitsList');
        this.addHabitBtn = document.getElementById('addHabitBtn');
        this.removeHabitBtn = document.getElementById('removeHabitBtn');
        this.editModeBtn = document.getElementById('editModeBtn');
        this.monthlyStatsBtn = document.getElementById('monthlyStatsBtn');
        this.monthSelect = document.getElementById('monthSelect');
        this.yearInput = document.getElementById('yearInput');
        this.monthlyStatsModal = document.getElementById('monthlyStatsModal');
        this.closeStatsModal = document.getElementById('closeStatsModal');
        
        // Set initial values
        this.monthSelect.value = this.calendar.getMonth();
        this.yearInput.value = this.calendar.getYear();
        
        // Hide add and remove buttons initially
        this.addHabitBtn.style.display = 'none';
        this.removeHabitBtn.style.display = 'none';
        
        console.log('UI Elements:', {
            habitsList: this.habitsList,
            addHabitBtn: this.addHabitBtn,
            removeHabitBtn: this.removeHabitBtn,
            editModeBtn: this.editModeBtn,
            monthSelect: this.monthSelect,
            yearInput: this.yearInput
        });
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        this.addHabitBtn.addEventListener('click', () => {
            if (this.isEditMode) {
                console.log('Add Habit button clicked');
                this.addHabit();
            }
        });

        this.removeHabitBtn.addEventListener('click', () => {
            if (this.isEditMode) {
                console.log('Remove Habit button clicked');
                this.toggleRemoveMode();
            }
        });
        
        this.editModeBtn.addEventListener('click', () => {
            console.log('Edit Mode button clicked');
            this.toggleEditMode();
        });

        this.monthlyStatsBtn.addEventListener('click', () => this.showMonthlyStats());
        this.closeStatsModal.addEventListener('click', () => this.hideMonthlyStats());

        this.monthSelect.addEventListener('change', () => {
            if (this.isEditMode) {
                console.log('Month changed');
                this.updateDate();
            }
        });

        this.yearInput.addEventListener('change', () => {
            if (this.isEditMode) {
                console.log('Year changed');
                this.updateDate();
            }
        });
    }

    updateDate() {
        const month = parseInt(this.monthSelect.value);
        const year = parseInt(this.yearInput.value);
        this.calendar.setDate(month, year);
        this.updateTitle();
        this.renderHabits();
    }

    updateTitle() {
        document.querySelector('h1').textContent = this.calendar.getFormattedTitle();
    }

    renderHabits() {
        console.log('Rendering habits');
        this.habitsList.innerHTML = '';
        
        // Create calendar grid
        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid';
        
        // Create header row
        const headerRow = document.createElement('div');
        headerRow.className = 'calendar-header';
        
        // Add dates column header
        const datesColumnHeader = document.createElement('div');
        datesColumnHeader.className = 'dates-column';
        headerRow.appendChild(datesColumnHeader);
        
        // Add habit headers
        const habits = this.habitManager.getHabits();
        habits.forEach((habit, index) => {
            const habitHeader = document.createElement('div');
            habitHeader.className = 'habit-header';
            
            // Create habit column container
            const habitColumn = document.createElement('div');
            habitColumn.className = 'habit-column';
            
            // Add delete indicator
            const deleteIndicator = document.createElement('div');
            deleteIndicator.className = 'delete-indicator';
            deleteIndicator.textContent = '×';
            deleteIndicator.style.display = 'none';
            deleteIndicator.addEventListener('click', () => this.removeHabit(index));
            habitColumn.appendChild(deleteIndicator);
            
            // Add habit name
            const habitName = document.createElement('div');
            habitName.textContent = habit.name;
            habitColumn.appendChild(habitName);
            
            habitHeader.appendChild(habitColumn);
            headerRow.appendChild(habitHeader);
        });
        
        // Add spending header
        const spendingHeader = document.createElement('div');
        spendingHeader.className = 'habit-header';
        spendingHeader.textContent = 'Daily Spend';
        headerRow.appendChild(spendingHeader);
        
        // Add sleep header
        const sleepHeader = document.createElement('div');
        sleepHeader.className = 'habit-header';
        sleepHeader.textContent = 'Sleep';
        headerRow.appendChild(sleepHeader);
        
        calendarGrid.appendChild(headerRow);
        
        // Add date rows
        const dates = this.calendar.getDates();
        const today = new Date();
        
        dates.forEach((date, dayIndex) => {
            const dateRow = document.createElement('div');
            dateRow.className = 'date-row';
            
            // Check if this is today's date
            if (date.date.toDateString() === today.toDateString()) {
                dateRow.classList.add('current-date');
            }
            
            // Add date item
            const dateItem = document.createElement('div');
            dateItem.className = 'date-item';
            
            const dateContainer = document.createElement('div');
            dateContainer.className = 'date-container';
            
            const dateText = document.createElement('span');
            dateText.textContent = date.formatted;
            dateContainer.appendChild(dateText);
            
            if (this.habitManager.isPayday(date.date)) {
                const starSpan = document.createElement('span');
                starSpan.className = 'payday-star';
                starSpan.textContent = '⭐';
                dateContainer.appendChild(starSpan);
            }
            
            dateItem.appendChild(dateContainer);
            dateRow.appendChild(dateItem);
            
            // Add habit checkboxes
            const dateString = date.date.toISOString().split('T')[0];
            habits.forEach((habit, habitIndex) => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'habit-checkbox';
                checkbox.checked = habit.completedDays[dateString] || false;
                checkbox.addEventListener('change', () => this.toggleHabit(habitIndex, dateString));
                dateRow.appendChild(checkbox);
            });
            
            // Add spending input
            const spendingInput = document.createElement('input');
            spendingInput.type = 'number';
            spendingInput.className = 'spending-input';
            spendingInput.min = '0';
            spendingInput.step = '0.5';
            spendingInput.value = this.habitManager.getDailySpending(dateString);
            spendingInput.placeholder = '0.00';
            spendingInput.addEventListener('change', (e) => {
                const amount = parseFloat(e.target.value) || 0;
                this.habitManager.updateDailySpending(dateString, amount);
                this.saveAndRender();
            });
            dateRow.appendChild(spendingInput);
            
            // Add sleep input
            const sleepInput = document.createElement('input');
            sleepInput.type = 'number';
            sleepInput.className = 'sleep-input';
            sleepInput.min = '0';
            sleepInput.max = '12';
            sleepInput.step = '0.5';
            sleepInput.value = this.habitManager.getDailySleep(dateString) || '';
            sleepInput.placeholder = '0.0';
            sleepInput.addEventListener('change', (e) => {
                const hours = parseFloat(e.target.value) || 0;
                this.habitManager.updateDailySleep(dateString, hours);
            });
            dateRow.appendChild(sleepInput);
            
            calendarGrid.appendChild(dateRow);
        });
        
        this.habitsList.appendChild(calendarGrid);
    }

    async addHabit() {
        console.log('Adding new habit');
        
        if (!this.habitManager.canAddMoreHabits()) {
            alert('You have reached the maximum limit of 5 habits.');
            return;
        }
        
        // Create modal for habit selection
        const modal = document.createElement('div');
        modal.className = 'habit-modal';
        modal.innerHTML = `
            <div class="habit-modal-content">
                <h3>Add New Habit</h3>
                <select id="habitSelect" class="habit-select">
                    ${this.predefinedHabits.map(habit => 
                        `<option value="${habit}">${habit}</option>`
                    ).join('')}
                </select>
                <input type="text" id="customHabitInput" class="custom-habit-input hidden" placeholder="Enter custom habit">
                <div class="modal-buttons">
                    <button id="confirmHabitBtn">Add</button>
                    <button id="cancelHabitBtn">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const habitSelect = modal.querySelector('#habitSelect');
        const customHabitInput = modal.querySelector('#customHabitInput');
        const confirmBtn = modal.querySelector('#confirmHabitBtn');
        const cancelBtn = modal.querySelector('#cancelHabitBtn');
        
        // Show/hide custom input based on selection
        habitSelect.addEventListener('change', () => {
            if (habitSelect.value === 'Custom') {
                customHabitInput.classList.remove('hidden');
                customHabitInput.focus();
            } else {
                customHabitInput.classList.add('hidden');
                customHabitInput.value = ''; // Clear the input when hidden
            }
        });
        
        // Handle confirmation
        confirmBtn.addEventListener('click', () => {
            let habitName;
            if (habitSelect.value === 'Custom') {
                habitName = customHabitInput.value.trim();
                if (!habitName) {
                    customHabitInput.focus();
                    return; // Don't close modal if custom input is empty
                }
            } else {
                habitName = habitSelect.value;
            }
            
            if (this.habitManager.addHabit(habitName)) {
                this.saveAndRender();
                this.updateAddButtonState();
            }
            document.body.removeChild(modal);
        });
        
        // Handle cancellation
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    updateAddButtonState() {
        if (this.isEditMode) {
            this.addHabitBtn.disabled = !this.habitManager.canAddMoreHabits();
            this.addHabitBtn.style.opacity = this.habitManager.canAddMoreHabits() ? '1' : '0.5';
        }
    }

    async toggleHabit(habitIndex, dateString) {
        console.log('Toggling habit:', { habitIndex, dateString });
        this.habitManager.toggleHabitCompletion(habitIndex, dateString);
        await this.saveAndRender();
    }

    async updateHabitName(index, newName) {
        console.log('Updating habit name:', { index, newName });
        this.habitManager.updateHabitName(index, newName);
        await this.saveAndRender();
    }

    toggleEditMode() {
        console.log('Toggling edit mode');
        this.isEditMode = !this.isEditMode;
        document.body.classList.toggle('edit-mode', this.isEditMode);
        this.editModeBtn.textContent = this.isEditMode ? 'Save' : 'Edit Mode';
        
        // Show/hide add and remove buttons based on edit mode
        this.addHabitBtn.style.display = this.isEditMode ? 'block' : 'none';
        this.removeHabitBtn.style.display = this.isEditMode ? 'block' : 'none';
        
        // Update add button state
        if (this.isEditMode) {
            this.updateAddButtonState();
        }

        // Add or remove payday button
        if (this.isEditMode) {
            this.addPaydayButton();
        } else {
            this.removePaydayButton();
        }
    }

    addPaydayButton() {
        // Remove existing button if any
        this.removePaydayButton();

        // Create new button
        const paydayBtn = document.createElement('button');
        paydayBtn.id = 'setPaydayBtn';
        paydayBtn.className = 'payday-button';
        paydayBtn.textContent = this.habitManager.getPayday() ? 
            `Change Payday (Current: ${this.habitManager.getPayday()})` : 
            'Set Payday';
        
        // Add click handler
        paydayBtn.addEventListener('click', () => {
            // Create modal for payday selection
            const modal = document.createElement('div');
            modal.className = 'habit-modal';
            modal.innerHTML = `
                <div class="habit-modal-content">
                    <h3>Set Payday</h3>
                    <div class="payday-input-container">
                        <label for="paydayInput">Enter the day of the month for payday (1-31):</label>
                        <input type="number" id="paydayInput" min="1" max="31" 
                            value="${this.habitManager.getPayday() || ''}" 
                            placeholder="Enter day (1-31)">
                    </div>
                    <div class="modal-buttons">
                        <button id="confirmPaydayBtn">Save</button>
                        <button id="cancelPaydayBtn">Cancel</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            const paydayInput = modal.querySelector('#paydayInput');
            const confirmBtn = modal.querySelector('#confirmPaydayBtn');
            const cancelBtn = modal.querySelector('#cancelPaydayBtn');
            
            // Handle confirmation
            confirmBtn.addEventListener('click', () => {
                const dayNum = parseInt(paydayInput.value);
                if (dayNum >= 1 && dayNum <= 31) {
                    this.habitManager.setPayday(dayNum);
                    this.saveAndRender();
                    paydayBtn.textContent = `Change Payday`;
                    document.body.removeChild(modal);
                } else {
                    paydayInput.classList.add('error');
                    paydayInput.focus();
                }
            });
            
            // Handle cancellation
            cancelBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });

            // Handle Enter key
            paydayInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    confirmBtn.click();
                }
            });

            // Focus the input
            paydayInput.focus();
        });

        // Add button to controls
        const controls = document.querySelector('.controls');
        controls.insertBefore(paydayBtn, this.addHabitBtn);
    }

    removePaydayButton() {
        const existingBtn = document.getElementById('setPaydayBtn');
        if (existingBtn) {
            existingBtn.remove();
        }
    }

    async saveAndRender() {
        console.log('Saving and rendering habits');
        await this.habitManager.saveHabits();
        this.renderHabits();
    }

    showMonthlyStats() {
        const stats = this.calculateMonthlyStats();
        this.displayMonthlyStats(stats);
        this.monthlyStatsModal.style.display = 'block';
    }

    hideMonthlyStats() {
        this.monthlyStatsModal.style.display = 'none';
    }

    calculateMonthlyStats() {
        const dates = this.calendar.getDates();
        const today = new Date();
        const currentDate = today.getDate();
        
        // Filter dates up to current date
        const relevantDates = dates.filter(date => date.date.getDate() <= currentDate);
        
        // Calculate habit completion
        const habits = this.habitManager.getHabits();
        let totalHabits = 0;
        let completedHabits = 0;
        
        habits.forEach(habit => {
            relevantDates.forEach(date => {
                const dateString = date.date.toISOString().split('T')[0];
                if (habit.completedDays[dateString]) {
                    completedHabits++;
                }
                totalHabits++;
            });
        });
        
        // Calculate total spending
        let totalSpending = 0;
        relevantDates.forEach(date => {
            const dateString = date.date.toISOString().split('T')[0];
            totalSpending += this.habitManager.getDailySpending(dateString) || 0;
        });
        
        // Calculate average sleep
        let totalSleep = 0;
        let sleepDays = 0;
        relevantDates.forEach(date => {
            const dateString = date.date.toISOString().split('T')[0];
            const sleep = this.habitManager.getDailySleep(dateString);
            if (sleep) {
                totalSleep += sleep;
                sleepDays++;
            }
        });
        
        return {
            habitCompletion: {
                percentage: totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0,
                completed: completedHabits,
                total: totalHabits
            },
            spending: {
                total: totalSpending,
                average: relevantDates.length > 0 ? totalSpending / relevantDates.length : 0
            },
            sleep: {
                average: sleepDays > 0 ? totalSleep / sleepDays : 0,
                totalDays: sleepDays
            }
        };
    }

    displayMonthlyStats(stats) {
        // Display habit completion
        const habitCompletionStats = document.getElementById('habitCompletionStats');
        habitCompletionStats.innerHTML = `
            <div class="stat-value">${stats.habitCompletion.percentage.toFixed(1)}%</div>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${stats.habitCompletion.percentage}%"></div>
            </div>
            <div class="stat-label">${stats.habitCompletion.completed} of ${stats.habitCompletion.total} habits completed</div>
        `;
        
        // Display spending
        const monthlySpendingStats = document.getElementById('monthlySpendingStats');
        monthlySpendingStats.innerHTML = `
            <div class="stat-value">€${stats.spending.total.toFixed(2)}</div>
            <div class="stat-label">Total spending this month</div>
            <div class="stat-value">€${stats.spending.average.toFixed(2)}</div>
            <div class="stat-label">Average daily spending</div>
        `;
        
        // Display sleep
        const averageSleepStats = document.getElementById('averageSleepStats');
        averageSleepStats.innerHTML = `
            <div class="stat-value">${stats.sleep.average.toFixed(1)} hours</div>
            <div class="stat-label">Average sleep per night</div>
            <div class="stat-value">${stats.sleep.totalDays}</div>
            <div class="stat-label">Days tracked</div>
        `;
    }

    toggleRemoveMode() {
        const isRemoveMode = this.removeHabitBtn.classList.toggle('active');
        this.removeHabitBtn.textContent = isRemoveMode ? 'Cancel Remove' : 'Remove Habit';
        
        // Toggle remove-mode class on body
        document.body.classList.toggle('remove-mode', isRemoveMode);
        
        // Toggle delete indicators
        const deleteIndicators = document.querySelectorAll('.delete-indicator');
        deleteIndicators.forEach(indicator => {
            indicator.style.display = isRemoveMode ? 'block' : 'none';
        });
    }

    async removeHabit(index) {
        if (confirm('Are you sure you want to remove this habit?')) {
            if (this.habitManager.removeHabit(index)) {
                await this.saveAndRender();
                this.updateAddButtonState();
                this.toggleRemoveMode(); // Exit remove mode after successful deletion
            }
        }
    }
} 