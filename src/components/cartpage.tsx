import React, { useState } from "react";
import CartSummary from "./cartsummary";
import Tomate from '../assets/tomate.jpg';
import Cebolla from '../assets/cebolla.jpg';
import Lechuga from '../assets/lechuga.jpg';
import Pepino from '../assets/pepino.jpg';
import Coliflor from '../assets/coliflor.jpg';
import Acelga from '../assets/acelga.jpg';
import Pimiento from '../assets/pimiento.jpg';
import Zanahoria from '../assets/zanahoria.jpg';


type Product = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

const CartPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([
    { name: "Tomate", price: 1.2, quantity: 1, image: Tomate  },
    { name: "Cebolla", price: 0.8, quantity: 1, image: Cebolla },
    { name: "Lechuga", price: 1.5, quantity: 1, image: Lechuga },
    { name: "Pepino", price: 1.7, quantity: 1, image: Pepino },
    { name: "Coliflor", price: 2.5, quantity: 1, image: Coliflor },
    { name: "Acelga", price: 1.0, quantity: 1, image: Acelga },
    { name: "Pimiento", price: 1.1, quantity: 1, image: Pimiento },
    { name: "Zanahoria", price: 0.9, quantity: 1, image: Zanahoria },
  ]);

  const addToCart = (product: Product) => {
    const productInCart = products.find((p) => p.name === product.name);

    if (productInCart) {
      setProducts(products.map((p) => p.name === product.name ? { ...p, quantity: p.quantity + 1 } : p));
    } else {
      setProducts([...products, { ...product }]);
      setSuggestedProducts(suggestedProducts.filter((p) => p.name !== product.name));
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    const updatedProducts = [...products];
    if (newQuantity > 0) {
      updatedProducts[index].quantity = newQuantity;
    } else {
      removeProduct(index);
    }
    setProducts(updatedProducts);
  };

  const removeProduct = (index: number) => {
    const removedProduct = products[index];
    setProducts(products.filter((_, i) => i !== index));
    setSuggestedProducts([...suggestedProducts, { ...removedProduct, quantity: 1 }]);
  };

  const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 max-w-5xl mx-auto mt-16">
      <div className={`flex-1 bg-white rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out`} style={{ minHeight: `${products.length * 100 + 50}px`, maxHeight: '600px', overflowY: 'auto' }}>
        <h2 className="text-2xl font-bold mb-4"> 🛒 Cesta</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No tienes productos en tu cesta.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {products.map((product, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-20 h-20" />
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(index, product.quantity - 1)}>-</button>
                  <span>{product.quantity}</span>
                  <button onClick={() => updateQuantity(index, product.quantity + 1)}>+</button>
                </div>
                <p className="font-bold">{formatCurrency(product.price * product.quantity)}</p>
                <button onClick={() => removeProduct(index)} className="text-red-500 hover:text-red-700">🗑️</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col md:w-1/3 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <h2 className="text-2xl font-bold mb-4">Productos Sugeridos</h2>
          <div className="grid grid-cols-2 gap-4">
            {suggestedProducts.map((product, index) => (
              <div key={index} className="flex flex-col items-center">
                <img src={product.image} alt={product.name} className="w-20 h-20" />
                <p>{product.name}</p>
                <p className="text-green-500 font-bold">{formatCurrency(product.price)}</p>
                <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded" onClick={() => addToCart(product)}>Agregar</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-2xl font-bold mb-4">Resumen</h2>
          <p className="text-xl font-bold">Total a pagar: {formatCurrency(total)}</p>
          <button className="mt-4 w-full bg-green-800 text-white py-2 rounded hover:bg-green-700">Pasar por caja</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
