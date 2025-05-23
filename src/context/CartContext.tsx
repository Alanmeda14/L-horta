// import React, { createContext, useContext, useState, useEffect } from 'react';

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   unit: string;
//   image: string;
// }

// interface CartContextType {
//   items: CartItem[];
//   setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
//   totalItems: number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [items, setItems] = useState<CartItem[]>([]);

//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
//     setItems(cartItems);
//   }, []);

//   const totalItems = items.reduce((total, item) => total + item.quantity, 0);

//   return (
//     <CartContext.Provider value={{ items, setItems, totalItems }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };