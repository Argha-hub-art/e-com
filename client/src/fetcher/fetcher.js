export const getProducts = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products`
    );

    if (response.ok) {
      const data = await response.json();
      return data.products;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};
