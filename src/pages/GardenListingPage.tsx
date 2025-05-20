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
    const [availableSpots, setAvailableSpots] = useState({
        'plantacion': 5,
        'riego': 1
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
        if (!volunteerStatus[activity] && availableSpots[activity] === 0) {
            return;
        }

        setVolunteerStatus(prev => ({
            ...prev,
            [activity]: !prev[activity]
        }));

        setAvailableSpots(prev => ({
            ...prev,
            [activity]: prev[activity] + (volunteerStatus[activity] ? 1 : -1)
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
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'productos' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-500'}`}
                        onClick={() => setActiveTab('productos')}
                    >
                        Productos
                    </button>
                    <button
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'voluntariado' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-500'}`}
                        onClick={() => setActiveTab('voluntariado')}
                        disabled={!garden.isVolunteerAvailable}
                    >
                        Voluntariado
                    </button>
                </div>

                {activeTab === 'productos' && garden.isProductAvailable && (
                    <div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 w-1/3">Producto</th>
                                        <th className="text-center py-2 w-1/6">Precio por kg</th>
                                        <th className="text-center py-2 w-1/3">Cantidad</th>
                                        <th className="text-right py-2 w-1/6">Total</th>
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
                                        <td className="py-4 text-center">5€/kg</td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    className="bg-green-100 w-8 h-8 flex items-center justify-center rounded hover:bg-green-200 active:bg-green-300 transition-colors"
                                                    onClick={() => updateQuantity('tomates', -250)}
                                                >
                                                    <span className="text-green-800 font-medium">-</span>
                                                </button>
                                                <div className="w-20 text-center tabular-nums">
                                                    {quantities.tomates}g
                                                </div>
                                                <button
                                                    className="bg-green-100 w-8 h-8 flex items-center justify-center rounded hover:bg-green-200 active:bg-green-300 transition-colors"
                                                    onClick={() => updateQuantity('tomates', 250)}
                                                >
                                                    <span className="text-green-800 font-medium">+</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="w-20 text-right ml-auto tabular-nums">
                                                {calculateTotal('tomates', 5).toFixed(2)}€
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr className="border-t">
                                        <td colSpan={3} className="py-4 text-right font-semibold">Total</td>
                                        <td className="py-4">
                                            <div className="w-20 text-right ml-auto tabular-nums font-bold">
                                                {calculateGrandTotal().toFixed(2)}€
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

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
                        <div className="border rounded-lg p-4 transition-all hover:shadow-md">
                            <h3 className="font-semibold">Plantación de semillas</h3>
                            <p className="text-gray-600">15 Mayo, 2025</p>
                            <div className="flex items-center gap-2">
                                <p className="text-gray-600">Plazas disponibles: {availableSpots.plantacion}</p>
                                {availableSpots.plantacion === 0 && !volunteerStatus.plantacion && (
                                    <span className="text-red-600 text-sm">No hay plazas disponibles</span>
                                )}
                            </div>
                            {!volunteerStatus.plantacion ? (
                                <button
                                    onClick={() => toggleVolunteerStatus('plantacion')}
                                    disabled={availableSpots.plantacion === 0}
                                    className={`mt-3 px-4 py-2 rounded-lg transition-colors ${
                                        availableSpots.plantacion === 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    Inscribirse
                                </button>
                            ) : (
                                <button
                                    onClick={() => toggleVolunteerStatus('plantacion')}
                                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Desinscribirse
                                </button>
                            )}
                        </div>

                        <div className="border rounded-lg p-4 transition-all hover:shadow-md">
                            <h3 className="font-semibold">Riego y mantenimiento</h3>
                            <p className="text-gray-600">22 Mayo, 2025</p>
                            <div className="flex items-center gap-2">
                                <p className="text-gray-600">Plazas disponibles: {availableSpots.riego}</p>
                                {availableSpots.riego === 0 && !volunteerStatus.riego && (
                                    <span className="text-red-600 text-sm">No hay plazas disponibles</span>
                                )}
                            </div>
                            {!volunteerStatus.riego ? (
                                <button
                                    onClick={() => toggleVolunteerStatus('riego')}
                                    disabled={availableSpots.riego === 0}
                                    className={`mt-3 px-4 py-2 rounded-lg transition-colors ${
                                        availableSpots.riego === 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    Inscribirse
                                </button>
                            ) : (
                                <button
                                    onClick={() => toggleVolunteerStatus('riego')}
                                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
export { GardenListingPage };