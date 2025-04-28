"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Loader from "../loader";

const ProtectedNavbar = () => {
  const { user, isLoading } = useUser();
  const [open, setOpen] = useState(false); // State to toggle profile popup

  if (isLoading) return <Loader />;

  const userRoles = user?.["https://virtual-fitting-room-eight.vercel.app/roles"] || [];

  return (
    <div>
      <nav className="p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/men-women-styles">
            <Image src="/logo.svg" alt="Virtual Vogue" width={150} height={150} className="object-contain" />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/men-women-styles" className="text-gray-800 hover:text-gray-600 transition text-[20px] bebas-font hidden md:flex">
              Home
            </Link>
            <Link href="/about" className="text-gray-800 hover:text-gray-600 transition text-[20px] bebas-font hidden md:flex">
              About
            </Link>
            <Link href="/guide" className="text-gray-800 hover:text-gray-600 transition text-[20px] bebas-font hidden md:flex">
              Guide
            </Link>
            {/* Profile Dropdown */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.picture ? user?.picture : "https://github.com/shadcn.png"} />
                    <AvatarFallback>
                      <img src={"https://github.com/shadcn.png"} alt="" />
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-64 p-4">
                <div className="flex flex-col items-center text-center">
                  {/* User Avatar */}
                  <Avatar className="w-16 h-16 mb-2">
                    <AvatarImage src={user?.picture ? user?.picture : "https://github.com/shadcn.png"} />
                    <AvatarFallback>
                      <img src={"https://github.com/shadcn.png"} alt="" />
                    </AvatarFallback>
                  </Avatar>

                  {/* User Details */}
                  <p className="text-lg font-semibold truncate w-48">{user?.name}</p>
                  <p className="text-sm text-gray-500 truncate w-48">{user?.email}</p>

                  {/* Logout Button */}

                  <Button className="w-full mt-4 bg-red-500 hover:bg-red-600" asChild>
                    <a href="/api/auth/logout">Logout</a>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ProtectedNavbar;
