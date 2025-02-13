# Fit Tracker

Maintaining a consistent workout routine is challenging for individuals juggling busy schedules, diverse fitness goals, and limited access to resources. To those unfamiliar with working out, even just planning a routine will add some difficulty when starting out. These challenges often lead to inefficient workouts, lack of motivation, and suboptimal results. There is a need for a solution that simplifies workout planning, adapts to individual needs, and optimizes time spent exercising.

Introducing the Fit Tracker, a comprehensive fitness tool designed to make working out more convenient and effective. Utilizing a database of workouts categorized by muscle groups, accessibility, and efficiency, this tool will eliminate these challenges and allow users to quickly and easily plan their workouts and work towards their goals more efficiently by searching the database for the exercises relevant to them.

Along with this accessible database of possible exercises, users will also be able to input their fitness goals such as weight loss or growth, equipment availability, and free time during the week. This will allow the Fit Tracker to narrow down the pool of exercises recommended to users to fit their needs, and efficiently schedule and direct their workouts for the results they desire.

## Classes

### User
- Represents a user with attributes like height, weight, fitness goal, gym access, cardio options, workout duration, and workout days.

### BMI
- Handles BMI calculations and suggestions.
- Methods:
  - `calculate(height, weight)`: Calculates the BMI.
  - `getSuggestion(bmi)`: Provides suggestions based on the BMI.

### Workout
- Represents a collection of workouts.
- Methods:
  - `filterWorkouts(goal, gymAccess, cardioOptions)`: Filters workouts based on the user's goal, gym access, and cardio options.

### WorkoutPlan
- Generates workout plans based on user inputs.
- Methods:
  - `generate(filteredWorkouts, workoutDuration, workoutDays)`: Generates workout plans based on the filtered workouts, workout duration, and workout days.

### WorkoutLoader
- Loads workouts from a JSON file.
- Methods:
  - `load()`: Loads workouts from the `workouts.json` file.

### FitTracker
- Handles the main functionality of the application.
- Methods:
  - `calculateBMI()`: Calculates and displays the BMI.
  - `showPlan()`: Generates and displays the workout plan.

## Unit Tests

Unit tests have been created for the following classes: `User`, `BMI`, `Workout`, `WorkoutPlan`, and `WorkoutLoader`. Each class has at least 5 tests, ensuring a total of at least 25 tests. These tests are designed to verify the functionality and correctness of the methods within each class.

### User Class Tests
- Tests the creation of a `User` instance with correct attributes.
- Tests the calculation of BMI.
- Tests the BMI suggestions for different BMI ranges (underweight, normal weight, overweight, obese).

### BMI Class Tests
- Tests the calculation of BMI.
- Tests the BMI suggestions for different BMI ranges (underweight, normal weight, overweight, obese).

### Workout Class Tests
- Tests the filtering of workouts based on different fitness goals (weight loss, muscle gain, maintenance).
- Tests the handling of empty workouts array and unknown goals.

### WorkoutPlan Class Tests
- Tests the generation of workout plans with correct duration and days.
- Tests the handling of empty filtered workouts array, zero workout duration, and zero workout days.

### WorkoutLoader Class Tests
- Tests the loading of workouts from a JSON file.
- Tests the handling of empty JSON file, fetch errors, and invalid JSON format.

To run the tests, use the following command:

```sh
npm test
```

Add the following script to your `package.json` file to run the tests using Jest:

```json
"scripts": {
  "test": "jest"
}
```

## Team Members

- Salvador Solana Allende: ssolanaallende@scu.edu
- Brandon Nhin: bnhin@scu.edu
