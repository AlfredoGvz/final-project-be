const { client, connectToMongoDB } = require("../../../server/connection");
const { ObjectId } = require("mongodb");
const reviewsData = require("../originalDbsData/reviews_original_data.json");

async function populateDbReview() {
  try {
    await connectToMongoDB();
    const db = client.db("testDatabase");
    const jsonToInsert = reviewsData.map((review) => ({
      _id: new ObjectId(review._id),
      toilet_id: review.toilet_id,
      review: review.review,
      created_at: review.created_at,
    }));
    await db.collection("reviews").insertMany(jsonToInsert);
  } catch (error) {
  } finally {
    await client.close();
  }
}
module.exports = populateDbReview;
