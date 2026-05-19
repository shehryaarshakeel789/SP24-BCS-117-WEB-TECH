const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Product = require('./models/product');

const MONGO_URL = 'mongodb://127.0.0.1:27017/ecommerce-auth';

async function seed() {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  const adminEmail = 'admin@example.com';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const password = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin User', email: adminEmail, password, role: 'admin' });
    console.log('Created admin user: admin@example.com / admin123');
  } else {
    console.log('Admin user already exists');
  }

  const existingProduct = await Product.findOne({ name: 'Sample Sneaker' });
  if (!existingProduct) {
    await Product.create({ name: 'Sample Sneaker', price: 79.99, category: 'Shoes', rating: 4.2, stock: 10, imagePath: '/uploads/spotlight-row-1-image-1.png' });
    console.log('Created sample product.');
  } else {
    console.log('Sample product already exists');
  }

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
