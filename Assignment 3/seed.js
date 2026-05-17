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
    { name: "Nike Air Max 90", category: "Shoes", price: 129.99, rating: 4.5, stock: 15 },
    { name: "Nike Air Force 1", category: "Shoes", price: 99.99, rating: 4.7, stock: 20 },
    { name: "Nike React Infinity", category: "Shoes", price: 159.99, rating: 4.3, stock: 10 },
    { name: "Nike Pegasus 38", category: "Shoes", price: 119.99, rating: 4.6, stock: 25 },
    { name: "Nike ZoomX Vaporfly", category: "Shoes", price: 249.99, rating: 4.8, stock: 5 },
    { name: "Nike Court Legacy", category: "Shoes", price: 89.99, rating: 4.2, stock: 30 },
    { name: "Nike Revolution 6", category: "Shoes", price: 69.99, rating: 4.4, stock: 40 },
    { name: "Nike Blazer Mid", category: "Shoes", price: 109.99, rating: 4.5, stock: 18 },
    
    { name: "Nike Dri-FIT T-Shirt", category: "Apparel", price: 34.99, rating: 4.4, stock: 50 },
    { name: "Nike Sportswear Hoodie", category: "Apparel", price: 74.99, rating: 4.5, stock: 40 },
    { name: "Nike Running Shorts", category: "Apparel", price: 44.99, rating: 4.3, stock: 35 },
    { name: "Nike Tech Fleece Joggers", category: "Apparel", price: 99.99, rating: 4.6, stock: 28 },
    { name: "Nike Essential Leggings", category: "Apparel", price: 59.99, rating: 4.4, stock: 32 },
    { name: "Nike Windrunner Jacket", category: "Apparel", price: 119.99, rating: 4.5, stock: 18 },
    { name: "Nike Polo Shirt", category: "Apparel", price: 54.99, rating: 4.3, stock: 25 },
    { name: "Nike Cargo Pants", category: "Apparel", price: 89.99, rating: 4.2, stock: 20 },
    
    { name: "Nike Training Backpack", category: "Accessories", price: 64.99, rating: 4.3, stock: 22 },
    { name: "Nike Crew Socks", category: "Accessories", price: 14.99, rating: 4.2, stock: 100 },
    { name: "Nike Swoosh Cap", category: "Accessories", price: 29.99, rating: 4.1, stock: 45 },
    { name: "Nike Sports Watch", category: "Accessories", price: 199.99, rating: 4.6, stock: 12 },
    { name: "Nike Water Bottle", category: "Accessories", price: 34.99, rating: 4.3, stock: 60 },
    { name: "Nike Gym Bag", category: "Accessories", price: 79.99, rating: 4.4, stock: 20 },
    { name: "Nike Headband", category: "Accessories", price: 19.99, rating: 4.1, stock: 50 },
    { name: "Nike Wristbands", category: "Accessories", price: 14.99, rating: 4.0, stock: 70 },
    
    { name: "Nike Basketball", category: "Sports Gear", price: 149.99, rating: 4.5, stock: 8 },
    { name: "Nike Training Gloves", category: "Sports Gear", price: 49.99, rating: 4.4, stock: 24 },
    { name: "Nike Resistance Bands", category: "Sports Gear", price: 39.99, rating: 4.2, stock: 30 },
    { name: "Nike Yoga Mat", category: "Sports Gear", price: 64.99, rating: 4.3, stock: 16 },
    { name: "Nike Jump Rope", category: "Sports Gear", price: 24.99, rating: 4.1, stock: 40 },
    { name: "Nike Soccer Ball", category: "Sports Gear", price: 119.99, rating: 4.4, stock: 10 },
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
