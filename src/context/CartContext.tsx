import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "../types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  shipping: number;
  finalTotal: number;
  promoCode: string;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  toastMessage: string | null;
  clearToast: () => void;
  // Admin cart manipulation features
  adminSetCartItemPrice: (productId: string, customPrice: number) => void;
  adminAddProductToCart: (product: Product, quantity: number, customPrice?: number) => void;
  adminRemoveCartItemPriceOverride: (productId: string) => void;
  setCartDirectly: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "sanatan_seva_store_cart_v1";
const PROMO_STORAGE_KEY = "sanatan_seva_store_promo_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState<string>(() => {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(PROMO_STORAGE_KEY, promoCode);
    } catch (e) {
      console.error("Failed to save promo code to localStorage", e);
    }
  }, [promoCode]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3000);
  };

  const clearToast = () => setToastMessage(null);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, product.stock || 99);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        showToast(`Updated "${product.name}" quantity (${newQty}) in cart.`);
        return updated;
      } else {
        const addQty = Math.min(quantity, product.stock || 99);
        showToast(`Added "${product.name}" to cart.`);
        return [...prevCart, { product, quantity: addQty }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.product.id === productId);
      if (item) {
        showToast(`Removed "${item.product.name}" from cart.`);
      }
      return prevCart.filter((item) => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock || 99;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode("");
    showToast("Cart cleared.");
  };

  // Admin Specific Cart Operations
  const adminSetCartItemPrice = (productId: string, customPrice: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            customPriceOverride: Math.max(0, customPrice),
          };
        }
        return item;
      })
    );
    showToast(`Admin updated item price in cart to ₹${customPrice}`);
  };

  const adminRemoveCartItemPriceOverride = (productId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          const { customPriceOverride, ...rest } = item;
          return rest;
        }
        return item;
      })
    );
    showToast("Price reset to original product rate.");
  };

  const adminAddProductToCart = (product: Product, quantity: number, customPrice?: number) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          customPriceOverride: customPrice !== undefined ? customPrice : updated[existingIndex].customPriceOverride,
        };
        return updated;
      }
      return [
        ...prevCart,
        {
          product,
          quantity,
          customPriceOverride: customPrice,
        },
      ];
    });
    showToast(`Admin added "${product.name}" to cart.`);
  };

  const setCartDirectly = (items: CartItem[]) => {
    setCart(items);
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "SANATAN10") {
      setPromoCode("SANATAN10");
      showToast("Coupon SANATAN10 applied! 10% Seva Discount.");
      return { success: true, message: "10% Seva discount applied successfully!" };
    } else if (clean === "SEVA108") {
      setPromoCode("SEVA108");
      showToast("Coupon SEVA108 applied! ₹108 Off.");
      return { success: true, message: "₹108 discount applied successfully!" };
    } else if (clean === "ADMIN100") {
      setPromoCode("ADMIN100");
      showToast("Admin Courtesy 100% discount applied.");
      return { success: true, message: "Admin coupon applied." };
    }
    return { success: false, message: "Invalid or expired promo code. Try 'SANATAN10'" };
  };

  const removePromoCode = () => {
    setPromoCode("");
    showToast("Promo code removed.");
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    const effectivePrice =
      item.customPriceOverride !== undefined ? item.customPriceOverride : item.product.price;
    return acc + effectivePrice * item.quantity;
  }, 0);

  let discount = 0;
  if (promoCode === "SANATAN10") {
    discount = Math.round(subtotal * 0.1);
  } else if (promoCode === "SEVA108") {
    discount = subtotal > 500 ? 108 : 0;
  } else if (promoCode === "ADMIN100") {
    discount = subtotal;
  }

  // Free shipping on orders over 999
  const shipping = subtotal > 0 && subtotal - discount < 999 ? 75 : 0;
  const finalTotal = Math.max(0, subtotal - discount + shipping);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        shipping,
        finalTotal,
        promoCode,
        applyPromoCode,
        removePromoCode,
        toastMessage,
        clearToast,
        adminSetCartItemPrice,
        adminAddProductToCart,
        adminRemoveCartItemPriceOverride,
        setCartDirectly,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
