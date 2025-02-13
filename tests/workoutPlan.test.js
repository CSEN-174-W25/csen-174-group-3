const WorkoutPlan = require('../start.js').WorkoutPlan;

const mockFilteredWorkouts = [
  { name: 'Running', "time (minutes)": 30 },
  { name: 'Bicep Curls', "time (minutes)": 8 },
  { name: 'Jumping Jacks', "time (minutes)": 4.5 },
  { name: 'Push-ups', "time (minutes)": 5.5 },
];

describe('WorkoutPlan Class', () => {
  test('should generate workout plans with correct duration and days', () => {
    const plans = WorkoutPlan.generate(mockFilteredWorkouts, 30, 3);
    expect(plans.length).toBe(3);
    plans.forEach(plan => {
      const totalTime = plan.reduce((sum, workout) => sum + workout["time (minutes)"], 0);
      expect(totalTime).toBeLessThanOrEqual(30);
    });
  });

  test('should generate workout plans with at least one workout per day', () => {
    const plans = WorkoutPlan.generate(mockFilteredWorkouts, 30, 3);
    plans.forEach(plan => {
      expect(plan.length).toBeGreaterThan(0);
    });
  });

  test('should handle empty filtered workouts array', () => {
    const plans = WorkoutPlan.generate([], 30, 3);
    expect(plans.length).toBe(3);
    plans.forEach(plan => {
      expect(plan.length).toBe(0);
    });
  });

  test('should handle zero workout duration', () => {
    const plans = WorkoutPlan.generate(mockFilteredWorkouts, 0, 3);
    expect(plans.length).toBe(3);
    plans.forEach(plan => {
      expect(plan.length).toBe(0);
    });
  });

  test('should handle zero workout days', () => {
    const plans = WorkoutPlan.generate(mockFilteredWorkouts, 30, 0);
    expect(plans.length).toBe(0);
  });
});
