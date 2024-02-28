const path = require("path");
const fs = require("fs");
const { client, connectToMongoDB } = require("../../../server/connection");

async function getAllOriginalInfo() {
  try {
    await connectToMongoDB();
    const db = client.db("testDatabase");
    const collections = await db.collections();
    for (let collection of collections) {
      const document = await collection.find({}).toArray();
      const jsonFileName = path.join(
        __dirname,
        "../originalDbsData",
        `${collection.collectionName}_original_data.json`
      );
      const jsonData = JSON.stringify(document);
      fs.writeFileSync(jsonFileName, jsonData);
    }
  } catch (error) {
  } finally {
    await client.close();
  }
}
// getAllOriginalInfo();
// module.exports = getAllOriginalInfo;
