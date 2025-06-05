export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    location: string;
    phone: string;
    image: string;
}

export interface Product {
    id: number;
    caName: string;
    esName: string;
    enName: string;
    frName: string;
    image?: string;
}

export interface GardenProduct {
    id?: number;
    product: Product;
    unitPrice: number;
    stock: number;
    units: string;
    garden?: Garden;
}

export interface Garden {
    id?: number;
    name: string;
    description: string;
    location: string;
    postalCode: string;
    image: string;
    user: {
        id: number;
      };
    gardenProducts?: GardenProduct[];
    volunteerSessions?: Session[];
    volunteerSessionAvailable?: boolean;
    productAvailable?: boolean;
}

export interface Session {
    id: number;
    garden: Garden;
    datetime: string;
    /* startTime: string;
    endTime: string; */
    maxVolunteers: number;
    currentParticipants: number;
    taskDescription: string;
    status: string;
}

export interface Booking {
    id: number;
    session: Session;
    user: User;
    status: string;
    date: string;
} 
export interface DisplayOrder {
    id: number;
    createdAt: string;
    gardenName: string;
    status: string;
    products: {
      name: string;
      quantity: number;
    }[];
  }


export interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    units: string;
    totalPrice: number;
    unitPrice: number;
    image?: string;
}