import React, { useState, useMemo, useEffect } from "react";
import { useInventory } from "../context/InventoryContext";
import { ProductCategory, Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { OmSymbol, LotusIcon, DiyaIcon, TempleIcon } from "../components/SacredIcons";
import { Search, SlidersHorizontal, Sparkles, X, Check, BookOpen, Shirt, Gift, ShieldCheck, Heart } from "lucide-react";

interface StorePageProps {
  navigate: (path: string) => void;
  initialCategory?: string | null;
}

export const StorePage: React.FC<StorePageProps> = ({ navigate, initialCategory }) => {
  const { products, categories } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    document.title = "Sanatan Seva Store | Sanatan Dharma Seva Trust";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Shop devotional, spiritual and Sanatan-inspired products from Sanatan Dharma Seva Trust. 100% authentic Vedic items supporting sacred seva."
      );
    }
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }
      // In stock filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesCat;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      // default: featured first then id
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy, inStockOnly]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Puja & Devotional":
        return <DiyaIcon className="w-3.5 h-3.5" />;
      case "Rudraksha & Malas":
        return <Sparkles className="w-3.5 h-3.5" />;
      case "Hindu Books":
        return <BookOpen className="w-3.5 h-3.5" />;
      case "Hindu Symbols":
        return <OmSymbol className="w-3.5 h-3.5" />;
      case "Temple & Home Decor":
        return <TempleIcon className="w-3.5 h-3.5" />;
      case "Sanatan Merchandise":
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case "Clothing":
        return <Shirt className="w-3.5 h-3.5" />;
      case "Gifts":
        return <Gift className="w-3.5 h-3.5" />;
      default:
        return <LotusIcon className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div id="store-page-root" className="min-h-screen bg-[#fdfbf7] pb-20">
      {/* =========================================================================
          STORE HERO SECTION - Natural Tones
          ========================================================================= */}
      <section className="mandala-bg border-b border-gray-200/80 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 text-orange-800 text-xs font-bold uppercase tracking-widest border border-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Sanatan Seva Store</span>
          </div>

          <h1 className="marcellus text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            SANATAN SEVA STORE
          </h1>

          <p className="text-base sm:text-lg text-gray-700 italic max-w-xl mx-auto font-serif">
            "Spiritual products. Cultural values. Meaningful living."
          </p>

          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto font-sans leading-relaxed pt-1">
            Every sacred purchase directly supports our community Gaushalas, Sadhu Annadaan, and Vedic education programs.
          </p>

          {/* Quick Search in Hero */}
          <div className="pt-4 max-w-lg mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="store-hero-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brass idols, rudraksha malas, Bhagavad Gita, puja items..."
                className="w-full pl-11 pr-10 py-3 bg-white text-gray-900 rounded-full text-xs sm:text-sm font-sans border border-gray-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CATEGORY PILLS & FILTER STRIP
          ========================================================================= */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Categories Horizontal Scroll with pill-btn styling */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 scroll-smooth">
            <button
              id="cat-btn-all"
              onClick={() => setSelectedCategory("All")}
              className={`pill-btn shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                selectedCategory === "All"
                  ? "active"
                  : "bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              <LotusIcon className="w-3.5 h-3.5" />
              <span>All Products ({products.length})</span>
            </button>

            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const count = products.filter((p) => p.category === category).length;
              return (
                <button
                  key={category}
                  id={`cat-btn-${category.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  onClick={() => setSelectedCategory(category)}
                  className={`pill-btn shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "active"
                      : "bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                  <span className={`text-[10px] opacity-80`}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Sort & In-stock toggle */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
            <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-orange-600 focus:ring-orange-500"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* =========================================================================
            FEATURED PRODUCTS SHOWCASE (When viewing "All" and no search)
            ========================================================================= */}
        {selectedCategory === "All" && !searchQuery && (
          <section id="featured-products-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-5 bg-[#f97316] rounded-full" />
                <h2 className="marcellus text-xl sm:text-2xl font-bold text-gray-900">
                  Featured Sacred Artifacts
                </h2>
              </div>
              <span className="text-xs text-orange-600 font-bold uppercase tracking-wider">
                Blessed & Consecrated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            ALL FILTERED PRODUCTS CATALOG GRID
            ========================================================================= */}
        <section id="products-catalog-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200">
            <div>
              <h2 className="marcellus text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>{selectedCategory === "All" ? "Complete Store Catalog" : selectedCategory}</span>
                <span className="text-sm font-sans font-normal text-gray-500">
                  ({filteredProducts.length} items)
                </span>
              </h2>
              {searchQuery && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Showing search results for: <span className="font-semibold text-gray-800">"{searchQuery}"</span>
                </p>
              )}
            </div>

            {(selectedCategory !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="text-xs text-orange-600 hover:text-orange-800 font-medium underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-md mx-auto space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="marcellus text-lg font-bold text-gray-800">
                No Spiritual Products Found
              </h3>
              <p className="text-xs text-gray-500">
                We couldn't find items matching your search criteria. Try selecting another category or resetting the search.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="px-4 py-2 pill-btn active rounded-full text-xs font-bold"
              >
                View All Products
              </button>
            </div>
          )}
        </section>

        {/* =========================================================================
            TRUST SACRED GUARANTEE BANNER
            ========================================================================= */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <OmSymbol className="w-7 h-7" />
            </div>
            <div>
              <h3 className="marcellus text-lg font-bold text-gray-900">
                Sanatan Seva Quality & Consecration Promise
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
                All Rudrakshas are lab-certified, metals are pure grade brass and panchdhatu, and books are printed with traditional Sanskrit accuracy.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/donate")}
            className="shrink-0 px-5 py-2.5 rounded-full buy-btn text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
          >
            <span>Learn About Trust Seva</span>
            <span>&rarr;</span>
          </button>
        </section>
      </div>
    </div>
  );
};
