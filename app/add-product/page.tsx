"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/admin/components/product-form";
import { ProductCategory } from "@/admin/lib/model/product";
import { useAppStore } from "@/zustand/store"; // ✅ Import global store

export default function AddProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category =
    (searchParams.get("category") as ProductCategory) || "male lower_body";

  const { user: auth0User } = useUser();
  const { user, setUser } = useAppStore();

  // ✅ Sync Auth0 user with Zustand store
  useEffect(() => {
    if (auth0User) {
      const roleClaim = "https://virtual-fitting-room-eight.vercel.app/roles";
      const role =
        Array.isArray(auth0User[roleClaim]) &&
        auth0User[roleClaim].includes("admin")
          ? "admin"
          : "individual";

      setUser({ ...auth0User, role });
    }
  }, [auth0User, setUser]);

  const userEmail = user?.email || "";
  const userRole = user?.role || "individual";

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/admin">
          <Button variant="outline">← Back to Admin Dashboard</Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">Add New Product</h1>

      <ProductForm
        product={{
          category,
          name: "",
          price: 0,
          image: "",
          description: "",
          id: "",
          email: userEmail, // ✅ Email is included
          role: userRole, // ✅ Role is included (optional)
        }}
        onSuccess={() => router.push("/admin")}
        onCancel={() => router.push("/admin")}
      />
    </div>
  );
}
