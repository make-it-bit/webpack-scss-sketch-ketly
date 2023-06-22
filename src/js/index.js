import '../scss/index.scss';
import '../scss/reset.scss';
// import '../scss/_reset.scss';

let checkedNavHeading = 'calculate';

document.getElementById('nav')?.addEventListener('change', () => {
  checkedNavHeading = document.querySelector('input[name="heading"]:checked')?.value;
  if (!document.getElementById('submit-button')) {
    document.getElementById('plan-button').innerText = 'Calculate Macros';
    document.getElementById('plan-button')?.removeAttribute('id');
    document.querySelector('button')?.setAttribute('id', 'submit-button');
  }
  if (document.querySelector('.calculated-macros')) {
    document.querySelector('.calculated-macros')?.remove();
  }

  if (checkedNavHeading === 'calculate') {
    document.getElementById('generator-2').style.display = 'none';
    document.getElementById('generator-1').style.display = 'block';
  } else if (checkedNavHeading === 'enter') {
    document.getElementById('generator-1').style.display = 'none';
    document.getElementById('generator-2').style.display = 'block';
  }
  return;
});

document.getElementById('submit-button')?.addEventListener('click', () => {
  /* TODO: input validation! */
  let macros = {};
  if (checkedNavHeading === 'calculate') {
    const height = document.getElementById('height-input')?.value;
    const weight = document.getElementById('weight-input')?.value;
    const age = document.getElementById('age-input')?.value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const activityLevel = document.querySelector('input[name="activity"]:checked')?.value;
    const goal = document.querySelector('input[name="goal"]:checked')?.value;
    const dietType = document.querySelector('input[name="diet"]:checked')?.value;
    const allergies = document.querySelectorAll('input[name="allergy"]:checked');
    macros = calculateMacros({ height, weight, age, gender, activityLevel, goal });
  } else if (checkedNavHeading === 'enter') {
    const dietType = document.getElementById('diet-input')?.value;
    const calories = document.getElementById('calories-input')?.value;
    const protein = document.getElementById('protein-input')?.value;
    const fats = document.getElementById('fats-input')?.value;
    const carbohydrates = document.getElementById('carbohydrates-input')?.value;
    macros = { calories, protein, fats, carbohydrates };
  }
  if (!document.querySelector('.calculated-macros')) {
    displayMacros(macros);
  }
  return;
});

// these formulas are used: https://www.lvac.com/blog/calculate-macronutrients/
// this knowledge is used: https://healthyeater.com/flexible-dieting-calculator
const calculateMacros = (input) => {
  let bmr = 0;
  if (input.gender === 'male') {
    bmr = 66 + 6.2 * input.weight + 12.7 * input.height - 6.76 * input.age;
  } else if (input.gender === 'female') {
    bmr = 655.1 + 4.35 * input.weight + 4.7 * input.height - 4.7 * input.age;
  }
  let tdee = 0;
  if (input.activityLevel === 'sedentary') {
    tdee = 12 * bmr;
  } else if (input.activityLevel === 'lightly-active') {
    tdee = 1.375 * bmr;
  } else if (input.activityLevel === 'active') {
    tdee = 1.55 * bmr;
  } else if (input.activityLevel === 'very-active') {
    tdee = 1.725 * bmr;
  } else if (input.activityLevel === 'extremely-active') {
    tdee = 1.9 * bmr;
  }
  let calories = 0;
  if (input.goal === 'lose-weight') {
    calories = Math.floor(tdee - tdee * 0.2);
  } else if (input.goal === 'maintain-weight') {
    calories = Math.floor(tdee);
  } else if (input.goal === 'gain-weight') {
    calories = Math.floor(tdee + tdee * 0.2);
  }
  const protein = Math.floor((calories * 0.3) / 4);
  const fats = Math.floor((calories * 0.3) / 4);
  const carbohydrates = Math.floor((calories * 0.4) / 4);
  return { calories, protein, fats, carbohydrates };
};

const displayMacros = (macros) => {
  document.getElementById('submit-button').innerText = 'Get Meal Plan';
  document.getElementById('submit-button')?.removeAttribute('id');
  document.querySelector('button')?.setAttribute('id', 'plan-button');
  let container;
  if (checkedNavHeading === 'calculate') {
    container = document.getElementById('generator-1');
  } else if (checkedNavHeading === 'enter') {
    container = document.getElementById('generator-2');
  }
  const div = document.createElement('div');
  div.setAttribute('class', 'calculated-macros');
  const h1 = document.createElement('h1');
  h1.innerText = 'Your Suggested Macros';
  div.append(h1);
  const rowFirst = document.createElement('div');
  rowFirst.setAttribute('class', 'row');
  const colFirst = document.createElement('div');
  colFirst.setAttribute('class', 'col-12');
  const calories = document.createElement('p');
  calories.setAttribute('class', 'extra-p');
  calories.innerText = 'Calories';
  const caloriesNum = document.createElement('p');
  caloriesNum.innerText = `${macros.calories} kcal`;
  colFirst.append(calories);
  colFirst.append(caloriesNum);
  rowFirst.append(colFirst);
  div.append(rowFirst);
  const rowSecond = document.createElement('div');
  rowSecond.setAttribute('class', 'row');
  const colSecond1 = document.createElement('div');
  colSecond1.setAttribute('class', 'col-4');
  const protein = document.createElement('p');
  protein.setAttribute('class', 'extra-p');
  protein.innerText = 'Protein';
  const proteinNum = document.createElement('p');
  proteinNum.innerText = `${macros.protein} g`;
  colSecond1.append(protein);
  colSecond1.append(proteinNum);
  const colSecond2 = document.createElement('div');
  colSecond2.setAttribute('class', 'col-4');
  const fats = document.createElement('p');
  fats.setAttribute('class', 'extra-p');
  fats.innerText = 'Fats';
  const fatsNum = document.createElement('p');
  fatsNum.innerText = `${macros.fats} g`;
  colSecond2.append(fats);
  colSecond2.append(fatsNum);
  const colSecond3 = document.createElement('div');
  colSecond3.setAttribute('class', 'col-4');
  const carbohydrates = document.createElement('p');
  carbohydrates.setAttribute('class', 'extra-p');
  carbohydrates.innerText = 'Carbohydrates';
  const carbohydratesNum = document.createElement('p');
  carbohydratesNum.innerText = `${macros.carbohydrates} g`;
  colSecond3.append(carbohydrates);
  colSecond3.append(carbohydratesNum);
  rowSecond.append(colSecond1);
  rowSecond.append(colSecond2);
  rowSecond.append(colSecond3);
  div.append(rowSecond);
  container?.append(div);
};
