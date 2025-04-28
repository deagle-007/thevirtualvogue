import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Product } from "@/admin/lib/model/product";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || "male lower_body";

    const client = await clientPromise;
    const db = client.db("clothing-store");

    const products = await db
      .collection("products")
      .find({ category })
      .toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = (await request.json()) as Product;

    // Validate required fields
    if (!product.name || !product.price || !product.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("clothing-store");

    // Generate a unique ID if not provided
    if (!product.id) {
      const count = await db
        .collection("products")
        .countDocuments({ category: product.category });
      product.id = (count + 1).toString();
    }

    const result = await db.collection("products").insertOne(product as any);

    return NextResponse.json(
      { message: "Product created successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
