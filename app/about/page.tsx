"use client";

import ProtectedNavbar from "@/components/global/protectednavbar";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <ProtectedNavbar />
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="bg-[#D9D9D9] w-full lg:w-4/5 p-10 rounded-[70px] shadow-md">
          <div className="text-center max-w-3xl mx-auto">
            <Info className="mx-auto text-gray-600 w-10 h-10 mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-gray-800 bebas-font">
              About Virtual Vogue
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              Virtual Vogue is your smart fitting room, letting you try on
              clothing virtually with AI. Whether it's a casual tee or a
              designer outfit, you can mix and match styles, upload garments,
              and get a realistic preview on your own image—without stepping
              out!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
