import router from './router/router';
import './style.css';
import createServer from './server/server';

createServer();

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

window.addEventListener('popstate', router);

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault();

    // Set active status
    const prevActive = document.querySelector('.side-menu__link--active');
    if (prevActive) {
      prevActive.classList.remove('side-menu__link--active');
    }
    e.target.classList.add('side-menu__link--active');

    navigateTo(e.target.href);
  }
});

router();
