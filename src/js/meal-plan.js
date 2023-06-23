import '../scss/_reset.scss';
import '../scss/_index.scss';
import '../scss/_bootstrap-grid.scss';

import completeMealPlan from './index.js';

document.querySelector('.generator')?.addEventListener('click', () => {
  console.log('uuel lehel');
  console.log(completeMealPlan);
});
