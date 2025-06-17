import { DateManager } from '../utils/dateManager.js';

export class Calendar {
    constructor() {
        this.dateManager = new DateManager();
    }

    getDates() {
        return this.dateManager.getMonthDates();
    }

    getFormattedTitle() {
        return this.dateManager.getFormattedTitle();
    }

    setDate(month, year) {
        this.dateManager.setDate(month, year);
    }

    getMonth() {
        return this.dateManager.getMonth();
    }

    getYear() {
        return this.dateManager.getYear();
    }
} 