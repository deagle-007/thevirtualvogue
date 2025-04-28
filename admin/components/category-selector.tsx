"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCategory } from "../lib/model/product";
import { FaTshirt, FaUserTie, FaFemale, FaMale } from "react-icons/fa";

interface CategorySelectorProps {
  activeCategory: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
}

export function CategorySelector({
  activeCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  const categories = [
    { value: "male lower_body", label: "Men's Bottoms", icon: <FaUserTie /> },
    { value: "male upper_body", label: "Men's Tops", icon: <FaTshirt /> },
    {
      value: "female lower_body",
      label: "Women's Bottoms",
      icon: <FaFemale />,
    },
    { value: "female upper_body", label: "Women's Tops", icon: <FaMale /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Card
          key={category.value}
          onClick={() => onCategoryChange(category.value as ProductCategory)}
          className={`cursor-pointer p-4 text-center transition-all ${
            activeCategory === category.value
              ? "border-primary shadow-lg"
              : "border-gray-300"
          }`}
        >
          <CardContent className="flex flex-col items-center space-y-2">
            <div className="text-3xl">{category.icon}</div>
            <span className="font-medium">{category.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
