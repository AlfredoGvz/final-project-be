const { MongoClient } = require("mongodb");
const ENV = process.env.NODE_ENV || "development";
console.log(ENV, "<<<< the current ENV");
require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to the MongoDB server");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Rethrow the error to handle it in your application
  }
}

// Export the connected client and the function to establish connection
module.exports = {
  client,
  connectToMongoDB,
};
