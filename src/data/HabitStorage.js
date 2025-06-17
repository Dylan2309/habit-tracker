export class HabitStorage {
    constructor() {
        this.habits = [];
        this.loadHabits();
    }

    async loadHabits() {
        this.habits = await window.api.getHabits();
    }

    async getHabits() {
        return this.habits;
    }

    async saveHabits(habits) {
        this.habits = habits;
        await window.api.saveHabits(habits);
    }
} 