import Cookies from 'js-cookie';

//import { mount as mountManagement } from 'management/ManagementApp';
import { mount as mountCommunication } from 'communication/CommunicationApp';
import { mount as mountAuthentication } from 'authentication/AuthenticationApp';
import ManagementView from '../components/management-view/management-view';

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

const router = async () => {
  const routes = [
    { path: '/manage', view: { title: 'management', render: ManagementView } },
    {
      path: '/auth',
      view: { title: 'authentication', render: mountAuthentication },
    },
    {
      path: '/tasks',
      view: { title: 'communication', render: mountCommunication },
    },
  ];

  const cookie = Cookies.get('token');
  console.log(location.pathname);

  // Logout redirect
  if (location.pathname === '/logout/') {
    Cookies.remove('token');
    await history.pushState(null, null, '/');
    router();
  }

  // No token redirect
  if (location.pathname !== '/auth/') {
    if (!cookie) {
      await history.pushState(null, null, '/auth/');
      router();
    }
  }

  // Root redirect based on token (When API is done this will be managed based on permissions)
  if (location.pathname === '/login-redirect') {
    const identity = parseJwt(cookie);
    console.log(identity);
    await history.pushState(null, null, '/manage/');
  }

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

  let parentNavigate;

  if (match.route.view.title === 'authentication') {
    const { onParentNavigate } = match.route.view.render(root, {
      onNavigate: (mfRoute) => {
        if (trailingRoute !== mfRoute) {
          history.pushState(null, null, mfRoute);
          router();
        }
      },
    });
    parentNavigate = onParentNavigate;
  } else {
    const { onParentNavigate } = match.route.view.render(root, {
      onNavigate: (mfRoute) => {
        if (trailingRoute !== mfRoute) {
          history.pushState(null, null, match.route.path + mfRoute);
        }
      },
    });
    parentNavigate = onParentNavigate;
  }

  parentNavigate(trailingRoute);

  if (
    location.pathname.split(/(?=\/)/g)[0] !== '/manage' &&
    location.pathname.split(/(?=\/)/g)[0] !== '/tasks'
  ) {
    // Remove shared elements
    const sideElement = document.getElementById('side-shared-element');
    if (sideElement && sideElement.firstChild) {
      sideElement.removeChild(sideElement.firstChild);
    }
  }
};

export default router;
