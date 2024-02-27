const { client, connectToMongoDB } = require("../../../server/connection");
const { ObjectId } = require("mongodb");
const cityData = require("../originalDbsData/cities_original_data.json");

async function populateDbCity() {
  try {
    await connectToMongoDB();
    const db = client.db("testDatabase");

    const jsonToInsert = cityData.map((city) => ({
      _id: new ObjectId(city._id),
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
    }));

    await db.collection("cities").insertMany(jsonToInsert);
  } catch (error) {
  } finally {
    await client.close();
  }
}

module.exports = populateDbCity;
