require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Case = require('./src/models/Case');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Seeding data...');

    await User.deleteMany({});
    await Case.deleteMany({});

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ResQLink.com',
      password: 'admin123',
      role: 'admin',
    });

    const coordinator = await User.create({
      name: 'Coord User',
      email: 'coordinator@ResQLink.com',
      password: 'coord123',
      role: 'coordinator',
    });

    const volunteer = await User.create({
      name: 'Vol User',
      email: 'volunteer@ResQLink.com',
      password: 'vol123',
      role: 'volunteer',
      skills: ['Medical', 'Logistics'],
      location: 'Sector 7',
    });

    await Case.create({
      title: 'Flash Flood in Sector 4',
      description: 'Heavy rainfall caused flooding. Urgent rescue needed.',
      category: 'Flood',
      urgency: 'High',
      location: 'Sector 4',
      createdBy: coordinator._id,
      updates: [{ note: 'Case opened.', user: 'Coord User' }],
    });

    console.log('Seed successful!');
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

seed();
