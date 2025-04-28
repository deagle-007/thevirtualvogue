"use client";

import React, { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation"; // ✅ Using next/navigation for App Router
import Loader from "@/components/loader";

const Auth = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait until authentication status is determined

    if (user) {
      if (window.location.pathname === "/") {
        router.push("/men-women-styles");
      }
    } else {
      // If logged out and not on "/", redirect to "/"
      if (window.location.pathname !== "/") {
        router.push("/");
      }
    }
  }, [user, isLoading]);

  if (isLoading) return <Loader />;
  if (error) return <div>{error.message}</div>;

  return <div></div>;
};

export default Auth;
