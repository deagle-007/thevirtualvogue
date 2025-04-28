"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CategorySelector } from "@/admin/components/category-selector";
import { ProductsGrid } from "@/admin/components/products-grid";
import { ProductCategory } from "@/admin/lib/model/product";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function AdminDashboard() {
  const [activeCategory, setActiveCategory] =
    useState<ProductCategory>("male lower_body");

  const { user, isLoading: userLoading } = useUser();

  // ✅ Role extraction from custom claim
  const roles: string[] = Array.isArray(
    user?.["https://virtual-fitting-room-eight.vercel.app/roles"]
  )
    ? user?.["https://virtual-fitting-room-eight.vercel.app/roles"]
    : [];

  const isAdmin = roles.includes("admin");
  const userEmail: string = user?.email || "";

  const getCategoryTitle = (category: ProductCategory): string => {
    switch (category) {
      case "male lower_body":
        return "Men's Bottoms";
      case "male upper_body":
        return "Men's Tops";
      case "female lower_body":
        return "Women's Bottoms";
      case "female upper_body":
        return "Women's Tops";
      default:
        return "Products";
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Unauthorized</h2>
          <p className="text-sm text-gray-500">
            You must be an admin to access this page.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 text-sm underline"
          >
            Go back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-10 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <Link href="/men-women-styles">
          <Image
            src="/logo.svg"
            alt="Virtual Vogue"
            width={180}
            height={180}
            className="object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>
        <Link href={`/add-product?category=${activeCategory}`}>
          <Button className="bg-black text-white px-6 py-3 text-lg rounded-lg shadow-md transition hover:bg-black/80">
            + Add New Product
          </Button>
        </Link>
      </div>

      {/* Category Selector */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Categories
        </h2>
        <CategorySelector
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </section>

      {/* Product Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 pb-2">
          {getCategoryTitle(activeCategory)}
        </h2>
        <div style={{ height: 30 }} />

        {/* ✅ Only show products belonging to this admin's email */}
        <ProductsGrid
          category={activeCategory}
          key={activeCategory}
          adminEmail={userEmail}
        />
      </section>
    </main>
  );
}
