import { toast  } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export const showSuccess = (msg) => {
  toast.success(msg, {
    autoClose: 3000,
    position: 'top-right',
    theme: 'colored'
  });
};

export const showError = (msg) => {
  toast.error(msg || 'Oops... Erro inesperado.', {
    autoClose: 3000,
    position: 'top-right',
    theme: 'colored'
  });
};