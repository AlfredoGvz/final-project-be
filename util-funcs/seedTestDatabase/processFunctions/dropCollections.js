const { client, connectToMongoDB } = require("../../../server/connection");

async function dropCollections() {
  try {
    await connectToMongoDB();
    const db = client.db("testDatabase");
    const collections = await db.collections();
    for (const collection of collections) {
      console.log(`${collection.collectionName} collection dropped`);
      await collection.deleteMany({});
    }
  } catch (error) {
  } finally {
    await client.close();
  }
}

module.exports = dropCollections;
