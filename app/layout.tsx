import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./AuthProvider";
import { AOSProvider } from "@/components/global/aos-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Virtual Vogue",
  description: "Virtual Vogue",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}>
        <AuthProvider>
          <AOSProvider>{children}</AOSProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
