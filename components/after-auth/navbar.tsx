"use client";

import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Dialog } from "@headlessui/react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Loader from "../loader";

// Navigation Links Configuration
const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Guide", path: "/guide" },
];

// Reusable Navigation Links Component
const NavLinks = ({ onClick }: { onClick?: () => void }) => (
  <>
    {NAV_LINKS.map(({ name, path }) => (
      <Link key={name} href={path} onClick={onClick}>
        <button className="w-[123px] h-[34px] px-6 py-1 rounded-full uppercase bg-black text-white">{name}</button>
      </Link>
    ))}
  </>
);

// Profile Dropdown Component
const ProfileDropdown = () => {
  const { user } = useUser();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user?.picture ?? "https://github.com/shadcn.png"} />
            <AvatarFallback>
              <img src="https://github.com/shadcn.png" alt="User Avatar" />
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4 bg-white shadow-lg">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-16 h-16 mb-2">
            <AvatarImage src={user?.picture ?? "https://github.com/shadcn.png"} />
            <AvatarFallback>
              <img src="https://github.com/shadcn.png" alt="User Avatar" />
            </AvatarFallback>
          </Avatar>
          <p className="text-lg font-semibold truncate w-48">{user?.name}</p>
          <p className="text-sm text-gray-500 truncate w-48">{user?.email}</p>

          <Button className="w-full mt-4 bg-red-500 hover:bg-red-600" asChild>
            <a href="/api/auth/logout">Logout</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Mobile Menu Component
const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <Dialog open={isOpen} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/50" />
    <Dialog.Panel className="fixed top-0 right-0 w-64 h-full bg-white p-6 shadow-lg">
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-4 right-4">
        <AiOutlineClose size={28} />
      </button>

      {/* Navigation Links */}
      <div className="mt-10 flex flex-col space-y-4">
        <NavLinks onClick={onClose} />
        <ProfileDropdown />
      </div>
    </Dialog.Panel>
  </Dialog>
);

// Main Navigation Bar Component
export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();

  if (isLoading) return <Loader />;

  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white font-bold">
          <img src="/logo.svg" alt="Logo" className="w-[200px]" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-2 items-center">
          <NavLinks />
          <ProfileDropdown />
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(true)} className="md:hidden text-white">
          <AiOutlineMenu size={32} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
}
