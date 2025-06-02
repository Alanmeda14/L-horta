import React from 'react';
import { Trash2 } from 'lucide-react';
import { ShoppingCartItem, groupItemsByGarden } from '../services/shoppingListService';

interface CartItemsListProps {
  items: ShoppingCartItem[];
  onUpdateQuantity: (item: ShoppingCartItem, newQuantity: number) => void;
  onRemoveItem: (item: ShoppingCartItem) => void;
}

const CartItemsList: React.FC<CartItemsListProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem 
}) => {
  const groupedItems = groupItemsByGarden(items);
  
  return (
    <>
      {Object.values(groupedItems).map(({ garden, items: gardenItems }) => (
        <div key={garden.id} className="mb-8">
          <div className="bg-green-50 px-4 py-3 mb-4 rounded-t-lg border-b border-green-100">
            <h2 className="text-lg font-semibold text-green-800">{garden.name}</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {gardenItems.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                  <img 
                    src={`http://localhost:8080${item.product.image}`}
                    alt={item.product.caName} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-medium">{item.product.caName}</h3>
                  <p className="text-gray-500 text-sm">
                    {item.unitPrice}€/{item.units}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button 
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button 
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="min-w-[80px] text-right font-medium">
                    {(item.unitPrice * item.quantity).toFixed(2)}€
                  </div>
                  
                  <button 
                    onClick={() => onRemoveItem(item)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default CartItemsList; 