export class WorkoutList {
  constructor() {
    this.workouts = [];
  }

  async load() {
    const response = await fetch("workouts.json");
    this.workouts = await response.json();
  }

  filterGoals(goal) {
    return this.workouts.filter((workout) => {
      if (goal === "weight loss")
        return workout.type === "cardio" || workout.means === "gym aerobics";
      if (goal === "muscle gain") return workout.type === "strength";
      if (goal === "maintenance")
        return (
          workout.type === "cardio" ||
          workout.type === "strength" ||
          workout.means === "gym aerobics"
        );
    });
  }

  filterTags(filters) {
    return this.workouts.filter((workout) => {
      return Object.keys(filters).every((key) => workout[key] === filters[key]);
    });
  }

  generate(goal, workoutDuration, workoutDays) {
    let filteredWorkouts = this.filterGoals(goal);
    const plans = [];
    for (let i = 0; i < workoutDays; i++) {
      let plan = [];
      let totalTime = 0;
      while (totalTime < workoutDuration && filteredWorkouts.length > 0) {
        const workout =
          filteredWorkouts[Math.floor(Math.random() * filteredWorkouts.length)];
        if (totalTime + workout["time (minutes)"] <= workoutDuration) {
          plan.push(workout);
          totalTime += workout["time (minutes)"];
        } else {
          break;
        }
      }
      plans.push(plan);
    }
    return plans;
  }
}