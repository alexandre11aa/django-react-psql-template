// src/features/User/services/userService.ts

import api from "../../../services/api";
import type { User, UserSearchParams, PaginatedUserResponse } from '../types/userType';

const search = async (
  page: number,
  pageSize: number,
  params: UserSearchParams = {}
): Promise<PaginatedUserResponse> => {
  try {
    const searchParams = new URLSearchParams();

    // Parâmetros de paginação
    searchParams.append('page', String(page));
    searchParams.append('page_size', String(pageSize));

    // Parâmetro de status
    if (params.isActive !== undefined) searchParams.append('is_active', String(params.isActive));

    // Parâmetros de busca textual
    if (params.searchField && params.searchValue) {
      searchParams.append('search_field', params.searchField);
      searchParams.append('search_value', params.searchValue);
    }

    const response = await api.get<PaginatedUserResponse>('users/custom_user/search/', {
      params: searchParams,
    });

    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar usuários paginados!', error);
    throw error;
  }
};

const get = async (id: number): Promise<User> => {
  try {
    const response = await api.get<User>(`users/custom_user/get_by_id/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar usuário com ID ${id}!`, error);
    throw error;
  }
};

const create = async (userData: {
  name: string;
  email: string;
  access_level: string;
  password?: string;
  is_active: boolean;
}): Promise<User> => {
  try {
    const response = await api.post<User>('users/custom_user/create/', userData);
    console.log('Usuário criado com sucesso!');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar usuário!', error);
    throw error;
  }
};

const update = async (userId: number, userData: {
  name: string;
  email: string;
  access_level: string;
  password?: string;
}): Promise<User> => {
  try {
    const response = await api.patch<User>(`users/custom_user/update_by_id/${userId}/`, userData, { headers: { 'Content-Type': 'application/json' } } );
    console.log('Usuário atualizado com sucesso!');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao atualizar usuário!', error);
    throw error;
  }
};

const toggleStatus = async (userId: number) => {
  try {
    await api.delete(`users/custom_user/delete_by_id/${userId}/`);
    console.log('Status do usuário alterado com sucesso!');
  } catch (error: any) {
    console.error('Erro ao alterar status de usuário!', error);
    throw error;
  }
};

export default {
  search,
  get,
  create,
  update,
  toggleStatus,
};