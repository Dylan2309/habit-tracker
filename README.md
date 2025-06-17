# Habit Tracker

A simple and intuitive habit tracking application that helps you monitor your daily habits, spending, and sleep patterns.

## Features

- Track up to 5 habits simultaneously
- Daily habit completion tracking
- Monthly calendar view
- Daily spending tracker
- Sleep hours tracking
- Payday indicator
- Monthly statistics
- Edit mode for managing habits and data

## Habit Management

- Add new habits from predefined options or create custom ones
- Remove habits when needed
- Maximum of 5 habits at any time
- Edit mode required for adding/removing habits

## Usage

1. Click "Edit Mode" to enter edit mode
2. Use "Add Habit" to create new habits (up to 5)
3. Use "Remove Habit" to delete existing habits
4. Click checkboxes to mark habits as complete
5. Enter daily spending amounts
6. Track sleep hours
7. Set your payday for the month
8. View monthly statistics

## Controls

- **Edit Mode**: Toggle edit mode to manage habits and data
- **Add Habit**: Add new habits (available in edit mode)
- **Remove Habit**: Remove existing habits (available in edit mode)
- **Monthly Stats**: View statistics for the current month

## Data Storage

All data is stored locally on your device and persists between sessions.

## Development

This application is built using:
- HTML5
- CSS3
- JavaScript (ES6+)
- Electron

## License

MIT License

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd habit-tracker
```

2. Install dependencies:
```bash
npm install
```

## Development

To run the application in development mode:
```bash
npm start
```

## Building

To build the application for your platform:
```bash
npm run build
```

## Technologies Used

- Electron - Cross-platform desktop application framework
- electron-store - Persistent data storage
- HTML/CSS/JavaScript - Frontend development

## Project Structure

```
habit-tracker/
├── src/              # Source files
├── node_modules/     # Dependencies
├── package.json      # Project configuration
└── index.html        # Main application window
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
