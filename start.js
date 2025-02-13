class User {
  constructor(height, weight, goal, workoutDuration, workoutDays) {
    this.height = height;
    this.weight = weight;
    this.goal = goal;
    this.workoutDuration = workoutDuration;
    this.workoutDays = workoutDays;
  }
}

class BMI {
  static calculate(height, weight) {
    return weight / ((height / 100) * (height / 100));
  }

  static getSuggestion(bmi) {
    if (bmi < 18.5) {
      return "Based on your BMI results, we at Fit Tracker recommend you to focus on muscle gain exercises because you are underweight. These types of exercises will help you build muscle mass.";
    } else if (bmi >= 18.5 && bmi < 25) {
      return "Based on your BMI results, we at Fit Tracker recommend you to maintain your current fitness level with a mix of cardio and strength exercises because you have a normal weight.";
    } else if (bmi >= 25 && bmi < 30) {
      return "Based on your BMI results, we at Fit Tracker recommend you to focus on weight loss exercises because you are overweight. These types of exercises will help you reduce body fat.";
    } else {
      return "Based on your BMI results, we at Fit Tracker recommend you to focus on weight loss exercises because you are obese. These types of exercises will help you reduce body fat.";
    }
  }
}

class Workout {
  constructor(workouts) {
    this.workouts = workouts;
  }

  filterWorkouts(goal) {
    return this.workouts.filter(workout => {
      if (goal === 'weight loss') return workout.type === 'cardio' || workout.means === 'gym aerobics';
      if (goal === 'muscle gain') return workout.type === 'strength';
      if (goal === 'maintenance') return workout.type === 'cardio' || workout.type === 'strength' || workout.means === 'gym aerobics';
    });
  }
}

class WorkoutPlan {
  static generate(filteredWorkouts, workoutDuration, workoutDays) {
    const plans = [];
    for (let i = 0; i < workoutDays; i++) {
      let plan = [];
      let totalTime = 0;
      while (totalTime < workoutDuration) {
        const workout = filteredWorkouts[Math.floor(Math.random() * filteredWorkouts.length)];
        if (totalTime + workout["time (minutes)"] <= workoutDuration) {
          plan.push(workout);
          totalTime += workout["time (minutes)"];
        }
      }
      plans.push(plan);
    }
    return plans;
  }
}

class WorkoutLoader {
  static async load() {
    const response = await fetch('workouts.json');
    const workouts = await response.json();
    return workouts;
  }
}

class FitTracker {
  static async calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const bmi = BMI.calculate(height, weight);

    let result = '';
    if (isNaN(bmi) || height <= 0 || weight <= 0) {
      result = 'Please enter valid numeric values.';
    } else if (weight > 600) {
      result = 'Weight cannot be greater than 600kg.';
    } else if (height > 251 || height < 40) {
      result = 'Height cannot be greater than 251cm or less than 40cm.';
    } else {
      result = `Your BMI is: ${bmi.toFixed(2)}`;
      const suggestion = BMI.getSuggestion(bmi);
      result += `<br>${suggestion}`;
      document.getElementById('goal-container').style.display = 'block';
    }

    document.getElementById('result').innerHTML = result;
  }

  static async showPlan() {
    console.log("showPlan function called"); // Debug log
    document.getElementById('result2').style.display = 'flex';
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const goal = document.getElementById('goal').value;
    const workoutDuration = parseInt(document.getElementById('workout-duration').value);
    const workoutDays = parseInt(document.getElementById('workout-days').value);
    console.log("User inputs:", { height, weight, goal, workoutDuration, workoutDays }); // Debug log

    const user = new User(height, weight, goal, workoutDuration, workoutDays);

    const bmi = BMI.calculate(height, weight);
    if (isNaN(bmi) || isNaN(workoutDuration) || isNaN(workoutDays) || workoutDuration <= 0 || workoutDays <= 0) {
      document.getElementById('result2').innerHTML = 'Please enter valid numeric values for all fields.';
      return;
    }

    const workouts = await WorkoutLoader.load();
    console.log("Workouts loaded:", workouts); // Debug log
    const workoutInstance = new Workout(workouts);
    const filteredWorkouts = workoutInstance.filterWorkouts(goal);
    console.log("Filtered workouts:", filteredWorkouts); // Debug log
    const workoutPlans = WorkoutPlan.generate(filteredWorkouts, workoutDuration, workoutDays);
    console.log("Generated workout plans:", workoutPlans); // Debug log

    let result2 = workoutPlans.map((plan, index) => `
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
  }
}

const limitCharacters = (element, maxLength) => {
  if (element.value.length > maxLength) {
    element.value = element.value.slice(0, maxLength);
  }
};

const startApp = () => {
  document.getElementById('intro-container').style.display = 'none';
  document.getElementById('main-container').style.display = 'block';
};

// Ensure the calculateBMI function is called when the button is clicked
document.querySelector('.btn-calculate').addEventListener('click', FitTracker.calculateBMI);
document.getElementById('btn-show-plan').addEventListener('click', FitTracker.showPlan);
