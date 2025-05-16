import React, { useState, useEffect } from "react";
import CartList from "../components/cartlist";
import CartSummary from "./cartsummary";
type Product = {
  name: string;
  price: number;
  quantity: number;
};

const CartPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { name: "Tomates", price: 1.2, quantity: 3 },
    { name: "Cebollas", price: 0.8, quantity: 5 },
    { name: "Lechugas", price: 1.5, quantity: 2 }
  ]);

  const updateQuantity = (index: number, newQuantity: number) => {
    const updatedProducts = [...products];
    if (newQuantity >= 0) {
      updatedProducts[index].quantity = newQuantity;
    }
    setProducts(updatedProducts);
  };

  const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tu Cesta de Productos</h2>
      <CartList products={products} onQuantityChange={updateQuantity} />
      <CartSummary total={total} />
      <button className="mt-4 w-full bg-green-500 text-white py-2 rounded">Proceder al Pago</button>
    </div>
  );
};

export default CartPage;