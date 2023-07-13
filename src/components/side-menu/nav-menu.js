import tableIcon from '../../assets/table.svg';
import listIcon from '../../assets/list.svg';

const NavMenu = () => {
  return `
    <nav class='side-menu'>
      <ul>
        <li>
          <a class='side-menu__link side-menu__link--active' href="/manage" data-link>
            <img src="${tableIcon}" alt="icon" />
            Manage
          </a>
        </li>
        <li>
          <a class='side-menu__link' href="/tasks" data-link>
            <img src="${listIcon}" alt="icon" />
            Tasks
          </a>
        </li>
      </ul>
    </nav>
    `;
};

export default NavMenu;
