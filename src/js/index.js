import '../scss/_reset.scss';
import '../scss/_index.scss';
import '../scss/_bootstrap-grid.scss';

let checkedNavOption = 'calculate';
let mealPlanInfo = {};
let completeMealPlan = {};

document.getElementById('nav')?.addEventListener('change', () => {
  checkedNavOption = document.querySelector('input[name="heading"]:checked')?.value;
  document.getElementById('submit-button')?.removeAttribute('class');
  if (document.querySelectorAll('input[name="allergy"]:checked').length > 0) {
    const checkedAllergies = document.querySelectorAll('input[name="allergy"]:checked');
    for (let i = 0; i < checkedAllergies.length; i++) {
      checkedAllergies[i].checked = false;
    }
  }
  if (document.querySelector('.calculated-macros')) {
    document.querySelector('.calculated-macros')?.remove();
  }
  if (checkedNavOption === 'calculate') {
    document.getElementById('generator-2').style.display = 'none';
    document.getElementById('generator-1').style.display = 'block';
  } else if (checkedNavOption === 'enter') {
    document.getElementById('generator-1').style.display = 'none';
    document.getElementById('generator-2').style.display = 'block';
  }
  return;
});

/* TODO: INPUT VALIDATION! */
document.getElementById('submit-button')?.addEventListener('click', () => {
  if (!document.getElementById('submit-button')?.classList.contains('plan-button')) {
    let macros = {};
    if (checkedNavOption === 'calculate') {
      const height = document.getElementById('height-input')?.value;
      const weight = document.getElementById('weight-input')?.value;
      const age = document.getElementById('age-input')?.value;
      const gender = document.querySelector('input[name="gender"]:checked')?.value;
      const activityLevel = document.querySelector('input[name="activity-level"]:checked')?.value;
      const goal = document.querySelector('input[name="goal"]:checked')?.value;
      const dietType = document.querySelector('input[name="diet-type"]:checked')?.value;
      const allergies = document.querySelectorAll('input[name="allergy"]:checked');
      macros = calculateMacros({ height, weight, age, gender, activityLevel, goal });
      mealPlanInfo = { macros, dietType, allergies };
    } else if (checkedNavOption === 'enter') {
      const dietType = document.getElementById('diet-type-input')?.value;
      const calories = document.getElementById('calories-input')?.value;
      const protein = document.getElementById('protein-input')?.value;
      const fats = document.getElementById('fats-input')?.value;
      const carbohydrates = document.getElementById('carbohydrates-input')?.value;
      const allergies = document.querySelectorAll('input[name="allergy"]:checked');
      macros = { calories, protein, fats, carbohydrates };
      mealPlanInfo = { macros, dietType, allergies };
    }
    displayMacros(macros);
  } else {
    generateMealPlan();
  }
  return;
});

/* these formulas are used: https://www.lvac.com/blog/calculate-macronutrients/! */
/* this knowledge is used: https://healthyeater.com/flexible-dieting-calculator! */
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
    calories = Number((tdee - tdee * 0.2).toFixed(0));
  } else if (input.goal === 'maintain-weight') {
    calories = Number(tdee.toFixed(0));
  } else if (input.goal === 'gain-weight') {
    calories = Number((tdee + tdee * 0.2).toFixed(0));
  }
  const protein = Number(((calories * 0.3) / 4).toFixed(0));
  const fats = Number(((calories * 0.3) / 4).toFixed(0));
  const carbohydrates = Number(((calories * 0.4) / 4).toFixed(0));
  return { calories, protein, fats, carbohydrates };
};

const displayMacros = (macros) => {
  document.getElementById('submit-button')?.setAttribute('class', 'plan-button');
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
  const submitButtonDiv = document.getElementById('button');
  submitButtonDiv?.parentNode?.insertBefore(div, submitButtonDiv);
};

const generateMealPlan = async () => {
  const breakfastMeals = extractMealsInfo(await fetchData('Breakfast', mealPlanInfo));
  const lunchMeals = extractMealsInfo(await fetchData('Lunch', mealPlanInfo));
  const dinnerMeals = extractMealsInfo(await fetchData('Dinner', mealPlanInfo));
  completeMealPlan = { breakfastMeals, lunchMeals, dinnerMeals };
  window.location.href = '../meal-plan.html';
  return;
};

/* TODO: ERROR HANDLING! */
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
  console.log(additionalData);
  try {
    const response = await fetch(BASE_URL + AUTH_INFO + additionalData).then((res) => res.json());
    return response;
  } catch (error) {
    console.log(error);
    return;
  }
};

/* i found out that these meal-type percentages are typical! */
const valueBasedOnMealType = (mealType, category) => {
  if (mealType === 'Breakfast') {
    return Number((category * 0.35).toFixed(0));
  } else if (mealType === 'Lunch') {
    return Number((category * 0.4).toFixed(0));
  } else if (mealType === 'Dinner') {
    return Number((category * 0.25).toFixed(0));
  }
};

const extractMealsInfo = (input) => {
  const arrayOfMeals = [];
  for (let i = 0; i < 7; i++) {
    const calories = input.hits[i].recipe.calories;
    const label = input.hits[i].recipe.label;
    const ingredients = input.hits[i].recipe.ingredientLines;
    const meal = { calories, label, ingredients };
    arrayOfMeals.push(meal);
  }
  return arrayOfMeals;
};

export default completeMealPlan;
