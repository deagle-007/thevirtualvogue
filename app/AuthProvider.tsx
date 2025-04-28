"use client"; // Ensure this is a client component

import { UserProvider } from "@auth0/nextjs-auth0/client";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
