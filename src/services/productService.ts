import axios from 'axios';
import api from './api';
const API_URL = '/products';

export interface Product {
  id?: number;
  name: string;
  unitPrice: number;
  stock: number;
  gardenId: number; // asumiendo que seleccionas el huerto al crear
}

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await api.get(API_URL);
  return res.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
};

export const createProduct = async (product: Product): Promise<Product> => {
  return (await api.post(API_URL, {
    ...product,
    garden: { id: product.gardenId } // para vincular con Garden en el backend
  })).data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};

export const getPagedProducts = async (page = 0, size = 10) => {
  const res = await axios.get(`http://localhost:8080/products/paged?page=${page}&size=${size}`);
  return res.data;
};