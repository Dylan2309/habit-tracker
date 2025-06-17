import { HabitTracker } from './components/HabitTracker.js';

console.log('Script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    // Init habit tracker
    window.habitTracker = new HabitTracker();
    console.log('HabitTracker initialized');
}); 