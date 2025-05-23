import api from './api';

const API_URL = '/users';

export interface User {
  id?: number;
  name: string;
  surname: string;
  email: string; 
  location: string; 
  password?: string;
  role: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>(API_URL);
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`${API_URL}/${id}`);
  return response.data;
};

export const createUser = async (user: User): Promise<User> => {
  const response = await api.post<User>(API_URL, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
