const citiesJSON = require("../../data/test-data/all-cities.json");
const { client, connectToMongoDB, ENV } = require("../../server/connection");

async function seedTestCityData() {
  try {
    await connectToMongoDB();
    const db = client.db("testDatabase");

    await db
      .collection("cities")
      .drop()
      .then(() => {
        console.log("db dropped");
      });

    const formattedDataArray = citiesJSON.map((obj) => ({
      latitude: obj.lat,
      longitude: obj.lon,
      name: obj.cityName,
    }));

    console.log(formattedDataArray, "<<< the formatted array for DB");

    const result = await db.collection("cities").insertMany(formattedDataArray);
    console.log(`${result.insertedCount} toilets inserted successfully.`);

    await client.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}
seedTestCityData();

module.exports = seedCityData;
