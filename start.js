const calcularIMC = () => {
  const altura = document.getElementById('altura').value;
  const peso = document.getElementById('peso').value;

  const imc = peso / ((altura / 100) * (altura / 100));

  let resultado = '';
  if (isNaN(imc)) {
      resultado = 'Por favor, ingrese valores numéricos válidos.';
  } else if (altura < 0 || peso < 0) {
      resultado = 'Ni el peso ni la altura pueden ser números negativos.';
  }  else if (peso > 600) {
    resultado = 'El peso no puede ser mayor a 600kg.';
    } else if (altura > 251 || altura < 40) {
        resultado = 'La altura no puede ser mayor a 251cm ni menor a 40cm.';
    }else {
      resultado = `Su IMC es: ${imc.toFixed(2)}`;
  }

  document.getElementById('resultado').innerHTML = resultado;
};


document.getElementById('btn-calcular').addEventListener("click", () => {
  document.getElementById('scene').style.display = 'flex';
  document.getElementById('resultado2').style.display = 'none';

  runCanvasAnimation(() => {
      document.getElementById('scene').style.display = 'none';
      document.getElementById('resultado2').style.display = 'flex';
  });
});

const mostrarPlan = () => {
  const altura = document.getElementById('altura').value;
  const peso = document.getElementById('peso').value;

  const imc = peso / ((altura / 100) * (altura / 100));

  let resultado2 = '';
  if (isNaN(imc)) {
      resultado2 = 'Por favor, ingrese valores numéricos válidos.';
  } else if (imc > 0 && imc < 18.5) {
      resultado2 = '<img src="img/1.jpeg" class="plan" alt="">';
  } else if (imc >= 18.5 && imc < 25) {
      resultado2 = '<img src="img/plan de 18 a 25.jpeg" class="plan" alt="">';
  } else if (imc >= 25 && imc < 30) {
      resultado2 = '<img src="img/3.jpeg" class="plan" alt="">';
  } else if (imc >= 30) {
      resultado2 = '<img src="img/4.jpeg" class="plan" alt="">';
  }

  document.getElementById('resultado2').innerHTML = resultado2;
};

const limitarCaracteres = (elemento, maxLength) => {
  if (elemento.value.length > maxLength) {
      elemento.value = elemento.value.slice(0, maxLength);
  }
};

const runCanvasAnimation = (callback) => {
  const canvas = document.getElementById('animationCanvas');
  const ctx = canvas.getContext('2d');

  const mancuernaImg = new Image();
  mancuernaImg.src = 'img/dumbell.png'; // Asegúrate de tener esta imagen en la carpeta correcta

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

  mancuernaImg.onload = () => {
      const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(mancuernaImg, (canvas.width - weightWidth) / 2, weightY, weightWidth, weightHeight);

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
