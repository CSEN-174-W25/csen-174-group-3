export class User {
  constructor(height, weight, goal, workoutDuration, workoutDays) {
    this._height = height;
    this._weight = weight;
    this._bmi = this.calcBMI();
    this.goal = goal;
    this.workoutDuration = workoutDuration;
    this.workoutDays = workoutDays;
  }

  set height(height) {
    this._height = height;
    this._bmi = this.calcBMI();
  }

  set weight(weight) {
    this._weight = weight;
    this._bmi = this.calcBMI();
  }

  set bmi(bmi) {
    this._bmi = bmi;
  }

  get height() {
    return this._height;
  }

  get weight() {
    return this._weight;
  }

  get bmi() {
    return this._bmi;
  }

  calcBMI() {
    return this._weight / (this._height * this._height);
  }

  getSuggestion() {
    if (this._bmi < 18.5) {
      return "Underweight: Recommend you to focus on muscle gain exercises. These types of exercises will help you build muscle mass.";
    } else if (this._bmi >= 18.5 && this._bmi < 25) {
      return "Baseline: Recommend you to maintain your current fitness level with a mix of cardio and strength exercises.";
    } else if (this._bmi >= 25 && this._bmi < 30) {
      return "Overweight: Recommend you to focus on weight loss exercises. These types of exercises will help you reduce body fat.";
    } else {
      return "Obese: Recommend you to focus on weight loss exercises. These types of exercises will help you reduce body fat.";
    }
  }
}