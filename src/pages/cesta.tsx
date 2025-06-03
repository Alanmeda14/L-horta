import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { 
  getShoppingCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart, 
  ShoppingCart, 
  ShoppingCartItem
} from "../services/shoppingListService";
import CartItemsList from '../components/CartItemList';

const Cesta: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<ShoppingCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        console.log('Fetching cart data...');
        const data = await getShoppingCart();
        setCart(data);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching the cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleUpdateQuantity = async (item: ShoppingCartItem, newQuantity: number) => {
    try {
      await updateCartItemQuantity(item.gardenProductId, newQuantity);
      if (cart) {
        setCart({
          ...cart,
          items: cart.items.map(i => 
            i.id === item.id ? { ...i, quantity: newQuantity } : i
          )
        });
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemoveItem = async (item: ShoppingCartItem) => {
    try {
      await removeFromCart(item.gardenProductId);
      if (cart) {
        setCart({
          ...cart,
          items: cart.items.filter(i => i.id !== item.id)
        });
      }
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCart(null);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
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

  const totalPrice = cart.items.reduce((total, item) => 
    total + (item.unitPrice * item.quantity), 0
  );
  const tax = totalPrice * 0.04; // 4% tax
  const grandTotal = totalPrice + tax;

  return (
    <div className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{t("mi-cesta")}</h1>
        <button 
          onClick={handleClearCart}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {t("empty_cart")}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <CartItemsList 
          items={cart.items}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
        
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