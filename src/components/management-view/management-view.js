import { mount as mountManagement } from 'management/ManagementApp';

const ManagementView = (root, { onNavigate }) => {
  const { onParentNavigate } = mountManagement(root, {
    onNavigate,
  });

  return { onParentNavigate };
};

export default ManagementView;
