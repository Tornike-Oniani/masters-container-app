import { mount as mountManagement } from 'management/ManagementApp';
import { mount as mountCommunication } from 'communication/CommunicationApp';

import './style.css';

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    { path: '/', view: () => console.log('Viewing root') },
    { path: '/manage', view: mountManagement },
    { path: '/tasks', view: mountCommunication },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  // Not found route
  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }

  const root = document.getElementById('root');
  match.route.view(root);
};

window.addEventListener('popstate', router);

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});

router();
