import React from "react";
import { Product } from "../types";
import { ProductImage } from "./ProductImage";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Eye, Star, CheckCircle, AlertCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  navigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, navigate }) => {
  const { addToCart } = useCart();

  const handleCardClick = () => {
    navigate(`/store/product/${product.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="product-card group bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative w-full pt-[90%] overflow-hidden bg-stone-100">
        <div className="absolute inset-0">
          <ProductImage product={product} className="w-full h-full" />
        </div>

        {/* Category Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/95 text-stone-800 backdrop-blur-xs shadow-xs border border-stone-200/60">
            {product.category}
          </span>
          {product.featured && (
            <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#d4af37] text-white shadow-xs">
              ★ Featured
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="bg-white text-stone-900 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-orange-600" />
            Quick View
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating if present */}
          {product.rating && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-1 font-medium">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="font-bold text-stone-800">{product.rating}</span>
              {product.reviewsCount && (
                <span className="text-stone-400">({product.reviewsCount})</span>
              )}
            </div>
          )}

          {/* Product Name with Marcellus typography */}
          <h3 className="marcellus font-bold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 font-sans leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Stock Status */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-stone-900 font-sans">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through font-sans">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div>
              {isOutOfStock ? (
                <span className="text-[10px] font-semibold text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Out of stock
                </span>
              ) : isLowStock ? (
                <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> In Stock
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              id={`view-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span>Details</span>
            </button>

            <button
              id={`add-to-cart-btn-${product.id}`}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                isOutOfStock
                  ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                  : "buy-btn text-white shadow-xs"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
