
const calculateBMI = async () => {
  const heightFeet = parseFloat(document.getElementById('height-feet').value);
  const heightInches = parseFloat(document.getElementById('height-inches').value);
  const weightPounds = parseFloat(document.getElementById('weight').value);

  const totalHeightInches = (heightFeet * 12) + heightInches;
  const heightMeters = totalHeightInches * 0.0254;
  const weightKg = weightPounds * 0.453592;

  const bmi = weightKg / (heightMeters * heightMeters);

  let result = '';
  if (isNaN(bmi) || totalHeightInches <= 0 || weightPounds <= 0) {
      result = 'Please enter valid numeric values.';
  } else if (weightPounds > 1323) {
      result = 'Weight cannot be greater than 1323 pounds.';
  } else if (totalHeightInches > 99 || totalHeightInches < 16) {
      result = 'Height cannot be greater than 99 inches or less than 16 inches.';
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
      return "Great news! Your BMI results suggest that focusing on muscle-building exercises could be a great way to strengthen your body and boost your overall fitness. Let’s work on building muscle mass with a plan that fits your goals!";
  } else if (bmi >= 18.5 && bmi < 25) {
      return "You're on the right track! Your BMI results indicate that maintaining your current fitness level with a balanced mix of cardio and strength exercises is a great way to stay healthy and strong. Keep up the great work!";
  } else if (bmi >= 25 && bmi < 30) {
      return "Let’s reach your goals together! Your BMI results suggest that incorporating weight-loss-focused exercises can help you enhance your fitness and energy levels. A mix of cardio and strength training can be a great way to feel your best!";
  } else {
      return "You’re taking an important step toward a healthier you! Your BMI results indicate that focusing on exercises that support weight loss could help improve your overall well-being. A personalized fitness plan with fun and effective workouts will set you up for success!";
  }
};

document.getElementById('btn-show-plan').addEventListener("click", async () => {
  document.getElementById('result2').style.display = 'flex';
  const heightFeet = parseFloat(document.getElementById('height-feet').value);
  const heightInches = parseFloat(document.getElementById('height-inches').value);
  const weightPounds = parseFloat(document.getElementById('weight').value);
  const goal = document.getElementById('goal').value;
  const workoutDays = parseInt(document.getElementById('workout-days').value);
  const workoutDuration = parseInt(document.getElementById('workout-duration').value);

  const totalHeightInches = (heightFeet * 12) + heightInches;
  const heightMeters = totalHeightInches * 0.0254;
  const weightKg = weightPounds * 0.453592;
  const bmi = weightKg / (heightMeters * heightMeters);

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
