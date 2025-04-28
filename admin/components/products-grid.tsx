"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductCard } from "./product-card";
import { ProductForm } from "./product-form";
import { Product } from "../lib/model/product";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface ProductsGridProps {
  category: string;
  adminEmail?: string;
}

export function ProductsGrid({ category, adminEmail }: ProductsGridProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Carousel hook
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 1,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2, spacing: 20 },
      },
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 25 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 30 },
      },
    },
    loop: true,
  });

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `/api/products?category=${encodeURIComponent(category)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      const filtered = adminEmail
        ? data.filter((p: Product) => p.email === adminEmail)
        : data;

      setProducts(filtered);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => setEditingProduct(product);

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const id = productToDelete._id || productToDelete.id;
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(
        products.filter(
          (p) => p._id !== productToDelete._id && p.id !== productToDelete.id
        )
      );
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading products...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (products.length === 0)
    return (
      <div className="text-center py-8">
        No products found in this category.
      </div>
    );

  return (
    <>
      {/* Carousel Controls */}
      <div className="relative py-8">
        {/* Left Arrow */}
        <button
          onClick={() => instanceRef.current?.prev()}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white text-black rounded-full p-2 shadow-md hover:scale-110 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => instanceRef.current?.next()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white text-black rounded-full p-2 shadow-md hover:scale-110 transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Itself */}
        <div ref={sliderRef} className="keen-slider px-6 md:px-16">
          {products.map((product) => (
            <div
              key={product._id?.toString() || product.id}
              className="keen-slider__slide"
            >
              <ProductCard
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
      >
        <DialogContent
          className="w-full max-w-2xl p-4 sm:p-6 md:p-8 bg-white rounded-lg overflow-y-auto"
          style={{ maxHeight: "80vh" }}
        >
          <DialogTitle className="text-center text-2xl mb-6">
            Edit Product
          </DialogTitle>

          {editingProduct && (
            <div className="w-full max-w-md mx-auto">
              <ProductForm
                product={editingProduct}
                onSuccess={() => {
                  setEditingProduct(null);
                  fetchProducts();
                }}
                myHeight="auto"
                onCancel={() => setEditingProduct(null)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{productToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
