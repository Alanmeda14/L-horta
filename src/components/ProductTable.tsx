import React, { useState } from 'react';
import QuantitySelector from './QuantitySelector';
import { useTranslation } from 'react-i18next';

interface Product {
    id: string;
    name: string;
    pricePerUnit: number;
    unit: string;
    imageUrl: string;
}

interface VolunteerSession {
    id: string;
    name: string;
    date: string;
    spots: number;
}

interface SelectedProduct {
    id: string;
    quantity: number;
    price: number;
}

interface SelectedSession {
    id: string;
    spots: number;
}

const ProductTable: React.FC<{ gardenImage: string }> = ({ gardenImage }) => {
    const products: Product[] = [
        { id: '1', name: 'Tomates', pricePerUnit: 5, unit: 'kg', imageUrl: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg' },
        { id: '2', name: 'Lechuga', pricePerUnit: 2, unit: 'unidad', imageUrl: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg' },
        { id: '3', name: 'Zanahorias', pricePerUnit: 3, unit: 'kg', imageUrl: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg' },
        { id: '4', name: 'Pimientos', pricePerUnit: 4, unit: 'kg', imageUrl: 'https://images.pexels.com/photos/128536/pexels-photo-128536.jpeg' },
    ];

    const volunteerSessions: VolunteerSession[] = [
        { id: '1', name: 'Plantación de semillas', date: '15 Mayo, 2025', spots: 5 },
        { id: '2', name: 'Riego y mantenimiento', date: '22 Mayo, 2025', spots: 3 },
        { id: '3', name: 'Cosecha comunitaria', date: '29 Mayo, 2025', spots: 8 },
    ];

    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [selectedSessions, setSelectedSessions] = useState<SelectedSession[]>([]);
    const [activeTab, setActiveTab] = useState<'products' | 'volunteer'>('products');

    const handleProductQuantityChange = (productId: string, quantity: number) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        if (quantity === 0) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
            return;
        }

        const price = (quantity / 1000) * product.pricePerUnit;

        const existingProductIndex = selectedProducts.findIndex(p => p.id === productId);
        if (existingProductIndex >= 0) {
            const updatedProducts = [...selectedProducts];
            updatedProducts[existingProductIndex] = { id: productId, quantity, price };
            setSelectedProducts(updatedProducts);
        } else {
            setSelectedProducts([...selectedProducts, { id: productId, quantity, price }]);
        }
    };

    const handleSessionSelection = (sessionId: string, spots: number) => {
        if (spots === 0) {
            setSelectedSessions(selectedSessions.filter(s => s.id !== sessionId));
            return;
        }

        const existingSessionIndex = selectedSessions.findIndex(s => s.id === sessionId);
        if (existingSessionIndex >= 0) {
            const updatedSessions = [...selectedSessions];
            updatedSessions[existingSessionIndex] = { id: sessionId, spots };
            setSelectedSessions(updatedSessions);
        } else {
            setSelectedSessions([...selectedSessions, { id: sessionId, spots }]);
        }
    };

    const totalProductsPrice = selectedProducts.reduce((sum, product) => sum + product.price, 0);
    const totalSessionsCount = selectedSessions.reduce((sum, session) => sum + session.spots, 0);
    const { t } = useTranslation();



    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto my-8">
            <div className="relative h-64 overflow-hidden">
                <img
                    src={gardenImage}
                    alt="Garden"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-6 text-white">
                        <h2 className="text-3xl font-bold mb-2">L'Hort de Gavà</h2>
                        <p className="text-lg">Gavà de Mar</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <p className="text-gray-600 mb-8">{t('availableServices')}</p>

                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'products'
                                ? 'text-green-700 border-b-2 border-green-500'
                                : 'text-gray-500 hover:text-green-700'
                            }`}
                        onClick={() => setActiveTab('products')}
                    >
                        {t('products_1')}
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'volunteer'
                                ? 'text-green-700 border-b-2 border-green-500'
                                : 'text-gray-500 hover:text-green-700'
                            }`}
                        onClick={() => setActiveTab('volunteer')}
                    >
                        {t('volunteering')}
                    </button>
                </div>

                {activeTab === 'products' && (
                    <div>
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Producto</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-700">Precio por kg</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-700">Cantidad</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    const selectedProduct = selectedProducts.find(p => p.id === product.id);
                                    const quantity = selectedProduct ? selectedProduct.quantity : 0;
                                    const price = selectedProduct ? selectedProduct.price : 0;

                                    return (
                                        <tr key={product.id} className="border-b border-gray-100">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    <span className="text-gray-800">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center text-gray-800">{product.pricePerUnit}€/{product.unit}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center">
                                                    <QuantitySelector
                                                        initialValue={quantity}
                                                        onChange={(value) => handleProductQuantityChange(product.id, value)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right text-gray-800">{price.toFixed(2)}€</td>
                                        </tr>
                                    );
                                })}
                                <tr className="bg-green-50">
                                    <td colSpan={3} className="py-4 px-4 text-right font-medium text-gray-700">Total</td>
                                    <td className="py-4 px-4 text-right font-medium text-gray-800">{totalProductsPrice.toFixed(2)}€</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="mt-6 flex justify-end">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors duration-300">
                                Añadir a Cesta
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'volunteer' && (
                    <div>
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actividad</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-700">Fecha</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-700">Plazas disponibles</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-700">Apuntarse</th>
                                </tr>
                            </thead>
                            <tbody>
                                {volunteerSessions.map((session) => {
                                    const selectedSession = selectedSessions.find(s => s.id === session.id);
                                    const selectedSpots = selectedSession ? selectedSession.spots : 0;

                                    return (
                                        <tr key={session.id} className="border-b border-gray-100">
                                            <td className="py-3 px-4 text-gray-800">{session.name}</td>
                                            <td className="py-3 px-4 text-center text-gray-800">{session.date}</td>
                                            <td className="py-3 px-4 text-center text-gray-800">{session.spots}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center">
                                                    <select
                                                        value={selectedSpots}
                                                        onChange={(e) => handleSessionSelection(session.id, parseInt(e.target.value, 10))}
                                                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                    >
                                                        <option value="0">0</option>
                                                        {[...Array(session.spots)].map((_, i) => (
                                                            <option key={i} value={i + 1}>
                                                                {i + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr className="bg-green-50">
                                    <td colSpan={3} className="py-4 px-4 text-right font-medium text-gray-700">Total de plazas</td>
                                    <td className="py-4 px-4 text-center font-medium text-gray-800">{totalSessionsCount}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="mt-6 flex justify-end">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors duration-300">
                                Confirmar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductTable;