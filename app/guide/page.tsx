"use client";

import ProtectedNavbar from "@/components/global/protectednavbar";
import { Compass } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <ProtectedNavbar />
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="bg-[#D9D9D9] w-full lg:w-4/5 p-10 rounded-[70px] shadow-md">
          <div className="text-center max-w-3xl mx-auto">
            <Compass className="mx-auto text-green-600 w-10 h-10 mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-gray-800 bebas-font">
              How to Use Virtual Vogue
            </h1>
            <ol className="text-left text-gray-700 text-lg leading-loose list-decimal list-inside">
              <li>
                📤 Upload your garment photo or select from existing items.
              </li>
              <li>👕 Choose your category – tops, bottoms, or full fits.</li>
              <li>
                🧠 Our AI matches it to your image and generates a preview.
              </li>
              <li>🔍 Use zoom to view details, then download or share!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
