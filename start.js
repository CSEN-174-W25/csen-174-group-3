class Auth {
    static signUp(username, password) {
        const users = JSON.parse(localStorage.getItem("users")) || {};
        if (users[username]) {
            this.showMessage("Username already exists!", "error");
            return;
        }
        users[username] = { password };
        localStorage.setItem("users", JSON.stringify(users));
        this.showMessage("Account created successfully!", "success");
        showLogIn();
    }

    static logIn(username, password) {
        const users = JSON.parse(localStorage.getItem("users")) || {};
        if (users[username]?.password === password) {
            localStorage.setItem("currentUser", username);
            document.getElementById("app-container").style.display = "block";
            document.getElementById("auth-container").style.display = "none";
            document.querySelector('.hero-section').style.display = 'none';
            loadSavedWorkouts();
        } else {
            this.showMessage("Invalid credentials", "error");
        }
    }

    static logOut() {
        localStorage.removeItem("currentUser");
        document.querySelector('.hero-section').style.display = 'block';
        document.getElementById("app-container").style.display = "none";
        document.getElementById("auth-container").style.display = "block";
        document.getElementById("saved-workouts-list").innerHTML = ""; // Clear the workout display
        window.location.reload();
    }

    static showMessage(message, type = "info") {
        const messageEl = document.getElementById("auth-message");
        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
    }
}

class FitnessManager {
    static async loadWorkouts() {
        const response = await fetch('workouts.json');
        return await response.json();
    }

    static calculateBMI(weight, heightFeet, heightInches) {
        const totalInches = (heightFeet * 12) + heightInches;
        const heightMeters = totalInches * 0.0254;
        const weightKg = weight * 0.453592;
        return weightKg / (heightMeters ** 2);
    }

    static generatePlan(workouts, goal, experienceLevel, workoutPreferences, daysPerWeek, timePerSession) {
        let filteredWorkouts = workouts.filter(w => 
            w.fitness_goals.includes(goal) &&
            w.experience_level.includes(experienceLevel) &&
            w.workout_preferences.includes(workoutPreferences)
        );

        console.log("Filtered workouts:", filteredWorkouts); // Debugging line

        if (filteredWorkouts.length === 0) {
            throw new Error("No workouts found matching your criteria. Please adjust your preferences.");
        }

        let plan = [];
        for (let i = 0; i < daysPerWeek; i++) {
            let dayPlan = [];
            let totalTime = 0;
            while (totalTime < timePerSession) {
                const workout = filteredWorkouts[Math.floor(Math.random() * filteredWorkouts.length)];
                if (!workout) break; // Exit if no workout is found
                const workoutTime = workout.time_minutes;
                if (totalTime + workoutTime <= timePerSession) {
                    dayPlan.push(workout);
                    totalTime += workoutTime;
                } else {
                    break;
                }
            }
            plan.push(dayPlan);
        }
        return plan;
    }

    static filterExercises(workouts, muscleGroup) {
        return workouts.filter(w => w.muscleGroup === muscleGroup);
    }
}

// DOM Interactions
function showSignUp() {
    document.getElementById("login-form").classList.add("fade-out");
    setTimeout(() => {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("signup-form").style.display = "block";
        document.getElementById("signup-form").classList.remove("fade-out");
    }, 300);
}

function showLogIn() {
    document.getElementById("signup-form").classList.add("fade-out");
    setTimeout(() => {
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
        document.getElementById("login-form").classList.remove("fade-out");
    }, 300);
}

function navigateToMenu() {
    document.querySelectorAll(".content-container").forEach(el => el.style.display = "none");
    document.getElementById("menu-container").style.display = "block";
}

async function navigateToWorkoutPlan() {
    document.getElementById("menu-container").style.display = "none";
    document.getElementById("workout-plan-container").style.display = "block";
}

async function navigateToExerciseSearch() {
    document.getElementById("menu-container").style.display = "none";
    document.getElementById("exercise-search-container").style.display = "block";
}

function navigateToMacroCalculator() {
    document.getElementById("menu-container").style.display = "none";
    document.getElementById("macro-calculator-container").style.display = "block";
}

function navigateToSavedWorkouts() {
    document.getElementById("menu-container").style.display = "none";
    document.getElementById("saved-workouts-container").style.display = "block";
}

function navigateToSavedExercises() {
    window.location.href = "saved-exercises.html";
}

async function calculateBMI() {
    const weight = parseFloat(document.getElementById("weight").value);
    const feet = parseFloat(document.getElementById("height-feet").value);
    const inches = parseFloat(document.getElementById("height-inches").value);

    if (isNaN(weight) || isNaN(feet) || isNaN(inches)) {
        showResult("Please fill all fields with valid numbers", true);
        return;
    }

    if (weight <= 0 || weight > 1100) {
        showResult("Please enter a valid weight (0-1100 pounds)", true);
        return;
    }

    if (feet <= 0 || feet > 8 || inches < 0 || inches >= 12) {
        showResult("Please enter a valid height (0-8 feet and 0-11 inches)", true);
        return;
    }

    try {
        const bmi = FitnessManager.calculateBMI(weight, feet, inches);
        showResult(`BMI: ${bmi.toFixed(2)}<br>${getBMISuggestion(bmi)}`);
    } catch (error) {
        showResult(error.message, true);
    }
}

function getBMISuggestion(bmi) {
    if (bmi < 18.5) return "Your goal should be towards building strength and energy! Focus on resistance training to build muscle. Strength isn’t just about size—it’s about feeling powerful in your body!";
    if (bmi < 25) return "You’re in a great place to refine your fitness! Maintain your strength with a mix of resistance training and cardio to boost endurance. Keep this up with workouts or functional training to push your limits and unlock new goals!";
    if (bmi < 30) return "Let’s focus on fat loss while building strength! A mix of strength training and moderate-intensity cardio is key. Start with workouts you enjoy, and gradually increase intensity—you’ve got this!";
    return "Your journey starts with consistency and movement that feels good! Begin with low-impact exercises to enhance endurance while getting each day better. Some bodyweight strength training to develop muscle. Small changes add up to big results—stay committed, and your body will thank you!";
}

async function searchExercises() {
    const muscleGroup = document.getElementById("muscle-group").value;
    try {
        const workouts = await FitnessManager.loadWorkouts();
        const results = FitnessManager.filterExercises(workouts, muscleGroup);
        displayExercises(results);
    } catch (error) {
        showResult(`Error: ${error.message}`, true);
    }
}

async function filterExercisesByGoal() {
    const fitnessGoal = document.getElementById("fitness-goal").value.toLowerCase().replace(" ", "_");
    try {
        const workouts = await FitnessManager.loadWorkouts();
        console.log("Loaded workouts:", workouts); // Debugging line
        const results = workouts.filter(w => w.fitness_goals.includes(fitnessGoal));
        console.log("Filtered results:", results); // Debugging line
        displayExercisesByGoal(results);
    } catch (error) {
        showResult(`Error: ${error.message}`, true);
    }
}

async function filterExercisesByGoalAndExperience() {
    const fitnessGoal = document.getElementById("fitness-goal").value.toLowerCase().replace(" ", "_");
    const experienceLevel = document.getElementById("experience-level").value.toLowerCase();
    try {
        const workouts = await FitnessManager.loadWorkouts();
        console.log("Loaded workouts:", workouts); // Debugging line
        const results = workouts.filter(w => 
            w.fitness_goals.includes(fitnessGoal) && 
            w.experience_level.includes(experienceLevel)
        );
        console.log("Filtered results:", results); // Debugging line
        displayExercisesByGoal(results);
    } catch (error) {
        showResult(`Error: ${error.message}`, true);
    }
}

async function filterExercisesByGoalExperienceAndPreferences() {
    const fitnessGoal = document.getElementById("fitness-goal").value.toLowerCase().replace(" ", "_");
    const experienceLevel = document.getElementById("experience-level").value.toLowerCase();
    const workoutPreferences = document.getElementById("workout-preferences").value.toLowerCase();
    try {
        const workouts = await FitnessManager.loadWorkouts();
        console.log("Loaded workouts:", workouts); // Debugging line
        const results = workouts.filter(w => 
            w.fitness_goals.includes(fitnessGoal) && 
            w.experience_level.includes(experienceLevel) &&
            w.workout_preferences.includes(workoutPreferences)
        );
        console.log("Filtered results:", results); // Debugging line
        displayExercisesByGoal(results);
    } catch (error) {
        showResult(`Error: ${error.message}`, true);
    }
}

function displayExercisesByGoal(exercises) {
    const container = document.getElementById("goal-exercise-results");
    console.log("Displaying exercises:", exercises); // Debugging line
    container.innerHTML = exercises.map(ex => `
        <div class="exercise-card">
            <h3>${ex.name}</h3>
            <p>${ex.description}</p>
            <div class="exercise-meta">
                <span>Type: ${ex.type}</span>
                <span>Duration: ${ex.time_minutes} mins</span>
                <span>Muscle Group: ${ex.muscleGroup}</span>
            </div>
        </div>
    `).join("");
}

function saveExercise(exerciseCode) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        showResult("No user is currently logged in.", true);
        return;
    }

    const savedExercisesKey = `savedExercises_${currentUser}`;
    let savedExercises = JSON.parse(localStorage.getItem(savedExercisesKey)) || [];

    // Fetch the exercise details
    FitnessManager.loadWorkouts().then(workouts => {
        const exercise = workouts.find(ex => ex.code === exerciseCode);
        if (!exercise) {
            showResult("Exercise not found.", true);
            return;
        }

        // Prevent duplicate exercises
        if (savedExercises.some(e => e.code === exercise.code)) {
            showResult("Exercise already saved.", true);
            return;
        }

        savedExercises.push(exercise);
        localStorage.setItem(savedExercisesKey, JSON.stringify(savedExercises));
        showResult("Exercise Saved!", false);
    }).catch(error => {
        showResult(`Error: ${error.message}`, true);
    });
}

function displayExercises(exercises) {
    const container = document.getElementById("exercise-results");
    console.log("Displaying exercises:", exercises); // Debugging line
    container.innerHTML = exercises.map(ex => `
        <div class="exercise-card">
            <h3>${ex.name}</h3>
            <p>${ex.description}</p>
            <div class="exercise-meta">
                <span>Type: ${ex.type}</span>
                <span>Duration: ${ex.time_minutes} mins</span>
                <span>Muscle Group: ${ex.muscleGroup}</span>
            </div>
            <button onclick='saveExercise("${ex.code}")' class="btn-save">Save Exercise</button>
        </div>
    `).join("");
}

function showResult(message, isError = false) {
    const resultEl = document.getElementById("bmi-result");
    resultEl.innerHTML = isError 
        ? `<div class="error">${message}</div>`
        : `<div class="success">${message}</div>`;
}

async function generateWorkoutPlan() {
    const goal = document.getElementById("fitness-goal").value;
    const experienceLevel = document.getElementById("experience-level").value;
    const workoutPreferences = document.getElementById("workout-preferences").value;
    const daysPerWeek = parseInt(document.getElementById("days-per-week").value);
    const timePerSession = parseInt(document.getElementById("time-per-session").value);

    if ([goal, experienceLevel, workoutPreferences].some(v => !v) || isNaN(daysPerWeek) || isNaN(timePerSession) || daysPerWeek <= 0 || timePerSession <= 0) {
        showResult("Please fill all fields with valid values", true);
        return;
    }

    try {
        const workouts = await FitnessManager.loadWorkouts();
        console.log("Loaded workouts:", workouts); // Debugging line
        const plan = FitnessManager.generatePlan(workouts, goal, experienceLevel, workoutPreferences, daysPerWeek, timePerSession);
        console.log("Generated plan:", plan); // Debugging line
        if (plan.length === 0) {
            showResult("No workouts found for the selected criteria", true);
            return;
        }
        displayWorkoutPlan(plan);
        showSaveButton(plan);
    } catch (error) {
        showResult(`Error: ${error.message}`, true);
    }
}

function showSaveButton(plan) {
    const container = document.getElementById("goal-exercise-results");
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Workout";
    saveButton.className = "btn-save";
    saveButton.onclick = () => saveWorkoutPlan(plan);
    container.appendChild(saveButton);
}

function saveWorkoutPlan(plan) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        showResult("No user is currently logged in.", true);
        return;
    }

    const savedWorkoutsKey = `savedWorkouts_${currentUser}`;
    let savedWorkouts = JSON.parse(localStorage.getItem(savedWorkoutsKey)) || [];
    savedWorkouts.push(plan);
    localStorage.setItem(savedWorkoutsKey, JSON.stringify(savedWorkouts));
    displaySavedWorkouts();
    showResult("Workout Plan Saved!", false);
}

function displayWorkoutPlan(plan) {
    const container = document.getElementById("goal-exercise-results");
    let workoutPlanHTML = '<div class="results-grid">';
    console.log("Displaying workout plan:", plan); // Debugging line

    plan.forEach((day, index) => {
        workoutPlanHTML += `
            <div class="day-plan">
                <h3>Day ${index + 1}</h3>
                ${day.map(ex => `
                    <div class="exercise-card">
                        <h3>${ex.name}</h3>
                        <p>${ex.description}</p>
                        <div class="exercise-meta">
                            <span>Type: ${ex.type}</span>
                            <span>Duration: ${ex.time_minutes} mins</span>
                            <span>Muscle Group: ${ex.muscleGroup}</span>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    });

    workoutPlanHTML += '</div>';
    container.innerHTML = workoutPlanHTML;
    console.log("Workout plan HTML:", workoutPlanHTML); // Debugging line
}

function calculateBMR() {
    const weight = parseFloat(document.getElementById("macro-weight").value);
    const heightFeet = parseFloat(document.getElementById("macro-height-feet").value);
    const heightInches = parseFloat(document.getElementById("macro-height-inches").value);
    const gender = document.getElementById("macro-gender").value;
    const age = parseFloat(document.getElementById("macro-age").value);
    const activityLevel = parseFloat(document.getElementById("macro-activity-level").value);
    const goal = document.getElementById("macro-goal").value;

    if ([weight, heightFeet, heightInches, age, activityLevel].some(isNaN)) {
        document.getElementById("macro-result").value = "Please fill all fields with valid numbers.";
        return;
    }

    const totalHeightInches = (heightFeet * 12) + heightInches;
    const heightCm = totalHeightInches * 2.54;
    const weightKg = weight * 0.453592;
    let bmr;

    if (gender === "male") {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else if (gender === "female") {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    } else {
        document.getElementById("macro-result").value = "Invalid gender selected.";
        return;
    }

    let totalCalories = bmr * activityLevel - 250;

    console.log(`Weight: ${weight} lbs (${weightKg.toFixed(2)} kg)`);
    console.log(`Height: ${totalHeightInches} inches (${heightCm.toFixed(2)} cm)`);
    console.log(`BMR: ${bmr.toFixed(2)} calories/day`);
    console.log(`Total Calories: ${totalCalories.toFixed(2)} calories/day`);

    document.getElementById("macro-result").value = 
        `Based on your physical data and goals, your daily calorie intake should be approximately ${totalCalories.toFixed(2)} calories/day.`;

    // Calculate macronutrient breakdown
    let proteinPercentage, carbsPercentage, fatsPercentage;

    if (goal === "fat_loss") {
        proteinPercentage = 0.30;
        carbsPercentage = 0.45;
        fatsPercentage = 0.25;
    } else if (goal === "muscle_gain") {
        proteinPercentage = 0.25;
        carbsPercentage = 0.50;
        fatsPercentage = 0.25;
    } else if (goal === "maintenance") {
        proteinPercentage = 0.25;
        carbsPercentage = 0.50;
        fatsPercentage = 0.25;
    }

    const proteinCalories = totalCalories * proteinPercentage;
    const carbsCalories = totalCalories * carbsPercentage;
    const fatsCalories = totalCalories * fatsPercentage;

    const proteinGrams = proteinCalories / 4;
    const carbsGrams = carbsCalories / 4;
    const fatsGrams = fatsCalories / 9;

    const mealsPerDay = 4;
    const proteinPerMeal = proteinGrams / mealsPerDay;
    const carbsPerMeal = carbsGrams / mealsPerDay;
    const fatsPerMeal = fatsGrams / mealsPerDay;

    console.log(`Protein: ${proteinGrams.toFixed(2)}g (${proteinPerMeal.toFixed(2)}g per meal)`);
    console.log(`Carbs: ${carbsGrams.toFixed(2)}g (${carbsPerMeal.toFixed(2)}g per meal)`);
    console.log(`Fats: ${fatsGrams.toFixed(2)}g (${fatsPerMeal.toFixed(2)}g per meal)`);

    document.getElementById("macro-additional-result").value = 
        `Macronutrient Breakdown:\n` +
        `To achieve your goal, you should consume the following macros daily:\n` +
        `Protein: ${proteinGrams.toFixed(2)}g (${proteinPerMeal.toFixed(2)}g per meal)\n` +
        `Carbs: ${carbsGrams.toFixed(2)}g (${carbsPerMeal.toFixed(2)}g per meal)\n` +
        `Fats: ${fatsGrams.toFixed(2)}g (${fatsPerMeal.toFixed(2)}g per meal)`;
}

function displaySavedWorkouts() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        showResult("No user is currently logged in.", true);
        return;
    }

    const savedWorkoutsKey = `savedWorkouts_${currentUser}`;
    const savedWorkouts = JSON.parse(localStorage.getItem(savedWorkoutsKey)) || [];
    const container = document.getElementById("saved-workouts-list");
    container.innerHTML = savedWorkouts.map((workout, index) => `
        <div class="saved-workout-item">
            <div class="workout-controls">
                <button onclick="toggleWorkoutDetails(${index})" class="btn-view">View</button>
                <button onclick="removeSavedWorkout(${index})" class="btn-remove">Remove</button>
            </div>
            <span>Workout Plan ${index + 1}</span>
            <div id="workout-details-${index}" class="workout-details" style="display: none;">
                ${workout.map((day, dayIndex) => `
                    <div class="day-plan">
                        <h3>Day ${dayIndex + 1}</h3>
                        ${day.map(ex => `
                            <div class="exercise-card">
                                <h3>${ex.name}</h3>
                                <p>${ex.description}</p>
                                <div class="exercise-meta">
                                    <span>Type: ${ex.type}</span>
                                    <span>Duration: ${ex.time_minutes} mins</span>
                                    <span>Muscle Group: ${ex.muscleGroup}</span>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `).join("")}
            </div>
        </div>
    `).join("");
}

function toggleWorkoutDetails(index) {
    const details = document.getElementById(`workout-details-${index}`);
    details.style.display = details.style.display === "none" ? "block" : "none";
}

function removeSavedWorkout(index) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        showResult("No user is currently logged in.", true);
        return;
    }

    const savedWorkoutsKey = `savedWorkouts_${currentUser}`;
    let savedWorkouts = JSON.parse(localStorage.getItem(savedWorkoutsKey)) || [];
    savedWorkouts.splice(index, 1);
    localStorage.setItem(savedWorkoutsKey, JSON.stringify(savedWorkouts));
    loadSavedWorkouts();
}

function saveWorkout(workout) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        showResult("No user is currently logged in.", true);
        return;
    }

    const savedWorkoutsKey = `savedWorkouts_${currentUser}`;
    let savedWorkouts = JSON.parse(localStorage.getItem(savedWorkoutsKey)) || [];
    savedWorkouts.push(workout);
    localStorage.setItem(savedWorkoutsKey, JSON.stringify(savedWorkouts));
    loadSavedWorkouts();
}

function loadSavedWorkouts() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        showResult("No user is currently logged in.", true);
        return;
    }

    const savedWorkoutsKey = `savedWorkouts_${currentUser}`;
    const savedWorkouts = JSON.parse(localStorage.getItem(savedWorkoutsKey)) || [];
    const container = document.getElementById("saved-workouts-list");
    container.innerHTML = savedWorkouts.map((workout, index) => `
        <div class="saved-workout-item">
            <div class="workout-controls">
                <button onclick="toggleWorkoutDetails(${index})" class="btn-view">View</button>
                <button onclick="removeSavedWorkout(${index})" class="btn-remove">Remove</button>
            </div>
            <span>Workout Plan ${index + 1}</span>
            <div id="workout-details-${index}" class="workout-details" style="display: none;">
                ${workout.map((day, dayIndex) => `
                    <div class="day-plan">
                        <h3>Day ${dayIndex + 1}</h3>
                        ${day.map(ex => `
                            <div class="exercise-card">
                                <h3>${ex.name}</h3>
                                <p>${ex.description}</p>
                                <div class="exercise-meta">
                                    <span>Type: ${ex.type}</span>
                                    <span>Duration: ${ex.time_minutes} mins</span>
                                    <span>Muscle Group: ${ex.muscleGroup}</span>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `).join("")}
            </div>
        </div>
    `).join("");
}

function displaySavedExercises() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        showResult("No user is currently logged in.", true);
        return;
    }

    const savedExercisesKey = `savedExercises_${currentUser}`;
    const savedExercises = JSON.parse(localStorage.getItem(savedExercisesKey)) || [];
    const container = document.getElementById("saved-exercises-list");

    if (savedExercises.length === 0) {
        container.innerHTML = "<p>You haven't saved any exercises yet.</p>";
        return;
    }

    container.innerHTML = savedExercises.map((ex, index) => `
        <div class="exercise-card">
            <h3>${ex.name}</h3>
            <p>${ex.description}</p>
            <div class="exercise-meta">
                <span>Type: ${ex.type}</span>
                <span>Duration: ${ex.time_minutes} mins</span>
                <span>Muscle Group: ${ex.muscleGroup}</span>
            </div>
            <button onclick="removeSavedExercise(${index})" class="btn-remove">Remove</button>
        </div>
    `).join("");
}

function removeSavedExercise(index) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        showResult("No user is currently logged in.", true);
        return;
    }

    const savedExercisesKey = `savedExercises_${currentUser}`;
    let savedExercises = JSON.parse(localStorage.getItem(savedExercisesKey)) || [];
    savedExercises.splice(index, 1);
    localStorage.setItem(savedExercisesKey, JSON.stringify(savedExercises));
    displaySavedExercises();
}

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("currentUser");
    document.querySelector('.hero-section').style.display = isLoggedIn ? 'none' : 'block';
    if (isLoggedIn) {
        document.getElementById("app-container").style.display = "block";
        document.getElementById("auth-container").style.display = "none";
    } else {
        document.getElementById("auth-container").style.display = "block";
    }
    document.querySelector(".welcome-title").classList.add("fade-in");
    document.querySelector(".auth-container").classList.add("slide-fade-in");
});
