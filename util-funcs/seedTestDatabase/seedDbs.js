const dropCollections = require("./processFunctions/dropCollections");
const insertIntoCities = require("./processFunctions/populateDbCities");
const insertIntoReviews = require("./processFunctions/populateDbReviews");
const insertIntoToilets = require("./processFunctions/populateDbToilets");

const seed = dropCollections()
  .then(() => {
    console.log("toilets collection seeded");
    return insertIntoCities();
  })
  .then(() => {
    console.log("reviews collection seeded");
    return insertIntoReviews();
  })
  .then(() => {
    console.log("toilets collection seeded");
    return insertIntoToilets();
  })
  .then(() => {
    console.log("Database seeding completed.");
  })
  .catch((error) => {
    console.error("Error while seeding database:", error);
  });

module.exports = seed;
