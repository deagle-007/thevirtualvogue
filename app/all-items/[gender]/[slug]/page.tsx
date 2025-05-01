"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import ProtectedNavbar from "@/components/global/protectednavbar";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/zustand/store";
import { useUser } from "@auth0/nextjs-auth0/client";

// Static fallback catalogue
import { products as staticProducts } from "@/data/product-data";

export default function AllItems() {
  const router = useRouter();
  const { gender, slug } = useParams();
  const { setGarmentImage } = useAppStore();
  const { isLoading: routeLoading } = useProtectedRoute();
  const { user, isLoading: userLoading } = useUser();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryKey = `${gender} ${slug}`;
  const userEmail = user?.email;
  const roles: string[] = Array.isArray(
    user?.["https://virtual-fitting-room-eight.vercel.app/roles"]
  )
    ? user["https://virtual-fitting-room-eight.vercel.app/roles"]
    : [];
  const isAdmin = roles.includes("admin");

  useEffect(() => {
    if (isAdmin && userEmail) {
      const fetchAdminProducts = async () => {
        try {
          const response = await fetch(`/api/products?category=${categoryKey}`);
          const data = await response.json();
          const filtered = data.filter((p: any) => p.email === userEmail);
          setCategoryProducts(filtered);
        } catch (err) {
          console.error("Failed to load admin products:", err);
          setCategoryProducts([]);
        }
      };
      fetchAdminProducts();
    } else {
      // fallback to static products
      setCategoryProducts(staticProducts[categoryKey] || []);
    }
  }, [categoryKey, isAdmin, userEmail]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGarmentImage = (imageUrl: string) => {
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "garment-image.jpg", { type: blob.type });
        setGarmentImage(file);
      });
  };

  if (routeLoading || userLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-white">
      <ProtectedNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center space-x-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold tracking-wider bebas-font uppercase">
            {gender} APPAREL - {slug === "upper_body" ? "TOPS" : "BOTTOMS"}
          </h1>
        </div>

        {/* Upload Section */}
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center mb-10 p-10 bg-[#D9D9D9] rounded-[70px] w-full lg:w-[80%]">
            {!selectedImage ? (
              <div className="bg-[#f5f5f5] w-full max-w-sm px-6 py-8 rounded-2xl shadow-sm">
                <div
                  className="cursor-pointer p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-10 h-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-lg font-medium text-center">
                    Upload Garment
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center bg-[#e6e6e6] rounded-3xl px-8 py-6 shadow-inner">
                <Image
                  src={selectedImage}
                  alt="Preview"
                  width={260}
                  height={360}
                  className="rounded-xl mb-4 object-contain max-h-[360px]"
                />
                <Link
                  href={{
                    pathname: "/upload-fit",
                    query: { slug: gender, category: slug },
                  }}
                >
                  <Button
                    onClick={() => handleGarmentImage(selectedImage!)}
                    className="bg-black text-white px-8 py-3 rounded-full text-base hover:bg-black/90 transition-all"
                  >
                    Continue
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:px-32 gap-10">
          {categoryProducts.map((product) => {
            const id = product._id?.toString() || product.id;
            return (
              <Link
                key={id}
                href={`/items/${gender}/${slug}/${id}`}
                className="group"
              >
                <div className="bg-[#EDEDED] aspect-[4/5] relative overflow-hidden rounded-3xl flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={220}
                    height={240}
                    className="h-[240px] w-[220px] bg-transparent p-5 transform group-hover:scale-105 transition-transform duration-300 rounded-3xl"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-medium text-gray-900 group-hover:text-gray-600 transition bebas-font">
                    {product.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
