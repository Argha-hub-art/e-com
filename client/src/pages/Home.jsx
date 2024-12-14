import ProductCard from "../components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../fetcher/fetcher";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

      {isLoading ? (
        <Loader2 className="animate-spin w-6 h-6 mx-auto" />
      ) : products?.length === 0 ? (
        <p className="text-gray-500 text-center">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
