const { client, connectToMongoDB } = require("../../../server/connection");

async function dropCollections() {
  try {
    await connectToMongoDB();
    const db = client.db("testDatabase");
    const collections = await db.collections();
    for (const collection of collections) {
      // console.log(`${collection.collectionName} collection dropped`);
      await collection.deleteMany({});
      console.log(`All collections dropped`);
    }
    // const collection = db.collection("cities");
    // await collection.deleteMany({
    //   name: { $nin: ["Liverpool", "Cardiff", "Glasgow", "Belfast"] },
    // });
  } catch (error) {
  } finally {
    await client.close();
  }
}

module.exports = dropCollections;
