import { User } from "./user.js";
import { WorkoutList } from "./workouts.js";

let userInstance = new User();
let workouts = new WorkoutList();

window.startApp = async () => {
  await workouts.load();
  navigateToMenu();
}

document.addEventListener("DOMContentLoaded", () => {
  const btnNavPlan = document.getElementById("btn-nav-plan");
  const btnNavSearch = document.querySelectorAll(".btn-nav-search");
  const btnNavBacks = document.querySelectorAll(".btn-nav-back");

  // Check if btnNavPlan exists
  if (btnNavPlan) {
    console.log(".btn-nav-plan found. Adding event listener.");
    btnNavPlan.addEventListener("click", navigateToWorkoutPlan);
  } else {
    console.error(".btn-nav-plan not found in the DOM.");
  }

  // Check if btnNavSearch exists
  if (btnNavSearch) {
    console.log(".btn-nav-search found. Adding event listener.");
    btnNavSearch.forEach((btn) => {
      btn.addEventListener("click", navigateToExerciseSearch);
    });
  } else {
    console.error(".btn-nav-search not found in the DOM.");
  }

  // Check if btnNavBacks exist
  if (btnNavBacks) {
    console.log(".btn-nav-backs found. Adding event listeners.");
    btnNavBacks.forEach((btn) => {
      btn.addEventListener("click", navigateToMenu);
    });
  } else {
    console.error(".btn-nav-back not found in the DOM.");
  }
});

const navigateToMenu = async () => {
  document.getElementById("intro-container").style.display = "none";
  document.getElementById("menu-container").style.display = "block";
  document.getElementById("workout-plan-container").style.display = "none";
  document.getElementById("exercise-search-container").style.display = "none";
};

const navigateToWorkoutPlan = () => {
  document.getElementById("menu-container").style.display = "none";
  document.getElementById("workout-plan-container").style.display = "block";
  document.getElementById("exercise-search-container").style.display = "none";
};

const navigateToExerciseSearch = () => {
  document.getElementById("menu-container").style.display = "none";
  document.getElementById("workout-plan-container").style.display = "none";
  document.getElementById("exercise-search-container").style.display = "block";
};

const inToM = (inches) => { return inches * 0.0254;};
const lbToKg = (pounds) => { return pounds * 0.453592;};

const calculateBMI = async () => {
  const heightFeet = parseFloat(document.getElementById('height-feet').value);
  const heightInches = parseFloat(document.getElementById('height-inches').value);
  const totalHeightInches = (heightFeet * 12) + heightInches;
  const weightPounds = parseFloat(document.getElementById('weight').value);
  
  userInstance.height = inToM(totalHeightInches);
  userInstance.weight = lbToKg(weightPounds);

  let result = '';
  if (isNaN(userInstance.bmi) || totalHeightInches <= 0 || weightPounds <= 0) {
      result = 'Please enter valid numeric values.';
  } else if (weightPounds > 1323) {
      result = 'Weight cannot be greater than 1323 pounds.';
  } else if (totalHeightInches > 99 || totalHeightInches < 16) {
      result = 'Height cannot be greater than 99 inches or less than 16 inches.';
  } else {
      result = `Your BMI is: ${userInstance.bmi.toFixed(2)}`;
      const suggestion = userInstance.getSuggestion();
      result += `<br>${suggestion}`;
      document.getElementById('goal-container').style.display = 'block';
  }
  document.getElementById('result').innerHTML = result;
};

const showPlan = async () => {
  document.getElementById("result2").style.display = "flex";
  const heightFeet = parseFloat(document.getElementById("height-feet").value);
  const heightInches = parseFloat(
    document.getElementById("height-inches").value
  );
  const totalHeightInches = heightFeet * 12 + heightInches;
  const weightPounds = parseFloat(document.getElementById("weight").value);
  const goal = document.getElementById("goal").value;
  const workoutDays = parseInt(document.getElementById("workout-days").value);
  const workoutDuration = parseInt(
    document.getElementById("workout-duration").value
  );

  userInstance.height = inToM(totalHeightInches);
  userInstance.weight = lbToKg(weightPounds);
  userInstance.goal = goal;
  userInstance.workoutDuration = workoutDuration;
  userInstance.workoutDays = workoutDays;

  if (
    isNaN(userInstance.bmi) ||
    isNaN(workoutDays) ||
    isNaN(workoutDuration) ||
    workoutDays <= 0 ||
    workoutDuration <= 0
  ) {
    document.getElementById("result2").innerHTML =
      "Please enter valid numeric values for all fields.";
    return;
  }

  console.log("Inputs are valid. Proceeding to show plan...");
  console.log("Loaded workouts:", workouts);
  const filteredWorkouts = workouts.filterGoals(goal);

  console.log("Filtered workouts:", filteredWorkouts);
  let workoutPlans = workouts.generate(goal, workoutDuration, workoutDays);
  console.log("Generated workout plans:", workoutPlans);
  let result2 = workoutPlans
    .map(
      (plan, index) => `
    <div class="workout-plan">
      <h3>Day ${index + 1}</h3>
      ${plan
        .map(
          (workout) => `
        <div class="workout">
          <h4>${workout.name}</h4>
          <p>${workout.description}</p>
          <p>Time: ${workout["time (minutes)"]} minutes</p>
        </div>
      `
        )
        .join("")}
    </div>
  `
    )
    .join("");

  document.getElementById("result2").innerHTML = result2;
};

const searchExercises = () => {
  const muscleGroup = document.getElementById('muscle-group').value;
  console.log(muscleGroup);
  const filteredWorkouts = workouts.filterTags({"muscleGroup": muscleGroup});

  let resultHtml = filteredWorkouts.map(workout => `
    <div class="workout">
      <h4>${workout.name}</h4>
      <p>${workout.description}</p>
      <p>Time: ${workout["time (minutes)"]} minutes</p>
    </div>
  `).join('');

  document.getElementById('exercise-results').innerHTML = resultHtml;
};