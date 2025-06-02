import api from './api';
const API_URL = '/shopping-cart';

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

export const groupItemsByGarden = (items: ShoppingCartItem[]) => {
  return items.reduce((groups, item) => {
    const gardenId = item.garden.id;
    if (!groups[gardenId]) {
      groups[gardenId] = {
        garden: item.garden,
        items: []
      };
    }
    groups[gardenId].items.push(item);
    return groups;
  }, {} as Record<number, { garden: GardenDTO; items: ShoppingCartItem[] }>);
};

export const getShoppingCart = async (): Promise<ShoppingCart> => {
  const res = await api.get(API_URL);
  console.log(res.data)
  return res.data;
};

export const addToCart = async (gardenProductId: number, quantity: number): Promise<void> => {
  await api.post(`${API_URL}/items`, null, {
    params: { gardenProductId, quantity }
  });
};

export const updateCartItemQuantity = async (gardenProductId: number, quantity: number): Promise<void> => {
  await api.put(`${API_URL}/items/${gardenProductId}`, null, {
    params: { quantity }
  });
};

export const removeFromCart = async (gardenProductId: number): Promise<void> => {
  await api.delete(`${API_URL}/items/${gardenProductId}`);
};

export const clearCart = async (): Promise<void> => {
  await api.delete(API_URL);
};
