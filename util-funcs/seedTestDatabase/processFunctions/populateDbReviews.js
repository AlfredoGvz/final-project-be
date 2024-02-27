const { client, connectToMongoDB } = require("../../../server/connection");
const { ObjectId } = require("mongodb");
const reviewsData = require("../originalDbsData/reviews_original_data.json");

async function populateDbReview() {
  try {
    await connectToMongoDB();
    const db = client.db("testDatabase");
    for (const review of reviewsData) {
      await db.collection("reviews").insertOne({
        _id: new ObjectId(review._id),
        toilet_id: review.toilet_id,
        comment: review.comment,
      });
    }
  } catch (error) {
  } finally {
    await client.close();
  }
}
module.exports = populateDbReview;
