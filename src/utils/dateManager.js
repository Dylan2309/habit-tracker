export class DateManager {
    constructor() {
        this.currentDate = new Date();
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        this.dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }

    getMonthName() {
        return this.monthNames[this.currentDate.getMonth()];
    }

    getYear() {
        return this.currentDate.getFullYear();
    }

    getMonth() {
        return this.currentDate.getMonth();
    }

    setDate(month, year) {
        this.currentDate = new Date(year, month);
    }

    getFormattedTitle() {
        return `${this.getMonthName()} ${this.getYear()}`;
    }

    getDaysInMonth() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        return new Date(year, month + 1, 0).getDate();
    }

    getFirstDayOfMonth() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        return new Date(year, month, 1).getDay();
    }

    getFormattedDate(day) {
        const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        const dayName = this.dayNames[date.getDay()];
        const dayNumber = this.getOrdinalSuffix(day);
        return `${dayName} ${day}${dayNumber}`;
    }

    getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    getMonthDates() {
        const daysInMonth = this.getDaysInMonth();
        const dates = [];
        
        for (let day = 1; day <= daysInMonth; day++) {
            dates.push({
                day,
                formatted: this.getFormattedDate(day),
                date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day)
            });
        }
        
        return dates;
    }
} 