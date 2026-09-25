require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const Room = require('../models/Room.model');
const User = require('../models/User.model');
const connectDB = require('../config/db');

connectDB();

const rooms = [
  {
    name: 'Ocean View Suite',
    type: 'Suite',
    description: 'A luxurious suite with a breathtaking view of the ocean, featuring a king-size bed and premium amenities.',
    pricePerNight: 299,
    capacity: 2,
    amenities: ['Free WiFi', 'Ocean View', 'Balcony', 'Room Service', 'Mini Bar'],
    images: [{ url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', public_id: 'mock_1' }],
    averageRating: 4.8
  },
  {
    name: 'Deluxe City Room',
    type: 'Deluxe',
    description: 'Modern room located in the heart of the city with easy access to all major attractions.',
    pricePerNight: 150,
    capacity: 3,
    amenities: ['Free WiFi', 'City View', 'Air Conditioning', 'Flat Screen TV'],
    images: [{ url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', public_id: 'mock_2' }],
    averageRating: 4.5
  },
  {
    name: 'Standard Twin Room',
    type: 'Standard',
    description: 'Comfortable twin room ideal for friends or colleagues traveling together.',
    pricePerNight: 99,
    capacity: 2,
    amenities: ['Free WiFi', 'Air Conditioning', 'Desk'],
    images: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', public_id: 'mock_3' }],
    averageRating: 4.2
  }
];

const importData = async () => {
  try {
    await Room.deleteMany();
    await User.deleteMany();
    
    await Room.insertMany(rooms);
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
    }

    await User.create({
      name: 'Admin User',
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    
    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Room.deleteMany();
    await User.deleteMany();
    console.log('✅ Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data destruction: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
