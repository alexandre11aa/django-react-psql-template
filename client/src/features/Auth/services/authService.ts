// src/features/Auth/services/loginService.ts

import api from "../../../services/api";
import type { LoginResponse, TokenResponse } from '../types/loginType';
import { navigateTo } from '../../../utils/navigate';


const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login/', { email, password });
    console.log('Login realizado.');
    return response.data;

  } catch (error: any) {
    console.error('Erro no login!', error);
    throw error;
  }
};

const token = async (email: string, password: string): Promise<TokenResponse> => {
  try {
    const response = await api.post<TokenResponse>('/auth/token/', { email, password });
    console.log('Token obtido.');
    return response.data;

  } catch (error: any) {
    console.error('Erro na obtenção do Token!', error);
    throw error;
  }
};

const logout = async () => {
  try {
    await api.post('/auth/logout/', {});
    console.log('Logout realizado.');
    navigateTo('/login');
  } catch (error: any) {
    console.error('Erro ao encerrar a sessão!', error);
  }
};

const validate = async () => {
  try {
    const response = await api.get('/auth/validate_cookie/');
    return response.data;
  } catch (error: any) {
    console.error('Token inválido, deslogar!', error);
    navigateTo('/login');
  }
};

const requestPasswordReset = async ( data: { email: string; } ) => {
  try {
    const response = await api.post(
      "/auth/request_password_reset/",
      data,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Email de recuperação enviado com sucesso!");
    return response.data;

  } catch (error: any) {
    console.error("Erro ao solicitar recuperação de senha!", error);
    throw error;
  }
};

const passwordReset = async ( data: { token: string; password: string; } ) => {
  try {
    const response = await api.post(
      "/auth/password_reset/",
      data,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Senha redefinida com sucesso!");
    return response.data;

  } catch (error: any) {
    console.error("Erro ao redefinir senha!", error);
    throw error;
  }
};

const authService = { 
  login,
  token,
  logout,
  validate,
  requestPasswordReset,
  passwordReset
};

export default authService;
