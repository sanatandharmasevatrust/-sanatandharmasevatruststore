import React, { useState } from "react";
import { Product } from "../types";
import { DiyaIcon, LotusIcon, OmSymbol, TempleIcon, TrishulIcon } from "./SacredIcons";
import { BookOpen, Sparkles, Shirt, Gift, ShieldCheck } from "lucide-react";

interface ProductImageProps {
  product: Product;
  className?: string;
  large?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  className = "w-full h-48",
  large = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Category thematic color and icon mapping for visual consistency
  const getCategoryIcon = () => {
    switch (product.category) {
      case "Puja & Devotional":
        return <DiyaIcon className={large ? "w-16 h-16 text-amber-500" : "w-10 h-10 text-amber-500"} />;
      case "Rudraksha & Malas":
        return <Sparkles className={large ? "w-16 h-16 text-amber-700" : "w-10 h-10 text-amber-700"} />;
      case "Hindu Books":
        return <BookOpen className={large ? "w-16 h-16 text-amber-800" : "w-10 h-10 text-amber-800"} />;
      case "Hindu Symbols":
        return <OmSymbol className={large ? "w-16 h-16 text-amber-600" : "w-10 h-10 text-amber-600"} />;
      case "Temple & Home Decor":
        return <TempleIcon className={large ? "w-16 h-16 text-amber-600" : "w-10 h-10 text-amber-600"} />;
      case "Sanatan Merchandise":
        return <ShieldCheck className={large ? "w-16 h-16 text-orange-600" : "w-10 h-10 text-orange-600"} />;
      case "Clothing":
        return <Shirt className={large ? "w-16 h-16 text-amber-600" : "w-10 h-10 text-amber-600"} />;
      case "Gifts":
        return <Gift className={large ? "w-16 h-16 text-rose-600" : "w-10 h-10 text-rose-600"} />;
      default:
        return <LotusIcon className={large ? "w-16 h-16 text-amber-600" : "w-10 h-10 text-amber-600"} />;
    }
  };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-stone-100 flex items-center justify-center ${className}`}>
      {!imageError && product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none bg-radial from-amber-100/60 via-amber-50/30 to-stone-50 border border-amber-200/50">
          <div className="p-3 bg-white/90 rounded-full shadow-sm border border-amber-200 mb-2">
            {getCategoryIcon()}
          </div>
          <p className="text-xs font-serif font-medium text-amber-900 line-clamp-2 px-2">
            {product.name}
          </p>
          <span className="mt-1 text-[10px] tracking-wider uppercase font-semibold text-amber-700/80 bg-amber-100/70 px-2 py-0.5 rounded">
            {product.category}
          </span>
          <div className="absolute top-2 right-2 opacity-15 pointer-events-none">
            <OmSymbol className="w-12 h-12 text-amber-800" />
          </div>
        </div>
      )}
    </div>
  );
};
