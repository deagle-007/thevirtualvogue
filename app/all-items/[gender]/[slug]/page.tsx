"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import ProtectedNavbar from "@/components/global/protectednavbar";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/zustand/store";
import { useUser } from "@auth0/nextjs-auth0/client";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { products as staticProducts } from "@/data/product-data";

export default function AllItems() {
  const router = useRouter();
  const { gender, slug } = useParams();
  const { setGarmentImage } = useAppStore();
  const { isLoading: routeLoading } = useProtectedRoute();
  const { user, isLoading: userLoading } = useUser();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryKey = `${gender} ${slug}`;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userLoading && user) {
        const userEmail = user.email;
        const roles: string[] = Array.isArray(
          user?.["https://virtual-fitting-room-eight.vercel.app/roles"]
        )
          ? user["https://virtual-fitting-room-eight.vercel.app/roles"]
          : [];
        const isAdmin = roles.includes("admin");

        if (isAdmin && userEmail) {
          try {
            const response = await fetch(
              `/api/products?category=${categoryKey}`
            );
            const data = await response.json();
            const filtered = data.filter((p: any) => p.email === userEmail);
            setCategoryProducts(filtered);
          } catch (err) {
            console.error("Failed to load admin products:", err);
            setCategoryProducts([]);
          }
        } else {
          setCategoryProducts(staticProducts[categoryKey] || []);
        }

        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [userLoading, user, categoryKey]);

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
        slides: { perView: 4, spacing: 30 },
      },
    },
    loop: true,
  });

  if (routeLoading || userLoading || loadingProducts) return <Loader />;

  return (
    <div className="min-h-screen bg-white">
      <ProtectedNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Top Bar */}
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
                    query: { slug: gender, category: slug }, // ✅ this is what is sent
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

        {/* Carousel Section */}
        <div className="relative w-full">
          {/* Arrows */}
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white text-black rounded-full p-2 shadow-md hover:scale-110 transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white text-black rounded-full p-2 shadow-md hover:scale-110 transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel */}
          <div ref={sliderRef} className="keen-slider px-6 md:px-16">
            {categoryProducts.map((product) => {
              const id = product._id?.toString() || product.id;
              return (
                <div
                  key={id}
                  className="keen-slider__slide min-w-0 flex flex-col items-center"
                >
                  <Link href={`/items/${gender}/${slug}/${id}`}>
                    <div className="bg-[#EDEDED] w-[160px] h-[210px] relative overflow-hidden rounded-2xl flex items-center justify-center mx-auto shadow-md">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={150}
                        height={190}
                        className="object-contain bg-transparent transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-gray-600 transition bebas-font">
                        {product.name}
                      </h3>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
