import { mount as mountManagement } from 'management/ManagementApp';
import { mount as mountCommunication } from 'communication/CommunicationApp';

import './style.css';

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  console.log(location.pathname);
  const routes = [
    { path: '/', view: () => console.log('Viewing root') },
    { path: '/manage', view: mountManagement },
    { path: '/tasks', view: mountCommunication },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route,
      isMatch: location.pathname.split(/(?=\/)/g)[0] === route.path,
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

  // When navigation happens in micro frontend update the browser URL correspondingly.
  // This is necessary because micro frontends use MemoryRouters and don't alter the browser address bar themselves.
  let trailingRoute = location.pathname.split(/(?=\/)/g);
  trailingRoute.shift();
  trailingRoute = trailingRoute.join('');
  trailingRoute ? '/' : trailingRoute;

  const { onParentNavigate } = match.route.view(root, {
    onNavigate: (mfRoute) => {
      if (trailingRoute !== mfRoute) {
        history.pushState(null, null, match.route.path + mfRoute);
      }
    },
  });

  onParentNavigate(trailingRoute);
};

window.addEventListener('popstate', router);

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});

router();
