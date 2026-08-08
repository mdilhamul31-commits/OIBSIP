import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string; // generated unique id for cart instance
  pizzaId?: string; // for prebuilt
  name: string;
  price: number;
  quantity: number;
  isCustom: boolean;
  image?: string;
  customizations?: {
    base?: string;
    sauce?: string;
    cheese?: string;
    veggies?: string[];
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    // Check if identical item exists (for prebuilt mostly)
    if (!item.isCustom) {
      const existing = cart.find(c => c.pizzaId === item.pizzaId);
      if (existing) {
        updateQuantity(existing.id, existing.quantity + item.quantity);
        return;
      }
    }
    setCart([...cart, item]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart(cart.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
