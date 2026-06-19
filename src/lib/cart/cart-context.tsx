'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CustomizationData {
  customText?: string;
  customImage?: string[];
  customColors?: string[];
  material?: string;
  size?: string;
  quality?: string;
  printMethod?: string;
  files?: File[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customization?: CustomizationData;
  customizationCost?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: { id: string; name: string; price: number; image: string }, customization?: CustomizationData) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateCustomization: (id: string, customization: CustomizationData) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const calculateCustomizationCost = (customization?: CustomizationData): number => {
    if (!customization) return 0;
    
    let cost = 0;
    
    if (customization.customText?.length > 0) {
      cost += 5;
    }
    
    if (customization.customImage?.length > 0) {
      cost += 10 * customization.customImage.length;
    }
    
    if (customization.customColors?.length > 0) {
      cost += 3;
    }
    
    if (customization.material === 'premium') {
      cost += 10;
    } else if (customization.material === 'luxury') {
      cost += 25;
    }
    
    if (customization.quality === 'high') {
      cost += 8;
    } else if (customization.quality === 'premium') {
      cost += 15;
    }
    
    return cost;
  };

  const addToCart = (product: { id: string; name: string; price: number; image: string }, customization?: CustomizationData) => {
    const customizationCost = calculateCustomizationCost(customization);
    
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...product, quantity: 1, customization, customizationCost }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const updateCustomization = (id: string, customization: CustomizationData) => {
    const customizationCost = calculateCustomizationCost(customization);
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, customization, customizationCost } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price + (item.customizationCost || 0)) * item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateCustomization,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}