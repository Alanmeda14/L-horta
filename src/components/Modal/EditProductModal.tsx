import React, { useState, useEffect } from "react";
import { Modal } from '../common/Modal';
import { toast } from "react-toastify";

interface Product {
    id: number;
    name: string;
    unitPrice: number;
    quantity: number;
    image: string;
    description?: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSave?: (updatedProduct: Product) => Promise<void>;
    gardenId: number;
}

export const EditProductModal: React.FC<Props> = ({ isOpen, onClose, product, onSave }) => {
    const [name, setName] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [quantityUnit, setQuantityUnit] = useState<'g'|'kg'|'units'>('g');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setUnitPrice(product.unitPrice.toString());
            setQuantity(product.quantity.toString());
            setDescription(product.description || "");
            if (product.quantity >= 1000) {
                setQuantityUnit('kg');
                setQuantity((product.quantity / 1000).toString());
            } else {
                setQuantityUnit('g');
                setQuantity(product.quantity.toString());
            }
        }
    }, [product]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d.,]/g, '');
        if (value === '' || /^\d*[.,]?\d{0,2}$/.test(value)) {
            setUnitPrice(value);
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d.,]/g, '');
        if (value === '' || /^\d*[.,]?\d{0,3}$/.test(value)) {
            setQuantity(value);
        }
    };

    const convertQuantityToGrams = (value: string, unit: string): number => {
        const numValue = parseFloat(value.replace(',', '.'));
        switch (unit) {
            case 'kg':
                return numValue * 1000;
            case 'units':
                return numValue;
            default:
                return numValue;
        }
    };

    const handleConfirm = async () => {
        try {
            if (!product) return;

            if (!name.trim()) {
                toast.error("El nombre del producto es obligatorio");
                return;
            }

            const priceValue = parseFloat(unitPrice.replace(',', '.'));
            if (isNaN(priceValue) || priceValue <= 0) {
                toast.error("El precio debe ser mayor que 0");
                return;
            }

            const quantityValue = parseFloat(quantity.replace(',', '.'));
            if (isNaN(quantityValue) || quantityValue <= 0) {
                toast.error("La cantidad debe ser mayor que 0");
                return;
            }

            setIsSubmitting(true);

            const finalQuantity = convertQuantityToGrams(quantity, quantityUnit);

            const updatedProduct = {
                ...product,
                name,
                unitPrice: priceValue,
                quantity: finalQuantity,
                description
            };

            if (onSave) {
                await onSave(updatedProduct);
            }
            toast.success("✅ Producto actualizado con éxito");
            onClose();
        } catch (err) {
            console.error("❌ Error al actualizar producto:", err);
            toast.error("No se pudo actualizar el producto");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title="Editar producto"
            onCancel={onClose}
            onConfirm={handleConfirm}
            isSubmitting={isSubmitting}
            isOpen={isOpen}
            
        >
            <form className="flex flex-col gap-3 text-left" onSubmit={e => e.preventDefault()}>
                <label className="text-sm font-medium">Nombre:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded"
                    required
                />

                <label className="text-sm font-medium">Precio (€/kg):</label>
                <div className="relative">
                    <input
                        type="text"
                        inputMode="decimal"
                        value={unitPrice}
                        onChange={handlePriceChange}
                        className="border p-2 rounded w-full"
                        required
                        placeholder="0,00"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€</span>
                </div>

                <label className="text-sm font-medium">Cantidad:</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        inputMode="decimal"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="border p-2 rounded flex-1"
                        required
                        placeholder="0,000"
                    />
                    <select
                        value={quantityUnit}
                        onChange={(e) => setQuantityUnit(e.target.value as 'g'|'kg'|'units')}
                        className="border p-2 rounded bg-white"
                    >
                        <option value="g">gramos</option>
                        <option value="kg">kilos</option>
                        <option value="units">unidades</option>
                    </select>
                </div>

                <label className="text-sm font-medium">Descripción:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded"
                    rows={3}
                />
            </form>
        </Modal>
    );
};
