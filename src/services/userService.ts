import { UserData } from 'pages/UserProfile';
import api from './api';

const API_URL = '/users';

export interface User {
  id: number;
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
  const user = response.data;

  console.log(user)

  return {
    ...user,
    profileImage: user.profileImage
      ? `${user.profileImage}`
      : undefined,
  };
  /* const response = await api.get<User>(`${API_URL}/${id}`);
  return response.data; */
};

export const createUser = async (user: User): Promise<User> => {
  const response = await api.post<User>(API_URL, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};


export const updateUserProfile = async (
  userId: number,
  data: Partial<UserData>,
  imageFile?: File
): Promise<void> => {
  const formData = new FormData();

  // Serializamos el objeto `data` a JSON y lo enviamos en el campo 'user'
  formData.append('user', JSON.stringify(data));

  // Adjuntamos la imagen solo si viene
  if (imageFile) {
    formData.append('profileImage', imageFile);
  }

  await api.patch(`${API_URL}/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


export const changeUserPassword = async (userId: number, data: PasswordPayload): Promise<void> => {
  /* await api.put(`${API_URL}/${userId}/change-password`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  }); */
};

// Cambiar rol de usuario a OWNER
export const changeUserRoleToOwner = async (userId: number): Promise<void> => {
  await api.patch(`${API_URL}/${userId}/role`);
};
