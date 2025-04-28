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

    // ✅ Build MongoDB filter dynamically
    const filter: Record<string, any> = {};
    if (email) filter.email = email;
    if (category) filter.category = category;

    // ✅ Fetch filtered products
    const products = await db.collection("products").find(filter).toArray();

    // ✅ Transform to structured format
    const formattedProducts: Record<string, any[]> = {};

    products.forEach(
      ({ category, id, name, price, image, description, email }) => {
        if (!formattedProducts[category]) {
          formattedProducts[category] = [];
        }
        formattedProducts[category].push({
          id,
          name,
          price,
          image,
          description,
          email, // optional: useful for debug
        });
      }
    );

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
