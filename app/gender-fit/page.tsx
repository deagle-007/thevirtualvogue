"use client";

import Image from "next/image";
import Link from "next/link";
import "../../styles/globals.css";
import ProtectedNavbar from "@/components/global/protectednavbar";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Loader from "@/components/loader";

export default function GenderFit() {
  const { isLoading } = useProtectedRoute();
  if (isLoading) return <Loader />;
  return (
    <div className="min-h-screen bg-white">
      <ProtectedNavbar />
      {/* Gender Selection */}
      <div className="container mx-auto justify-center px-4 py-8">
        <div style={{ justifyItems: "center" }} className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto justify-center items-center">
          {/* Men Section */}
          <Link
            href="/cloth-fit/male"
            className="group relative flex flex-col items-center justify-center transition duration-300 transform hover:scale-105"
          >
            <div className="relative w-full  overflow-hidden rounded-lg">
              <Image data-aos="fade-down" height={400} width={300} src="/boygender.png" alt="Men's Fashion" className=" h-auto w-[220px] " />
              <div className="absolute inset-0 bg-black/0  transition-all duration-300" />
            </div>
          </Link>
          {/* Women Section */}
          <Link
            href="/cloth-fit/female"
            className="group relative flex flex-col justify-center items-center transition duration-300 transform hover:scale-105"
          >
            <div className="relative w-full  overflow-hidden rounded-lg">
              <Image data-aos="fade-right" height={400} width={300} src="/girlgender.png" alt="Women's Fashion" className=" h-auto w-[190px]" />
              <div className="absolute inset-0 bg-black/0 transition-all duration-300" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
