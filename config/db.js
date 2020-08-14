const mongoose = require('mongoose');
require('dotenv').config({ path: './config/config.env' });

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = connectDB;