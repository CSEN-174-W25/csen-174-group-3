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
        } else {
            this.showMessage("Invalid credentials", "error");
        }
    }

    static logOut() {
        localStorage.removeItem("currentUser");
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

    static generatePlan(workouts, goal, daysPerWeek, timePerSession) {
        let filteredWorkouts;
        if (goal === "weight-loss") {
            filteredWorkouts = workouts.filter(w => w.type === "cardio");
        } else if (goal === "muscle-gain") {
            filteredWorkouts = workouts.filter(w => w.type === "strength");
        } else {
            filteredWorkouts = workouts;
        }

        return Array.from({ length: daysPerWeek }, () => {
            let dayPlan = [];
            let totalTime = 0;
            while (totalTime < timePerSession) {
                const workout = filteredWorkouts[Math.floor(Math.random() * filteredWorkouts.length)];
                const workoutTime = workout["time (minutes)"];
                if (totalTime + workoutTime <= timePerSession) {
                    dayPlan.push(workout);
                    totalTime += workoutTime;
                }
            }
            return dayPlan;
        });
    }

    static filterExercises(workouts, muscleGroup) {
        return workouts.filter(w => w.muscleGroup === muscleGroup);
    }
}

// DOM Interactions
function showSignUp() {
    document.getElementById("signup-form").style.display = "block";
    document.getElementById("login-form").style.display = "none";
    document.querySelector(".btn-switch[onclick='showLogIn()']").style.display = "block";
    document.querySelector(".btn-switch[onclick='showSignUp()']").style.display = "none";
}

function showLogIn() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    document.querySelector(".btn-switch[onclick='showLogIn()']").style.display = "none";
    document.querySelector(".btn-switch[onclick='showSignUp()']").style.display = "block";
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

async function calculateBMI() {
    const weight = parseFloat(document.getElementById("weight").value);
    const feet = parseFloat(document.getElementById("height-feet").value);
    const inches = parseFloat(document.getElementById("height-inches").value);

    if ([weight, feet, inches].some(isNaN)) {
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

function displayExercises(exercises) {
    const container = document.getElementById("exercise-results");
    container.innerHTML = exercises.map(ex => `
        <div class="exercise-card">
            <h3>${ex.name}</h3>
            <p>${ex.description}</p>
            <div class="exercise-meta">
                <span>Type: ${ex.type}</span>
                <span>Duration: ${ex["time (minutes)"]} mins</span>
                <span>Difficulty: ${ex.difficulty}</span>
            </div>
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
    // Function content removed
}

function displayWorkoutPlan(plan) {
    // Function content removed
}

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("currentUser")) {
        document.getElementById("app-container").style.display = "block";
        document.getElementById("auth-container").style.display = "none";
    } else {
        document.getElementById("auth-container").style.display = "block";
    }
});
