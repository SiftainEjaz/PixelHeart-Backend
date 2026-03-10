const mongoose = require('mongoose');

const connectToDB = async function () {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
}

module.exports = {connectToDB};

