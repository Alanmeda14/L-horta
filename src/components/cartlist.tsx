import React from "react";
import CartItem from "./cartItem";

type Product = {
  name: string;
  price: number;
  quantity: number;
};

type CartListProps = {
  products: Product[];
  onQuantityChange: (index: number, quantity: number) => void;
};

const CartList: React.FC<CartListProps> = ({ products, onQuantityChange }) => {
  return (
    <div>
      {products.map((product, index) => (
        <CartItem
          key={index}
          name={product.name}
          price={product.price}
          quantity={product.quantity}
          onQuantityChange={(quantity) => onQuantityChange(index, quantity)}
        />
      ))}
    </div>
  );
};

export default CartList;