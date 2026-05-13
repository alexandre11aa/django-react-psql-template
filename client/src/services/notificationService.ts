import { toast } from 'react-toastify';
import { useApiError } from '../hooks/useApiError';
import 'react-toastify/dist/ReactToastify.css';

const apiError = useApiError();

const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string, error?: any) => { apiError(message, error); },
  info: (message: string) => toast.info(message),
  warn: (message: string) => toast.warn(message),
};

export default notify;
