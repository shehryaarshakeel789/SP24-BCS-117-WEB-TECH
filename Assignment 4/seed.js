const mongoose = require("mongoose");
const Product = require("./models/products");

mongoose.connect("mongodb://localhost:27017/ecommerce", {
}).then(() => {
    console.log("MongoDB connected for seeding");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
});

const sampleProducts = [
    { name: "Nike Air Max 90", category: "Shoes", price: 129.99, rating: 4.5, stock: 15, imagePath: "/uploads/spotlight-row-1-image-1.png" },
    { name: "Nike Air Force 1", category: "Shoes", price: 99.99, rating: 4.7, stock: 20, imagePath: "/uploads/spotlight-row-1-image-2.png" },
    { name: "Nike React Infinity", category: "Shoes", price: 159.99, rating: 4.3, stock: 10, imagePath: "/uploads/spotlight-row-1-image-3.png" },
    { name: "Nike Pegasus 38", category: "Shoes", price: 119.99, rating: 4.6, stock: 25, imagePath: "/uploads/spotlight-row-1-image-4.png" },
    { name: "Nike ZoomX Vaporfly", category: "Shoes", price: 249.99, rating: 4.8, stock: 5, imagePath: "/uploads/spotlight-row-1-image-5.png" },
    { name: "Nike Court Legacy", category: "Shoes", price: 89.99, rating: 4.2, stock: 30, imagePath: "/uploads/spotlight-row-1-image-6.png" },
    { name: "Nike Revolution 6", category: "Shoes", price: 69.99, rating: 4.4, stock: 40, imagePath: "/uploads/spotlight-row-1-image-7.png" },
    { name: "Nike Blazer Mid", category: "Shoes", price: 109.99, rating: 4.5, stock: 18, imagePath: "/uploads/spotlight-row-1-image-8.png" },
    
    { name: "Nike Dri-FIT T-Shirt", category: "Apparel", price: 34.99, rating: 4.4, stock: 50, imagePath: "/uploads/spotlight-row-2-image-1.png" },
    { name: "Nike Sportswear Hoodie", category: "Apparel", price: 74.99, rating: 4.5, stock: 40, imagePath: "/uploads/spotlight-row-2-image-2.png" },
    { name: "Nike Running Shorts", category: "Apparel", price: 44.99, rating: 4.3, stock: 35, imagePath: "/uploads/spotlight-row-2-image-3.png" },
    { name: "Nike Tech Fleece Joggers", category: "Apparel", price: 99.99, rating: 4.6, stock: 28, imagePath: "/uploads/spotlight-row-2-image-4.png" },
    { name: "Nike Essential Leggings", category: "Apparel", price: 59.99, rating: 4.4, stock: 32, imagePath: "/uploads/spotlight-row-2-image-5.png" },
    { name: "Nike Windrunner Jacket", category: "Apparel", price: 119.99, rating: 4.5, stock: 18, imagePath: "/uploads/spotlight-row-2-image-6.png" },
    { name: "Nike Polo Shirt", category: "Apparel", price: 54.99, rating: 4.3, stock: 25, imagePath: "/uploads/spotlight-row-2-image-7.png" },
    { name: "Nike Cargo Pants", category: "Apparel", price: 89.99, rating: 4.2, stock: 20, imagePath: "/uploads/spotlight-row-2-image-8.png" },
    
    { name: "Nike Training Backpack", category: "Accessories", price: 64.99, rating: 4.3, stock: 22, imagePath: "/uploads/1779146319587-spotlight-row-1-image-1.png" },
    { name: "Nike Crew Socks", category: "Accessories", price: 14.99, rating: 4.2, stock: 100, imagePath: "/uploads/1779146376650-spotlight-row-1-image-2.png" },
];

async function seedDatabase() {
    try {
        await Product.deleteMany({});
        const result = await Product.insertMany(sampleProducts);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seedDatabase();
