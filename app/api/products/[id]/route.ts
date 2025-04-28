import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const client = await clientPromise;
    const db = client.db("clothing-store");

    let product;
    if (ObjectId.isValid(id)) {
      product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    } else {
      product = await db.collection("products").findOne({ id });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updateData = await request.json();
    const { _id, ...dataToUpdate } = updateData; // Exclude _id from update

    const client = await clientPromise;
    const db = client.db("clothing-store");

    let result;
    if (ObjectId.isValid(id)) {
      result = await db.collection("products").updateOne({ _id: new ObjectId(id) }, { $set: dataToUpdate });
    } else {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const client = await clientPromise;
    const db = client.db("clothing-store");

    let result;
    if (ObjectId.isValid(id)) {
      result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    } else {
      result = await db.collection("products").deleteOne({ id });
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
