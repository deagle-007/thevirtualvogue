"use client";

import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import Link from "next/link";
import { useAppStore } from "@/zustand/store";

const images = ["/home 2.jpg", "/home 1.jpg"];

const categories = [
  {
    label: "MENS TOPS",
    path: "/all-items/male/upper_body",
    slug: "upper body of men",
  },
  {
    label: "MENS BOTTOMS",
    path: "/all-items/male/lower_body",
    slug: "lower body of men",
  },
  {
    label: "WOMEN TOPS",
    path: "/all-items/female/upper_body",
    slug: "upper body of women",
  },
  {
    label: "WOMEN BOTTOMS",
    path: "/all-items/female/lower_body",
    slug: "lower body of women",
  },
];

// 🔁 Button Component that adapts to image index
const CategoryButton = ({
  label,
  path,
  slug,
  currentImageIndex,
}: {
  label: string;
  path: string;
  slug: string;
  currentImageIndex: number;
}) => {
  const { setGarmentDescription } = useAppStore();

  const handleSetGarment = () => {
    setGarmentDescription(slug);
  };

  // 🟡 Yellowish on image 0, 🟦 Teal on image 1
  const backgroundColor = currentImageIndex === 0 ? "#805d2f" : "#032629";

  return (
    <Link onClick={handleSetGarment} href={path}>
      <div
        className="cursor-pointer text-white rounded-[43px] p-3 opacity-80 w-[140px] h-[140px] flex justify-center items-center sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] hover:scale-110 hover:opacity-100 transform transition-all duration-500 ease-in-out"
        style={{ backgroundColor }}
      >
        <span className="text-center text-white text-sm sm:text-base leading-tight block">
          {label.split(" ").map((word, i) => (
            <span key={i} className="block">
              {word}
            </span>
          ))}
        </span>
      </div>
    </Link>
  );
};

export function HeroSection({ roles }: any) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full">
      {/* Background Images */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 bg-cover bg-top transition-opacity duration-1000 ${
              currentImageIndex === index ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url('${image}')`,
              zIndex: currentImageIndex === index ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Category Buttons */}
      <div className="relative h-full flex items-end justify-center z-20 pb-[150px]">
        <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-6">
          {categories.map((category) => (
            <CategoryButton
              key={category.label}
              label={category.label}
              path={category.path}
              slug={category.slug}
              currentImageIndex={currentImageIndex}
            />
          ))}
        </div>
      </div>

      {/* Admin Catalog Edit Button */}
      {roles.includes("admin") && (
        <div className="fixed bottom-5 right-5 z-50">
          <Link href="/admin">
            <button className="flex items-center gap-2 h-[40px] px-4 sm:px-6 py-2 rounded-full bg-black text-white uppercase shadow-lg hover:bg-gray-800 transition text-sm sm:text-base">
              <FiEdit size={18} />
              Edit Catalog
            </button>
          </Link>
        </div>
      )}
    </section>
  );
}
