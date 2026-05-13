import { toast } from "react-toastify";

export function useApiError() {
  return (defaultMessage: string, error?: any) => {
    if (error?.response?.data) {
      const messages = Object.entries(error.response.data)
        .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(", ") : msg}`)
        .join("\n");

      toast.error(`${defaultMessage}\n${messages}`);
    } else {
      toast.error(defaultMessage);
    }
  };
}
