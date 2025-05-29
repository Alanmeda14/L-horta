export interface Garden {
    id: number;
    name: string;
    description?: string;
    location?: string;
    ownerId?: number;
    products?: Product[];
}

export interface Product {
    id: number;
    name: string;
    unitPrice: number;
    availableQuantity: number;
    unitType: 'kg' | 'g' | 'unit';
    gardenId: number;
}

export interface VolunteerSession {
    id?: number;
    taskDescription: string;
    startDateTime?: string;
    endDateTime?: string;
    maxVolunteers: number;
    gardenId: number;
    currentVolunteers?: number;
}