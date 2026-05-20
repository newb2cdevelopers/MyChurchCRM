import { toast } from 'react-toastify';
import ToastContent from './ToastContent';

function showToast(variant, title, description, options = {}) {
  toast(
    ({ closeToast }) => (
      <ToastContent
        variant={variant}
        title={title}
        description={description}
        closeToast={closeToast}
      />
    ),
    {
      hideProgressBar: true,
      closeButton: false,
      autoClose: 5000,
      ...options,
    },
  );
}

showToast.success = (title, description, options) =>
  showToast('success', title, description, options);
showToast.error = (title, description, options) =>
  showToast('error', title, description, options);
showToast.warning = (title, description, options) =>
  showToast('warning', title, description, options);
showToast.info = (title, description, options) =>
  showToast('info', title, description, options);

export default showToast;
