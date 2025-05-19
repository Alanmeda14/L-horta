import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
    onChange: (value: number) => void;
    initialValue?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ onChange, initialValue = 0 }) => {
    const [quantity, setQuantity] = useState(initialValue);

    const increment = () => {
        let newValue;
        if (quantity < 1000) { // Less than 1kg
            newValue = quantity + 250; // Add 250g
        } else {
            newValue = quantity + 500; // Add 500g
        }
        setQuantity(newValue);
        onChange(newValue);
    };

    const decrement = () => {
        if (quantity <= 0) return;

        let newValue;
        if (quantity <= 1000) { // 1kg or less
            newValue = quantity - 250; // Subtract 250g
        } else {
            newValue = quantity - 500; // Subtract 500g
        }

        if (newValue < 0) newValue = 0;
        setQuantity(newValue);
        onChange(newValue);
    };

    const formatQuantity = (grams: number) => {
        if (grams >= 1000) {
            const kg = grams / 1000;
            return `${kg} kg`;
        }
        return `${grams} g`;
    };

    return (
        <div className="flex items-center space-x-1">
            <button
                onClick={decrement}
                className="h-8 w-8 flex items-center justify-center bg-green-100 rounded-md text-green-700 hover:bg-green-200 transition-colors"
                disabled={quantity <= 0}
            >
                <Minus size={16} />
            </button>
            <span className="w-16 text-center text-sm font-medium">{formatQuantity(quantity)}</span>
            <button
                onClick={increment}
                className="h-8 w-8 flex items-center justify-center bg-green-100 rounded-md text-green-700 hover:bg-green-200 transition-colors"
            >
                <Plus size={16} />
            </button>
        </div>
    );
};

export default QuantitySelector;