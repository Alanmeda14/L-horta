import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const GardenListingPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [garden, setGarden] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('productos');
    const [quantities, setQuantities] = useState({
        tomates: 0,
        lechuga: 0,
        zanahorias: 0,
        pimientos: 0
    });
    const [volunteerStatus, setVolunteerStatus] = useState({
        'plantacion': false,
        'riego': false
    });

    useEffect(() => {
        const selectedGarden = localStorage.getItem('selectedGarden');
        if (selectedGarden) {
            setGarden(JSON.parse(selectedGarden));
        }
    }, [id]);

    if (!garden) {
        return <div>Cargando...</div>;
    }

    const updateQuantity = (product: keyof typeof quantities, amount: number) => {
        setQuantities(prev => ({
            ...prev,
            [product]: Math.max(0, prev[product] + amount)
        }));
    };

    const calculateTotal = (product: keyof typeof quantities, pricePerKg: number) => {
        return (quantities[product] / 1000) * pricePerKg;
    };

    const calculateGrandTotal = () => {
        return Object.entries(quantities).reduce((total, [product, quantity]) => {
            const prices = {
                tomates: 5,
                lechuga: 2,
                zanahorias: 3,
                pimientos: 4
            };
            return total + (quantity / 1000) * prices[product as keyof typeof prices];
        }, 0);
    };

    const toggleVolunteerStatus = (activity: keyof typeof volunteerStatus) => {
        setVolunteerStatus(prev => ({
            ...prev,
            [activity]: !prev[activity]
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="relative h-64 mb-6">
                    <img
                        src={garden.image}
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
                        className={`px-4 py-2 ${activeTab === 'productos' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('productos')}
                    >
                        Productos
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'voluntariado' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('voluntariado')}
                        disabled={!garden.isVolunteerAvailable}
                    >
                        Voluntariado
                    </button>
                </div>

                {activeTab === 'productos' && garden.isProductAvailable && (
                    <div>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Producto</th>
                                    <th className="text-left py-2">Precio por kg</th>
                                    <th className="text-center py-2">Cantidad</th>
                                    <th className="text-right py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="py-4 flex items-center gap-2">
                                        <img
                                            src="https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg"
                                            alt="Tomates"
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <span>Tomates</span>
                                    </td>
                                    <td>5€/kg</td>
                                    <td className="text-center">
                                        <div className="inline-flex items-center gap-2">
                                            <button
                                                className="bg-green-100 w-8 h-8 flex items-center justify-center rounded hover:bg-green-200"
                                                onClick={() => updateQuantity('tomates', -250)}
                                            >
                                                -
                                            </button>
                                            <span className="w-16 text-center">{quantities.tomates}g</span>
                                            <button
                                                className="bg-green-100 w-8 h-8 flex items-center justify-center rounded hover:bg-green-200"
                                                onClick={() => updateQuantity('tomates', 250)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="text-right">{calculateTotal('tomates', 5).toFixed(2)}€</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="border-t">
                                    <td colSpan={3} className="py-4 text-right font-semibold">Total</td>
                                    <td className="py-4 text-right font-semibold">{calculateGrandTotal().toFixed(2)}€</td>
                                </tr>
                            </tfoot>
                        </table>

                        <div className="flex justify-between mt-6">
                            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                Añadir al carrito
                            </button>
                            <button
                                onClick={() => navigate('/home')}
                                className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                            >
                                Volver al listado
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'voluntariado' && garden.isVolunteerAvailable && (
                    <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold">Plantación de semillas</h3>
                            <p className="text-gray-600">15 Mayo, 2025</p>
                            <p className="text-gray-600">Plazas disponibles: 5</p>
                            {!volunteerStatus.plantacion ? (
                                <button
                                    onClick={() => toggleVolunteerStatus('plantacion')}
                                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Inscribirse
                                </button>
                            ) : (
                                <button
                                    onClick={() => toggleVolunteerStatus('plantacion')}
                                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Desinscribirse
                                </button>
                            )}
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold">Riego y mantenimiento</h3>
                            <p className="text-gray-600">22 Mayo, 2025</p>
                            <p className="text-gray-600">Plazas disponibles: 3</p>
                            {!volunteerStatus.riego ? (
                                <button
                                    onClick={() => toggleVolunteerStatus('riego')}
                                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Inscribirse
                                </button>
                            ) : (
                                <button
                                    onClick={() => toggleVolunteerStatus('riego')}
                                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Desinscribirse
                                </button>
                            )}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => navigate('/home')}
                                className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                            >
                                Volver al listado
                            </button>
                        </div>
                    </div>
                )}

                {((activeTab === 'productos' && !garden.isProductAvailable) || 
                  (activeTab === 'voluntariado' && !garden.isVolunteerAvailable)) && (
                    <div className="text-center py-8">
                        <p className="text-gray-600 text-lg">
                            {activeTab === 'productos' 
                                ? 'Este huerto no tiene productos disponibles actualmente.'
                                : 'Este huerto no tiene opciones de voluntariado disponibles actualmente.'}
                        </p>
                        <button
                            onClick={() => navigate('/home')}
                            className="mt-4 px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        >
                            Volver al listado
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GardenListingPage;