import type { ObjectId } from "mongodb";

export interface Product {
  _id?: ObjectId | string;
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  email?: string; // ✅ NEW: to store which admin added it
  role?: string; // ✅ NEW: optional, for audit/logging
}

export type ProductCategory =
  | "male lower_body"
  | "female upper_body"
  | "female lower_body"
  | "male upper_body";

export interface Products {
  [key: string]: Product[];
}
