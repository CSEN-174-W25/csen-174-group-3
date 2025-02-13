const BMI = require('../start.js').BMI;

describe('BMI Class', () => {
  test('should calculate BMI correctly', () => {
    const bmi = BMI.calculate(180, 75);
    expect(bmi).toBeCloseTo(23.15, 2);
  });

  test('should return correct suggestion for underweight', () => {
    const suggestion = BMI.getSuggestion(17);
    expect(suggestion).toContain('focus on muscle gain exercises');
  });

  test('should return correct suggestion for normal weight', () => {
    const suggestion = BMI.getSuggestion(22);
    expect(suggestion).toContain('maintain your current fitness level');
  });

  test('should return correct suggestion for overweight', () => {
    const suggestion = BMI.getSuggestion(27);
    expect(suggestion).toContain('focus on weight loss exercises');
  });

  test('should return correct suggestion for obese', () => {
    const suggestion = BMI.getSuggestion(32);
    expect(suggestion).toContain('focus on weight loss exercises');
  });
});
