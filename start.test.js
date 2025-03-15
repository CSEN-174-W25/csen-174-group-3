const { JSDOM } = require('jsdom');
const { expect } = require('chai');
const sinon = require('sinon');

// Mock the DOM
const dom = new JSDOM(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitBuilder</title>
</head>
<body>
    <input type="number" id="macro-weight">
    <input type="number" id="macro-height-feet">
    <input type="number" id="macro-height-inches">
    <select id="macro-gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
    </select>
    <input type="number" id="macro-age">
    <select id="macro-activity-level">
        <option value="1.2">Sedentary (Little to no exercise)</option>
        <option value="1.375">Light Exercise (1-3 days/week)</option>
        <option value="1.55">Moderate Exercise (3-5 days/week)</option>
        <option value="1.725">Heavy Exercise (6-7 days/week)</option>
        <option value="1.9">Very Heavy Exercise (Athletes, 2x/day)</option>
    </select>
    <select id="macro-goal">
        <option value="fat_loss">Fat Loss</option>
        <option value="muscle_gain">Muscle Gain</option>
        <option value="maintenance">Maintenance</option>
    </select>
    <textarea id="macro-result" rows="4" readonly></textarea>
    <textarea id="macro-additional-result" rows="4" readonly></textarea>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

// Import the function to test
const { calculateBMR } = require('./start.js');

describe('calculateBMR', () => {
    beforeEach(() => {
        // Reset input values before each test
        document.getElementById('macro-weight').value = '';
        document.getElementById('macro-height-feet').value = '';
        document.getElementById('macro-height-inches').value = '';
        document.getElementById('macro-gender').value = 'male';
        document.getElementById('macro-age').value = '';
        document.getElementById('macro-activity-level').value = '1.2';
        document.getElementById('macro-goal').value = 'fat_loss';
        document.getElementById('macro-result').value = '';
        document.getElementById('macro-additional-result').value = '';
    });

    it('should calculate BMR and macros for valid male inputs', () => {
        document.getElementById('macro-weight').value = '180';
        document.getElementById('macro-height-feet').value = '5';
        document.getElementById('macro-height-inches').value = '10';
        document.getElementById('macro-gender').value = 'male';
        document.getElementById('macro-age').value = '25';
        document.getElementById('macro-activity-level').value = '1.55';
        document.getElementById('macro-goal').value = 'muscle_gain';

        calculateBMR();

        expect(document.getElementById('macro-result').value).to.include('calories/day');
        expect(document.getElementById('macro-additional-result').value).to.include('Protein');
    });

    it('should calculate BMR and macros for valid female inputs', () => {
        document.getElementById('macro-weight').value = '150';
        document.getElementById('macro-height-feet').value = '5';
        document.getElementById('macro-height-inches').value = '6';
        document.getElementById('macro-gender').value = 'female';
        document.getElementById('macro-age').value = '30';
        document.getElementById('macro-activity-level').value = '1.375';
        document.getElementById('macro-goal').value = 'fat_loss';

        calculateBMR();

        expect(document.getElementById('macro-result').value).to.include('calories/day');
        expect(document.getElementById('macro-additional-result').value).to.include('Protein');
    });

    it('should show error for invalid inputs', () => {
        document.getElementById('macro-weight').value = 'abc';
        document.getElementById('macro-height-feet').value = '5';
        document.getElementById('macro-height-inches').value = '10';
        document.getElementById('macro-gender').value = 'male';
        document.getElementById('macro-age').value = '25';
        document.getElementById('macro-activity-level').value = '1.55';
        document.getElementById('macro-goal').value = 'muscle_gain';

        calculateBMR();

        expect(document.getElementById('macro-result').value).to.equal('Please fill all fields with valid numbers.');
    });

    it('should show error for invalid gender selection', () => {
        document.getElementById('macro-weight').value = '180';
        document.getElementById('macro-height-feet').value = '5';
        document.getElementById('macro-height-inches').value = '10';
        document.getElementById('macro-gender').value = 'invalid';
        document.getElementById('macro-age').value = '25';
        document.getElementById('macro-activity-level').value = '1.55';
        document.getElementById('macro-goal').value = 'muscle_gain';

        calculateBMR();

        expect(document.getElementById('macro-result').value).to.equal('Invalid gender selected.');
    });
});
