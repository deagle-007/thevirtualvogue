"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAppStore } from "@/zustand/store";
import { Button } from "@/components/ui/button";
import axios from "axios";
import ProtectedNavbar from "@/components/global/protectednavbar";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL: any = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category"); // ✅ Read from URL

  const {
    garment_image,
    human_image,
    garment_description,
    category,
    denoise_steps,
    seed,
    number_of_images,
    setGeneratedImage,
    setCategory, // ✅ Import setter
  } = useAppStore();

  const [loading, setLoading] = useState(false);

  // ✅ If Zustand category is missing, restore from URL
  useEffect(() => {
    if (!category && urlCategory) {
      setCategory(urlCategory === "lower_body" ? "lower_body" : "upper_body");
    }
  }, [category, urlCategory, setCategory]);

  const handleApiCall = async () => {
    if (!garment_image || !human_image) {
      alert("Please upload both images before proceeding.");
      return;
    }

    const formData = new FormData();
    formData.append("garment_image", garment_image);
    formData.append("human_image", human_image);
    formData.append(
      "garment_description",
      garment_description.replace(/"/g, "")
    );
    formData.append("category", category); // ✅ Now reliably set
    formData.append("denoise_steps", denoise_steps.toString());
    formData.append("seed", seed.toString());
    formData.append("number_of_images", number_of_images.toString());

    try {
      setLoading(true);
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.images?.length > 0) {
        const base64Image = response.data.images[0];
        const imageUrl = `data:image/png;base64,${base64Image}`;
        setGeneratedImage(imageUrl);
        router.push("/download-image");
      } else {
        alert("No image received from API!");
      }
    } catch (error) {
      console.error("Error calling API:", error);
      alert("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ProtectedNavbar />
      <div className="flex flex-col items-center justify-center p-10">
        <div className="container mx-auto flex justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-2xl font-bold tracking-wider bebas-font">
              Go Back
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {garment_image ? (
            <div className="flex justify-center items-center flex-col">
              <div className="bg-[#D9D9D9] lg:h-[320px] lg:w-[400px] relative flex justify-center items-center rounded-[70px] shadow-2xl">
                <Image
                  src={URL.createObjectURL(garment_image)}
                  alt={"garment"}
                  height={300}
                  width={300}
                  className="h-[250px] w-auto bg-[#E1E1E1]"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No garment image uploaded</p>
          )}

          {human_image ? (
            <div className="flex justify-center items-center flex-col">
              <div className="bg-[#D9D9D9] lg:h-[320px] lg:w-[400px] relative flex justify-center items-center rounded-[70px] shadow-2xl">
                <Image
                  src={URL.createObjectURL(human_image)}
                  alt={"human"}
                  height={300}
                  width={300}
                  className="h-[250px] w-auto bg-[#E1E1E1]"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No human image uploaded</p>
          )}
        </div>

        {/* API Call Button */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <Button
            onClick={handleApiCall}
            disabled={loading}
            className={`mt-8 text-white text-lg px-10 py-3 h-[50px] rounded-full shadow-lg ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-black/80"
            }`}
          >
            {loading ? "Processing..." : "Try On Outfit"}
          </Button>
        )}
      </div>
    </div>
  );
};

// Wrap the component with Suspense
const SuspenseWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
};

export default SuspenseWrapper;
