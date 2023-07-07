import '../styles/_reset.scss';
import '../styles/_index.scss';
import '../styles/_bootstrap-grid.scss';

import errorMessages from '../errorMessages';

let checkedNavOption = 'calculate';
let mealPlanInfo = {};

document.getElementById('nav')?.addEventListener('change', () => {
  checkedNavOption = document.querySelector('input[name="heading"]:checked')?.value;
  document.querySelector('.alert')?.remove();
  document.querySelector('.alert-message')?.remove();
  if (document.querySelectorAll('input[name="allergy"]:checked').length > 0) {
    const checkedAllergies = document.querySelectorAll('input[name="allergy"]:checked');
    for (let i = 0; i < checkedAllergies.length; i++) {
      checkedAllergies[i].checked = false;
    }
  }
  if (checkedNavOption === 'calculate') {
    document.getElementById('submit-button')?.removeAttribute('class');
    document.getElementById('submit-button').innerText = 'Calculate Macros';
    document.getElementById('generator-2').style.display = 'none';
    document.getElementById('generator-1').style.display = 'block';
  } else if (checkedNavOption === 'enter') {
    document.getElementById('submit-button')?.setAttribute('class', 'plan-button');
    document.getElementById('submit-button').innerText = 'Generate Meal Plan';
    if (document.querySelector('.calculated-macros')) {
      document.querySelector('.calculated-macros')?.remove();
    }
    document.getElementById('generator-1').style.display = 'none';
    document.getElementById('generator-2').style.display = 'block';
  }
  return;
});

document.getElementById('submit-button')?.addEventListener('click', () => {
  let macros = {};
  if (checkedNavOption === 'calculate' && !document.getElementById('submit-button')?.classList.contains('plan-button')) {
    const height = document.getElementById('height-input')?.value;
    const weight = document.getElementById('weight-input')?.value;
    const age = document.getElementById('age-input')?.value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const activityLevel = document.querySelector('input[name="activity-level"]:checked')?.value;
    const goal = document.querySelector('input[name="goal"]:checked')?.value;
    const dietType = document.querySelector('input[name="diet-type"]:checked')?.value;
    const allergies = document.querySelectorAll('input[name="allergy"]:checked');
    if (validateInput({ height, weight, age })) {
      macros = calculateMacros({ height, weight, age, gender, activityLevel, goal });
      displayMacros(macros);
      mealPlanInfo = { macros, dietType, allergies };
    } else {
      return;
    }
  } else if (checkedNavOption === 'enter') {
    const dietType = document.getElementById('diet-type-input')?.value;
    const calories = document.getElementById('calories-input')?.value;
    const protein = document.getElementById('protein-input')?.value;
    const fats = document.getElementById('fats-input')?.value;
    const carbohydrates = document.getElementById('carbohydrates-input')?.value;
    const allergies = document.querySelectorAll('input[name="allergy"]:checked');
    if (validateInput({ calories, protein, fats, carbohydrates })) {
      macros = { calories, protein, fats, carbohydrates };
      mealPlanInfo = { macros, dietType, allergies };
    } else {
      return;
    }
    generateMealPlan();
  } else {
    generateMealPlan();
  }
  return;
});

const validateInput = (input) => {
  document.querySelector('.alert')?.remove();
  document.querySelector('.alert-message')?.remove();
  if (Object.keys(input).length === 3) {
    if (input.height === '' || input.weight === '' || input.age === '') {
      const div = document.createElement('div');
      div.setAttribute('class', 'row m-0 px-3 alert');
      const p = document.createElement('p');
      p.setAttribute('class', 'alert-message p-0');
      p.innerText = 'Some input fields are empty! Try again!';
      div.append(p);
      const nav = document.getElementById('nav');
      nav?.parentNode?.insertBefore(div, nav.nextSibling);
      return false;
    } else if (!(input.height >= 100 && input.height <= 250)) {
      const p = document.createElement('p');
      p.setAttribute('class', 'alert-message p-0');
      p.innerText = 'Height must be a number between 100-250 (cm)! Try again!';
      const heightInput = document.getElementById('height-input');
      heightInput?.parentNode?.insertBefore(p, heightInput);
      return false;
    } else if (!(input.weight >= 30 && input.weight <= 300)) {
      const p = document.createElement('p');
      p.setAttribute('class', 'alert-message p-0');
      p.innerText = 'Weight must be a number between 30-300 (kg)! Try again!';
      const weightInput = document.getElementById('weight-input');
      weightInput?.parentNode?.insertBefore(p, weightInput);
      return false;
    } else if (!(input.age >= 14 && input.age <= 99)) {
      const p = document.createElement('p');
      p.setAttribute('class', 'alert-message p-0');
      p.innerText = 'Age must be a number between 14-99 (years)! Try again!';
      const ageInput = document.getElementById('age-input');
      ageInput?.parentNode?.insertBefore(p, ageInput);
      return false;
    }
  } else if (Object.keys(input).length === 4) {
    if (input.calories === '' || input.protein === '' || input.fats === '' || input.carbohydrates === '') {
      const div = document.createElement('div');
      div.setAttribute('class', 'row m-0 px-3 alert');
      const p = document.createElement('p');
      p.setAttribute('class', 'alert-message p-0');
      p.innerText = 'Some input fields are empty! Try again!';
      div.append(p);
      const nav = document.getElementById('nav');
      nav?.parentNode?.insertBefore(div, nav.nextSibling);
      return false;
    } else if (input.calories < 0 || input.protein < 0 || input.fats < 0 || input.carbohydrates < 0) {
      const div = document.createElement('div');
      div.setAttribute('class', 'row m-0 px-3 alert');
      const p = document.createElement('p');
      p.setAttribute('class', 'alert-message p-0');
      p.innerText = 'All input fields must have a positive value! Try again!';
      div.append(p);
      const nav = document.getElementById('nav');
      nav?.parentNode?.insertBefore(div, nav.nextSibling);
      return false;
    }
  }
  return true;
};

/* https://www.forbes.com/health/body/bmr-calculator/, https://www.lvac.com/blog/calculate-macronutrients/, https://healthyeater.com/flexible-dieting-calculator! */
const calculateMacros = (input) => {
  let bmr = 0;
  if (input.gender === 'male') {
    bmr = 10 * input.weight + 6.25 * input.height - 5 * input.age + 5;
  } else if (input.gender === 'female') {
    bmr = 10 * input.weight + 6.25 * input.height - 5 * input.age - 161;
  }
  let tdee = 0;
  if (input.activityLevel === 'sedentary') {
    tdee = 1.2 * bmr;
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
    calories = Number((tdee - tdee * 0.2).toFixed(0));
  } else if (input.goal === 'maintain-weight') {
    calories = Number(tdee.toFixed(0));
  } else if (input.goal === 'gain-weight') {
    calories = Number((tdee + tdee * 0.2).toFixed(0));
  }
  const protein = Number(((calories * 0.4) / 4).toFixed(0));
  const fats = Number(((calories * 0.15) / 4).toFixed(0));
  const carbohydrates = Number(((calories * 0.45) / 4).toFixed(0));
  return { calories, protein, fats, carbohydrates };
};

const displayMacros = (macros) => {
  document.getElementById('submit-button')?.setAttribute('class', 'plan-button');
  document.getElementById('submit-button').innerText = 'Generate Meal Plan';

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

  div.append(rowFirst);
  div.append(rowSecond);

  const submitButtonDiv = document.getElementById('button');
  submitButtonDiv?.parentNode?.insertBefore(div, submitButtonDiv);
};

const generateMealPlan = async () => {
  document.querySelector('.generator').style.display = 'none';
  document.querySelector('.loader').style.display = 'block';
  const breakfastMeals = extractMealsInfo(await fetchData('Breakfast', mealPlanInfo));
  const lunchMeals = extractMealsInfo(await fetchData('Lunch', mealPlanInfo));
  const dinnerMeals = extractMealsInfo(await fetchData('Dinner', mealPlanInfo));
  localStorage.setItem('completeMealPlan', JSON.stringify({ breakfastMeals, lunchMeals, dinnerMeals }));
  document.querySelector('.loader').style.display = 'none';
  document.querySelector('.generator').style.display = 'block';
  window.location.href = '../meal-plan.html';
  return;
};

const fetchData = async (mealType, input) => {
  const BASE_URL = 'https://api.edamam.com/api/recipes/v2?type=public';
  const AUTH_INFO = '&app_id=a8a1b73a&app_key=34a790e3c4f9bc291c294b8b542bfaa7';
  let dietType = '';
  if (input.dietType === 'vegetarian') {
    dietType = '&health=vegetarian';
  } else if (input.dietType === 'vegan') {
    dietType = '&health=vegan';
  }
  let allergies = '';
  if (input.allergies) {
    for (let i = 0; i < input.allergies.length; i++) {
      allergies += `&exclude=${input.allergies[i].value}`;
    }
  }
  const additionalData = `&random=true&mealType=${mealType}&nutrients%5BENERC_KCAL%5D=${valueBasedOnMealType(
    mealType,
    input.macros.calories
  )}&nutrients%5BPROCNT%5D=${valueBasedOnMealType(mealType, input.macros.protein)}&nutrients%5BFAT%5D=${valueBasedOnMealType(
    mealType,
    input.macros.fats
  )}&nutrients%5BCHOCDF%5D=${valueBasedOnMealType(mealType, input.macros.carbohydrates)}${dietType}${allergies}`;
  try {
    // const response = await fetch(BASE_URL + AUTH_INFO + additionalData);
    // if (!response.ok) throw new Error(response.statusText);
    const response = await fetch(BASE_URL + AUTH_INFO + additionalData).then((res) => res.json());
    return response;
  } catch (error) {
    if (errorMessages[error.message]) return alert(errorMessages[error.message]);
    alert('Tekkis tundmatu viga! Proovi mõne aja pärast uuesti!');

    if (error.message === 'Failed to fetch') {
      alert('Vastust ei ole võimalik kuvada, sest siht-veebiaadress on vigane! Proovi uuesti!');
    } else {
      alert('Tekkis tundmatu viga! Proovi mõne aja pärast uuesti!');
    }
    window.location.href = './index.html';
    return;
  }
};

/* these meal-type percentages should be typical! */
const valueBasedOnMealType = (mealType, category) => {
  if (mealType === 'Breakfast') return Number((category * 0.35).toFixed(0));
  if (mealType === 'Lunch') return Number((category * 0.4).toFixed(0));
  if (mealType === 'Dinner') return Number((category * 0.25).toFixed(0));
};

const extractMealsInfo = (input) => {
  const arrayOfMeals = [];
  for (let i = 0; i < 7; i++) {
    const label = input.hits[i].recipe.label;
    const ingredients = input.hits[i].recipe.ingredientLines;
    const image = input.hits[i].recipe.image;
    const calories = Number(input.hits[i].recipe.calories.toFixed(0));
    const protein = Number(input.hits[i].recipe.totalNutrients.PROCNT.quantity.toFixed(0));
    const fat = Number(input.hits[i].recipe.totalNutrients.FAT.quantity.toFixed(0));
    const carbohydrates = Number(input.hits[i].recipe.totalNutrients.CHOCDF.quantity.toFixed(0));
    const meal = { label, ingredients, image, calories, protein, fat, carbohydrates };
    arrayOfMeals.push(meal);
  }
  return arrayOfMeals;
};
