import { Garden } from 'types/types';
import api from './api';

const API_URL = '/gardens';

export interface Product {
  id?: number;
  name: string;
  unitPrice: number;
  stock: number;
}

/* export interface Garden {
  id?: number;
  name: string;
  description: string;
  image: string;
  location: string;
  user: {
    id: number;
  };
  products?: Product[];
} */


// Obtener todos los jardines
export const getAllGardens = async (): Promise<Garden[]> => {
  const res = await api.get(API_URL);
  return res.data;
};

// Obtener jardín por ID
export const getGardenById = async (id: number): Promise<Garden> => {
  const res = await api.get(`${API_URL}/${id}`);
  console.log(res.data)
  return res.data;
};

// Create new garden
export const createGarden = async (formData: FormData): Promise<Garden> => {
  const res = await api.post<Garden>(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

// Eliminar jardín por ID
export const deleteGarden = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};

// Buscar jardines que contengan cierto producto
export const getGardensByProduct = async (productName: string): Promise<Garden[]> => {
  const res = await api.get(`${API_URL}/products/${encodeURIComponent(productName)}`);
  return res.data;
};
