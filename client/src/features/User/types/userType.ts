// src/features/User/types/userType.ts

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  access_level: string;
  is_active: boolean;
}

export interface UserSearchParams {
  searchField?: "name" | "email" | "access_level";
  searchValue?: string;
  isActive?: boolean;
}

export interface PaginatedUserResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}
