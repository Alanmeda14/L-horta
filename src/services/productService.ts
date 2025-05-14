import axios from 'axios';

const API_URL = 'http://localhost:8080/products';

export interface Product {
  id?: number;
  name: string;
  unitPrice: number;
  stock: number;
  gardenId: number; // asumiendo que seleccionas el huerto al crear
}

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createProduct = async (product: Product): Promise<Product> => {
  return (await axios.post(API_URL, {
    ...product,
    garden: { id: product.gardenId } // para vincular con Garden en el backend
  })).data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
