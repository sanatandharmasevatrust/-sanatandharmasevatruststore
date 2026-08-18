import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { OmSymbol, LotusIcon, DiyaIcon } from "../components/SacredIcons";
import {
  User,
  ShoppingBag,
  FileText,
  Heart,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Package,
  CheckCircle2,
  Download,
  ExternalLink,
  Edit2,
  Save,
  ArrowRight,
} from "lucide-react";

interface CustomerProfilePageProps {
  navigate: (path: string) => void;
}

export const CustomerProfilePage: React.FC<CustomerProfilePageProps> = ({ navigate }) => {
  const { currentUser, updateProfile, logout, orders } = useAuth();
  const { cart, finalTotal } = useCart();

  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "donations">("orders");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [editName, setEditName] = useState(currentUser?.name || "");
  const [editPhone, setEditPhone] = useState(currentUser?.phone || "");
  const [editGotra, setEditGotra] = useState(currentUser?.gotra || "");
  const [editPan, setEditPan] = useState(currentUser?.pan || "");
  const [editStreet, setEditStreet] = useState(currentUser?.address?.street || "");
  const [editCity, setEditCity] = useState(currentUser?.address?.city || "");
  const [editState, setEditState] = useState(currentUser?.address?.state || "");
  const [editPincode, setEditPincode] = useState(currentUser?.address?.pincode || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    document.title = "My Account & Orders | Sanatan Seva Store";
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
      gotra: editGotra,
      pan: editPan,
      address: {
        street: editStreet,
        city: editCity,
        state: editState,
        pincode: editPincode,
      },
    });
    setIsEditingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div id="customer-profile-root" className="min-h-[85vh] bg-[#fdfbf7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f97316] to-[#7c2d12] text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "🕉️"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full">
                  Sanatan Devotee Account
                </span>
                {currentUser?.gotra && (
                  <span className="text-xs text-gray-500 font-medium">Gotra: {currentUser.gotra}</span>
                )}
              </div>
              <h1 className="marcellus text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {currentUser?.name || "Namaste Devotee"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {currentUser?.email} • {currentUser?.phone || "+91 98123 45678"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/store")}
              className="px-4 py-2 rounded-full buy-btn text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Store</span>
            </button>

            <button
              onClick={() => navigate("/donate")}
              className="px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
              <span>Donate Seva</span>
            </button>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold uppercase tracking-wider"
            >
              Sign Out
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 space-x-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "orders"
                ? "border-orange-600 text-orange-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Store Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "profile"
                ? "border-orange-600 text-orange-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Devotee Details & 80G PAN</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: CUSTOMER ORDERS
            ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Active Cart Quick Summary if items exist */}
            {cart.length > 0 && (
              <div className="p-5 rounded-3xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-200 text-orange-800 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      You have {cart.reduce((a, b) => a + b.quantity, 0)} sacred items in your cart
                    </h4>
                    <p className="text-xs text-orange-800">
                      Subtotal: ₹{finalTotal.toLocaleString("en-IN")} • Proceed to checkout to receive blessed items.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/store/checkout")}
                  className="px-5 py-2.5 rounded-full buy-btn text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                >
                  <span>Complete Checkout &rarr;</span>
                </button>
              </div>
            )}

            {/* Orders List */}
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="marcellus text-xl font-bold text-gray-900">No Past Orders Found</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Your store purchases and sacred contributions will appear here with downloadable invoice receipts.
                </p>
                <button
                  onClick={() => navigate("/store")}
                  className="px-6 py-2.5 rounded-full buy-btn text-white text-xs font-bold uppercase tracking-wider"
                >
                  Explore Sanatan Store
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900 text-sm">
                            Order #{order.orderId}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {order.status}
                          </span>
                        </div>
                        <span className="text-gray-500 text-[11px]">Placed on {order.createdAt}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">Total Amount:</span>
                        <span className="marcellus text-lg font-bold text-orange-800">
                          ₹{order.pricing.total.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Items in this order */}
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-2 border-b border-gray-50 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 overflow-hidden shrink-0 border border-orange-100">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 block">{item.product.name}</span>
                              <span className="text-gray-500 text-[11px]">
                                Qty: {item.quantity} × ₹{item.product.price}
                              </span>
                            </div>
                          </div>

                          <span className="font-bold text-gray-800 font-mono">
                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Trust Guarantee Footer */}
                    <div className="bg-[#fdfbf7] p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-gray-600 gap-2 border border-gray-200/60">
                      <div>
                        <strong>Delivering to:</strong> {order.customer.fullName},{" "}
                        {order.customer.address}, {order.customer.city} ({order.customer.pincode})
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-700 font-bold">100% Proceeds Support Dharmic Seva</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: CUSTOMER PROFILE & ADDRESS BOOK
            ========================================================================= */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="marcellus text-xl font-bold text-gray-900">
                  Devotee Information & 80G Tax Details
                </h3>
                <p className="text-xs text-gray-500">
                  Keep your delivery address and PAN information updated for 80G tax benefit certificates.
                </p>
              </div>

              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full p-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider block">
                      Gotra
                    </label>
                    <input
                      type="text"
                      value={editGotra}
                      onChange={(e) => setEditGotra(e.target.value)}
                      placeholder="e.g. Kashyapa, Bharadwaja"
                      className="w-full p-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider block">
                      PAN Card (For 80G Exemption)
                    </label>
                    <input
                      type="text"
                      value={editPan}
                      onChange={(e) => setEditPan(e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      className="w-full p-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl font-mono uppercase focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider block">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={editStreet}
                      onChange={(e) => setEditStreet(e.target.value)}
                      placeholder="House / Flat No, Street, Landmark"
                      className="w-full p-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider block">City</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full p-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase tracking-wider block">
                        State
                      </label>
                      <input
                        type="text"
                        value={editState}
                        onChange={(e) => setEditState(e.target.value)}
                        className="w-full p-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase tracking-wider block">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={editPincode}
                        onChange={(e) => setEditPincode(e.target.value)}
                        className="w-full p-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl buy-btn text-white font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200 space-y-3">
                  <span className="font-bold text-orange-800 uppercase tracking-wider block">
                    Devotee Details:
                  </span>
                  <div className="space-y-1.5 text-gray-700">
                    <p>
                      <strong>Name:</strong> {currentUser?.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {currentUser?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {currentUser?.phone || "+91 98123 45678"}
                    </p>
                    <p>
                      <strong>Gotra:</strong> {currentUser?.gotra || "Kashyapa"}
                    </p>
                    <p>
                      <strong>PAN for 80G Exemption:</strong>{" "}
                      <span className="font-mono font-bold text-orange-900">
                        {currentUser?.pan || "ABCDE1234F"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200 space-y-3">
                  <span className="font-bold text-orange-800 uppercase tracking-wider block">
                    Primary Sacred Delivery Address:
                  </span>
                  <div className="space-y-1.5 text-gray-700">
                    <p>{currentUser?.address?.street || "Flat 402, Om Shanti Enclave"}</p>
                    <p>
                      {currentUser?.address?.city || "Varanasi"},{" "}
                      {currentUser?.address?.state || "Uttar Pradesh"} -{" "}
                      {currentUser?.address?.pincode || "221005"}
                    </p>
                    <p className="text-emerald-700 font-semibold text-[11px] pt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified for Express Temple Delivery</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
