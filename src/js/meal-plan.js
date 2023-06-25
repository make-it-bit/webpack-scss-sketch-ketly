import '../scss/_reset.scss';
import '../scss/_meal-plan.scss';
import '../scss/_bootstrap-grid.scss';

const completeMealPlan = JSON.parse(localStorage.getItem('completeMealPlan'));

window.addEventListener('load', () => {
  const body = document.querySelector('body');
  for (let i = 0; i < 7; i++) {
    const h1 = document.createElement('h1');
    h1.innerText = `DAY ${i + 1}`;
    body?.append(h1);
    for (let k = 0; k < 3; k++) {
      if (k === 0) {
        displayMeal('BREAKFAST', completeMealPlan.breakfastMeals, i);
      } else if (k === 1) {
        displayMeal('LUNCH', completeMealPlan.lunchMeals, i);
      } else {
        displayMeal('DINNER', completeMealPlan.dinnerMeals, i);
      }
    }
  }
  return;
});

const displayMeal = (mealType, meals, mealIndex) => {
  const body = document.querySelector('body');

  const row1 = document.createElement('div');
  row1.setAttribute('class', 'row meal');

  const col1 = document.createElement('div');
  col1.setAttribute('class', 'col-12');
  const h2_1 = document.createElement('h2');
  h2_1.innerText = mealType;
  col1.append(h2_1);
  row1.append(col1);

  const col2 = document.createElement('div');
  col2.setAttribute('class', 'col-12');
  const h2_2 = document.createElement('h2');
  h2_2.innerText = meals[mealIndex].label;
  col2.append(h2_2);
  row1.append(col2);

  const col2_1 = document.createElement('div');
  col2_1.setAttribute('class', 'col-auto');
  const p1 = document.createElement('p');
  p1.innerHTML = `<span>Calories:</span> ${meals[mealIndex].calories}`;
  col2_1.append(p1);
  const col2_2 = document.createElement('div');
  col2_2.setAttribute('class', 'col-auto');
  const p2 = document.createElement('p');
  p2.innerHTML = `<span>Protein:</span> ${meals[mealIndex].protein}`;
  col2_2.append(p2);
  const col2_3 = document.createElement('div');
  col2_3.setAttribute('class', 'col-auto');
  const p3 = document.createElement('p');
  p3.innerHTML = `<span>Fats:</span> ${meals[mealIndex].fat}`;
  col2_3.append(p3);
  const col2_4 = document.createElement('div');
  col2_4.setAttribute('class', 'col-auto');
  const p4 = document.createElement('p');
  p4.innerHTML = `<span>Carbohydrates:</span> ${meals[mealIndex].carbohydrates}`;
  col2_4.append(p4);
  row1.append(col2_1);
  row1.append(col2_2);
  row1.append(col2_3);
  row1.append(col2_4);

  const div = document.createElement('div');
  div.setAttribute('class', 'ingredients');
  for (let i = 0; i < meals[mealIndex].ingredients.length; i++) {
    const col3 = document.createElement('div');
    col3.setAttribute('class', 'col-12 ingredient');
    const p5 = document.createElement('p');
    p5.innerHTML = meals[mealIndex].ingredients[i];
    col3.append(p5);
    div.append(col3);
  }
  row1.append(div);

  const col4 = document.createElement('div');
  col4.setAttribute('class', 'col-12 image');
  const img = document.createElement('img');
  img.src = meals[mealIndex].image;
  col4.append(img);
  row1.append(col4);

  body?.append(row1);
};
