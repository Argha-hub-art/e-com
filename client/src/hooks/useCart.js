// useCart.js
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Utility functions
const getCartFromLocalStorage = (userId) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.filter((item) => item.userId === userId);
};

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const useCart = (user) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items when user changes
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const loadCart = () => {
      const cart = getCartFromLocalStorage(user.id);
      // Optionally, enrich cart items with product details here
      setCartItems(cart);
    };

    loadCart();
  }, [user]);

  // Function to add an item to the cart
  const addToCart = (product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if the item already exists in the cart
      const existingItemIndex = cart.findIndex(
        (item) => item.productId === product._id && item.userId === user.id
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += 1;
      } else {
        // Add new item to the cart
        cart.push({
          id: Date.now(), // Unique identifier
          productId: product._id,
          quantity: 1,
          userId: user?._id,
          product: {
            name: product?.name,
            image: product?.image,
            price: product?.price,
          },
        });
      }

      console.log(cart);

      saveCartToLocalStorage(cart);
      setCartItems(cart);
      toast.success("Added to cart");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("An error occurred while adding to cart");
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = (id) => {
    if (!user) {
      toast.error("Please login to modify the cart");
      return;
    }

    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter(
        (item) => !(item.id === id && item.userId === user.id)
      );
      saveCartToLocalStorage(cart);
      setCartItems(cart);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      toast.error("Failed to remove item");
    }
  };

  const clearCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.userId !== user.id);
    saveCartToLocalStorage(cart);
    setCartItems(cart);
  };

  // Function to update the quantity of an item in the cart
  const updateQuantity = (id, quantity) => {
    if (!user) {
      toast.error("Please login to modify the cart");
      return;
    }

    if (quantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const itemIndex = cart.findIndex(
        (item) => item.id === id && item.userId === user.id
      );

      if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        saveCartToLocalStorage(cart);
        setCartItems(cart);
        toast.success("Quantity updated");
      } else {
        toast.error("Item not found in cart");
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  return { cartItems, addToCart, removeFromCart, updateQuantity, clearCart };
};

export default useCart;
