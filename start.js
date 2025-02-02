const calculateBMI = async () => {
  const height = document.getElementById('height').value;
  const weight = document.getElementById('weight').value;

  const bmi = weight / ((height / 100) * (height / 100));

  let result = '';
  if (isNaN(bmi)) {
      result = 'Please enter valid numeric values.';
  } else if (height < 0 || weight < 0) {
      result = 'Neither weight nor height can be negative numbers.';
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
  const height = document.getElementById('height').value;
  const weight = document.getElementById('weight').value;
  const goal = document.getElementById('goal').value;
  const bmi = weight / ((height / 100) * (height / 100));
  await showPlan(bmi, goal);
});

const showPlan = async (bmi, goal) => {
  let result2 = '';
  if (isNaN(bmi)) {
      result2 = 'Please enter valid numeric values.';
  } else {
      const workouts = await loadWorkouts();
      const filteredWorkouts = workouts.filter(workout => {
          if (goal === 'weight loss') return workout.type === 'cardio';
          if (goal === 'muscle gain') return workout.type === 'strength';
          if (goal === 'maintenance') return workout.type === 'cardio' || workout.type === 'strength';
      });

      result2 = filteredWorkouts.map(workout => `
        <div class="workout">
          <h3>${workout.name}</h3>
          <p>${workout.description}</p>
          <p>Time: ${workout["time (minutes)"]} minutes</p>
        </div>
      `).join('');
  }

  document.getElementById('result2').innerHTML = result2;
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

// Ensure the calculateBMI function is called when the button is clicked
document.querySelector('.btn-calculate').addEventListener('click', calculateBMI);
