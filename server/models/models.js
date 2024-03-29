const { client, connectToMongoDB, database } = require("../connection");
const { ObjectId } = require("mongodb");
const fs = require("fs").promises;

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
  if (inc_vote === undefined || typeof inc_vote !== "number") {
    return Promise.reject("Invalid vote value.");
  }

  try {
    await connectToMongoDB();
    const db = client.db(database);
    const toiletsCollection = db.collection("toilets");
    const itemId = { _id: new ObjectId(toilet_id) };
    const update = { $inc: { votes: inc_vote } };

    const result = await toiletsCollection.findOneAndUpdate(itemId, update, {
      returnDocument: "after",
    });
    if (result === null) {
      return Promise.reject("No toilet to vote on.");
    }
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
    const db = client.db(database);
    const reviewsCollection = db.collection("reviews");
    const reviews = await reviewsCollection.find({ toilet_id: id }).toArray();
    console.log(reviews, 'reviews in the model with time?');
    return reviews;
  } catch (err) {
    console.log(err, "<<< err in the model block");
  }
}

async function insertReviewById(toilet_id, review) {
  if (review === undefined || review === "") {
    return Promise.reject("Cannot post an empty review.");
  } else if (toilet_id === undefined || toilet_id === "") {
    return Promise.reject("Missing toilet id.");
  }

  try {
    await connectToMongoDB();
    const db = client.db(database);
    const reviewsCollection = await db.collection("reviews");

    const formattedReview = {
      toilet_id: toilet_id,
      review: review,
      created_at: new Date(),
    };

    await reviewsCollection.insertOne(formattedReview);

    const toiletsCollection = db.collection("toilets");
    const itemId = { _id: new ObjectId(toilet_id) };
    const update = { $inc: { comment_count: 1 } };

    const result = await toiletsCollection.findOneAndUpdate(itemId, update, {
      returnDocument: "after",
    });
    if (result === null) {
      return Promise.reject("No toilet to review.");
    }
    return { results: result, review: formattedReview };
  } catch (err) {
    console.log(err, "<<< err in the model block");
  }
}

function getEndpoints() {
  return fs.readFile("endpoints.json", "utf-8").then((info) => {
    return JSON.parse(info);
  });
}

module.exports = {
  getCities,
  getCityToilets,
  updateCityToilets,
  getReviewsById,
  insertReviewById,
  getEndpoints
};
