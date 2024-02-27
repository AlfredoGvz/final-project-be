const dropCollections = require("./processFunctions/dropCollections");
const insertIntoCities = require("./processFunctions/populateDbCities");
const insertIntoReviews = require("./processFunctions/populateDbReviews");
const insertIntoToilets = require("./processFunctions/populateDbToilets");
const getOriginalData = require("./processFunctions/captureOriginalData");

async function seed() {
  try {
    await getOriginalData();
    // console.log("collections have been dropped");
    await dropCollections();
    // console.log("toilets collection seeded");
    await insertIntoCities();
    // console.log("reviews collection seeded");
    await insertIntoReviews();
    // console.log("toilets collection seeded");
    await insertIntoToilets();
    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error while seeding database:", error);
  }
}

module.exports = seed;
