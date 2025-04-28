"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product, ProductCategory } from "../lib/model/product";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
  myHeight?: any;
}

export function ProductForm({
  product,
  onSuccess,
  onCancel,
  myHeight = "auto",
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: "",
      price: 0,
      image: "",
      description: "",
      category: "male lower_body",
    }
  );

  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image || null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as ProductCategory,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Show preview immediately
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      // Start upload
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      // Update form data with Cloudinary URL
      setFormData((prev) => ({
        ...prev,
        image: data.secure_url,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
      setImagePreview(product?.image || null);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = product?._id
        ? `${process.env.NEXT_PUBLIC_BACKENDURL}/api/products/${product._id}`
        : `${process.env.NEXT_PUBLIC_BACKENDURL}/api/products`;

      const method = product?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(imagePreview, "imagePreview");

  return (
    <Card className={`w-full max-w-md mx-auto bg-white h-[${myHeight}]`}>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (in cents)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex flex-col items-center justify-center gap-4">
              {imagePreview ? (
                <div className="relative flex justify-center items-center w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    className="object-contain h-[200px] w-[200px]"
                    height={200}
                    width={200}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleImageClick}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition"
                >
                  <Upload className="h-20 w-20 p-5 text-gray-400 mb-4 mt-4 " />
                  <p className="text-sm text-gray-500">
                    Click to upload product image
                  </p>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {uploadingImage && (
                <p className="text-sm text-blue-500">Uploading image...</p>
              )}

              {!imagePreview && formData.image && (
                <div className="text-sm text-gray-500">
                  Current image URL: {formData.image}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male lower_body">Men's Bottoms</SelectItem>
                <SelectItem value="male upper_body">Men's Tops</SelectItem>
                <SelectItem value="female lower_body">
                  Women's Bottoms
                </SelectItem>
                <SelectItem value="female upper_body">Women's Tops</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || uploadingImage}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || uploadingImage}>
            {isLoading ? "Saving..." : "Save Product"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
