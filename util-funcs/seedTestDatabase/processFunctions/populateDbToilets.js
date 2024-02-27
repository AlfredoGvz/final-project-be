const { client, connectToMongoDB } = require("../../../server/connection");
const { ObjectId } = require("mongodb");
const toiletsData = require("../originalDbsData/toilets_original_data.json");

async function populateDbToilet() {
  try {
    await connectToMongoDB();
    const db = client.db("testDatabase");
    const jsonToInsert = toiletsData.map((toilet) => ({
      _id: new ObjectId(toilet._id),
      refuge_id: toilet.refuge_id,
      name: toilet.name,
      street: toilet.street,
      city: toilet.city,
      country: toilet.country,
      unisex: toilet.unisex,
      changing_table: toilet.changing_table,
      accessible: toilet.accessible,
      comment: toilet.comment,
      latitude: toilet.latitude,
      longitude: toilet.longitude,
      distance: toilet.distance,
      votes: toilet.votes,
      comment_count: toilet.comment_count,
    }));
    await db.collection("toilets").insertMany(jsonToInsert);
  } catch (error) {
  } finally {
    await client.close();
  }
}
module.exports = populateDbToilet;
