require('dotenv').config();
const mongoose = require('mongoose');

// const port = process.env.PORT
const mongoString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.xylicd4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const connectDB = () => {
    mongoose.connect(mongoString);
    const database = mongoose.connection;

    database.on('error', (error) => {
        console.log('MongoDB connection error', error);
    });

    database.once('connected', () => {
        console.log('Database Connected');
    });
};

module.exports = connectDB;