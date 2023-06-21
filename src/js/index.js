import '../scss/index.scss';
import '../scss/reset.scss';
import '../../node_modules/bootstrap/scss/bootstrap-grid.scss';

document.getElementById('nav')?.addEventListener('change', () => {
  let checkedNavHeading = document.querySelector('input[name="heading"]:checked')?.value;
  console.log('checkedNavHeading: ', checkedNavHeading);
  if (checkedNavHeading === 'calculate') {
    document.getElementById('generator-2').style.display = 'none';
    document.getElementById('generator-1').style.display = 'block';
  } else if (checkedNavHeading === 'enter') {
    document.getElementById('generator-1').style.display = 'none';
    document.getElementById('generator-2').style.display = 'block';
  }
  return;
});
