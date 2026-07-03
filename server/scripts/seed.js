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
    // Fallback if ENV is not loaded
    if (!process.env.MONGO_URI) {
      process.env.MONGO_URI = 'mongodb://localhost:27017/product_inventory';
    }

    await connectDB();

    // Clear old collections
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('Database cleared successfully.');

    // Seed Categories
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`${createdCategories.length} categories seeded.`);

    const getCatId = (name) => {
      const found = createdCategories.find(c => c.name === name);
      return found ? found._id : null;
    };

    // Seed Sample Products
    const productsData = [
      {
        name: 'Smartphone X1',
        description: 'Latest model with 128GB storage and 5G connectivity.',
        quantity: 15,
        categories: [getCatId('Electronics')],
      },
      {
        name: 'Wireless Noise-Canceling Headphones',
        description: 'Over-ear headphones with superior active noise cancellation.',
        quantity: 8,
        categories: [getCatId('Electronics')],
      },
      {
        name: 'Denim Jacket',
        description: 'Classic blue denim jacket, regular fit, unisex.',
        quantity: 25,
        categories: [getCatId('Clothing')],
      },
      {
        name: 'Air Fryer XL',
        description: '5.8-quart digital air fryer with 8 cooking presets.',
        quantity: 12,
        categories: [getCatId('Home & Kitchen')],
      },
      {
        name: 'Yoga Mat',
        description: 'Eco-friendly high-density yoga mat with carrying strap.',
        quantity: 50,
        categories: [getCatId('Sports'), getCatId('Beauty')],
      }
    ];

    await Product.insertMany(productsData);
    console.log('Sample products seeded successfully.');

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();