# GPA/CGPA Calculator

A web-based application that helps students calculate their Grade Point Average (GPA) for individual semesters and their Cumulative Grade Point Average (CGPA) across multiple semesters. Plan your academic trajectory with the "what-if" simulation mode to project future semester outcomes.

## Features

- **Semester GPA Calculation**: Automatically calculate your GPA for each semester using a weighted average formula
- **Cumulative CGPA Tracking**: Track your overall academic performance across all semesters
- **Multiple Semester Management**: Create and manage multiple semesters with full data organization
- **Subject Management**: Add, view, and remove individual subjects with credits and grades
- **What-If Simulation Mode**: Simulate future semester outcomes to plan your target CGPA
- **Data Persistence**: Automatic saving to browser local storage—your data persists between sessions
- **Data Export/Import**: Export your academic records as JSON for backup or import previously saved data
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **No Installation Required**: Pure HTML, CSS, and JavaScript—runs directly in your browser
- **Cross-Browser Compatible**: Supports Chrome, Firefox, Safari, and Edge

## Grading Scale

The calculator uses the standard 10-point grading scale:

| Grade | Grade Points |
|-------|--------------|
| O     | 10.0         |
| A+    | 9.0          |
| A     | 8.0          |
| B+    | 7.0          |
| B     | 6.0          |
| C     | 5.0          |
| D     | 4.0          |
| F     | 0.0          |

## Installation

### Prerequisites

- A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+)
- No external dependencies or installations required

### Quick Start

1. **Download or Clone** the project files
2. **Navigate** to the project directory
3. **Open** `index.html` in your web browser
   - You can double-click `index.html` to open it directly
   - Or drag `index.html` into your browser window
   - Or use a local server (recommended for best compatibility)

#### Using a Local Server (Optional)

For the best experience, serve the files through a local HTTP server:

**Using Python 3:**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Using Node.js (http-server):**
```bash
npx http-server
```

**Using PHP:**
```bash
php -S localhost:8000
```

## Usage Overview

### Adding a Semester

1. Click the **"Add Semester"** button in the controls section
2. A new semester will be created and automatically selected
3. You can now add subjects to this semester

### Adding Subjects

1. Enter the subject name (e.g., "Mathematics", "English")
2. Enter the credit hours (1-10)
3. Select the grade from the dropdown
4. Click **"Add Subject"**
5. The subject appears in the subjects list and your semester GPA updates automatically

### Viewing GPA and CGPA

- **Semester GPA**: Displayed below the subjects list for the currently selected semester
- **Cumulative CGPA**: Prominently displayed at the top of the application
- Both values are updated in real-time as you add, modify, or remove subjects

### Managing Multiple Semesters

1. Click on semester tabs at the top to switch between semesters
2. Each semester displays its own subjects and GPA
3. Semesters are listed in chronological order (oldest to newest)

### Deleting a Subject

1. Click the **"Delete"** button next to any subject
2. The subject is immediately removed
3. GPA and CGPA values update automatically

### Deleting a Semester

1. Click the **"Delete Semester"** button (only available if more than one semester exists)
2. Confirm the action in the dialog
3. The semester and all its subjects are removed
4. Your CGPA recalculates automatically

### What-If Simulation Mode

Use this feature to plan your academic goals:

1. Click **"What-If Mode"** to enter simulation mode
2. A blue indicator badge appears showing the mode is active
3. Create hypothetical future semesters by adding subjects with projected grades
4. Your projected CGPA is calculated including both real and hypothetical semesters
5. Hypothetical semesters appear with a visual distinction
6. Exit What-If Mode to discard all hypothetical semesters and restore your real data

**Note**: Hypothetical data is not saved to local storage.

### Exporting Your Data

1. Click **"Export Data"** button
2. A JSON file is automatically downloaded to your computer
3. The file is named with a timestamp (e.g., `gpa-calculator-2024-01-15.json`)
4. Use this backup to transfer your data to another device or for safekeeping

### Importing Data

1. Click **"Import Data"** button
2. Select a previously exported JSON file
3. Click "Open"
4. Your data is restored and you'll see a confirmation message
5. **Warning**: Importing will replace your current data—export first if you need to preserve it

### Clearing All Data

1. Click **"Clear All Data"** button
2. A confirmation dialog appears with a strong warning
3. Click "Confirm" to permanently delete all semesters and subjects
4. The application resets to a fresh state with one empty semester
5. **Note**: This action cannot be undone—make sure you've exported your data first if needed

## Understanding Your Calculations

### GPA Formula

GPA is calculated as a weighted average:

```
GPA = (Sum of: Credits × Grade Points for each subject) / Total Credits
```

**Example:**
- Subject 1: 3 credits, A (8.0) = 3 × 8 = 24
- Subject 2: 4 credits, B+ (7.0) = 4 × 7 = 28
- Subject 3: 2 credits, A+ (9.0) = 2 × 9 = 18

GPA = (24 + 28 + 18) / (3 + 4 + 2) = 70 / 9 = 7.78

### CGPA Formula

CGPA is your cumulative GPA across all semesters:

```
CGPA = (Sum of: Credits × Grade Points for all subjects across all semesters) / Total Credits across all semesters
```

CGPA combines the academic performance from every semester into a single comprehensive measure.

## Data Storage

- **Local Storage**: Your data is automatically saved to your browser's local storage
- **No Account Required**: Everything is stored locally on your device
- **Privacy**: Your academic data never leaves your computer
- **Persistence**: Data remains saved even after closing the browser

### Storage Warning

If your browser's local storage is unavailable:
- A warning message appears
- The application continues to work in memory-only mode
- Your data will not persist after closing the browser
- Export your data regularly as a backup

## Browser Compatibility

The GPA/CGPA Calculator is tested and compatible with:

- **Chrome**: Version 90 or higher
- **Firefox**: Version 88 or higher
- **Safari**: Version 14 or higher
- **Edge**: Version 90 or higher

**Note**: Mobile browsers (Chrome Mobile, Safari iOS, Firefox Mobile) are also supported with full responsive design.

## Keyboard Shortcuts

- **Tab**: Navigate between form fields and interactive elements
- **Enter**: Submit forms or activate buttons
- **Escape**: Close confirmation dialogs

## Tips for Best Results

1. **Regular Backups**: Export your data monthly to protect against data loss
2. **What-If Planning**: Use the simulation mode at the beginning of each semester to plan your target grades
3. **Accurate Credits**: Ensure credit values match your course registration
4. **Letter Grades**: Only grades from the scale are supported (case-insensitive input may vary by implementation)
5. **Private Device**: For privacy, use this calculator on a device you control

## Accessibility Features

The GPA/CGPA Calculator is designed with accessibility in mind:

### Keyboard Navigation
- **Tab**: Move between interactive elements
- **Shift + Tab**: Move backwards through elements
- **Enter**: Submit forms or activate buttons
- **Escape**: Close confirmation dialogs
- **Arrow Keys** (Left/Right/Up/Down): Navigate between semester tabs
- **Home**: Jump to the first semester tab
- **End**: Jump to the last semester tab

### Screen Reader Support
- Proper semantic HTML with ARIA labels and roles
- Live regions for dynamic content updates
- Form field descriptions and labels
- Status messages announced to assistive technology

### Visual Accessibility
- High color contrast ratios meeting WCAG AA standards
- Focus indicators clearly visible on all interactive elements
- Large clickable targets (minimum 44x44 pixels on mobile)
- Responsive design works on all device sizes
- Dark mode support for reduced strain

### Browser Accessibility Settings
- Respects **prefers-reduced-motion** for users with vestibular disorders
- Respects **prefers-contrast** for users requiring higher contrast
- Respects **prefers-color-scheme** for dark mode preferences
- Supports **forced-colors** mode for Windows High Contrast users

## Performance Considerations

- **No External Dependencies**: Pure vanilla JavaScript ensures fast load times
- **Minimal Bundle Size**: Single HTML file with embedded CSS and JavaScript
- **Local Storage**: Data persists without server calls
- **Instant Calculations**: All calculations happen in real-time
- **Mobile Optimized**: Responsive design works smoothly on all devices

## Data Privacy & Security

- **Zero External Requests**: All data stays on your device
- **Browser Local Storage**: Data stored only in your browser
- **No Cloud Sync**: No accounts, no servers, complete privacy
- **Export Control**: You control when to back up your data
- **Complete Transparency**: View the complete source code anytime

## Troubleshooting

### Data Not Saving?

- Check if local storage is enabled in your browser settings
- Try exporting your data to JSON as a backup
- Restart your browser and try again
- Check browser storage limits (usually 5-10MB per site)

### Calculations Seem Wrong?

- Verify all subject credits are entered (1-10)
- Check that grades are selected from the dropdown
- Review the grading scale table above to ensure correct grade points
- Note: GPA = (Sum of Credits × Grade Points) / Total Credits

### Page Not Loading?

- Make sure all files (index.html, styles.css, app.js) are in the same directory
- Try opening the file in a different browser
- Clear your browser cache and reload
- Check browser console for error messages (F12)

### Import Failed?

- Verify the JSON file is a valid export from this calculator
- Ensure the file hasn't been modified manually
- Try exporting fresh data and importing again to test
- Check for file corruption or incomplete downloads

### Keyboard Navigation Not Working?

- Ensure JavaScript is enabled in your browser
- Try refreshing the page (Ctrl+R or Cmd+R)
- Check if browser extensions are interfering
- Test in a different browser to isolate the issue

### Accessibility Not Working?

- Enable screen reader or accessibility settings
- Verify browser has latest updates installed
- Check OS accessibility settings are configured
- Test with native accessibility tools (built into OS)

## Development & Contribution

### Project Structure

```
gpa-cgpa-calculator/
├── index.html       # Main HTML structure with semantic markup
├── styles.css       # Complete styling with responsive design
├── app.js           # JavaScript application with all logic
├── app.test.js      # Test file for unit testing
└── README.md        # This comprehensive documentation
```

### Technology Stack

- **HTML5**: Semantic markup with ARIA attributes
- **CSS3**: Advanced styling with CSS variables and media queries
- **Vanilla JavaScript (ES6+)**: Pure JavaScript, no frameworks or dependencies
- **Local Storage API**: Browser-based data persistence

### Code Architecture

The application uses a modular design with three main modules:

#### 1. DataManager Module
Manages application state and data persistence:
- State: semesters, active semester, what-if mode
- Methods: add/delete semester/subject, import/export, what-if mode

#### 2. Calculator Module
Handles all calculations and validation:
- GPA calculation with weighted average formula
- CGPA calculation across all semesters
- Input validation for credits and grades

#### 3. UIController Module
Manages user interface and event handling:
- Render semester tabs and subject lists
- Handle user interactions
- Update displays in real-time

### Testing

The project includes a test file (app.test.js) for unit testing using Jest or similar frameworks. Run tests with:

```bash
npm test
```

### Making Changes

1. Edit the respective file (HTML, CSS, or JavaScript)
2. Refresh your browser to see changes
3. Test all features to ensure nothing broke
4. Test on multiple browsers and devices
5. Verify accessibility with keyboard and screen reader

## Advanced Usage

### Batch Import/Export

You can manage multiple data files:

1. **Create backups**: Export data monthly with timestamps
2. **Compare semesters**: Import different saved states to compare
3. **Data migration**: Export from one device, import on another
4. **Version control**: Keep multiple versions of your academic record

### What-If Scenarios

Use what-if mode strategically:

1. **Goal Planning**: Project future CGPA with various grades
2. **Course Planning**: Simulate different course selections
3. **Grade Impact**: Understand how one subject affects CGPA
4. **Deadline Planning**: Know what GPA you need in final semester

### Using with Different Grading Scales

**Note**: This calculator uses the 10-point scale. For other scales (4.0 GPA, percentage-based, etc.):

1. You can manually convert grades using the current scale
2. Export your data and manually edit the JSON to adjust
3. The calculation logic remains the same, just adjust GRADE_POINTS mapping

## Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Core Features | ✓ | ✓ | ✓ | ✓ |
| Local Storage | ✓ | ✓ | ✓ | ✓ |
| Responsive Design | ✓ | ✓ | ✓ | ✓ |
| Keyboard Nav | ✓ | ✓ | ✓ | ✓ |
| Screen Reader | ✓ | ✓ | ✓ | ✓ |
| Dark Mode | ✓ | ✓ | ✓ | ✓ |
| Print | ✓ | ✓ | ✓ | ✓ |

## Version History

- **1.0.0** (Current): Initial release with complete GPA/CGPA calculator
  - Core calculation engine
  - Multiple semester management
  - What-if simulation mode
  - Data export/import
  - Comprehensive documentation
  - Full accessibility support
  - Responsive design

## Known Limitations

1. Maximum subjects per semester: Limited by browser storage (typically 100+)
2. Grading scale: Fixed to 10-point scale (can be modified in app.js GRADE_POINTS)
3. Credit range: 1-10 credits per subject (can be modified in app.js validation)
4. Browser storage: Dependent on browser local storage limits

## Frequently Asked Questions

**Q: Is my data secure?**
A: Yes, all data stays on your device in browser local storage. Nothing is sent to external servers.

**Q: Can I use this on multiple devices?**
A: Yes! Export your data on one device and import it on another. Use cloud storage services to sync JSON files.

**Q: What if I close the browser?**
A: Your data is saved in local storage and will persist when you reopen the browser.

**Q: Can I delete just one subject?**
A: Yes! Click the "Delete" button next to any subject in the subjects list.

**Q: What if I delete a semester by mistake?**
A: Unfortunately, deletions are permanent. Always export your data before making major changes.

**Q: Does this work offline?**
A: Yes! The application works completely offline once the files are loaded.

**Q: Can I modify the grading scale?**
A: Yes, advanced users can edit the GRADE_POINTS object in app.js and modify the select options in index.html.

**Q: How accurate are the calculations?**
A: The calculator uses the standard weighted average formula (Sum of Credits × Grade Points) / Total Credits, which is accurate to 2 decimal places.

---

## Support & Feedback

For issues, suggestions, or feedback:
1. Check the Troubleshooting section above
2. Review the browser console for error messages
3. Test in a different browser to isolate issues
4. Export your data before trying fixes

## License

This project is open source and available for educational and personal use.

## Contributing

Contributions are welcome! Areas for contribution:
- Bug fixes and improvements
- Additional features (budget tracking, etc.)
- Better documentation
- Accessibility enhancements
- Testing and quality assurance

## Credits

Developed as an open-source educational tool for students to track their academic performance.

---

**Start calculating your GPA today!** 🎓

Last updated: 2024
Version: 1.0.0

