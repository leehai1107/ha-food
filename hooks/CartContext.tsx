"use client";
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Cart, CartItem, Product, UpdateCartItemRequest } from '../types';

// Cart Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productSKU: string } }
  | { type: 'UPDATE_QUANTITY'; payload: UpdateCartItemRequest }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Cart };

// Cart Context Type
interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productSKU: string) => void;
  updateQuantity: (productSKU: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  isInCart: (productSKU: string) => boolean;
  getCartItem: (productSKU: string) => CartItem | undefined;
}

// Initial Cart State
const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  updatedAt: new Date().toISOString(),
};

// Cart Reducer
const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.productSKU === product.productSku);

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = Math.min(item.quantity + quantity, item.maxQuantity);
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      } else {
        // Add new item
        const newItem: CartItem = {
          productSKU: product.productSku,
          productName: product.productName,
          currentPrice: parseFloat(product.currentPrice),
          originalPrice: parseFloat(product.originalPrice),
          quantity: Math.min(quantity, product.quantity),
          imageUrl: product.images?.[0]?.imageUrl || undefined,
          available: product.available,
          maxQuantity: product.quantity,
          weight: product.weight || undefined,
          productType: product.productType,
        };
        newItems = [...state.items, newItem];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);

      return {
        items: newItems,
        totalItems,
        totalPrice,
        updatedAt: new Date().toISOString(),
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.productSKU !== action.payload.productSKU);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);

      return {
        items: newItems,
        totalItems,
        totalPrice,
        updatedAt: new Date().toISOString(),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productSKU, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productSKU } });
      }

      const newItems = state.items.map(item => {
        if (item.productSKU === productSKU) {
          return { ...item, quantity: Math.min(quantity, item.maxQuantity) };
        }
        return item;
      });

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);

      return {
        items: newItems,
        totalItems,
        totalPrice,
        updatedAt: new Date().toISOString(),
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        updatedAt: new Date().toISOString(),
      };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Props
interface CartProviderProps {
  children: ReactNode;
}

// Local Storage Key
const CART_STORAGE_KEY = 'ha-food-cart';

// Cart Provider Component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart: Cart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  // Cart Actions
  const addToCart = (product: Product, quantity: number = 1) => {
    if (!product.available || quantity <= 0) {
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeFromCart = (productSKU: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productSKU } });
  };

  const updateQuantity = (productSKU: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productSKU, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Helper Functions
  const getCartItemCount = () => cart.totalItems;

  const getCartTotal = () => cart.totalPrice;

  const isInCart = (productSKU: string) => {
    return cart.items.some(item => item.productSKU === productSKU);
  };

  const getCartItem = (productSKU: string) => {
    return cart.items.find(item => item.productSKU === productSKU);
  };

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal,
    isInCart,
    getCartItem,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to use Cart Context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
