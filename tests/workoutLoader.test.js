const WorkoutLoader = require('../start.js').WorkoutLoader;

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ name: 'Running', "time (minutes)": 30 }]),
  })
);

describe('WorkoutLoader Class', () => {
  test('should load workouts from JSON file', async () => {
    const workouts = await WorkoutLoader.load();
    expect(workouts).toEqual([{ name: 'Running', "time (minutes)": 30 }]);
  });

  test('should handle empty JSON file', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );
    const workouts = await WorkoutLoader.load();
    expect(workouts).toEqual([]);
  });

  test('should handle fetch error', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject('API is down'));
    await expect(WorkoutLoader.load()).rejects.toEqual('API is down');
  });

  test('should call fetch with correct URL', async () => {
    await WorkoutLoader.load();
    expect(global.fetch).toHaveBeenCalledWith('workouts.json');
  });

  test('should handle invalid JSON format', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.reject('Invalid JSON'),
      })
    );
    await expect(WorkoutLoader.load()).rejects.toEqual('Invalid JSON');
  });
});
