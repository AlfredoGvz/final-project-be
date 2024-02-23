const { client, connectToMongoDB } = require("../connection");

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

async function updateCityToilets(toilet_id, inc_votes){
  try{
    await connectToMongoDB();
    const db = client.db("development");
    const data = await db.collection("cities").find().toArray();
    // const data = await db.collection("toilets").findOneAndUpdate(
    //   {_id: toilet_id},
    //   {$inc: { "votes" : + inc_votes }})
      console.log(data, "<<< the data in the model");
      return data
    }
  catch(err){
    console.log(err);
  }
 finally {
  await client.close();
}
}

module.exports = {
  getCities,
  getCityToilets,
  updateCityToilets
};
