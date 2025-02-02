const calculateBMI = () => {
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
  }

  document.getElementById('result').innerHTML = result;
};

document.getElementById('btn-show-plan').addEventListener("click", () => {
  document.getElementById('scene').style.display = 'flex';
  document.getElementById('result2').style.display = 'none';

  runCanvasAnimation(() => {
      document.getElementById('scene').style.display = 'none';
      document.getElementById('result2').style.display = 'flex';
  });
});

const showPlan = () => {
  const height = document.getElementById('height').value;
  const weight = document.getElementById('weight').value;

  const bmi = weight / ((height / 100) * (height / 100));

  let result2 = '';
  if (isNaN(bmi)) {
      result2 = 'Please enter valid numeric values.';
  } else if (bmi > 0 && bmi < 18.5) {
      result2 = '<img src="img/1.jpeg" class="plan" alt="">';
  } else if (bmi >= 18.5 && bmi < 25) {
      result2 = '<img src="img/plan de 18 a 25.jpeg" class="plan" alt="">';
  } else if (bmi >= 25 && bmi < 30) {
      result2 = '<img src="img/3.jpeg" class="plan" alt="">';
  } else if (bmi >= 30) {
      result2 = '<img src="img/4.jpeg" class="plan" alt="">';
  }

  document.getElementById('result2').innerHTML = result2;
};

const limitCharacters = (element, maxLength) => {
  if (element.value.length > maxLength) {
      element.value = element.value.slice(0, maxLength);
  }
};

const runCanvasAnimation = (callback) => {
  const canvas = document.getElementById('animationCanvas');
  const ctx = canvas.getContext('2d');

  const dumbbellImg = new Image();
  dumbbellImg.src = 'img/dumbell.png'; // Make sure to have this image in the correct folder

  let weightY = 0;
  const weightHeight = 50;
  const weightWidth = 100;
  const floorY = canvas.height - 175;
  let velocity = 5;
  let bounce = 0.6;
  let damping = 0.9;
  let animating = true;
  let bounceCount = 0;
  const maxBounces = 3;

  dumbbellImg.onload = () => {
      const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(dumbbellImg, (canvas.width - weightWidth) / 2, weightY, weightWidth, weightHeight);

          if (animating) {
              weightY += velocity;
              velocity += 0.8; // simulate gravity

              if (weightY >= floorY) {
                  weightY = floorY;
                  velocity = -velocity * bounce;
                  bounceCount++;

                  // Apply damping to reduce energy on each bounce
                  if (bounceCount >= maxBounces || Math.abs(velocity) < 1) {
                      animating = false;
                      setTimeout(callback, 500);
                  }
              }
          }

          if (animating || Math.abs(velocity) >= 1) {
              requestAnimationFrame(animate);
          } else {
              ctx.fillStyle = 'black';
              ctx.fillRect(0, floorY + weightHeight, canvas.width, 10);
              setTimeout(callback, 1000);
          }
      };

      animate();
  };
};
