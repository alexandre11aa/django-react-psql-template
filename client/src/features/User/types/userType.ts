// src/features/User/types/userType.ts

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  access_level: string;
  is_active: boolean;
}

