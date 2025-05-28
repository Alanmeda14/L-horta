import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useTranslation } from "react-i18next";



// Define the CartItem interface
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

const Cesta: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const { t } = useTranslation();
  
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  
    const sanitizedItems = cartItems.map((item: any) => ({
      ...item,
      price: parseFloat(item.price),
      quantity: parseFloat(item.quantity),
    }));
  
    setItems(sanitizedItems);
  }, []);
  const removeFromCart = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.setItem('cart', '[]');
  };

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = totalPrice * 0.04; // 4% tax
  const grandTotal = totalPrice + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">{t("your_cart_is_empty")}</h2>
          <p className="text-gray-600 mb-8">{t("cart_empty_message")}</p>
          <button 
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            {t("explore_gardens")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{t("mi-cesta")}</h1>
        <button 
          onClick={clearCart}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
           {t("empty_cart")}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.price}€/{item.unit}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button 
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="px-3 py-1 min-w-[40px] text-center">
                    {item.quantity}
                  </span>
                  <button 
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="min-w-[80px] text-right font-medium">
                  {(item.price * item.quantity).toFixed(2)}€
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-gray-50 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">{t("subtotal")}</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t("tax_label", { percent: 4 })}</span>
            <span>{tax.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between font-bold pt-3 border-t">
            <span>{t("total")}</span>
            <span>{grandTotal.toFixed(2)}€</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <button 
          onClick={() => navigate('/home')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
           {t("continue_shopping")}
        </button>
        
        <button 
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
         {t("checkout")}
        </button>
      </div>
    </div>
  );
};

export default Cesta;