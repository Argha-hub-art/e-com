// Helper functions to get and save the cart in localStorage
export const getCart = (userId) => {
  const cart = localStorage.getItem(`cart_${userId}`);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (userId, cart) => {
  localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
};
