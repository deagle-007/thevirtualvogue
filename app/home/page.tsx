"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-fAcQvvm97wpfF4mNk0ikZV5T6IBlda.png')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-transparent p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GpETPLq6qxdcs8dbRk0zPuROU32hVj.png"
                alt="Virtual Vogue"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="flex items-center space-x-8">
              <a href="/home" className="text-white font-medium">
                HOME
              </a>
              <a href="/about" className="text-white font-medium">
                ABOUT
              </a>
              <a href="/admin" className="text-white font-medium">
                EDIT CATALOG
              </a>
              <Link
                href="/gender-fit"
                className="text-white hover:text-gray-300 transition"
              >
                GENDER FIT
              </Link>
              <div className="flex items-center bg-[#8B6E5B] rounded-full px-4 py-2">
                <span className="text-white mr-2">nome</span>
                <span className="text-white bg-[#6D574A] px-2 py-1 rounded-full text-sm">
                  100
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20">
          <div className="max-w-4xl">
            <h1 className="text-white">
              <span className="block font-script text-6xl md:text-7xl mb-4">
                Welcome to
              </span>
              <span className="block text-5xl md:text-7xl font-bold text-[#8B6E5B] mb-4">
                VIRTUAL VOGUE
              </span>
            </h1>
            <p className="text-white text-xl mb-12">
              Where fashion meets technology
            </p>

            {/* Features */}
            <div className="bg-black/40 backdrop-blur-sm rounded-[70px] p-8 mb-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#8B6E5B] text-2xl font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-2">
                      Explore & Experience the Virtual Try-On
                    </h3>
                    <p className="text-white/80">
                      Browse through our catalog and test out the virtual try-on
                      feature. Upload your own photos or take new ones to see
                      how each item looks in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#8B6E5B] text-2xl font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-2">
                      Manage Your Catalog
                    </h3>
                    <p className="text-white/80">
                      Keep your collection fresh and up to date! Easily edit,
                      remove, or add new articles to your catalog. Whether it's
                      a seasonal update or a new trend, you're in control.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#8B6E5B] hover:bg-[#6D574A] text-white px-8 py-6 text-lg rounded-full">
                Browse through Catalogue
              </Button>
              <Button
                variant="outline"
                className="border-[#8B6E5B] text-[#8B6E5B] hover:bg-[#8B6E5B] hover:text-white px-8 py-6 text-lg rounded-full"
              >
                Edit the catalog
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
