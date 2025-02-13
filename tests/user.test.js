const User = require('../start.js').User;

describe('User Class', () => {
  test('should create a User instance with correct attributes', () => {
    const user = new User(180, 75, 'weight loss', 30, 5);
    expect(user.height).toBe(180);
    expect(user.weight).toBe(75);
    expect(user.goal).toBe('weight loss');
    expect(user.workoutDuration).toBe(30);
    expect(user.workoutDays).toBe(5);
  });

  test('should calculate BMI correctly', () => {
    const user = new User(180, 75, 'weight loss', 30, 5);
    const bmi = user.calculateBMI();
    expect(bmi).toBeCloseTo(23.15, 2);
  });

  test('should return correct BMI suggestion for underweight', () => {
    const user = new User(180, 50, 'weight loss', 30, 5);
    const suggestion = user.getBMISuggestion();
    expect(suggestion).toContain('focus on muscle gain exercises');
  });

  test('should return correct BMI suggestion for normal weight', () => {
    const user = new User(180, 75, 'weight loss', 30, 5);
    const suggestion = user.getBMISuggestion();
    expect(suggestion).toContain('maintain your current fitness level');
  });

  test('should return correct BMI suggestion for overweight', () => {
    const user = new User(180, 90, 'weight loss', 30, 5);
    const suggestion = user.getBMISuggestion();
    expect(suggestion).toContain('focus on weight loss exercises');
  });
});
