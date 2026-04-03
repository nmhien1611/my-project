const mongoose = require('mongoose');
const ensureDefaultSettings = require('../services/ensureDefaultSettings');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    await ensureDefaultSettings();
    console.log('Default settings ensured');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
