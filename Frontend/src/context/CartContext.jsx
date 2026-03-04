import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage if it exists, otherwise empty array
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('foodHubCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodHubCart', JSON.stringify(cart));
  }, [cart]);

  // Function to add item or increase quantity
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product._id);
      
      if (existingItem) {
        // Increment quantity of existing item
        return prevCart.map(item => 
          item.productId === product._id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      
      // Add new item to cart
      return [...prevCart, { 
        productId: product._id, 
        name: product.name, 
        price: product.price, 
        quantity 
      }];
    });
  };

  // Function to decrease quantity or remove item if quantity reaches 0
  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      
      if (!existingItem) return prevCart;

      if (existingItem.quantity > 1) {
        // Reduce quantity by 1
        return prevCart.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      }
      
      // Remove item entirely if quantity was 1
      return prevCart.filter(item => item.productId !== productId);
    });
  };

  // Function to completely remove an item regardless of quantity
  const deleteFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  // Function to empty the cart after a successful order
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('foodHubCart');
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      deleteFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};