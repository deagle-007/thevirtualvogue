import clientPromise from "@/lib/mongodb";
import { Product, ProductCategory } from "../lib/model/product";

const products = {
  "male lower_body": [
    {
      id: "1",
      name: "Textured Trousers",
      price: 5990,
      image: "/cloths/men-lower/menlower1.png",
      description:
        "Premium textured trousers designed for style and comfort. Featuring a tailored fit, these trousers are perfect for office wear or casual outings.",
      category: "male lower_body",
    },
    {
      id: "2",
      name: "Slim Fit Jeans",
      price: 6990,
      image: "/cloths/men-lower/menlower2.png",
      description:
        "Modern slim-fit jeans crafted with stretchable fabric for flexibility and ease of movement. Designed to maintain a sleek and sharp look throughout the day.",
      category: "male lower_body",
    },
    {
      id: "3",
      name: "Cotton Chinos",
      price: 4990,
      image: "/cloths/men-lower/menlower3.png",
      description:
        "Soft and durable cotton chinos offering a balance of elegance and casual style. Ideal for pairing with shirts or t-shirts for any occasion.",
      category: "male lower_body",
    },
    {
      id: "4",
      name: "Classic Cargo Pants",
      price: 5500,
      image: "/cloths/men-lower/i1.png",
      description:
        "A rugged and functional pair of cargo pants featuring multiple pockets and a relaxed fit. Perfect for outdoor activities or casual everyday wear.",
      category: "male lower_body",
    },
    {
      id: "5",
      name: "Athletic Joggers",
      price: 4500,
      image: "/cloths/men-lower/i2.png",
      description: "Comfortable and stylish joggers with an elastic waistband and tapered fit. Designed for both workouts and relaxed casual wear.",
      category: "male lower_body",
    },
    {
      id: "6",
      name: "Tailored Dress Pants",
      price: 7000,
      image: "/cloths/men-lower/i3.png",
      description:
        "Sophisticated dress pants with a slim-fit cut, ideal for formal occasions or business meetings. Crafted from premium fabric for a polished look.",
      category: "male lower_body",
    },
    {
      id: "7",
      name: "Denim Shorts",
      price: 3900,
      image: "/cloths/men-lower/i4.png",
      description: "Classic denim shorts with a modern cut. Perfect for warm weather and casual outings, offering both comfort and a stylish edge.",
      category: "male lower_body",
    },
    {
      id: "8",
      name: "Relaxed-Fit Sweatpants",
      price: 4200,
      image: "/cloths/men-lower/i5.png",
      description: "Soft and cozy sweatpants designed for ultimate comfort. A great choice for lounging at home or light workouts.",
      category: "male lower_body",
    },
  ],
  "female upper_body": [
    {
      id: "1",
      name: "Chiffon Ruffle Blouse",
      price: 5200,
      image: "/cloths/female-top/femaletop1.png",
      description:
        "An elegant chiffon blouse featuring delicate ruffle details. Ideal for both office wear and evening occasions, offering a sophisticated and feminine touch.",
      category: "female upper_body",
    },
    {
      id: "2",
      name: "Sleeveless Cotton Top",
      price: 3700,
      image: "/cloths/female-top/femaletop2.png",
      description: "A soft and breathable sleeveless top made from premium cotton. Designed for warm weather, ensuring comfort and effortless style.",
      category: "female upper_body",
    },
    {
      id: "3",
      name: "Floral Printed Blouse",
      price: 4900,
      image: "/cloths/female-top/femaletop3.png",
      description:
        "A charming floral blouse with a flowy silhouette. Perfect for brunches, casual outings, or semi-formal gatherings with a touch of elegance.",
      category: "female upper_body",
    },
    {
      id: "4",
      name: "Relaxed Fit V-Neck Tee",
      price: 3600,
      image: "/cloths/female-top/i1.png",
      description:
        "A relaxed fit V-neck tee designed for everyday comfort. Made from soft cotton, making it a versatile and essential wardrobe staple.",
      category: "female upper_body",
    },
    {
      id: "5",
      name: "Casual Polo Shirt",
      price: 4200,
      image: "/cloths/female-top/i2.png",
      description: "A stylish and comfortable polo shirt with a casual yet polished design. Perfect for daily wear or casual office looks.",
      category: "female upper_body",
    },
    {
      id: "6",
      name: "Classic Crewneck Tee",
      price: 3200,
      image: "/cloths/female-top/i3.png",
      description: "A classic crewneck tee made from soft and durable fabric. A must-have for layering or wearing on its own in any season.",
      category: "female upper_body",
    },
    {
      id: "7",
      name: "Striped Buttoned Henley",
      price: 3900,
      image: "/cloths/female-top/i4.png",
      description: "A stylish striped Henley top with button details. A great blend of casual and trendy, making it an everyday favorite.",
      category: "female upper_body",
    },
    {
      id: "8",
      name: "Trendy Color Block Tee",
      price: 3800,
      image: "/cloths/female-top/i5.png",
      description: "A trendy color block tee made from lightweight and breathable fabric. Perfect for making a statement while staying comfortable.",
      category: "female upper_body",
    },
  ],
  "female lower_body": [
    {
      id: "1",
      name: "Elegant Pleated Skirt",
      price: 5400,
      image: "/cloths/female-lower/femalelower1.png",
      description:
        "A classic pleated skirt that enhances movement with a graceful flow. Designed for both formal and casual occasions with a flattering high-waist fit.",
      category: "female lower_body",
    },
    {
      id: "2",
      name: "Chic Wide-Leg Pants",
      price: 6200,
      image: "/cloths/female-lower/femalelower2.png",
      description:
        "Fashionable wide-leg pants made from breathable fabric for ultimate comfort. A versatile choice for office wear or casual outings.",
      category: "female lower_body",
    },
    {
      id: "3",
      name: "High-Rise Skinny Jeans",
      price: 5900,
      image: "/cloths/female-lower/femalelower3.png",
      description:
        "A stylish pair of high-rise skinny jeans that sculpts and flatters. Crafted with premium stretch denim for a perfect balance of comfort and style.",
      category: "female lower_body",
    },
    {
      id: "4",
      name: "Casual Linen Shorts",
      price: 3800,
      image: "/cloths/female-lower/i1.png",
      description: "Relaxed-fit linen shorts designed for warm days. Lightweight and breathable, making them a go-to choice for summer outfits.",
      category: "female lower_body",
    },
    {
      id: "5",
      name: "Denim A-Line Skirt",
      price: 4800,
      image: "/cloths/female-lower/i2.png",
      description: "A modern denim A-line skirt featuring a comfortable high waist and a sleek silhouette. Ideal for creating casual yet chic looks.",
      category: "female lower_body",
    },
    {
      id: "6",
      name: "Tailored Straight-Leg Trousers",
      price: 5500,
      image: "/cloths/female-lower/i3.png",
      description:
        "Elegant straight-leg trousers with a tailored fit. A wardrobe staple that effortlessly transitions from workwear to evening outings.",
      category: "female lower_body",
    },
    {
      id: "7",
      name: "Flared Palazzo Pants",
      price: 5700,
      image: "/cloths/female-lower/i4.png",
      description: "Flowy and lightweight palazzo pants offering a sophisticated yet relaxed look. Perfect for both casual and semi-formal styling.",
      category: "female lower_body",
    },
    {
      id: "8",
      name: "Sporty Jogger Pants",
      price: 4000,
      image: "/cloths/female-lower/i5.png",
      description:
        "A pair of comfy jogger pants with a relaxed fit, designed for active days or lounging at home. Made from soft and flexible fabric for ease of movement.",
      category: "female lower_body",
    },
  ],
  "male upper_body": [
    {
      id: "1",
      name: "Striped Button-Up Shirt",
      price: 5990,
      image: "/cloths/men-top/mentop1.png",
      description:
        "A sophisticated button-up shirt with textured stripes, suitable for both casual and semi-formal occasions. Crafted from premium breathable fabric for all-day comfort.",
      category: "male upper_body",
    },
    {
      id: "2",
      name: "Graphic Print Tee",
      price: 3490,
      image: "/cloths/men-top/mentop2.png",
      description:
        "A classic cotton t-shirt featuring a unique graphic print and a relaxed fit. Perfect for everyday wear, whether you're out and about or relaxing at home.",
      category: "male upper_body",
    },
    {
      id: "3",
      name: "Pocket Tee",
      price: 3490,
      image: "/cloths/men-top/mentop3.png",
      description: "A lightweight cotton tee with a minimalist design and a handy chest pocket. Ideal for layering or wearing alone on warm days.",
      category: "male upper_body",
    },
    {
      id: "4",
      name: "Casual V-Neck Tee",
      price: 3490,
      image: "/cloths/men-top/i1.png",
      description: "A casual and lightweight V-neck tee made from soft cotton. Its simple design makes it versatile for various casual settings.",
      category: "male upper_body",
    },
    {
      id: "5",
      name: "Printed Polo Shirt",
      price: 3990,
      image: "/cloths/men-top/i2.png",
      description:
        "A printed polo shirt crafted from comfortable cotton, featuring a stylish print that adds a touch of sophistication to your casual wardrobe.",
      category: "male upper_body",
    },
    {
      id: "6",
      name: "Basic Crewneck Tee",
      price: 2990,
      image: "/cloths/men-top/i3.png",
      description:
        "A basic crewneck tee made from lightweight cotton for everyday comfort. Its simplicity makes it a versatile staple in any wardrobe.",
      category: "male upper_body",
    },
    {
      id: "7",
      name: "Striped Henley Tee",
      price: 3490,
      image: "/cloths/men-top/i4.png",
      description:
        "A striped Henley tee crafted from soft cotton, offering a blend of casual style and comfort. Perfect for layering or wearing on its own.",
      category: "male upper_body",
    },
    {
      id: "8",
      name: "Color Block Tee",
      price: 3490,
      image: "/cloths/men-top/i5.png",
      description:
        "A color block tee made from breathable cotton, featuring a modern design that stands out. Ideal for casual outings and everyday wear.",
      category: "male upper_body",
    },
  ],
};

export async function seedDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db("clothing-store");

    // Clear existing products
    await db.collection("products").deleteMany({});

    // Insert all products
    const allProducts: any = [];

    Object.keys(products).forEach((category) => {
      products[category as ProductCategory].forEach((product) => {
        allProducts.push({
          ...product,
          category: category as ProductCategory,
        });
      });
    });

    if (allProducts.length > 0) {
      await db.collection("products").insertMany(allProducts);
      console.log(`Inserted ${allProducts.length} products`);
    }

    return { success: true, count: allProducts.length };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, error };
  }
}
