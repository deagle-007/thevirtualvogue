import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("clothing-store");

    // ✅ Extract query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const category = searchParams.get("category");

    // Log both email and category to ensure they are not undefined or null
    console.log("Received email:", email);   // Add this logging
    console.log("Received category:", category);  // Add this logging

    // ✅ Build MongoDB filter dynamically with proper checks
    const filter: Record<string, any> = {};

    // Safe check for email and category before using .startsWith()
    if (email && typeof email === "string" && email.trim() !== "") {
      filter.email = email;
    }

    if (category && typeof category === "string" && category.trim() !== "") {
      filter.category = category;
    }

    // ✅ Fetch filtered products from MongoDB
    const products = await db.collection("products").find(filter).toArray();

    // ✅ Transform products to structured format
    const formattedProducts: Record<string, any[]> = {};

    products.forEach(({ category, id, name, price, image, description, email }) => {
      if (!formattedProducts[category]) {
        formattedProducts[category] = [];
      }
      formattedProducts[category].push({
        id,
        name,
        price,
        image,
        description,
        email, // Optional, useful for debugging
      });
    });

    // Return the formatted products as a JSON response
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
