"use client";

import React, { useState, useRef } from "react";
import { Download, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProtectedNavbar from "@/components/global/protectednavbar";
import { useAppStore } from "@/zustand/store";
import { useRouter } from "next/navigation";

export default function ProductShowcase() {
  const { generated_image } = useAppStore();
  const router = useRouter();

  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const zoomLevel = 1.5;

  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomEnabled || !imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleToggleZoom = () => {
    setZoomEnabled((prev) => !prev);
  };

  const handleDownload = async () => {
    if (!generated_image) return;

    try {
      const response = await fetch(generated_image);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "generated-outfit.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading the image:", error);
      alert("Failed to download the image. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <ProtectedNavbar />
      <div className="container mx-auto py-8 px-6">
        <Card className="bg-[#dddddd] p-8 rounded-2xl shadow-md border border-gray-200">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left Side - Image */}
            <div className="flex flex-col items-center justify-center">
              <div
                ref={imageContainerRef}
                onClick={handleToggleZoom}
                onMouseMove={handleMouseMove}
                className="relative h-[440px] w-full max-w-[500px] bg-white rounded-xl overflow-hidden shadow-sm cursor-zoom-in transition"
              >
                {generated_image ? (
                  <>
                    <img
                      src={generated_image}
                      alt="Generated Outfit"
                      className="w-full h-full object-contain"
                    />
                    {zoomEnabled && (
                      <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                          backgroundImage: `url(${generated_image})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                          backgroundSize: `${zoomLevel * 100}%`,
                        }}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-center">Loading...</p>
                )}
              </div>

              {/* Info Text */}
              <div className="mt-4 px-4 py-1 bg-black text-white text-xs rounded-full select-none shadow">
                {zoomEnabled
                  ? "Click image to disable zoom"
                  : "Click image to enable zoom"}
              </div>
            </div>

            {/* Right Side - Info */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                Generated Outfit
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                This is your AI-generated outfit. Click the button below to
                download your image and return to home if you'd like to try
                another combination.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                <Button onClick={handleDownload} className="w-full md:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full md:w-auto border-gray-300"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
