const { client, connectToMongoDB } = require("../connection");
const { ObjectId } = require("mongodb");

async function getCities() {
  try {
    await connectToMongoDB();
    const db = client.db("development");
    const data = await db.collection("cities").find().toArray();
    return data;
  } catch (error) {
    console.log("Error from getCities() model", error);
  } finally {
    await client.close();
  }
}

async function getCityToilets(city_name) {
  const cityName = city_name[0].toUpperCase() + city_name.slice(1);

  return new Promise(async (resolve, reject) => {
    try {
      await connectToMongoDB();
      const db = client.db("development");
      const citiesCollection = await db.collection("cities");

      // Use aggregation pipeline to join cities and toilets
      const pipeline = [
        {
          $match: {
            name: cityName, // Filter documents to match only the city "Manchester"
          },
        },
        {
          $lookup: {
            from: "toilets",
            localField: "name",
            foreignField: "city",
            as: "toilets",
          },
        },
        {
          $addFields: {
            toilets: "$toilets", // Add a new field "toilets" containing the restrooms
          },
        },
      ];

      const cities = await citiesCollection.aggregate(pipeline).toArray();
      if (cities.length === 0) {
        reject(new Error("City not found in database"));
      } else {
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
    const db = client.db("development");
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
module.exports = {
  getCities,
  getCityToilets,
  updateCityToilets,
};
