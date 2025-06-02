import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGardenById } from '../services/gardenService';
import { getSessionsByGardenId, VolunteerSession } from '../services/volunteerSessionService';
import { GardenProductsTable } from '../components/Table/GardenProductsTable';
import { GardenSessionsList } from '../components/Table/GardenSessionsList';
import { GardenProduct } from '../types/types';
import { toast } from 'react-toastify';
import { addToCart } from '../services/shoppingListService';

const GardenListingPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [garden, setGarden] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('productos');
    const [products, setProducts] = useState<GardenProduct[]>([]);
    const [productLookup, setProductLookup] = useState<Record<string, any>>({});
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [sessions, setSessions] = useState<VolunteerSession[]>([]);
    const [volunteerStatus, setVolunteerStatus] = useState<Record<number, boolean>>({});
    const [availableSpots, setAvailableSpots] = useState<Record<number, number>>({});

    useEffect(() => {
        const fetchGardens = async () => {
            try {
                const data = await getGardenById(Number(id));
                setGarden(data);
                
                if (data.gardenProducts) {
                    setProducts(data.gardenProducts);
                    
                    const initialQuantities: Record<string, number> = {};
                    data.gardenProducts.forEach((p: GardenProduct) => {
                        if (p.id) {
                            initialQuantities[p.id.toString()] = 0;
                        }
                    });
                    setQuantities(initialQuantities);
                    
                    const lookup = data.gardenProducts.reduce((acc: any, p: GardenProduct) => {
                        if (p.id) {
                            acc[p.id.toString()] = p;
                        }
                        return acc;
                    }, {});
                    setProductLookup(lookup);
                }

                const gardenSessions = await getSessionsByGardenId(Number(id));
                setSessions(gardenSessions);
                
                const initialVolunteerStatus: Record<number, boolean> = {};
                const initialAvailableSpots: Record<number, number> = {};
                gardenSessions.forEach(session => {
                    if (session.id) {
                        initialVolunteerStatus[session.id] = false;
                        initialAvailableSpots[session.id] = session.maxVolunteers;
                    }
                });
                setVolunteerStatus(initialVolunteerStatus);
                setAvailableSpots(initialAvailableSpots);

            } catch (err) {
                console.error('Error fetching gardens:', err);
            }
        };
    
        fetchGardens();
    }, [id]);

    const updateQuantity = (productId: string, amount: number) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(0, (prev[productId] || 0) + amount)
        }));
    };

    const hasItemsInCart = Object.values(quantities).some(quantity => quantity > 0);

    const handleAddToCart = async () => {
        try {
            // Get all products with quantity > 0
            const itemsToAdd = Object.entries(quantities)
                .filter(([_, quantity]) => quantity > 0)
                .map(([productId, quantity]) => ({
                    gardenProductId: Number(productId),
                    quantity: quantity / 1000 // Convert to kg
                }));

            /* if (itemsToAdd.length === 0) {
                setNotification({
                    message: 'Please select at least one product to add to cart',
                    type: 'error'
                });
                return;
            } */

            // Add each item to the cart
            for (const item of itemsToAdd) {
                await addToCart(item.gardenProductId, item.quantity);
            }

            // Show success message
            toast.success("Item added to cart!")
            
            // Reset quantities
            const resetQuantities: Record<string, number> = {};
            Object.keys(quantities).forEach((key) => {
                resetQuantities[key] = 0;
            });
            setQuantities(resetQuantities);

        } catch (error) {
            console.error('Error adding items to cart:', error);
            toast.error("Error adding item to cart.")
        }
    };

    const toggleVolunteerStatus = (sessionId: number) => {
        if (!volunteerStatus[sessionId] && availableSpots[sessionId] === 0) {
            return;
        }

        setVolunteerStatus(prev => ({
            ...prev,
            [sessionId]: !prev[sessionId]
        }));

        setAvailableSpots(prev => ({
            ...prev,
            [sessionId]: prev[sessionId] + (volunteerStatus[sessionId] ? 1 : -1)
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {garden && garden.image && (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="relative h-64 mb-6">
                    <img
                        src={`http://localhost:8080${garden.image}`}
                        alt={garden.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <h1 className="text-white text-3xl font-bold">{garden.name}</h1>
                        <p className="text-white">{garden.location}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600">
                        Servicios disponibles: Entrega, Recogida, Visitas
                    </p>
                </div>

                <div className="flex gap-4 mb-6 border-b">
                    <button
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'productos' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-500'}`}
                        onClick={() => setActiveTab('productos')}
                    >
                        Productos
                    </button>
                    <button
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'voluntariado' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-500'}`}
                        onClick={() => setActiveTab('voluntariado')}
                    >
                        Voluntariado
                    </button>
                </div>

                {activeTab === 'productos' && garden.productAvailable && (
                    <GardenProductsTable
                        products={products}
                        quantities={quantities}
                        productLookup={productLookup}
                        hasItemsInCart={hasItemsInCart}
                        onUpdateQuantity={updateQuantity}
                        onAddToCart={handleAddToCart}
                        onNavigate={navigate}
                    />
                )}

                {activeTab === 'voluntariado' && (
                    <GardenSessionsList
                        sessions={sessions}
                        volunteerStatus={volunteerStatus}
                        availableSpots={availableSpots}
                        onToggleVolunteerStatus={toggleVolunteerStatus}
                        onNavigate={navigate}
                    />
                )}

                {activeTab === 'productos' && !garden.productAvailable && (
                    <div className="text-center py-8">
                        <p className="text-gray-600 text-lg">Este huerto no tiene productos disponibles actualmente.</p>
                        <button
                            onClick={() => navigate('/home')}
                            className="mt-4 px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        >
                            Volver al listado
                        </button>
                    </div>
                )}
            </div>)}
        </div>
    );
};

export default GardenListingPage;