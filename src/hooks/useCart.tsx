
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  filename: string;
  material: string;
  infill: number;
  layerHeight: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('3deality-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (err) {
        console.error('Failed to parse cart from localStorage:', err);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('3deality-cart', JSON.stringify(items));
  }, [items]);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (newItem: Omit<CartItem, 'id' | 'quantity'>) => {
    // Check if item already exists (same filename and material)
    const existingItemIndex = items.findIndex(
      item => item.filename === newItem.filename && item.material === newItem.material
    );

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      setItems(prev => prev.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item
      const id = Date.now().toString();
      setItems(prev => [...prev, { ...newItem, id, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      cartCount,
      addToCart,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
