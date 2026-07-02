import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();

const categoriesData = [
  { name: 'Electronics' },
  { name: 'Clothing' },
  { name: 'Home & Kitchen' },
  { name: 'Books' },
  { name: 'Sports' },
  { name: 'Beauty' },
  { name: 'Automotive' }
];

const seedData = async () => {
  try {
    // Force set Mongo URI if missing in env path relative to script run
    if (!process.env.MONGO_URI) {
      process.env.MONGO_URI = 'mongodb://localhost:27017/product_inventory';
    }

    await connectDB();

    // Clear existing collections to start fresh
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('Database cleared successfully.');

    // Seed categories
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`${createdCategories.length} categories seeded.`);

    // Find category ID helper
    const getCatId = (name) => {
      const found = createdCategories.find((c) => c.name === name);
      return found ? found._id : null;
    };

    // Seed sample products
    const productsData = [
      {
        name: 'Smartphone X1',
        description: 'Latest model with 128GB storage and 5G connectivity.',
        quantity: 15,
        categories: [getCatId('Electronics')],
        isDeleted: false
      },
      {
        name: 'Wireless Noise-Canceling Headphones',
        description: 'Over-ear headphones with superior active noise cancellation.',
        quantity: 8,
        categories: [getCatId('Electronics')],
        isDeleted: false
      },
      {
        name: 'Denim Jacket',
        description: 'Classic blue denim jacket, regular fit, unisex.',
        quantity: 25,
        categories: [getCatId('Clothing')],
        isDeleted: false
      },
      {
        name: 'Cotton T-Shirt Pack',
        description: 'Pack of 3 basic cotton t-shirts (Black, White, Grey).',
        quantity: 40,
        categories: [getCatId('Clothing')],
        isDeleted: false
      },
      {
        name: 'Air Fryer XL',
        description: '5.8-quart digital air fryer with 8 cooking presets.',
        quantity: 12,
        categories: [getCatId('Home & Kitchen')],
        isDeleted: false
      },
      {
        name: 'Ceramic Cookware Set',
        description: 'Non-stick ceramic pots and pans set, 10 pieces.',
        quantity: 6,
        categories: [getCatId('Home & Kitchen')],
        isDeleted: false
      },
      {
        name: 'Coding Bootcamp Survival Guide',
        description: 'A comprehensive handbook for modern software engineers.',
        quantity: 30,
        categories: [getCatId('Books')],
        isDeleted: false
      },
      {
        name: 'Yoga Mat',
        description: 'Eco-friendly high-density yoga mat with carrying strap.',
        quantity: 50,
        categories: [getCatId('Sports'), getCatId('Beauty')],
        isDeleted: false
      },
      {
        name: 'Adjustable Dumbbell Set',
        description: 'Pair of dumbbells adjustable from 5 to 52.5 lbs.',
        quantity: 5,
        categories: [getCatId('Sports')],
        isDeleted: false
      },
      {
        name: 'Hydrating Face Serum',
        description: 'Hyaluronic acid and vitamin B5 for deep skin hydration.',
        quantity: 18,
        categories: [getCatId('Beauty')],
        isDeleted: false
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`${createdProducts.length} products seeded.`);

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
