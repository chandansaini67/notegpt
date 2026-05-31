const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google DNS (8.8.8.8) to bypass ISP DNS that blocks MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Backend is running in offline mode. Database features will not work until a valid MONGO_URI is set.');
  }
};

module.exports = connectDB;
