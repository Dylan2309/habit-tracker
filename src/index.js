import { HabitTracker } from './components/HabitTracker.js';

console.log('Script loaded');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    // Initialize the habit tracker
    window.habitTracker = new HabitTracker();
    console.log('HabitTracker initialized');
}); 