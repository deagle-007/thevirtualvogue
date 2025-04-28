"use client";

import { HeroSection } from "@/components/after-auth/home-section";
import { NavBar } from "@/components/after-auth/navbar";
import { useUser } from "@auth0/nextjs-auth0/client";
import React from "react";

const MenWomenStyles = () => {
  const { user } = useUser();
  const roles: string[] = Array.isArray(user?.["https://virtual-fitting-room-eight.vercel.app/roles"])
    ? user?.["https://virtual-fitting-room-eight.vercel.app/roles"]
    : [];

  return (
    <div>
      <NavBar />
      <HeroSection roles={roles} />
    </div>
  );
};

export default MenWomenStyles;
