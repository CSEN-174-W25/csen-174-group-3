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
      await showPlan(bmi); // Call showPlan with the calculated BMI
  }

  document.getElementById('result').innerHTML = result;
};

document.getElementById('btn-show-plan').addEventListener("click", async () => {
  document.getElementById('result2').style.display = 'flex';
  const height = document.getElementById('height').value;
  const weight = document.getElementById('weight').value;
  const bmi = weight / ((height / 100) * (height / 100));
  await showPlan(bmi);
});

const showPlan = async (bmi) => {
  let result2 = '';
  if (isNaN(bmi)) {
      result2 = 'Please enter valid numeric values.';
  } else {
      const workouts = await loadWorkouts();
      const filteredWorkouts = workouts.filter(workout => {
          if (bmi < 18.5) return workout.type === 'strength';
          if (bmi >= 18.5 && bmi < 25) return workout.type === 'cardio';
          if (bmi >= 25 && bmi < 30) return workout.type === 'strength';
          if (bmi >= 30) return workout.type === 'cardio';
      });

      result2 = filteredWorkouts.map(workout => `
        <div class="workout">
          <h3>${workout.name}</h3>
          <p>${workout.description}</p>
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
