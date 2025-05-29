import api from './api';
import { VolunteerSession } from './volunteerSessionService';

const API_URL = 'http://localhost:8080/api/gardens';

export interface Product {
  id?: number;
  name: string;
  unitPrice: number;
  stock: number;
    unitType?: string;

}

export interface Garden {
  id?: number;
  name: string;
  description: string;
  image: string | null | string;
  location: string;
  postalCode?: string;
  user?: { id: number };
  productAvailable?: boolean;
  sessionAvailable?: boolean;
  products?: Product[];
  sessions?: VolunteerSession[]; // ✅ Añadido aquí
}

// Obtener todos los jardines
export const getAllGardens = async (): Promise<Garden[]> => {
  const res = await api.get(API_URL);
  return res.data;
};

// Obtener jardín por ID
export const getGardenById = async (id: number): Promise<Garden> => {
  const res = await api.get(`${API_URL}/${id}`);
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

// Buscar jardines por nombre de producto
export const getGardensByProduct = async (productName: string): Promise<Garden[]> => {
  const res = await api.get(`${API_URL}/products/${encodeURIComponent(productName)}`);
  return res.data;
};

// Obtener jardines paginados
export const getPagedGardens = async (page = 0, size = 10) => {
  const res = await api.get(`${API_URL}/paged?page=${page}&size=${size}`);
  return res.data;
};

// Actualizar precios de productos de un jardín
export const updateGardenProductPrices = async (gardenId: number, products: Product[]): Promise<Garden> => {
  const res = await api.patch(`${API_URL}/${gardenId}/products`, { products });
  return res.data;
};
