const { client, connectToMongoDB } = require("../../../server/connection");
const { ObjectId } = require("mongodb");
const cityData = require("../originalDbsData/cities_original_data.json");

async function populateDbCity() {
  try {
    await connectToMongoDB();
    const db = client.db("testDatabase");
    for (const city of cityData) {
      await db.collection("cities").insertOne({
        _id: new ObjectId(city._id),
        latitude: city.latitude,
        longitued: city.longitude,
        name: city.name,
      });
    }
  } catch (error) {
  } finally {
    await client.close();
  }
}

module.exports = populateDbCity;
