import React from "react";

type CartItemProps = {
  name: string;
  price: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
};

const CartItem: React.FC<CartItemProps> = ({ name, price, quantity, onQuantityChange }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>{name}</div>
      <div>${price.toFixed(2)}</div>
      <div className="flex items-center gap-2">
        <button onClick={() => onQuantityChange(quantity - 1)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => onQuantityChange(quantity + 1)}>+</button>
      </div>
      <div>${(price * quantity).toFixed(2)}</div>
    </div>
  );
};

export default CartItem;