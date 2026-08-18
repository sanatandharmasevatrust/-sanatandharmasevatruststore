import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ProductImage } from "../components/ProductImage";
import { OmSymbol, LotusIcon } from "../components/SacredIcons";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Tag,
  CheckCircle,
  AlertCircle,
  Heart,
  Sliders,
} from "lucide-react";

interface CartPageProps {
  navigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { isAdmin } = useAuth();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    shipping,
    finalTotal,
    promoCode,
    applyPromoCode,
    removePromoCode,
    totalItems,
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ success?: boolean; text?: string } | null>(null);

  useEffect(() => {
    document.title = "Your Sacred Shopping Cart | Sanatan Seva Store";
  }, []);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setPromoMessage({ success: res.success, text: res.message });
    if (res.success) {
      setInputCode("");
    }
  };

  const freeShippingThreshold = 999;
  const currentNet = subtotal - discount;
  const freeShippingProgress = Math.min(100, (currentNet / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - currentNet);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#fdfbf7]">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mb-4 shadow-xs">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="marcellus text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Your Sacred Cart is Empty
        </h2>
        <p className="text-sm text-gray-600 mb-6 max-w-md font-sans">
          Explore our collection of authentic Rudrakshas, pure brass puja items, Shrimad Bhagavad Gita, and spiritual home decor.
        </p>
        <button
          id="cart-empty-shop-btn"
          onClick={() => {
            navigate("/store");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="pill-btn active px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2"
        >
          <span>Explore Sanatan Store</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div id="cart-page-root" className="min-h-screen bg-[#fdfbf7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {isAdmin && (
          <div className="bg-[#7c2d12] text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-amber-800 animate-in fade-in-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-600/60 text-white">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs font-bold uppercase tracking-wider block text-amber-200">
                  Admin Active Cart Mode
                </strong>
                <p className="text-xs text-amber-100/90 font-sans">
                  You are logged in as Administrator. You can adjust custom item prices, stock overrides, or insert items in the Admin Dashboard.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                navigate("/admin");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shrink-0 shadow-xs"
            >
              Open Admin Cart & Price Editor &rarr;
            </button>
          </div>
        )}

        {/* Cart Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="marcellus text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-orange-600" />
              <span>Shopping Cart</span>
              <span className="text-sm font-sans font-normal text-gray-500">
                ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              All store orders directly support Sanatan Dharma Seva Trust initiatives.
            </p>
          </div>

          <button
            onClick={() => {
              navigate("/store");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700 hover:text-orange-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Free Delivery Banner Progress */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-medium text-gray-800">
              <Truck className="w-4 h-4 text-orange-600" />
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Congratulations! You have unlocked Free Sacred Delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="text-orange-700">₹{remainingForFreeShipping.toLocaleString("en-IN")}</strong> more of spiritual products for <strong>Free Delivery</strong>
                </span>
              )}
            </div>
            <span className="font-bold text-gray-700">{Math.round(freeShippingProgress)}%</span>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                remainingForFreeShipping === 0 ? "bg-emerald-500" : "bg-gradient-to-r from-amber-500 to-[#f97316]"
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: CART ITEMS LIST */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs divide-y divide-gray-100">
              {cart.map(({ product, quantity }) => {
                const itemSubtotal = product.price * quantity;
                return (
                  <div
                    key={product.id}
                    id={`cart-item-${product.id}`}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between hover:bg-[#fdfbf7] transition-colors"
                  >
                    {/* Thumbnail & Product Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        onClick={() => navigate(`/store/product/${product.slug}`)}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0 cursor-pointer"
                      >
                        <ProductImage product={product} className="w-full h-full" />
                      </div>

                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
                          {product.category}
                        </span>
                        <h3
                          onClick={() => navigate(`/store/product/${product.slug}`)}
                          className="marcellus font-bold text-base text-gray-900 hover:text-orange-600 transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h3>
                        <p className="text-xs font-sans text-gray-500">
                          Unit Price: ₹{product.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Subtotal Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-full bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3.5 py-1 text-xs font-bold text-gray-900 bg-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30 font-bold transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Subtotal */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-xs text-gray-400 block font-sans">Subtotal</span>
                        <span className="text-base font-bold text-gray-900 font-sans">
                          ₹{itemSubtotal.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear Cart link */}
            <div className="flex justify-between items-center px-2">
              <button
                onClick={clearCart}
                className="text-xs text-gray-500 hover:text-red-600 underline font-medium"
              >
                Clear entire cart
              </button>

              <span className="text-xs text-gray-500">
                🔒 Safe & Secure 256-Bit SSL Encrypted Order
              </span>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY & PROMO CODE */}
          <div className="lg:col-span-4 space-y-6">
            {/* Promo Code Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider marcellus">
                <Tag className="w-4 h-4 text-orange-600" />
                <span>Apply Seva Promo Code</span>
              </div>

              {promoCode ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <div>
                      <strong className="block font-bold">{promoCode} Applied</strong>
                      <span>You saved ₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-red-600 hover:text-red-800 font-semibold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="e.g. SANATAN10"
                      className="flex-1 px-3 py-2 text-xs uppercase bg-[#fdfbf7] border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase rounded-full transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                    <span>💡 Use code</span>
                    <button
                      type="button"
                      onClick={() => setInputCode("SANATAN10")}
                      className="font-bold text-orange-700 hover:underline"
                    >
                      SANATAN10
                    </button>
                    <span>for 10% Seva discount</span>
                  </div>
                </form>
              )}

              {promoMessage && !promoCode && (
                <p className={`text-xs ${promoMessage.success ? "text-emerald-600" : "text-red-600"}`}>
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Price Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h2 className="marcellus text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Items Subtotal ({totalItems})</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Promo Discount ({promoCode})</span>
                    <span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span>Standard Sacred Shipping</span>
                    {shipping === 0 && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold uppercase">
                        Free
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? "₹0 (Free)" : `₹${shipping}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                  <div>
                    <span className="marcellus text-lg font-bold text-gray-900 block">Total Amount</span>
                    <span className="text-[11px] text-gray-400">Inclusive of all GST & packing</span>
                  </div>
                  <span className="font-sans text-2xl font-extrabold text-orange-700">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="proceed-to-checkout-btn"
                onClick={() => {
                  navigate("/store/checkout");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full py-3.5 px-6 rounded-full buy-btn text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Seva Impact Note */}
              <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-orange-900 flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-orange-600 shrink-0 mt-0.5 fill-orange-600" />
                <p className="leading-tight">
                  <strong>Sacred Blessing:</strong> Your order directly contributes to providing wholesome green fodder for Desi cows in our Gaushala.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
