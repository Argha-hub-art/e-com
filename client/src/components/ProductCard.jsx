import { ShoppingCart, Trash } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useCart from "../hooks/useCart";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart, removeFromCart } = useCart(user);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-1">₹{Number(product.price)}</p>
        <p className="text-sm text-gray-500 mt-2">{product.description}</p>

        <div className="mt-4 flex justify-between items-center">
          {user?.isAdmin ? (
            <button
              onClick={() => removeFromCart(product.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
