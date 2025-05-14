import axios from 'axios';

const API_URL = 'http://localhost:8080/gardens';

export interface Garden {
  id?: number;
  name: string;
  description: string;
  image: string;
  location: string;
  userId: number;
}

export const getAllGardens = async (): Promise<Garden[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getGardenById = async (id: number): Promise<Garden> => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createGarden = async (garden: Garden): Promise<Garden> => {
  const payload = {
    ...garden,
    user: { id: garden.userId }
  };
  const res = await axios.post(API_URL, payload);
  return res.data;
};

export const deleteGarden = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
