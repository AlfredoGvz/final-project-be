const { client, connectToMongoDB, database } = require("../connection");
const { ObjectId } = require("mongodb");

console.log(database, "I the database am in the model");
async function getCities() {
  try {
    await connectToMongoDB();
    const db = client.db(database);
    const data = await db.collection("cities").find().toArray();
    return data;
  } catch (error) {
    console.log("Error from getCities() model", error);
  } finally {
    await client.close();
  }
}

async function getCityToilets(city_name, queries) {
  console.log(queries);
  const cityName = city_name[0].toUpperCase() + city_name.slice(1);
  const acceptedQueries = ["unisex", "changing_table", "accessible", "none"];
  const toiletFilterCriteria = {
    city: cityName,
  };
  const sortingByValuesInQuery = Object.keys(queries);
  if (
    queries &&
    !sortingByValuesInQuery.every((value) => acceptedQueries.includes(value))
  ) {
    return Promise.reject(new Error("Invalid filter criteria"));
  } else {
    for (const val of sortingByValuesInQuery) {
      toiletFilterCriteria[val] = queries[val] === "true";
    }
  }
  console.log(toiletFilterCriteria);

  await connectToMongoDB();
  const db = client.db(database);
  const toiletsCollection = db.collection("toilets");
  const toilet = await toiletsCollection.find(toiletFilterCriteria).toArray();
  const cityCollection = db.collection("cities");
  const city = await cityCollection.find({ name: cityName }).toArray();

  return new Promise(async (resolve, reject) => {
    try {
      if (city.length === 0) {
        reject(new Error("City not found in database"));
      } else {
        city[0].toilets = toilet;
        const cities = city;
        resolve(cities);
      }
    } finally {
      await client.close();
    }
  });
}

async function updateCityToilets(toilet_id, inc_vote) {
  //1- To update a document, use findOneAndUpdate passing item id, value to update and the returnDocument instruct to be return the updated object

  //2- To be able to find item by id in params, we gonna need to create an instance of ObjectId by using new ObjectId and passing in the id in the params.
  try {
    await connectToMongoDB();
    const db = client.db(database);
    const toiletsCollection = db.collection("toilets");
    const itemId = { _id: new ObjectId(toilet_id) };
    const update = { $inc: { votes: inc_vote } };

    const result = await toiletsCollection.findOneAndUpdate(itemId, update, {
      returnDocument: "after",
    });

    return result;
  } catch (error) {
    console.log(error, " i am a mistake");
  } finally {
    client.close();
  }
}

async function getReviewsById(id) {
  try {
    await connectToMongoDB();
    const db = client.db("development");
    const reviewsCollection = db.collection("reviews");
    // console.log(id, "<<<successfully getting parasm through");
    const reviews = await reviewsCollection.find({ toilet_id: id }).toArray();
    // console.log(reviews, "<<< all the reviews in the model");
    return reviews;
  } catch (err) {
    console.log(err, "<<< err in the model block");
  }
}

async function insertReviewById(toilet_id, review) {
  try {
    await connectToMongoDB();
    const db = client.db("development");
    const reviewsCollection = await db.collection("reviews");
    console.log(toilet_id, "<<<toilet id in the model");
    console.log(review, "<<< the comment in the model");
    const formattedReview = {
      toilet_id: toilet_id,
      review: review,
    };
    await reviewsCollection.insertOne(formattedReview);
    return formattedReview;
  } catch (err) {
    console.log(err, "<<< err in the model block");
  }
}
module.exports = {
  getCities,
  getCityToilets,
  updateCityToilets,
  getReviewsById,
  insertReviewById,
};
