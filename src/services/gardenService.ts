import axios from 'axios';
import api from './api';

const API_URL = '/gardens';

export interface Product {
  id?: number;
  name: string;
  unitPrice: number;
  stock: number;
}

export interface Garden {
  id?: number;
  name: string;
  description: string;
  image: string;
  location: string;
  user: {
    id: number;
  };
  products?: Product[];
  productAvailable?: boolean;
  sessionAvailable?: boolean;
}

// Obtener todos los jardines con filtros
export const getAllGardens = async (
  name?: string,
  location?: string,
  productAvailable?: string
): Promise<Garden[]> => {
  const params: any = {};
  if (name) params.name = name;
  if (location) params.location = location;
  if (productAvailable) params.productAvailable = productAvailable;

  const res = await api.get(API_URL, { params });
  return res.data;
};

// Obtener jardín por ID
export const getGardenById = async (id: number): Promise<Garden> => {
  const res = await api.get(`${API_URL}/${id}`);
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

export const getPagedGardens = async (page = 0, size = 10) => {
  const res = await axios.get(`http://localhost:8080/gardens/paged?page=${page}&size=${size}`);
  return res.data;
};
