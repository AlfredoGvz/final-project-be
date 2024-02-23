const client = require("../server/connection");
const express = require("express");
const app = express();
const {
  fetchingCities,
  fetchingCityToilets,
  patchingCityToilets,
} = require("./controllers/controllers");

app.get("/api/cities", fetchingCities);

app.get("/api/:city_name/toilets", fetchingCityToilets); //add property comments number and rating number

app.patch("/api/:city_name/toilets/:toiletId", patchingCityToilets)

app.use((err, req, res, next) => {
  if (err.status === 404 && err.msg === "City not found") {
    res.status(404).send({ msg: "City not found" });
  }
});

// client.connect().then(() => {
//   console.log(`Connected to MongoDB database: ${client.s.options.dbName}`);
// })
// .then(() => {
//   client.close()
//   console.log('Client closed successfully');
// });

module.exports = app;
