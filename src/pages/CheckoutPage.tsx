import React, { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ProductImage } from "../components/ProductImage";
import { OmSymbol, LotusIcon } from "../components/SacredIcons";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Printer,
  User,
} from "lucide-react";

interface CheckoutPageProps {
  navigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { cart, subtotal, discount, shipping, finalTotal, promoCode, clearCart } = useCart();
  const { currentUser, addCustomerOrder } = useAuth();

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address?.street || "",
    city: currentUser?.address?.city || "",
    state: currentUser?.address?.state || "",
    pincode: currentUser?.address?.pincode || "",
    notes: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.name,
        email: prev.email || currentUser.email,
        phone: prev.phone || currentUser.phone || "",
        address: prev.address || currentUser.address?.street || "",
        city: prev.city || currentUser.address?.city || "",
        state: prev.state || currentUser.address?.state || "",
        pincode: prev.pincode || currentUser.address?.pincode || "",
      }));
    }
  }, [currentUser]);

  const [paymentMethod, setPaymentMethod] = useState<"cashfree">("cashfree");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  useEffect(() => {
    document.title = "Secure Checkout | Sanatan Seva Store";
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returned = params.get("cashfree") === "return";
    const returnedOrderId = params.get("order_id");

    if (!returned || !returnedOrderId) return;

    let cancelled = false;

    const verifyReturn = async () => {
      setIsProcessing(true);

      try {
        const response = await fetch("/api/store/cashfree/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: returnedOrderId }),
        });

        const result = await response.json();

        if (!response.ok || !result?.paid) {
          if (!cancelled) {
            alert("Payment is not confirmed yet. Please check your Cashfree payment status or try again.");
            setIsProcessing(false);
          }
          return;
        }

        if (cancelled) return;

        const newOrder = {
          orderId: returnedOrderId,
          items: [...cart],
          customer: { ...formData },
          pricing: {
            subtotal,
            discount,
            shipping,
            total: Number(result.amount || finalTotal),
          },
          paymentMethod: "cashfree",
          promoCode,
          createdAt: new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
          status: "Processing" as const,
          paymentStatus: "PAID",
        };

        addCustomerOrder(newOrder);
        setOrderConfirmed(newOrder);
        clearCart();
        window.history.replaceState({}, "", "/store/checkout");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Cashfree return verification error:", error);
        if (!cancelled) {
          alert("We could not verify the payment yet. Please contact the Store if money was deducted.");
        }
      } finally {
        if (!cancelled) setIsProcessing(false);
      }
    };

    verifyReturn();

    return () => {
      cancelled = true;
    };
  }, []);

  if (cart.length === 0 && !orderConfirmed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-[#fdfbf7]">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="marcellus text-2xl font-bold text-gray-900 mb-2">
          No Items for Checkout
        </h2>
        <p className="text-sm text-gray-600 mb-6 max-w-sm">
          Your cart is currently empty. Please add items to proceed with placing an order.
        </p>
        <button
          onClick={() => navigate("/store")}
          className="pill-btn active px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
        >
          Explore Store
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      alert("Please complete the required delivery information.");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      alert("Please enter a valid 6-digit PIN code.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/store/cashfree/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(({ product, quantity }) => ({
            slug: product.slug,
            quantity,
          })),
          customer: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.paymentSessionId) {
        throw new Error(result?.error || "Unable to start Cashfree checkout.");
      }

      const cashfree = await load({
        mode: "production",
      });

      if (!cashfree) {
        throw new Error("Cashfree Checkout could not be loaded.");
      }

      await cashfree.checkout({
        paymentSessionId: result.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (error: any) {
      console.error("Cashfree checkout error:", error);
      alert(error?.message || "Unable to open Cashfree payment. Please try again.");
      setIsProcessing(false);
    }
  };

  // ORDER SUCCESS CONFIRMATION VIEW
  if (orderConfirmed) {
    return (
      <div id="order-confirmed-root" className="min-h-screen bg-[#fdfbf7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-gray-200 shadow-md text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-700 bg-orange-100/70 px-3 py-1 rounded-full">
                Order Placed Successfully
              </span>
              <h1 className="marcellus text-3xl sm:text-4xl font-bold text-gray-900">
                Jai Shri Krishna!
              </h1>
              <p className="text-sm text-gray-600 max-w-md mx-auto font-sans">
                Thank you for your order with Sanatan Seva Store. Your sacred package will be sanctified and dispatched promptly.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="bg-[#fdfbf7] rounded-xl p-4 border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left text-xs">
              <div>
                <span className="text-gray-400 block font-sans">Order ID:</span>
                <strong className="text-gray-900 font-mono text-sm">{orderConfirmed.orderId}</strong>
              </div>
              <div>
                <span className="text-gray-400 block font-sans">Date:</span>
                <strong className="text-gray-900">{orderConfirmed.createdAt}</strong>
              </div>
              <div>
                <span className="text-gray-400 block font-sans">Total Paid:</span>
                <strong className="text-orange-700 text-sm">₹{orderConfirmed.pricing.total.toLocaleString("en-IN")}</strong>
              </div>
              <div>
                <span className="text-gray-400 block font-sans">Payment Mode:</span>
                <strong className="text-gray-900 uppercase">{orderConfirmed.paymentMethod}</strong>
              </div>
            </div>

            {/* Shipping Address Summary */}
            <div className="text-left bg-orange-50/50 rounded-xl p-5 border border-orange-200/60 space-y-2 text-xs">
              <h4 className="marcellus font-bold text-orange-900 text-sm">
                Delivery Address & Contact:
              </h4>
              <p className="font-bold text-gray-800">{orderConfirmed.customer.fullName} ({orderConfirmed.customer.phone})</p>
              <p className="text-gray-600">
                {orderConfirmed.customer.address}, {orderConfirmed.customer.city},{" "}
                {orderConfirmed.customer.state} - {orderConfirmed.customer.pincode}
              </p>
              {orderConfirmed.customer.email && (
                <p className="text-gray-500">Email: {orderConfirmed.customer.email}</p>
              )}
            </div>

            {/* Ordered Items Preview */}
            <div className="text-left space-y-3 pt-2">
              <h4 className="marcellus font-bold text-gray-900 text-sm">
                Items in This Package:
              </h4>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                {orderConfirmed.items.map((item: any) => (
                  <div key={item.product.id} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-200 shrink-0">
                        <ProductImage product={item.product} className="w-full h-full" />
                      </div>
                      <div>
                        <strong className="text-gray-900 block">{item.product.name}</strong>
                        <span className="text-gray-500">Qty: {item.quantity} x ₹{item.product.price}</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 font-sans">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Order Slip</span>
              </button>

              <button
                onClick={() => {
                  navigate("/account");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>View in My Account</span>
              </button>

              <button
                onClick={() => {
                  navigate("/store");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full pill-btn active text-xs font-bold uppercase tracking-wider shadow-xs"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN CHECKOUT FORM VIEW
  return (
    <div id="checkout-page-root" className="min-h-screen bg-[#fdfbf7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <button
            onClick={() => navigate("/store/cart")}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-orange-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-600 font-medium bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: SHIPPING DETAILS & PAYMENT SELECTION */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Delivery Address Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="marcellus text-lg font-bold text-gray-900">
                    Shipping & Delivery Information
                  </h2>
                  <p className="text-xs text-gray-500">
                    Enter the exact address where you would like your sacred products delivered.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider block">
                    Phone Number (for Courier updates) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider block">
                    Email Address (for Dispatch tracking)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. rajesh@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider block">
                    Street Address / House No / Landmark *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Flat 302, Om Shanti Towers, Near Shiv Mandir"
                    className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider block">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Varanasi / New Delhi"
                    className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider block">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Uttar Pradesh"
                    className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider block">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g. 221001"
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider block">
                    Special Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Handle with sanctity / Bell outside"
                    className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. Isolated Payment Method Selection */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="marcellus text-lg font-bold text-gray-900">
                    Payment Method
                  </h2>
                  <p className="text-xs text-gray-500">
                    Choose your preferred payment method. (Store checkout is isolated from trust donations).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="p-5 rounded-xl border-2 border-orange-600 bg-orange-50/40 flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cashfree"
                    checked
                    readOnly
                    className="mt-1 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-gray-900">
                      <CreditCard className="w-4 h-4 text-orange-600" />
                      <span>Cashfree Secure Checkout</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Pay securely using UPI, cards, netbanking and other Cashfree-supported methods.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-semibold text-gray-600">
                      <span className="px-2 py-1 rounded-full bg-white border">UPI</span>
                      <span className="px-2 py-1 rounded-full bg-white border">Cards</span>
                      <span className="px-2 py-1 rounded-full bg-white border">Netbanking</span>
                      <span className="px-2 py-1 rounded-full bg-white border">Wallets</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY & PLACE ORDER BUTTON */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
              <h3 className="marcellus text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                Order Review ({cart.reduce((a, b) => a + b.quantity, 0)} items)
              </h3>

              {/* Items Compact List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-2">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-200">
                        <ProductImage product={product} className="w-full h-full" />
                      </div>
                      <div className="truncate">
                        <span className="font-semibold text-gray-900 block truncate">{product.name}</span>
                        <span className="text-gray-500">Qty: {quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 font-sans shrink-0">
                      ₹{(product.price * quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({promoCode})</span>
                    <span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? "₹0 (Free)" : `₹${shipping}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="marcellus text-base font-bold text-gray-900">Total Payable</span>
                  <span className="font-sans text-xl font-extrabold text-orange-700">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                id="place-order-submit-btn"
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-full buy-btn text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Sacred Order...</span>
                  </span>
                ) : (
                  <span>Pay Securely with Cashfree (₹{finalTotal.toLocaleString("en-IN")})</span>
                )}
              </button>

              <p className="text-[11px] text-center text-gray-500">
                By placing this order you agree to the Sanatan Seva Store guidelines and sacred handling terms.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
