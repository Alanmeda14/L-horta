import axios from 'axios';

const API_URL = 'http://localhost:8080/gardens';

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
    // puedes añadir más si los usas, como name, email, etc.
  };
  products?: Product[]; // 🌿 productos asociados al jardín
}

// Obtener todos los jardines
export const getAllGardens = async (): Promise<Garden[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Obtener jardín por ID
export const getGardenById = async (id: number): Promise<Garden> => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// Crear un nuevo jardín
export const createGarden = async (garden: Garden): Promise<Garden> => {
  const res = await axios.post(API_URL, garden);
  return res.data;
};

// Eliminar jardín por ID
export const deleteGarden = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

// Buscar jardines que contengan cierto producto
export const getGardensByProduct = async (productName: string): Promise<Garden[]> => {
  const res = await axios.get(`${API_URL}/products/${encodeURIComponent(productName)}`);
  return res.data;
};
