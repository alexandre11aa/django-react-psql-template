import { useEffect, useState } from "react";
import api from "../services/api";

export default function useValidateToken() {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await api.get("/auth/validate_cookie/");
        setIsValid(true);
      } catch (error: any) {
        setIsValid(false);
      }
    };

    validateToken();
  }, []);

  return isValid;
}
