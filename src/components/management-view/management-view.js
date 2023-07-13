import { mount as mountManagement } from 'management/ManagementApp';
import NavMenu from '../side-menu/nav-menu';

const ManagementView = (root, { onNavigate }) => {
  document.getElementById('side-shared-element').innerHTML = NavMenu();
  const { onParentNavigate } = mountManagement(root, {
    onNavigate,
  });

  return { onParentNavigate };
};

export default ManagementView;
