import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGardenById } from '../services/gardenService';
import { getSessionsByGardenId, VolunteerSession } from '../services/volunteerSessionService';
import { GardenProductsTable } from '../components/Table/GardenProductsTable';
import { GardenSessionsList } from '../components/Table/GardenSessionsList';
import { GardenProduct } from '../types/types';
import { toast } from 'react-toastify';
import { addToCart } from '../services/shoppingListService';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

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
                gardenSessions.forEach((session) => {
                    if (session.id) {
                        initialVolunteerStatus[session.id] = false;
                        initialAvailableSpots[session.id] = session.maxVolunteers;
                    }
                });
                setVolunteerStatus(initialVolunteerStatus);
                setAvailableSpots(initialAvailableSpots);
            } catch (err) {
                console.error('Error fetching gardens:', err);
                toast.error(t('fetch_gardens_error') || 'Error al cargar el huerto');
            }
        };

        fetchGardens();
    }, [id, t]);

    const updateQuantity = (productId: string, amount: number) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(0, (prev[productId] || 0) + amount),
        }));
    };

    const hasItemsInCart = Object.values(quantities).some((quantity) => quantity > 0);

    const handleAddToCart = async () => {
        try {
            const itemsToAdd = Object.entries(quantities)
                .filter(([_, quantity]) => quantity > 0)
                .map(([productId, quantity]) => ({
                    gardenProductId: Number(productId),
                    quantity: quantity / 1000, // Convert to kg
                }));

            for (const item of itemsToAdd) {
                await addToCart(item.gardenProductId, item.quantity);
            }

            toast.success(t('item_added_to_cart') || '¡Producto añadido a la cesta!');
            const resetQuantities: Record<string, number> = {};
            Object.keys(quantities).forEach((key) => {
                resetQuantities[key] = 0;
            });
            setQuantities(resetQuantities);
        } catch (error) {
            console.error('Error adding items to cart:', error);
            toast.error(t('error_adding_to_cart') || 'Error al añadir el producto a la cesta');
        }
    };

    const toggleVolunteerStatus = (sessionId: number) => {
        if (!volunteerStatus[sessionId] && availableSpots[sessionId] === 0) {
            return;
        }

        setVolunteerStatus((prev) => ({
            ...prev,
            [sessionId]: !prev[sessionId],
        }));

        setAvailableSpots((prev) => ({
            ...prev,
            [sessionId]: prev[sessionId] + (volunteerStatus[sessionId] ? 1 : -1),
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header Section */}
            <div className="bg-green-700 dark:bg-green-800 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">
                        {garden?.name || t('garden_details')}
                    </h1>
                    <p className="text-lg text-green-100 mb-2">
                        {garden?.location || t('garden_details_description')}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 ">
                {garden ? (
                    <div className="bg-white dark:bg-gray-450 rounded-xl shadow-lg p-8">
                        {garden.image && (
                            <div className="relative h-64 mb-8 dark:bg-gray-450">
                                <img
                                    src={`http://localhost:8080${garden.image}`}
                                    alt={garden.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                    <h1 className="text-white text-4xl font-bold">{garden.name}</h1>
                                    <p className="text-white text-lg">{garden.location}</p>
                                </div>
                            </div>
                        )}

                        <div className="mb-8">
                            <p className="text-gray-600 dark:text-gray-300 text-lg">
                                {t('available_services') || 'Servicios disponibles: Entrega, Recogida, Visitas'}
                            </p>
                        </div>

                        <div className="flex gap-6 mb-8 border-b border-gray-200 dark:border-gray-600">
                            <button
                                className={`px-6 py-3 font-semibold text-lg transition-colors ${activeTab === 'productos'
                                        ? 'text-green-500 dark:text-green-400 border-b-4 border-green-500 dark:border-green-400'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400'
                                    }`}
                                onClick={() => setActiveTab('productos')}
                            >
                                {t('products') || 'Productos'}
                            </button>
                            <button
                                className={`px-6 py-3 font-semibold text-lg transition-colors ${activeTab === 'voluntariado'
                                        ? 'text-green-500 dark:text-green-400 border-b-4 border-green-500 dark:border-green-400'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400'
                                    }`}
                                onClick={() => setActiveTab('voluntariado')}
                            >
                                {t('volunteering') || 'Voluntariado'}
                            </button>
                        </div>

                        {activeTab === 'productos' && garden.productAvailable ? (
                            <GardenProductsTable
                                products={products}
                                quantities={quantities}
                                productLookup={productLookup}
                                hasItemsInCart={hasItemsInCart}
                                onUpdateQuantity={updateQuantity}
                                onAddToCart={handleAddToCart}
                                onNavigate={navigate}
                            />
                        ) : activeTab === 'productos' ? (
                            <div className="text-center py-10">
                                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                                    {t('no_products_available') ||
                                        'Este huerto no tiene productos disponibles actualmente.'}
                                </p>
                                <button
                                    onClick={() => navigate('/home')}
                                    className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-400 transition-colors text-lg font-medium"
                                >
                                    {t('back_to_list') || 'Volver al listado'}
                                </button>
                            </div>
                        ) : null}

                        {activeTab === 'voluntariado' && (
                            <GardenSessionsList
                                sessions={sessions}
                                volunteerStatus={volunteerStatus}
                                availableSpots={availableSpots}
                                onToggleVolunteerStatus={toggleVolunteerStatus}
                                onNavigate={navigate}
                            />
                        )}
                    </div>
                ) : (
                    <div className="text-center text-green-500 dark:text-green-400 text-lg">
                        {t('loading') || 'Cargando...'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GardenListingPage;