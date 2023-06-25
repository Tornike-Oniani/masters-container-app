//import { mount as mountManagement } from 'management/ManagementApp';
import { mount as mountCommunication } from 'communication/CommunicationApp';
import { mount as mountAuthentication } from 'authentication/AuthenticationApp';

import ManagementView from '../components/management-view/management-view';

const router = async () => {
  const routes = [
    { path: '/manage', view: ManagementView },
    { path: '/auth', view: mountAuthentication },
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

  const root = document.getElementById('mf-root');

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

export default router;
