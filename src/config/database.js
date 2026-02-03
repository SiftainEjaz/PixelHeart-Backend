const mongoose = require('mongoose');

const connectToDB = async function () {
    await mongoose.connect("mongodb+srv://Saif:pTL9HxxETV5Qm4Rv@siftaincluster.voz89.mongodb.net/PixelHeart");
}

module.exports = {connectToDB};

