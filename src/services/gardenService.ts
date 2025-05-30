import { Garden } from 'types/types';
import api from './api';
import { VolunteerSession } from './volunteerSessionService';

const API_URL = '/gardens'
export interface Product {
  id?: number;
  name: string;
  unitPrice: number;
  stock: number;
  unitType?: string;

}


// Obtener todos los jardines con filtros
export const getAllGardens = async (): Promise<Garden[]> => {
  const res = await api.get(API_URL);
  return res.data;
}

export const filterGardens = async (
  name?: string,
  location?: string,
  productName?: string
): Promise<Garden[]> => {
  const params: any = {};
  if (name) params.name = name;
  if (location) params.location = location;
  if (productName) params.product = productName;
  
  console.log("🔍 Enviando filtros:", params);
  
  const res = await api.get(`${API_URL}/filter`, { params });
  
  return res.data;
}

// Obtener jardín por ID
export const getGardenById = async (id: number): Promise<Garden> => {
  const res = await api.get(`${API_URL}/${id}`);
  console.log(res.data)
  return res.data;
};

// Crear jardín
export const createGarden = async (formData: FormData): Promise<Garden> => {
  const res = await api.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Editar jardín
export const updateGarden = async (id: number, gardenData: FormData): Promise<Garden> => {
  const res = await api.put(`${API_URL}/${id}`, gardenData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Eliminar jardín
export const deleteGarden = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};

export const deleteProduct = async (productId: number) => {
  const response = await fetch(`http://localhost:8080/products/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error deleting product');
  }
  return response.json();
};

// Buscar jardines por nombre de producto
export const getGardensByProduct = async (productName: string): Promise<Garden[]> => {
  const res = await api.get(`${API_URL}/products/${encodeURIComponent(productName)}`);
  return res.data;
};

// Obtener jardines del usuario autenticado
export const getMyGardens = async (): Promise<Garden[]> => {
  const res = await api.get(`${API_URL}/my-gardens`);
  return res.data;
};
