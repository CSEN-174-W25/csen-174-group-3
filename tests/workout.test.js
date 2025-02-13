const Workout = require('../start.js').Workout;

const mockWorkouts = [
  { type: 'cardio', means: 'gym aerobics' },
  { type: 'strength', means: 'gym strength' },
  { type: 'cardio', means: 'bodyweight no equipment' },
  { type: 'strength', means: 'bodyweight no equipment' },
];

describe('Workout Class', () => {
  test('should filter workouts for weight loss', () => {
    const workout = new Workout(mockWorkouts);
    const filtered = workout.filterWorkouts('weight loss');
    expect(filtered.length).toBe(2);
    expect(filtered).toEqual(expect.arrayContaining([{ type: 'cardio', means: 'gym aerobics' }, { type: 'cardio', means: 'bodyweight no equipment' }]));
  });

  test('should filter workouts for muscle gain', () => {
    const workout = new Workout(mockWorkouts);
    const filtered = workout.filterWorkouts('muscle gain');
    expect(filtered.length).toBe(2);
    expect(filtered).toEqual(expect.arrayContaining([{ type: 'strength', means: 'gym strength' }, { type: 'strength', means: 'bodyweight no equipment' }]));
  });

  test('should filter workouts for maintenance', () => {
    const workout = new Workout(mockWorkouts);
    const filtered = workout.filterWorkouts('maintenance');
    expect(filtered.length).toBe(4);
  });

  test('should return empty array for unknown goal', () => {
    const workout = new Workout(mockWorkouts);
    const filtered = workout.filterWorkouts('unknown');
    expect(filtered.length).toBe(0);
  });

  test('should handle empty workouts array', () => {
    const workout = new Workout([]);
    const filtered = workout.filterWorkouts('weight loss');
    expect(filtered.length).toBe(0);
  });
});
