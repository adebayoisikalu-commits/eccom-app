import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart on app start
  useEffect(() => {
    const loadCart = async () => {
      try {
        const saved = await AsyncStorage.getItem("cart");
        if (saved) {
          setCart(JSON.parse(saved));
        }
      } catch (err) {
        console.log("Error loading cart:", err);
      }
    };

    loadCart();
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem("cart", JSON.stringify(cart));
      } catch (err) {
        console.log("Error saving cart:", err);
      }
    };

    saveCart();
  }, [cart]);

  // ➕ Add to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p._id === product._id);

      if (existing) {
        return prev.map((p) =>
          p._id === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ❌ Remove item
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

  // ⬆️ Increase quantity
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  };

  // ⬇️ Decrease quantity
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p._id === id
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  // 💰 Total price
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}