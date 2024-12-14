import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2, Trash } from "lucide-react";
import useCart from "../hooks/useCart";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Cart() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart } =
    useCart(user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const total =
    cartItems?.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    ) || 0;

  const handleBuy = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const products = cartItems.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
      }));
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/buy`,
        {
          method: "POST",
          body: JSON.stringify(products),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.ok && !data.error) {
        clearCart();
        toast.success("Order placed");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.message ||
        error.message;
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {!cartItems?.length ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600">${item.product.price}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      -
                    </button>
                    <span className="text-gray-700">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Total:
              </span>
              <span className="text-2xl font-bold text-indigo-600">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center p-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md"
              onClick={handleBuy}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Buy Now"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
