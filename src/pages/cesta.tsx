import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import ClearCartModal from "../components/Modal/ClearCartModal";
import RemoveItemModal from "../components/Modal/RemoveItemModal";
import CheckoutModal from "../components/Modal/CheckoutModal";
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
import { createOrderFromCart } from "../services/orderService";
import { toast } from "react-toastify";

const Cesta: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<ShoppingCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [showRemoveItemModal, setShowRemoveItemModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<ShoppingCartItem | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        console.log('Fetching cart data...', cart);
        const data = await getShoppingCart();
        console.log('Fetching cart data...', data);
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
      setShowClearCartModal(false);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const order = await createOrderFromCart();
      toast.success('Error creating order');
      setCart(null);
      // Optionally navigate to order details or confirmation page
      // navigate(`/orders/${order.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      toast.error('Error creating order');
    } finally {
      setLoading(false);
    }
  }
    
  const confirmRemoveItem = (item: ShoppingCartItem) => {
    setItemToRemove(item);
    setShowRemoveItemModal(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <div className="text-center dark:text-gray-200">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 text-center">
          <p className="text-red-600 dark:text-red-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <ShoppingBag className="h-16 w-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">{t("your_cart_is_empty")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{t("cart_empty_message")}</p>
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

      <div className=" mx-auto px-4 pt-24 pb-8 max-w-4xl">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold dark:text-gray-200">{t("mi-cesta")}</h1>
        <button
          onClick={() => setShowClearCartModal(true)}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {t("empty_cart")}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-300 rounded-lg shadow-lg overflow-hidden ">
        <CartItemsList
          items={cart.items}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={confirmRemoveItem}
        />

        <div className="p-6 bg-gray-50 dark:bg-gray-400 space-y-3">
          <div className="flex justify-between dark:text-gray-200">
            <span className="text-gray-600 dark:text-gray-300">{t("subtotal")}</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between dark:text-gray-200">
            <span className="text-gray-600 dark:text-gray-300">{t("tax_label", { percent: 4 })}</span>
            <span>{tax.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between font-bold pt-3 border-t border-gray-200 dark:border-gray-600 dark:text-gray-200">
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
          onClick={() => setShowCheckoutModal(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {t("checkout")}
        </button>
      </div>

      <ClearCartModal
        isOpen={showClearCartModal}
        onConfirm={handleClearCart}
        onCancel={() => setShowClearCartModal(false)}
        confirmText={t("confirm")}
        cancelText={t("cancel")}
      />

      <RemoveItemModal
        isOpen={showRemoveItemModal}
        onConfirm={() => {
          if (itemToRemove) {
            handleRemoveItem(itemToRemove);
            setItemToRemove(null);
          }
          setShowRemoveItemModal(false);
        }}
        onCancel={() => {
          setShowRemoveItemModal(false);
          setItemToRemove(null);
        }}
        confirmText={t("confirm")}
        cancelText={t("cancel")}
      />

      <CheckoutModal
        isOpen={showCheckoutModal}
        onConfirm={() => {
          // Add your checkout logic here
          handleCheckout();
        }}
        onCancel={() => setShowCheckoutModal(false)}
        confirmText={t("confirm")}
        cancelText={t("cancel")}
      />
    </div>
  );
};

export default Cesta;