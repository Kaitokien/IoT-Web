// Kết nối với CSDL MongoDB sử dụng MongoDBCompass

const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connect DB successfully");
    } catch (error) {
        console.log(error);
    }
}

