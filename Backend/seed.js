const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Load environment variables so we can connect to the database
dotenv.config();

const demoProducts = [
  {
    name: "Margherita Classic Pizza",
    description: "Authentic Italian pizza with fresh tomato sauce, mozzarella cheese, and basil leaves.",
    price: 299,
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
    inStock: true
  },
  {
    name: "Spicy Paneer Tikka",
    description: "Cubes of paneer marinated in spices and grilled in a tandoor.",
    price: 199,
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80",
    inStock: true
  },
  {
    name: "Double Cheese Burger",
    description: "Juicy double patty burger with melted cheddar cheese, lettuce, and our secret sauce.",
    price: 249,
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    inStock: true
  },
  {
    name: "Creamy Alfredo Pasta",
    description: "Penne pasta tossed in a rich, creamy garlic parmesan sauce with garlic bread.",
    price: 279,
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&q=80",
    inStock: true
  },
  {
    name: "Chocolate Fudge Brownie",
    description: "Warm, gooey chocolate brownie served with a drizzle of hot fudge.",
    price: 129,
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80",
    inStock: true
  },
  {
    name: "Iced Caramel Macchiato",
    description: "Refreshing cold coffee with vanilla syrup, milk, espresso, and a caramel drizzle.",
    price: 149,
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80",
    inStock: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to the database
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food-app';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to Database for seeding...');

    // Clear existing products so we don't create duplicates if you run this twice
    await Product.deleteMany();
    console.log('🗑️  Cleared old products.');

    // Insert the demo products
    await Product.insertMany(demoProducts);
    console.log('🍔 Successfully added demo products to the menu!');

    // Close the connection
    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();