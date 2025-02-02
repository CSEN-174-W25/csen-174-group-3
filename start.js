const calcularIMC = async () => {
  const altura = document.getElementById('altura').value;
  const peso = document.getElementById('peso').value;

  const imc = peso / ((altura / 100) * (altura / 100));

  let resultado = '';
  if (isNaN(imc)) {
      resultado = 'Por favor, ingrese valores numéricos válidos.';
  } else if (altura < 0 || peso < 0) {
      resultado = 'Ni el peso ni la altura pueden ser números negativos.';
  } else if (peso > 600) {
      resultado = 'El peso no puede ser mayor a 600kg.';
  } else if (altura > 251 || altura < 40) {
      resultado = 'La altura no puede ser mayor a 251cm ni menor a 40cm.';
  } else {
      resultado = `Su IMC es: ${imc.toFixed(2)}`;
      await mostrarPlan(imc); // Call mostrarPlan with the calculated BMI
  }

  document.getElementById('resultado').innerHTML = resultado;
};

document.getElementById('btn-show-plan').addEventListener("click", async () => {
  document.getElementById('resultado2').style.display = 'flex';
  const altura = document.getElementById('altura').value;
  const peso = document.getElementById('peso').value;
  const imc = peso / ((altura / 100) * (altura / 100));
  await mostrarPlan(imc);
});

const mostrarPlan = async (imc) => {
  let resultado2 = '';
  if (isNaN(imc)) {
      resultado2 = 'Por favor, ingrese valores numéricos válidos.';
  } else {
      const workouts = await loadWorkouts();
      const filteredWorkouts = workouts.filter(workout => {
          if (imc < 18.5) return workout.type === 'strength';
          if (imc >= 18.5 && imc < 25) return workout.type === 'cardio';
          if (imc >= 25 && imc < 30) return workout.type === 'strength';
          if (imc >= 30) return workout.type === 'cardio';
      });

      resultado2 = filteredWorkouts.map(workout => `
        <div class="workout">
          <h3>${workout.name}</h3>
          <p>${workout.description}</p>
        </div>
      `).join('');
  }

  document.getElementById('resultado2').innerHTML = resultado2;
};

const limitarCaracteres = (elemento, maxLength) => {
  if (elemento.value.length > maxLength) {
      elemento.value = elemento.value.slice(0, maxLength);
  }
};

const loadWorkouts = async () => {
  const response = await fetch('workouts.json');
  const workouts = await response.json();
  return workouts;
};
