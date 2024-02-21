const express = require("express");
const app = express();
const {
  fetchingCities,
  fetchingCityToilets,
} = require("./controllers/controllers");

app.get("/api/cities", fetchingCities);
app.get("/api/:city_name/toilets", fetchingCityToilets);

app.use((err, req, res, next) => {
  if (err.status === 404 && err.msg === "City not found") {
    res.status(404).send({ msg: "City not found" });
  }
});

module.exports = app;
