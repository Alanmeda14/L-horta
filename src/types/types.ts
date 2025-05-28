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
    description: string;
    image: string;
    price: number;
    stock: number;
}

export interface GardenProduct {
    id: number;
    garden: Garden;
    product: Product;
    quantity: number;
    price: number;
    available: boolean;
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
