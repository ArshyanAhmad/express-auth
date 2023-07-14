const mongoose = require('mongoose')

const connectToDatabase = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
            .then((con) => {
                console.log(`Database connected successfully: ${con.connection.host}`);
            })
            .catch(err => {
                console.log(`Error detected while connecting to database: ${err.message}`);
            })
    } catch (error) {
        console.log(`Error detected while connecting to mongodb: ${error.message}`);
    }
}

module.exports = connectToDatabase;