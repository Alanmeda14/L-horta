import axios from 'axios';

const API_URL = 'http://localhost:8080/users'; // Asegúrate que coincide con tu backend

export interface User {
  id?: number;
  name: string;
  surname: string;
  email: string; // Campo email agregado
  location: string; // <-- Nuevo campo de ubicación
  password?: string; // No se debería exponer, solo para crear
  role: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(API_URL);
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await axios.get<User>(`${API_URL}/${id}`);
  return response.data;
};

export const createUser = async (user: User): Promise<User> => {
  const response = await axios.post<User>(API_URL, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
