const User = require('../models/User');
const Asset = require('../models/Asset');
const Request = require('../models/Request');

// Database seeder logic to create default demo users and assets
const seedData = async () => {
  try {
    // 1. Delete existing seeded users and request histories to start fresh
    await User.deleteMany({
      email: { $in: ['admin@smartasset.com', 'manager@smartasset.com', 'employee@smartasset.com'] }
    });
    await Request.deleteMany({});
    console.log('Cleared old seed users and request histories.');

    console.log('Seeding fresh demo users...');

    const demoUsers = [
      {
        name: 'System Admin',
        email: 'admin@smartasset.com',
        password: 'Admin@123', // Hashed automatically by pre-save hook in User model
        role: 'admin'
      },
      {
        name: 'Inventory Manager',
        email: 'manager@smartasset.com',
        password: 'Manager@123', // Hashed automatically by pre-save hook in User model
        role: 'manager'
      },
      {
        name: 'Regular Employee',
        email: 'employee@smartasset.com',
        password: 'Employee@123', // Hashed automatically by pre-save hook in User model
        role: 'employee'
      }
    ];

    // Using create() instead of insertMany() to trigger password hashing pre-save hooks
    const createdUsers = await User.create(demoUsers);
    console.log('Demo users successfully seeded with hashed passwords!');

    const adminUser = createdUsers.find(u => u.role === 'admin');

    // 2. Clear old assets and seed fresh dummy inventory
    await Asset.deleteMany({});
    console.log('Cleared old assets database. Seeding 120 dummy assets...');

    const categories = ['Laptop', 'Hardware', 'Software', 'Accessory'];
    const statuses = ['available', 'assigned', 'maintenance'];
    const brands = ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer', 'Logitech', 'Samsung'];
    const products = ['ProBook', 'ThinkPad', 'MacBook', 'XPS', 'ROG', 'Monitor', 'Mouse', 'License'];

    const dummyAssets = [];

    for (let i = 1; i <= 120; i++) {
      const brand = brands[i % brands.length];
      const product = products[i % products.length];
      const category = categories[i % categories.length];
      const status = statuses[i % statuses.length];

      dummyAssets.push({
        name: `${brand} ${product} ${i}`,
        category,
        serialNumber: `ASSET-${String(i).padStart(4, '0')}`,
        quantity: Math.floor(Math.random() * 20) + 1,
        status,
        createdBy: adminUser._id
      });
    }

    await Asset.insertMany(dummyAssets);
    console.log(`${dummyAssets.length} dummy assets successfully seeded!`);

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;
