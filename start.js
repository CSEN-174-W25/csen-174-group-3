const calculateBMI = async () => {
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);

  const bmi = weight / ((height / 100) * (height / 100));

  let result = '';
  if (isNaN(bmi) || height <= 0 || weight <= 0) {
      result = 'Please enter valid numeric values.';
  } else if (weight > 600) {
      result = 'Weight cannot be greater than 600kg.';
  } else if (height > 251 || height < 40) {
      result = 'Height cannot be greater than 251cm or less than 40cm.';
  } else {
      result = `Your BMI is: ${bmi.toFixed(2)}`;
      const suggestion = getSuggestion(bmi);
      result += `<br>${suggestion}`;
      document.getElementById('goal-container').style.display = 'block';
  }

  document.getElementById('result').innerHTML = result;
};

const getSuggestion = (bmi) => {
  if (bmi < 18.5) {
      return "Based on your BMI results, we at Fit Tracker recommend you to focus on muscle gain exercises because you are underweight. These types of exercises will help you build muscle mass.";
  } else if (bmi >= 18.5 && bmi < 25) {
      return "Based on your BMI results, we at Fit Tracker recommend you to maintain your current fitness level with a mix of cardio and strength exercises because you have a normal weight.";
  } else if (bmi >= 25 && bmi < 30) {
      return "Based on your BMI results, we at Fit Tracker recommend you to focus on weight loss exercises because you are overweight. These types of exercises will help you reduce body fat.";
  } else {
      return "Based on your BMI results, we at Fit Tracker recommend you to focus on weight loss exercises because you are obese. These types of exercises will help you reduce body fat.";
  }
};

document.getElementById('btn-show-plan').addEventListener("click", async () => {
  document.getElementById('result2').style.display = 'flex';
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const goal = document.getElementById('goal').value;
  const workoutDays = parseInt(document.getElementById('workout-days').value);
  const workoutDuration = parseInt(document.getElementById('workout-duration').value);
  const bmi = weight / ((height / 100) * (height / 100));

  if (isNaN(bmi) || isNaN(workoutDays) || isNaN(workoutDuration) || workoutDays <= 0 || workoutDuration <= 0) {
      document.getElementById('result2').innerHTML = 'Please enter valid numeric values for all fields.';
      return;
  }

  console.log('Inputs are valid. Proceeding to show plan...');
  await showPlan(bmi, goal, workoutDays, workoutDuration);
});

const showPlan = async (bmi, goal, workoutDays, workoutDuration) => {
  let result2 = '';
  const workouts = await loadWorkouts();
  console.log('Loaded workouts:', workouts);
  const filteredWorkouts = workouts.filter(workout => {
      if (goal === 'weight loss') return workout.type === 'cardio' || workout.means === 'gym aerobics';
      if (goal === 'muscle gain') return workout.type === 'strength';
      if (goal === 'maintenance') return workout.type === 'cardio' || workout.type === 'strength' || workout.means === 'gym aerobics';
  });

  console.log('Filtered workouts:', filteredWorkouts);
  const workoutPlans = generateWorkoutPlans(filteredWorkouts, workoutDays, workoutDuration);
  console.log('Generated workout plans:', workoutPlans);
  result2 = workoutPlans.map((plan, index) => `
    <div class="workout-plan">
      <h3>Day ${index + 1}</h3>
      ${plan.map(workout => `
        <div class="workout">
          <h4>${workout.name}</h4>
          <p>${workout.description}</p>
          <p>Time: ${workout["time (minutes)"]} minutes</p>
        </div>
      `).join('')}
    </div>
  `).join('');

  document.getElementById('result2').innerHTML = result2;
};

const generateWorkoutPlans = (workouts, workoutDays, workoutDuration) => {
  const plans = [];
  for (let i = 0; i < workoutDays; i++) {
      let plan = [];
      let totalTime = 0;
      while (totalTime < workoutDuration) {
          const workout = workouts[Math.floor(Math.random() * workouts.length)];
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
};

const limitCharacters = (element, maxLength) => {
  if (element.value.length > maxLength) {
      element.value = element.value.slice(0, maxLength);
  }
};

const loadWorkouts = async () => {
  const response = await fetch('workouts.json');
  const workouts = await response.json();
  return workouts;
};

const startApp = () => {
  document.getElementById('intro-container').style.display = 'none';
  document.getElementById('main-container').style.display = 'block';
};

// Ensure the calculateBMI function is called when the button is clicked
document.querySelector('.btn-calculate').addEventListener('click', calculateBMI);
