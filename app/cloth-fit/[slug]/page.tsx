"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedNavbar from "@/components/global/protectednavbar";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Loader from "@/components/loader";
import { useAppStore } from "@/zustand/store";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { products as staticProducts } from "@/data/product-data";

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const gender = params?.gender?.toString();
  const slug = params?.slug?.toString();
  const id = params?.id?.toString();

  const { setGarmentImage, setCategory } = useAppStore();
  const { isLoading: authLoading } = useProtectedRoute();
  const { user, isLoading: userLoading } = useUser();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  const roles: string[] = Array.isArray(
    user?.["https://virtual-fitting-room-eight.vercel.app/roles"]
  )
    ? user["https://virtual-fitting-room-eight.vercel.app/roles"]
    : [];

  const isAdmin = roles.includes("admin");
  const userEmail = user?.email || "";

  useEffect(() => {
    const fetchProduct = async () => {
      if (!gender || !slug || !id) return;

      const key = `${gender} ${slug}`;

      if (isAdmin && userEmail) {
        try {
          const res = await fetch(`/api/products/${id}`);
          const data = await res.json();
          if (res.ok && data.email === userEmail) {
            setProduct(data);
          } else {
            // fallback to static if ID doesn't belong to this admin
            const fallback = staticProducts[key]?.find(
              (item) => item.id === id
            );
            setProduct(fallback || null);
          }
        } catch (err) {
          console.error("Error fetching admin product:", err);
          setProduct(null);
        }
      } else {
        // Static catalogue for non-admins
        const productList = staticProducts[key] || [];
        const match = productList.find((item) => item.id === id);
        setProduct(match || null);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [gender, slug, id, isAdmin, userEmail]);

  const handleGarmentImage = () => {
    if (slug === "upper_body" || slug === "lower_body") {
      setCategory(slug);
    }

    fetch(product.image)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "garment-image.jpg", { type: blob.type });
        setGarmentImage(file);
      });
  };

  if (authLoading || userLoading || loading) return <Loader />;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl font-semibold bebas-font text-gray-700">
          Product Not Found
        </h1>
        <p className="text-gray-500">
          Sorry, the requested product does not exist.
        </p>
        <Button onClick={() => router.back()} className="mt-4 bebas-font">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ProtectedNavbar />
      <div className="container mx-auto">
        <div className="flex items-center justify-center space-x-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold tracking-wider bebas-font uppercase">
            Go Back
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 justify-center items-center lg:pl-20 lg:pr-20">
          <div className="flex justify-center items-center flex-col">
            <div className="bg-[#D9D9D9] lg:h-[320px] lg:w-[400px] relative flex justify-center items-center rounded-[70px] shadow-2xl">
              <Image
                src={product.image}
                alt={product.name}
                height={300}
                width={300}
                className="h-[290px] p-7 lg:p-2 w-auto object-contain"
              />
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xl font-medium bebas-font">
              {slug === "upper_body" ? "TOPS" : "BOTTOMS"}
            </p>
            <h1 className="text-2xl font-medium bebas-font">{product.name}</h1>
            <p className="text-xl font-medium bebas-font">
              {product.description}
            </p>
            <Link href={`/upload-fit?slug=${gender}&category=${slug}`}>
              <Button
                className="w-full h-[50px] bebas-font rounded-[70px]"
                size="lg"
                onClick={handleGarmentImage}
              >
                Try On Virtually
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
