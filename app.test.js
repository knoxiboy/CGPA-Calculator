/**
 * Test suite for GPA/CGPA Calculator
 * Testing grade conversion, validation, calculation, and data management
 */

// Include the app.js file for testing
const { Calculator, DataManager } = require('./app.js');

// =========================================
// TEST SUITE 1: Grade to Points Conversion
// Property 7: Grade Conversion Correctness
// Validates: Requirements 2.1-2.8
// =========================================

console.log('Testing Grade to Points Conversion...');
console.log('=========================================');

const gradeTestCases = [
    { grade: 'O', expected: 10 },
    { grade: 'A+', expected: 9 },
    { grade: 'A', expected: 8 },
    { grade: 'B+', expected: 7 },
    { grade: 'B', expected: 6 },
    { grade: 'C', expected: 5 },
    { grade: 'D', expected: 4 },
    { grade: 'F', expected: 0 }
];

let gradeConversionPassed = 0;
let gradeConversionFailed = 0;

gradeTestCases.forEach(({ grade, expected }) => {
    const result = Calculator.gradeToPoints(grade);
    const passed = result === expected;
    
    if (passed) {
        console.log(`✓ PASS: Grade '${grade}' correctly converts to ${result}`);
        gradeConversionPassed++;
    } else {
        console.log(`✗ FAIL: Grade '${grade}' expected ${expected} but got ${result}`);
        gradeConversionFailed++;
    }
});

console.log(`\nGrade Conversion Tests: ${gradeConversionPassed} passed, ${gradeConversionFailed} failed`);
console.log('=========================================\n');

// =========================================
// TEST SUITE 2: Credit Validation
// Property 5: Credit Range Validation
// Validates: Requirements 1.6, 8.2, 8.3
// =========================================

console.log('Testing Credit Validation...');
console.log('=========================================');

const creditTestCases = [
    { credits: 1, expected: true, description: 'Minimum valid credit' },
    { credits: 5, expected: true, description: 'Middle range valid credit' },
    { credits: 10, expected: true, description: 'Maximum valid credit' },
    { credits: 0, expected: false, description: 'Below minimum' },
    { credits: 11, expected: false, description: 'Above maximum' },
    { credits: -5, expected: false, description: 'Negative value' },
    { credits: 3.5, expected: false, description: 'Decimal value' },
    { credits: '5', expected: false, description: 'String value' },
    { credits: null, expected: false, description: 'Null value' },
    { credits: undefined, expected: false, description: 'Undefined value' }
];

let creditValidationPassed = 0;
let creditValidationFailed = 0;

creditTestCases.forEach(({ credits, expected, description }) => {
    const result = Calculator.validateCredits(credits);
    const passed = result === expected;
    
    if (passed) {
        console.log(`✓ PASS: ${description} (${credits}) - correctly returns ${result}`);
        creditValidationPassed++;
    } else {
        console.log(`✗ FAIL: ${description} (${credits}) - expected ${expected} but got ${result}`);
        creditValidationFailed++;
    }
});

console.log(`\nCredit Validation Tests: ${creditValidationPassed} passed, ${creditValidationFailed} failed`);
console.log('=========================================\n');

// =========================================
// TEST SUITE 3: Grade Validation
// Property 6: Grade Set Validation
// Validates: Requirements 1.7
// =========================================

console.log('Testing Grade Set Validation...');
console.log('=========================================');

const validGradesForValidation = ['O', 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'];
const invalidGradesForValidation = ['E', 'A-', 'X', '', null, undefined, 1];

let gradeValidationPassed = 0;
let gradeValidationFailed = 0;

validGradesForValidation.forEach(grade => {
    const result = Calculator.validateGrade(grade);
    if (result === true) {
        console.log(`✓ PASS: Grade '${grade}' correctly validated as true`);
        gradeValidationPassed++;
    } else {
        console.log(`✗ FAIL: Grade '${grade}' expected true but got ${result}`);
        gradeValidationFailed++;
    }
});

invalidGradesForValidation.forEach(grade => {
    const result = Calculator.validateGrade(grade);
    if (result === false) {
        console.log(`✓ PASS: Grade '${grade}' correctly validated as false`);
        gradeValidationPassed++;
    } else {
        console.log(`✗ FAIL: Grade '${grade}' expected false but got ${result}`);
        gradeValidationFailed++;
    }
});

console.log(`\nGrade Validation Tests: ${gradeValidationPassed} passed, ${gradeValidationFailed} failed`);
console.log('=========================================\n');

// =========================================
// TEST SUITE 4: Subject Validation
// Property 1: Subject Validation Completeness
// Validates: Requirements 1.2, 8.1
// =========================================

console.log('Testing Subject Validation...');
console.log('=========================================');

const subjectValidationCases = [
    {
        subject: { name: 'Math', credits: 3, grade: 'A+' },
        expected: { valid: true, error: '' },
        description: 'Valid subject'
    },
    {
        subject: { name: '', credits: 3, grade: 'A' },
        expected: { valid: false, error: 'All fields are required' },
        description: 'Empty name'
    },
    {
        subject: { name: 'Physics', credits: 0, grade: 'A' },
        expected: { valid: false, error: 'Credits must be a number between 1 and 10' },
        description: 'Invalid credits'
    },
    {
        subject: { name: 'Chem', credits: 3, grade: 'X' },
        expected: { valid: false, error: 'Please select a valid grade' },
        description: 'Invalid grade'
    },
    {
        subject: null,
        expected: { valid: false, error: 'All fields are required' },
        description: 'Null subject'
    }
];

let subjectValidationPassed = 0;
let subjectValidationFailed = 0;

subjectValidationCases.forEach(({ subject, expected, description }) => {
    const result = Calculator.validateSubject(subject);
    const passed = result.valid === expected.valid && result.error === expected.error;
    
    if (passed) {
        console.log(`✓ PASS: ${description}`);
        subjectValidationPassed++;
    } else {
        console.log(`✗ FAIL: ${description}`);
        subjectValidationFailed++;
    }
});

console.log(`\nSubject Validation Tests: ${subjectValidationPassed} passed, ${subjectValidationFailed} failed`);
console.log('=========================================\n');

// =========================================
// TEST SUITE 5: Semester GPA Calculation
// Property 8: Semester GPA Calculation Formula
// Validates: Requirements 3.1, 3.2
// =========================================

console.log('Testing Semester GPA Calculation...');
console.log('=========================================');

const semesterGPACases = [
    {
        subjects: [],
        expected: 0.00,
        description: 'Empty subjects'
    },
    {
        subjects: [{ name: 'Math', credits: 3, grade: 'O' }],
        expected: 10.00,
        description: 'Single subject with O grade'
    },
    {
        subjects: [
            { name: 'Math', credits: 3, grade: 'O' },
            { name: 'English', credits: 2, grade: 'A' }
        ],
        expected: 9.20,
        description: 'Multiple subjects'
    }
];

let semesterGPAPassed = 0;
let semesterGPAFailed = 0;

semesterGPACases.forEach(({ subjects, expected, description }) => {
    const result = Calculator.calculateSemesterGPA(subjects);
    const resultNum = typeof result === 'string' ? parseFloat(result) : result;
    const passed = Math.abs(resultNum - expected) < 0.01;
    
    if (passed) {
        console.log(`✓ PASS: ${description} - GPA = ${result}`);
        semesterGPAPassed++;
    } else {
        console.log(`✗ FAIL: ${description} - Expected ${expected.toFixed(2)}, Got ${result}`);
        semesterGPAFailed++;
    }
});

console.log(`\nSemester GPA Tests: ${semesterGPAPassed} passed, ${semesterGPAFailed} failed`);
console.log('=========================================\n');

// =========================================
// TEST SUITE 6: CGPA Calculation
// Validates: Requirements 5.1, 5.2
// =========================================

console.log('Testing CGPA Calculation...');
console.log('=========================================');

const cgpaCases = [
    {
        semesters: [],
        expected: 0.00,
        description: 'Empty semesters'
    },
    {
        semesters: [{ subjects: [{ name: 'Math', credits: 3, grade: 'O' }] }],
        expected: 10.00,
        description: 'Single semester'
    },
    {
        semesters: [
            { subjects: [
                { name: 'Math', credits: 3, grade: 'O' },
                { name: 'English', credits: 2, grade: 'A' }
            ]},
            { subjects: [
                { name: 'Physics', credits: 4, grade: 'B+' }
            ]}
        ],
        expected: 8.22,
        description: 'Multiple semesters'
    }
];

let cgpaPassed = 0;
let cgpaFailed = 0;

cgpaCases.forEach(({ semesters, expected, description }) => {
    const result = Calculator.calculateCGPA(semesters);
    const resultNum = typeof result === 'string' ? parseFloat(result) : result;
    const passed = Math.abs(resultNum - expected) < 0.01;
    
    if (passed) {
        console.log(`✓ PASS: ${description} - CGPA = ${result}`);
        cgpaPassed++;
    } else {
        console.log(`✗ FAIL: ${description} - Expected ${expected.toFixed(2)}, Got ${result}`);
        cgpaFailed++;
    }
});

console.log(`\nCGPA Tests: ${cgpaPassed} passed, ${cgpaFailed} failed`);
console.log('=========================================\n');

// =========================================
// TEST SUITE 7: DataManager CRUD Operations
// Property 19: State Persistence Round-Trip
// Validates: Requirements 6.1-6.5
// =========================================

console.log('Testing DataManager Operations...');
console.log('=========================================');

DataManager.init();
let dataManagerPassed = 0;
let dataManagerFailed = 0;

// Test initialization
if (DataManager.state && DataManager.state.semesters.length > 0) {
    console.log('✓ PASS: DataManager initialized');
    dataManagerPassed++;
} else {
    console.log('✗ FAIL: DataManager initialization');
    dataManagerFailed++;
}

// Test semester operations
const semId = DataManager.addSemester(false);
if (DataManager.getSemester(semId)) {
    console.log('✓ PASS: Semester created');
    dataManagerPassed++;
} else {
    console.log('✗ FAIL: Semester creation');
    dataManagerFailed++;
}

// Test subject operations
const testSub = { name: 'Test', credits: 3, grade: 'A' };
DataManager.addSubject(semId, testSub);
const sem = DataManager.getSemester(semId);
if (sem.subjects.length > 0) {
    console.log('✓ PASS: Subject added');
    dataManagerPassed++;
} else {
    console.log('✗ FAIL: Subject addition');
    dataManagerFailed++;
}

// Test export/import
const exported = DataManager.exportData();
const importedOk = DataManager.importData(exported);
if (importedOk) {
    console.log('✓ PASS: Export/Import successful');
    dataManagerPassed++;
} else {
    console.log('✗ FAIL: Export/Import failed');
    dataManagerFailed++;
}

// Test what-if mode
DataManager.enterWhatIfMode();
if (DataManager.state.whatIfMode) {
    console.log('✓ PASS: What-If mode entered');
    dataManagerPassed++;
} else {
    console.log('✗ FAIL: What-If mode entry');
    dataManagerFailed++;
}

DataManager.exitWhatIfMode();
if (!DataManager.state.whatIfMode) {
    console.log('✓ PASS: What-If mode exited');
    dataManagerPassed++;
} else {
    console.log('✗ FAIL: What-If mode exit');
    dataManagerFailed++;
}

console.log(`\nDataManager Tests: ${dataManagerPassed} passed, ${dataManagerFailed} failed`);
console.log('=========================================\n');

// =========================================
// FINAL SUMMARY
// =========================================

const totalPassed = gradeConversionPassed + creditValidationPassed + gradeValidationPassed + 
                   subjectValidationPassed + semesterGPAPassed + cgpaPassed + dataManagerPassed;
const totalFailed = gradeConversionFailed + creditValidationFailed + gradeValidationFailed + 
                   subjectValidationFailed + semesterGPAFailed + cgpaFailed + dataManagerFailed;

console.log('========================================');
console.log('FINAL TEST SUMMARY');
console.log('========================================');
console.log(`Total: ${totalPassed} passed, ${totalFailed} failed`);
console.log('========================================\n');

if (totalFailed === 0) {
    console.log('✓ ALL TESTS PASSED! Application is fully functional.');
} else {
    console.log(`✗ ${totalFailed} test(s) failed. Please review.`);
}

process.exit(totalFailed === 0 ? 0 : 1);
