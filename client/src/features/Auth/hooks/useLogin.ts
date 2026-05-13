// src/features/Auth/hooks/useLogin.ts

import { useState } from 'react';

import notify from '../../../services/notificationService';
import loginService from '../services/authService';

import type { LoginResponse, UserStorage, UseLoginReturn } from '../types/loginType';


const useLogin = (): UseLoginReturn => {
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    try {
      const data: LoginResponse = await loginService.login(email, password);

      // Salva usuário no localStorage
      const user: UserStorage = {
        userAccessLevel: data.access_level,
        userEmail: data.email,
        userId: data.id,
        userName: data.name,
      };

      localStorage.setItem('user', JSON.stringify(user));

      return true;

    } catch (err: any) {
      notify.error('Falha ao iniciar sessão. Verifique seu email e senha.');
      return false;

    } finally {
      setLoading(false);

    }
  };

  return { login, loading };
};

export default useLogin;
