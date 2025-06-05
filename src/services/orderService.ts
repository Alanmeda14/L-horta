import api from './api';
import type { DisplayOrder } from '../types/types';
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


export const createOrderFromCart = async (): Promise<any[]> => {
  const res = await api.post(`${API_URL}/create-from-cart`);
  return res.data;
};

// Eliminar un pedido
export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};

// Obtener los pedidos de un usuario para mostrar en su perfil
export const getOrdersByUser = async (): Promise<DisplayOrder[]> => {
  try {
    const res = await api.get(`${API_URL}`);
    console.log('Raw response from backend:', JSON.stringify(res.data, null, 2));
    
    const transformedData = res.data.map((order: any) => {
      console.log('Processing order:', JSON.stringify(order, null, 2));
      
      // Get garden name from the first item's garden if not directly available
      const gardenName = order.gardenName || 
                        (order.items?.[0]?.garden?.name) || 
                        'Unknown Garden';
      
      const transformedOrder = {
        id: order.id,
        createdAt: order.date,
        status: order.status,
        gardenName: gardenName,
        totalPrice: Number(order.totalPrice) || 0,
        items: (order.items || []).map((item: any) => {
          console.log('Processing item:', JSON.stringify(item, null, 2));
          return {
            id: item.id,
            name: item.product?.esName || item.product?.name || 'Unknown Product',
            quantity: item.quantity || 0,
            units: item.units || 'unit',
            totalPrice: Number(item.totalPrice) || Number(item.unitPrice) * (item.quantity || 0),
            unitPrice: Number(item.unitPrice) || 0,
            image: item.product?.image
          };
        })
      };
      console.log('Transformed order:', JSON.stringify(transformedOrder, null, 2));
      return transformedOrder;
    });
    
    console.log('Final transformed data:', JSON.stringify(transformedData, null, 2));
    return transformedData;
  } catch (error) {
    console.error('Error in getOrdersByUser:', error);
    throw error;
  }
};

