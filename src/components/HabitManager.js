import { HabitStorage } from '../data/HabitStorage.js';

export class HabitManager {
    constructor() {
        this.storage = new HabitStorage();
        this.habits = [];
        this.dailySpending = {};
        this.dailySleep = {};
        this.payday = null; // This will now store the day of the month (1-31)
    }

    async loadHabits() {
        const data = await this.storage.getHabits();
        this.habits = data.habits || [];
        this.dailySpending = data.dailySpending || {};
        this.dailySleep = data.dailySleep || {};
        this.payday = data.payday || null;
        return this.habits;
    }

    async saveHabits() {
        await this.storage.saveHabits({
            habits: this.habits,
            dailySpending: this.dailySpending,
            dailySleep: this.dailySleep,
            payday: this.payday
        });
    }

    addHabit(name = 'New Habit') {
        if (this.canAddMoreHabits()) {
            this.habits.push({
                name: name,
                completedDays: {}
            });
            return true;
        }
        return false;
    }

    canAddMoreHabits() {
        return this.habits.length < 5;
    }

    updateHabitName(index, newName) {
        if (newName.trim()) {
            this.habits[index].name = newName.trim();
        }
    }

    toggleHabitCompletion(habitIndex, dateString) {
        const habit = this.habits[habitIndex];
        if (!habit.completedDays) {
            habit.completedDays = {};
        }
        habit.completedDays[dateString] = !habit.completedDays[dateString];
    }

    getHabits() {
        return this.habits;
    }

    updateDailySpending(dateString, amount) {
        this.dailySpending[dateString] = amount;
    }

    getDailySpending(dateString) {
        return this.dailySpending[dateString] || 0;
    }

    getDailySpendingData() {
        return this.dailySpending;
    }

    setPayday(dayOfMonth) {
        this.payday = dayOfMonth;
    }

    getPayday() {
        return this.payday;
    }

    isPayday(date) {
        if (!this.payday) return false;
        return date.getDate() === this.payday;
    }

    updateDailySleep(dateString, hours) {
        this.dailySleep[dateString] = hours;
    }

    getDailySleep(dateString) {
        return this.dailySleep[dateString] || 0;
    }

    getDailySleepData() {
        return this.dailySleep;
    }

    removeHabit(index) {
        if (index >= 0 && index < this.habits.length) {
            this.habits.splice(index, 1);
            return true;
        }
        return false;
    }
} 