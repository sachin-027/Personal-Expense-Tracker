const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }

  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
