import axios from 'axios';

const API_URL = 'http://localhost:8080/orders';

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

export const getAllOrders = async (): Promise<Order[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createOrder = async (order: Order): Promise<Order> => {
  const payload = {
    ...order,
    garden: { id: order.gardenId },
    user: { id: order.userId },
    items: order.items.map(item => ({
      ...item,
      product: { id: item.productId }
    }))
  };
  const res = await axios.post(API_URL, payload);
  return res.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
