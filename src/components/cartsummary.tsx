import React from "react";

type CartSummaryProps = {
  total: number;
};

const CartSummary: React.FC<CartSummaryProps> = ({ total }) => {
  return (
    <div className="mt-4 text-lg font-bold">
      Total a pagar: ${total.toFixed(2)}
    </div>
  );
};

export default CartSummary;