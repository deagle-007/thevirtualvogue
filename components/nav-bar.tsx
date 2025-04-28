"use client";

import { useState } from "react";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Dialog } from "@headlessui/react";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white font-bold">
          <img src="/logo.svg" alt="Logo" className="w-[200px]" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-2 items-center">
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Guide", path: "/guide" },
          ].map((item) => (
            <Link key={item.name} href={item.path}>
              <button className="w-[123px] h-[34px] px-6 py-1 rounded-full uppercase bg-black text-white">{item.name}</button>
            </Link>
          ))}
          <Link href="/api/auth/login">
            <button className="w-[123px] h-[34px] px-6 py-1 rounded-full uppercase bg-black text-white">Login</button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(true)} className="md:hidden text-white">
          <AiOutlineMenu size={32} />
        </button>
      </div>

      {/* Mobile Drawer (Sidebar) */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" />
        <Dialog.Panel className="fixed top-0 right-0 w-64 h-full bg-white p-6 shadow-lg">
          {/* Close Button */}
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4">
            <AiOutlineClose size={28} />
          </button>

          {/* Mobile Navigation Links */}
          <div className="mt-10 flex flex-col space-y-4">
            {[
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
              { name: "Guide", path: "/guide" },
            ].map((item) => (
              <Link key={item.name} href={item.path} onClick={() => setIsOpen(false)}>
                <button className="w-full h-[40px] rounded-full uppercase bg-black text-white">{item.name}</button>
              </Link>
            ))}
            <Link href="/api/auth/login" onClick={() => setIsOpen(false)}>
              <button className="w-full h-[40px] rounded-full uppercase bg-black text-white">Login</button>
            </Link>
          </div>
        </Dialog.Panel>
      </Dialog>
    </nav>
  );
}
