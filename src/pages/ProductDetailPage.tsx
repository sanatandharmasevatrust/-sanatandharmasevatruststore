import React, { useState, useEffect } from "react";
import { useInventory } from "../context/InventoryContext";
import { Product } from "../types";
import { ProductImage } from "../components/ProductImage";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/ProductCard";
import { OmSymbol, LotusIcon, DiyaIcon } from "../components/SacredIcons";
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Share2,
} from "lucide-react";

interface ProductDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, navigate }) => {
  const { products } = useInventory();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const product = products.find((p) => p.slug === slug);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Sanatan Seva Store`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", product.description);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
          <OmSymbol className="w-8 h-8" />
        </div>
        <h2 className="marcellus text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-600 mb-6 max-w-sm">
          The requested spiritual artifact or book might have been relocated or updated in our catalog.
        </p>
        <button
          onClick={() => navigate("/store")}
          className="pill-btn active px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
        >
          Return to Sanatan Store
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate("/store/checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div id="product-detail-page" className="min-h-screen bg-[#fdfbf7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            id="back-to-store-btn"
            onClick={() => {
              navigate("/store");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store Catalog</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-orange-600 px-3 py-1.5 rounded-full border border-gray-200 bg-white shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? "Link Copied!" : "Share Product"}</span>
          </button>
        </div>

        {/* Main Product Showcase Box */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sm:p-8 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Large Product Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 bg-[#fdfbf7]">
                <ProductImage product={product} className="w-full h-full" large={true} />
                {product.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#d4af37] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      ★ Featured Sacred Item
                    </span>
                  </div>
                )}
              </div>

              {/* Trust Badge below image */}
              <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/70 flex items-center justify-between text-xs text-orange-900">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold">100% Genuine Sanatan Artifact</span>
                </div>
                <span className="text-orange-700 font-serif italic">Blessed & Consecrated</span>
              </div>
            </div>

            {/* Right: Product Details & Purchase Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & Rating */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                    {product.category}
                  </span>

                  {product.rating && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-900">{product.rating}</span>
                      <span className="text-gray-500">({product.reviewsCount || 0} reviews)</span>
                    </div>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="marcellus text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 py-2 border-y border-gray-100">
                  <span className="text-3xl font-extrabold text-gray-900 font-sans">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-base text-gray-400 line-through font-sans">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                  <span className="text-xs text-gray-500 ml-auto font-sans">Taxes Included</span>
                </div>

                {/* Stock Status */}
                <div className="text-sm">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                      <AlertTriangle className="w-4 h-4" /> Currently Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-orange-800 bg-orange-50 px-3 py-1 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-orange-600" /> Only {product.stock} units left in stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> In Stock ({product.stock} available) - Dispatches within 24 hours
                    </span>
                  )}
                </div>

                {/* Product Description */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    About this Item
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed font-sans">
                    {product.description}
                  </p>
                </div>

                {/* Specifications & Consecration Details */}
                {product.details && (
                  <div className="bg-[#fdfbf7] rounded-xl p-4 border border-gray-200 space-y-2 text-xs">
                    <h4 className="marcellus font-bold text-gray-900 uppercase tracking-wider">
                      Item Specifications:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                      {product.details.material && (
                        <div>
                          <strong className="text-gray-900">Material:</strong> {product.details.material}
                        </div>
                      )}
                      {product.details.dimensions && (
                        <div>
                          <strong className="text-gray-900">Dimensions:</strong> {product.details.dimensions}
                        </div>
                      )}
                      {product.details.origin && (
                        <div>
                          <strong className="text-gray-900">Origin / Cluster:</strong> {product.details.origin}
                        </div>
                      )}
                      {product.details.consecration && (
                        <div>
                          <strong className="text-gray-900">Sanctity:</strong> {product.details.consecration}
                        </div>
                      )}
                    </div>

                    {product.details.includes && product.details.includes.length > 0 && (
                      <div className="pt-1 border-t border-gray-200">
                        <strong className="text-gray-900">Package Contains: </strong>
                        <span>{product.details.includes.join(", ")}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity Selector & Action CTA Buttons */}
              <div className="pt-4 space-y-4 border-t border-gray-100">
                {/* Quantity Control */}
                {!isOutOfStock && (
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-3.5 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 text-base font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-xs font-bold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        disabled={quantity >= product.stock}
                        className="px-3.5 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 text-base font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Buttons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    id="add-to-cart-btn-detail"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isOutOfStock
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "pill-btn bg-white hover:bg-orange-50 text-orange-700 border-orange-300 shadow-xs"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-orange-600" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    id="buy-now-btn-detail"
                    disabled={isOutOfStock}
                    onClick={handleBuyNow}
                    className={`py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isOutOfStock
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "buy-btn text-white shadow-xs"
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Additional Trust Assurances */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-gray-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span>Free shipping above ₹999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-orange-600" />
                    <span>7 Days Easy Replacement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products in same Category */}
        {relatedProducts.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 bg-[#f97316] rounded-full" />
              <h2 className="marcellus text-xl sm:text-2xl font-bold text-gray-900">
                Related in {product.category}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} navigate={navigate} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
