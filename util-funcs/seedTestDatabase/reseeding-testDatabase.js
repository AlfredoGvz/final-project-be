const {
  client,
  connectToMongoDB,
  database,
} = require("../../server/connection");
const originalCityData = require("./testDatabase.cities.json");
console.log(originalCityData);

const { ObjectId } = require("mongodb");

async function resetTestData() {
  try {
    await connectToMongoDB();
    let db = await client.db("testDatabase");
    await db.collection("cities").deleteMany({});

    await db
      .collection("cities")
      .insertMany(
        originalCityData.map((doc) => ({ ...doc, _id: new ObjectId(doc._id) }))
      );
  } finally {
    await client.close();
  }
}

resetTestData();
