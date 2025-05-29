import React from 'react';
import { Product } from '../types/index';

interface ProductManagerProps {
    products: Product[];
    onChange: (updatedProducts: Product[]) => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ products, onChange }) => {
    const unitOptions = [
        { value: 'kg', label: 'Kilogramos' },
        { value: 'g', label: 'Gramos' },
        { value: 'unit', label: 'Unidades' }
    ];

    const updateProductField = (index: number, field: keyof Product, value: any) => {
        const updated = [...products];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Gestión de Productos</h2>

            {products.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No hay productos disponibles</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipo de unidad
                                        </label>
                                        <select
                                            value={product.unitType}
                                            onChange={(e) => updateProductField(index, 'unitType', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                        >
                                            {unitOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Precio por {product.unitType === 'kg' ? 'kg' : product.unitType === 'g' ? '100g' : 'unidad'} (€)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={product.unitPrice}
                                            onChange={(e) => updateProductField(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cantidad disponible ({product.unitType === 'unit' ? 'unidades' : product.unitType})
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={product.availableQuantity}
                                        onChange={(e) => updateProductField(index, 'availableQuantity', parseInt(e.target.value, 10) || 0)}
                                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductManager;