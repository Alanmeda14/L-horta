import api from './api';
/* import type { DisplayOrder } from '../types/types'; */

const API_URL = '/orders';

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  
  
}

export interface Order {
  id?: number;
  gardenId: number;
  userId: number;
  date: string;
  status: string;
  items: OrderItem[];
}

export interface ProductDTO {
  id: number;
  caName: string;
  esName: string;
  enName: string;
  frName: string;
  image: string;
}

export interface GardenDTO {
  id: number;
  name: string;
}

export interface ShoppingCartItem {
  id: number;
  gardenProductId: number;
  product: ProductDTO;
  garden: GardenDTO;
  unitPrice: number;
  units: string;
  quantity: number;
  addedAt: string;
}

export interface ShoppingCart {
  id: number;
  userId: number;
  createdAt: string;
  items: ShoppingCartItem[];
}

// Obtener todos los pedidos (uso administrativo o backend)
export const getAllOrders = async (): Promise<Order[]> => {
  const res = await api.get(API_URL);
  return res.data;
};

// Crear un pedido
/* export const createOrder = async (order: Order): Promise<Order> => {
  const payload = {
    ...order,
    garden: { id: order.gardenId },
    user: { id: order.userId },
    items: order.items.map(item => ({
      ...item,
      product: { id: item.productId }
    }))
  };
  const res = await api.post(API_URL, payload);
  return res.data;
}; */

export const createOrderFromCart = async (): Promise<any[]> => {
  const res = await api.post(`${API_URL}/create-from-cart`);
  return res.data;
};

// Eliminar un pedido
export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};

// Obtener los pedidos de un usuario para mostrar en su perfil
export const getOrdersByUser = async (): Promise<[]> => {
  const res = await api.get(`${API_URL}`);
  return res.data;
};
