import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useInventory } from "../context/InventoryContext";
import { useCart } from "../context/CartContext";
import { Product, ProductCategory, CartItem } from "../types";
import { OmSymbol, LotusIcon, DiyaIcon } from "../components/SacredIcons";
import {
  ShieldCheck,
  Edit3,
  Trash2,
  Plus,
  Save,
  Upload,
  RotateCcw,
  Search,
  ShoppingBag,
  Package,
  DollarSign,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Tag,
  Layers,
  ArrowRight,
  TrendingUp,
  Percent,
} from "lucide-react";

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}


const resizeImageForStore = (file: File, maxSize = 1400, quality = 0.82): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select an image file."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("The selected image could not be processed."));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Image processing is not supported in this browser."));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { currentUser, isAdmin, logout, orders } = useAuth();
  const { products, categories, updateProduct, addProduct, deleteProduct, resetProductsToDefault } =
    useInventory();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    adminSetCartItemPrice,
    adminRemoveCartItemPriceOverride,
    adminAddProductToCart,
    subtotal,
    discount,
    shipping,
    finalTotal,
    promoCode,
  } = useCart();

  const [activeTab, setActiveTab] = useState<"products" | "cart" | "orders">("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Selected product for editing modal / drawer
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // New product creation state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    name: "",
    slug: "",
    description: "",
    price: 499,
    originalPrice: 799,
    category: "Puja & Devotional",
    stock: 25,
    featured: false,
    image: "/products/brass-diya.jpg",
  });

  // Admin Quick Cart Edit State
  const [selectedAddProductId, setSelectedAddProductId] = useState<string>("");
  const [addQty, setAddQty] = useState<number>(1);
  const [customPriceInput, setCustomPriceInput] = useState<string>("");

  useEffect(() => {
    document.title = "Admin Portal - Inventory & Cart Editor | Sanatan Seva Store";
  }, []);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Filter products for admin table
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Save edited product
  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name.trim()) {
      showStatus("error", "Product name cannot be empty.");
      return;
    }
    if (editingProduct.price <= 0) {
      showStatus("error", "Product price must be greater than zero.");
      return;
    }

    const res = updateProduct(editingProduct.id, {
      name: editingProduct.name,
      description: editingProduct.description,
      price: Number(editingProduct.price),
      originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
      category: editingProduct.category,
      stock: Number(editingProduct.stock),
      featured: editingProduct.featured,
      image: editingProduct.image,
    });

    if (res.success) {
      showStatus("success", `Updated "${editingProduct.name}" price (₹${editingProduct.price}) and description successfully!`);
      setEditingProduct(null);
    } else {
      showStatus("error", res.message);
    }
  };

  // Create new product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) {
      showStatus("error", "Product name and price are required.");
      return;
    }

    const slug =
      newProductForm.slug?.trim() ||
      newProductForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newProd: Product = {
      id: `custom-${Date.now()}`,
      name: newProductForm.name,
      slug: slug,
      description: newProductForm.description || "Authentic spiritual item from Sanatan Dharma Seva Trust.",
      price: Number(newProductForm.price),
      originalPrice: newProductForm.originalPrice ? Number(newProductForm.originalPrice) : undefined,
      category: (newProductForm.category as ProductCategory) || "Puja & Devotional",
      stock: Number(newProductForm.stock || 20),
      featured: Boolean(newProductForm.featured),
      image: newProductForm.image || "/products/brass-diya.jpg",
      rating: 5.0,
      reviewsCount: 1,
    };

    const res = addProduct(newProd);
    if (res.success) {
      showStatus("success", res.message);
      setIsAddingNew(false);
      setNewProductForm({
        name: "",
        slug: "",
        description: "",
        price: 499,
        originalPrice: 799,
        category: "Puja & Devotional",
        stock: 25,
        featured: false,
        image: "/products/brass-diya.jpg",
      });
    }
  };

  // Add item to active cart from admin panel
  const handleAdminAddToCart = () => {
    if (!selectedAddProductId) {
      showStatus("error", "Please select a product from the list.");
      return;
    }
    const product = products.find((p) => p.id === selectedAddProductId);
    if (!product) return;

    const parsedPrice = customPriceInput.trim() !== "" ? Number(customPriceInput) : undefined;
    adminAddProductToCart(product, Math.max(1, addQty), parsedPrice);
    showStatus("success", `Added "${product.name}" to cart with quantity ${addQty}.`);
    setCustomPriceInput("");
    setAddQty(1);
  };

  return (
    <div id="admin-dashboard-root" className="min-h-screen bg-[#fdfbf7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#7c2d12] text-amber-200 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full">
                  Admin Control Panel
                </span>
                <span className="text-xs text-gray-500 font-mono">Live Sync</span>
              </div>
              <h1 className="marcellus text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Store & Cart Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Logged in as <strong>{currentUser?.name || "Sanatan Store Admin"}</strong> ({currentUser?.email || "admin@sanatantrust.org"})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/store")}
              className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:text-orange-600 hover:border-orange-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all bg-white"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Store</span>
            </button>

            <button
              onClick={() => navigate("/store/cart")}
              className="px-4 py-2 rounded-full border border-orange-300 text-orange-800 bg-orange-50 hover:bg-orange-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>View Cart Page ({cart.length})</span>
            </button>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-4 py-2 rounded-full bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-3 shadow-xs animate-in slide-in-from-top-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                : "bg-red-50 text-red-900 border-red-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 space-x-2 sm:space-x-4">
          <button
            id="admin-tab-products"
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "products"
                ? "border-orange-600 text-orange-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            id="admin-tab-cart"
            onClick={() => setActiveTab("cart")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "cart"
                ? "border-orange-600 text-orange-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Active Cart Editor ({cart.length} items)</span>
          </button>

          <button
            id="admin-tab-orders"
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "orders"
                ? "border-orange-600 text-orange-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            id="admin-tab-security"
            onClick={() => setActiveTab("security" as any)}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              (activeTab as any) === "security"
                ? "border-orange-600 text-orange-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Supabase Security & RLS</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: PRODUCTS INVENTORY & LIVE PRICE/DESCRIPTION EDITOR
            ========================================================================= */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Action & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or description..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter products by category"
                  className="px-3 py-1.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium text-gray-700"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  id="admin-add-new-product-btn"
                  onClick={() => {
                    setIsAddingNew(true);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm("Reset all products back to default trust catalog? Custom changes will be restored.")) {
                      resetProductsToDefault();
                      showStatus("success", "Inventory reset to default catalog.");
                    }
                  }}
                  title="Reset to default seed data"
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add New Product Form Panel */}
            {isAddingNew && (
              <div className="bg-amber-50/60 rounded-3xl border-2 border-amber-300 p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-700" />
                    <h3 className="marcellus text-lg font-bold text-gray-900">
                      Add New Product to Store
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsAddingNew(false)}
                    className="text-xs text-gray-500 hover:text-gray-800 font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider block">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      placeholder="e.g. Copper Havan Kund with Stand"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider block">Category *</label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as ProductCategory })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase tracking-wider block">Price (₹) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newProductForm.price}
                        onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase tracking-wider block">Original MRP (₹)</label>
                      <input
                        type="number"
                        min="1"
                        value={newProductForm.originalPrice}
                        onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: Number(e.target.value) })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase tracking-wider block">Stock Units</label>
                      <input
                        type="number"
                        min="0"
                        value={newProductForm.stock}
                        onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase tracking-wider block">Featured Tag</label>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="featured-check"
                          checked={newProductForm.featured}
                          onChange={(e) => setNewProductForm({ ...newProductForm, featured: e.target.checked })}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <label htmlFor="featured-check" className="text-gray-700 font-medium">
                          Highlight on Store Home
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider block">Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={newProductForm.description}
                      onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                      placeholder="Detailed spiritual description, material authenticity, and sacred use..."
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider shadow-xs"
                    >
                      Save Product to Store
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Inline Product Edit Modal / Drawer */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-orange-200">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                        <Edit3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="marcellus text-xl font-bold text-gray-900">
                          Edit Product: {editingProduct.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Modify price, description, stock count, and catalog attributes.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase tracking-wider block">
                        Product Title / Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full p-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-orange-700 uppercase tracking-wider block">
                          Current Price (₹) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500 font-bold">₹</span>
                          <input
                            type="number"
                            required
                            min="1"
                            value={editingProduct.price}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                            }
                            className="w-full pl-7 pr-3 py-2.5 bg-orange-50/50 border border-orange-300 rounded-xl font-bold text-orange-950 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-700 uppercase tracking-wider block">
                          Original MRP (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                          <input
                            type="number"
                            min="1"
                            value={editingProduct.originalPrice || ""}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                originalPrice: e.target.value ? Number(e.target.value) : undefined,
                              })
                            }
                            className="w-full pl-7 pr-3 py-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-700 uppercase tracking-wider block">
                          Inventory Stock
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={editingProduct.stock}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                          }
                          className="w-full p-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700 uppercase tracking-wider block">
                          Category
                        </label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              category: e.target.value as ProductCategory,
                            })
                          }
                          className="w-full p-2.5 bg-[#fdfbf7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-700 uppercase tracking-wider block">
                          Featured Status
                        </label>
                        <div className="flex items-center gap-2 pt-2.5">
                          <input
                            type="checkbox"
                            id="edit-featured-check"
                            checked={editingProduct.featured}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, featured: e.target.checked })
                            }
                            className="w-4 h-4 text-orange-600 rounded"
                          />
                          <label htmlFor="edit-featured-check" className="text-gray-700 font-medium">
                            Show in Featured Store Carousel
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Product Image Editor */}
                    <div className="space-y-3 rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <label className="font-bold text-gray-700 uppercase tracking-wider block">
                            Product Image
                          </label>
                          <p className="text-[10px] text-gray-500 mt-1">
                            Upload a new image or paste an image URL. The image is resized before being saved.
                          </p>
                        </div>
                        {editingProduct.image && (
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-orange-200 bg-white shrink-0">
                            <img
                              src={editingProduct.image}
                              alt={`${editingProduct.name} preview`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="cursor-pointer">
                          <span className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors">
                            <Upload className="w-4 h-4" />
                            {isImageUploading ? "Processing image..." : "Upload New Image"}
                          </span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="sr-only"
                            disabled={isImageUploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (!file) return;

                              if (file.size > 8 * 1024 * 1024) {
                                showStatus("error", "Image is too large. Please choose an image under 8 MB.");
                                return;
                              }

                              setIsImageUploading(true);
                              try {
                                const dataUrl = await resizeImageForStore(file);
                                setEditingProduct((current) =>
                                  current ? { ...current, image: dataUrl } : current
                                );
                                showStatus("success", "Product image updated in the editor. Click Save & Apply Updates.");
                              } catch (error: any) {
                                showStatus("error", error?.message || "Could not process the image.");
                              } finally {
                                setIsImageUploading(false);
                              }
                            }}
                          />
                        </label>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                            Image URL
                          </label>
                          <input
                            type="url"
                            value={editingProduct.image?.startsWith("data:") ? "" : (editingProduct.image || "")}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, image: e.target.value.trim() })
                            }
                            placeholder="/products/my-product.jpg or https://..."
                            className="mt-1 w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-xs"
                          />
                        </div>
                      </div>

                      {editingProduct.image?.startsWith("data:") && (
                        <p className="text-[10px] text-emerald-700 font-semibold">
                          ✓ New uploaded image selected. Save the product to apply it.
                        </p>
                      )}
                    </div>

                    {/* Rich Description Editor */}
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase tracking-wider block">
                        Item Description *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        placeholder="Enter full descriptive product specifications..."
                        className="w-full p-3 bg-[#fdfbf7] border border-gray-300 rounded-xl leading-relaxed focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                      <p className="text-[10px] text-gray-500">
                        Changes will be immediately visible across the Store, Product Detail pages, and Shopping Cart.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${editingProduct.name}"?`)) {
                            deleteProduct(editingProduct.id);
                            showStatus("success", `Deleted "${editingProduct.name}" from store.`);
                            setEditingProduct(null);
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Item</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl buy-btn text-white font-bold uppercase tracking-wider shadow-sm flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save & Apply Updates</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="marcellus text-lg font-bold text-gray-900">
                    Active Catalog Items ({filteredProducts.length})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Click "Edit Details & Price" to adjust any product's pricing or description.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fdfbf7] text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="py-3.5 px-4">Item</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price (₹)</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => {
                      const discountPct = product.originalPrice
                        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                        : 0;

                      return (
                        <tr key={product.id} className="hover:bg-orange-50/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-orange-100 overflow-hidden shrink-0 border border-orange-200/60 flex items-center justify-center text-orange-700">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <OmSymbol className="w-5 h-5" />
                                )}
                              </div>
                              <div className="max-w-xs sm:max-w-md">
                                <span className="font-bold text-gray-900 block truncate">
                                  {product.name}
                                </span>
                                <p className="text-[11px] text-gray-500 line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium text-[10px]">
                              {product.category}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-orange-700 text-sm">
                                ₹{product.price.toLocaleString("en-IN")}
                              </span>
                              {product.originalPrice && (
                                <span className="text-[10px] text-gray-400 line-through">
                                  MRP ₹{product.originalPrice} ({discountPct}% OFF)
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`font-semibold ${
                                product.stock > 10
                                  ? "text-emerald-700"
                                  : product.stock > 0
                                  ? "text-amber-600"
                                  : "text-red-600"
                              }`}
                            >
                              {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            {product.featured ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                <Sparkles className="w-3 h-3" /> Featured
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400">Standard</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold text-xs flex items-center gap-1 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Details & Price</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ACTIVE CART EDITOR & OVERRIDES (ADMIN CART MANAGER)
            ========================================================================= */}
        {activeTab === "cart" && (
          <div className="space-y-6">
            {/* Cart Controller Hero */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="marcellus text-xl font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-orange-600" />
                    <span>Live Cart Items & Pricing Manager</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Directly modify cart quantities, override item pricing for patrons/devotees, or add store products.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => clearCart()}
                    className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold uppercase tracking-wider"
                  >
                    Clear All Cart Items
                  </button>
                  <button
                    onClick={() => navigate("/store/cart")}
                    className="px-4 py-1.5 rounded-xl buy-btn text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Open Customer Cart &rarr;
                  </button>
                </div>
              </div>

              {/* Admin Cart Item Injector Form */}
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs space-y-3">
                <span className="font-bold text-orange-950 uppercase tracking-wider block">
                  Add Item Directly to Cart (with optional Custom Admin Price Override):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <select
                      value={selectedAddProductId}
                      onChange={(e) => setSelectedAddProductId(e.target.value)}
                      aria-label="Select product to add to cart"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs"
                    >
                      <option value="">-- Select Product from Inventory --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Catalog: ₹{p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="number"
                      min="1"
                      placeholder="Quantity (e.g. 1)"
                      value={addQty}
                      onChange={(e) => setAddQty(Math.max(1, Number(e.target.value)))}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      min="0"
                      placeholder="Override Price (₹) [Optional]"
                      value={customPriceInput}
                      onChange={(e) => setCustomPriceInput(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAdminAddToCart}
                    className="px-5 py-2 rounded-xl bg-[#7c2d12] hover:bg-orange-950 text-white font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Insert Item into Cart</span>
                  </button>
                </div>
              </div>

              {/* Cart Table with Inline Price & Qty Adjustments */}
              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm">Active Cart is Currently Empty</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Use the product injector above or browse the store to add devotional items to the cart.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#fdfbf7] text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Standard Price</th>
                        <th className="py-3 px-4">Admin Price Override</th>
                        <th className="py-3 px-4">Quantity</th>
                        <th className="py-3 px-4">Item Total</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cart.map((item) => {
                        const effectivePrice =
                          item.customPriceOverride !== undefined
                            ? item.customPriceOverride
                            : item.product.price;
                        const itemTotal = effectivePrice * item.quantity;

                        return (
                          <tr key={item.product.id} className="hover:bg-orange-50/30">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-orange-100 overflow-hidden shrink-0">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                </div>
                                <span className="font-bold text-gray-900">{item.product.name}</span>
                              </div>
                            </td>

                            <td className="py-3 px-4 text-gray-600 font-mono">
                              ₹{item.product.price}
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="relative w-24">
                                  <span className="absolute left-2 top-1.5 text-gray-500 font-bold text-xs">₹</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={item.customPriceOverride !== undefined ? item.customPriceOverride : ""}
                                    placeholder={String(item.product.price)}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (val === "") {
                                        adminRemoveCartItemPriceOverride(item.product.id);
                                      } else {
                                        adminSetCartItemPrice(item.product.id, Number(val));
                                      }
                                    }}
                                    className="w-full pl-5 pr-2 py-1 bg-white border border-orange-300 rounded-lg text-xs font-bold text-orange-900"
                                  />
                                </div>
                                {item.customPriceOverride !== undefined && (
                                  <button
                                    onClick={() => adminRemoveCartItemPriceOverride(item.product.id)}
                                    title="Reset to standard price"
                                    className="text-[10px] text-orange-700 underline"
                                  >
                                    Reset
                                  </button>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 font-bold text-xs flex items-center justify-center"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuantity(item.product.id, Math.max(1, Number(e.target.value)))
                                  }
                                  className="w-12 text-center py-0.5 border border-gray-300 rounded-md text-xs font-bold"
                                />
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 font-bold text-xs flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td className="py-3 px-4 font-bold text-orange-800 font-mono">
                              ₹{itemTotal.toLocaleString("en-IN")}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Cart Totals Summary */}
              {cart.length > 0 && (
                <div className="bg-[#fdfbf7] p-4 sm:p-6 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-700">
                      Items in Cart: <strong className="text-gray-900">{cart.reduce((a, b) => a + b.quantity, 0)}</strong>
                    </span>
                    {promoCode && (
                      <span className="bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full font-bold">
                        Coupon: {promoCode} (-₹{discount})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-gray-500">Calculated Final Total: </span>
                      <span className="marcellus text-lg font-bold text-orange-900">
                        ₹{finalTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: CUSTOMER ORDERS VIEW
            ========================================================================= */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="marcellus text-xl font-bold text-gray-900">
                  Customer Orders & Tax Receipts ({orders.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Review verified customer purchases and trust dispatch statuses.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="p-5 rounded-2xl bg-[#fdfbf7] border border-gray-200 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/60 pb-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-orange-800">
                        Order #{order.orderId}
                      </span>
                      <span className="text-gray-500 ml-2">Placed: {order.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                        {order.status}
                      </span>
                      <span className="font-bold text-gray-900 text-sm">
                        ₹{order.pricing.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-bold text-gray-700 block">Customer Information:</span>
                      <p className="text-gray-600">
                        {order.customer.fullName} ({order.customer.phone})
                      </p>
                      <p className="text-gray-500 text-[11px]">
                        {order.customer.address}, {order.customer.city}, {order.customer.state} -{" "}
                        {order.customer.pincode}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-gray-700 block">Items Purchased:</span>
                      <ul className="space-y-1 text-gray-600 text-[11px]">
                        {order.items.map((it, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>
                              {it.quantity}x {it.product.name}
                            </span>
                            <span className="font-mono font-medium">
                              ₹{(it.product.price * it.quantity).toLocaleString("en-IN")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SUPABASE SECURITY & RLS AUDIT PANEL
            ========================================================================= */}
        {(activeTab as any) === "security" && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in-50">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="marcellus text-xl font-bold text-gray-900">
                    Supabase Authentication & Row-Level Security (RLS)
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Active security rules protecting Sanatan Trust inventory, pricing integrity, and devotee orders.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase">
                JWT & RLS Guard Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/70 space-y-1">
                <span className="text-[10px] uppercase font-bold text-orange-700 tracking-wider block">
                  Admin Authorization
                </span>
                <h4 className="text-sm font-bold text-gray-900">Full Inventory & Cart Access</h4>
                <p className="text-xs text-gray-600">
                  Only authenticated users with <code className="text-orange-900 bg-white px-1 py-0.5 rounded font-mono text-[10px]">role = 'admin'</code> can modify prices, edit descriptions, and perform cart item overrides.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                  Devotee Privacy Isolation
                </span>
                <h4 className="text-sm font-bold text-gray-900">RLS User Policy</h4>
                <p className="text-xs text-gray-600">
                  Customers can only read and insert their own orders (<code className="text-emerald-900 bg-white px-1 py-0.5 rounded font-mono text-[10px]">auth.uid() = user_id</code>), preventing cross-user data exposure.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-600 tracking-wider block">
                  Encrypted Session
                </span>
                <h4 className="text-sm font-bold text-gray-900">Auto-Refreshed JWT</h4>
                <p className="text-xs text-gray-600">
                  Secure cryptographic token session persistence via Supabase Auth client with automatic token refreshing.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl p-4 bg-[#fdfbf7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Environment Configuration
                </span>
                <span className="text-xs text-gray-500 font-mono">.env.example</span>
              </div>
              <p className="text-xs text-gray-600">
                To connect to your own Supabase project, specify <code className="bg-white px-1.5 py-0.5 border rounded font-mono text-orange-800 font-bold">VITE_SUPABASE_URL</code> and <code className="bg-white px-1.5 py-0.5 border rounded font-mono text-orange-800 font-bold">VITE_SUPABASE_ANON_KEY</code> in project settings. The app automatically boots the live Supabase client.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
