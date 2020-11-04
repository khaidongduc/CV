if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/my-cv';

const mongoose = require('mongoose');
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
module.exports = db;