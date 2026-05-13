// src/features/Auth/services/loginTypes.ts

export interface LoginResponse {
  access_level: string,
  detail: string;
  email: string;
  id: number;
  name: string,
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface UserStorage {
  userAccessLevel: string,
  userEmail: string;
  userId: number,
  userName: string,
}

export interface UseLoginReturn {
  login: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
}