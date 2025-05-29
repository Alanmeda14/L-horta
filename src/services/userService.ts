import { UserData } from 'pages/UserProfile';
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
  profileImage?: string;
}

interface PasswordPayload {
  currentPassword: string;
  newPassword: string;
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


export const updateUserProfile = async (userId: number, data: Partial<UserData>, imageFile?: File): Promise<void> => {
  const formData = new FormData();
  console.log(data);

  for (const key in data) {
    const value = data[key as keyof UserData];
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  }

  if (imageFile) {
    formData.append('profileImage', imageFile);
  }

  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  await api.patch(`${API_URL}/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Cambiar rol de usuario a OWNER
export const changeUserRoleToOwner = async (userId: number): Promise<void> => {
  await api.patch(`${API_URL}/${userId}/role`);
};

export const changeUserPassword = async (userId: number, data: PasswordPayload): Promise<void> => {
  /* await api.put(`${API_URL}/${userId}/change-password`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  }); */
};
