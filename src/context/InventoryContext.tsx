import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductCategory } from "../types";
import { products as initialProducts, STORE_CATEGORIES } from "../data/products";

interface InventoryContextType {
  products: Product[];
  categories: ProductCategory[];
  updateProduct: (id: string, updates: Partial<Product>) => { success: boolean; message: string };
  addProduct: (product: Product) => { success: boolean; message: string };
  deleteProduct: (id: string) => { success: boolean; message: string };
  resetProductsToDefault: () => void;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const INVENTORY_STORAGE_KEY = "sanatan_seva_store_inventory_v1";

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error loading products from localStorage", e);
    }
    return initialProducts;
  });

  useEffect(() => {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error("Failed to save inventory to localStorage", e);
    }
  }, [products]);

  const updateProduct = (id: string, updates: Partial<Product>) => {
    let found = false;
    setProducts((prevProducts) =>
      prevProducts.map((item) => {
        if (item.id === id) {
          found = true;
          return {
            ...item,
            ...updates,
            // ensure price is numeric
            price: updates.price !== undefined ? Number(updates.price) : item.price,
            originalPrice:
              updates.originalPrice !== undefined
                ? Number(updates.originalPrice)
                : item.originalPrice,
            stock: updates.stock !== undefined ? Number(updates.stock) : item.stock,
          };
        }
        return item;
      })
    );

    if (found) {
      return { success: true, message: `Product updated successfully!` };
    }
    return { success: false, message: `Product not found.` };
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    return { success: true, message: `Added "${newProduct.name}" to inventory!` };
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    return { success: true, message: "Product deleted from inventory." };
  };

  const resetProductsToDefault = () => {
    setProducts(initialProducts);
    try {
      localStorage.removeItem(INVENTORY_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        categories: STORE_CATEGORIES,
        updateProduct,
        addProduct,
        deleteProduct,
        resetProductsToDefault,
        getProductById,
        getProductBySlug,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
