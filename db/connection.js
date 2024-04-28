const mongoose = require('mongoose');

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`mongodb connected`);
  } catch (err) {
    console.log(`db connection error`);
  }
}

module.exports = connectDatabase;
