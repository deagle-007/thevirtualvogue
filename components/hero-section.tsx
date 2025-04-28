"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const images = ["/home 2.jpg", "/home 1.jpg"];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const headingColor = currentImageIndex === 0 ? "#805d2f" : "#14B8A6";
  const buttonBgColor = currentImageIndex === 0 ? "#805d2f" : "#14B8A6";
  const corporateButtonColor = "#6b7280"; // Grey color for corporate login

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            currentImageIndex === index ? "opacity-100 z-0" : "opacity-0 z-0"
          }`}
          style={{ backgroundImage: `url('${image}')` }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Content */}
      <div className="relative h-full flex items-end justify-center z-20 pb-10">
        <div className="flex w-full justify-center items-center px-6 md:px-8">
          <h1 className="text-white w-full max-w-[580px] rounded-[43px] p-6 opacity-80 bg-[#3F3932] transition-all duration-1000">
            {/* Bringing the */}
            <i
              className="block font-script text-6xl md:text-7xl mb-4 itallic-font font-bold text-left transition-colors duration-1000"
              style={{ color: headingColor }}
            >
              Bringing the
            </i>

            {/* FITTING ROOM */}
            <div className="mt-6 mb-6">
              <span className="block text-5xl md:text-7xl font-bold bebas-font text-center text-white">
                FITTING ROOM
              </span>
            </div>

            {/* to you */}
            <span
              className="block font-script text-7xl md:text-7xl itallic-font font-bold text-right transition-colors duration-1000 -mt-4 mr-12"
              style={{ color: headingColor }}
            >
              to you
            </span>

            {/* Two Buttons Side by Side */}
            <div className="flex justify-center gap-4 mt-8 w-full flex-wrap">
              {/* Normal User Login */}
              <Link
                href="/api/auth/login"
                className="flex-1 min-w-[140px] max-w-[220px]"
              >
                <Button
                  className="w-full rounded-full font-bold text-white text-lg py-6 px-8 transition-transform duration-300 transform hover:scale-105"
                  style={{ backgroundColor: buttonBgColor }}
                >
                  Login to Try-on!
                </Button>
              </Link>

              {/* Corporate Login */}
              <Link
                href="/api/auth/login"
                className="flex-1 min-w-[140px] max-w-[220px]"
              >
                <Button
                  className="w-full rounded-full font-bold text-white text-lg py-6 px-8 transition-transform duration-300 transform hover:scale-105"
                  style={{ backgroundColor: corporateButtonColor }}
                >
                  Login as Corporate
                </Button>
              </Link>
            </div>
          </h1>
        </div>
      </div>
    </section>
  );
}
