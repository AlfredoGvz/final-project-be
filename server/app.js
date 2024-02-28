const express = require("express");
const app = express();
app.use(express.json());
const {
  fetchingCities,
  fetchingCityToilets,
  patchingCityToilets,
  fetchReviewsById,
  postReviewById,
  fetchingEndpoints
} = require("./controllers/controllers");


app.get("/api/cities", fetchingCities);

app.get("/api/:city_name/toilets", fetchingCityToilets); 

app.patch("/api/toilets/:toilet_id", patchingCityToilets);

app.get("/api/reviews/:toilet_id", fetchReviewsById);

app.post("/api/review/:toilet_id", postReviewById);

app.get("/api", fetchingEndpoints);

app.use((err, req, res, next) => {
  if (err.status === 404 && err.msg === "City not found") {
    res.status(404).send({ msg: "City not found" });
  }
});



module.exports = app;
