const {
  getCities,
  getCityToilets,
  updateCityToilets,
  getReviewsById,
  insertReviewById,
  getEndpoints
} = require("../models/models");

function fetchingCities(request, response, next) {
  getCities().then((data) => {
    response.status(200).send({ cities: data });
  });
}

function fetchingCityToilets(request, response, next) {
  const { city_name } = request.params;
  const queries = request.query;
  getCityToilets(city_name, queries)
    .then((data) => {
      console.log(data, "from controller");
      response.status(200).send({ cityToilets: data });
    })
    .catch((err) => {
      console.log(err);
      if (err.message === "Invalid filter criteria") {
        response.status(400).send({ message: "Invalid filter criteria" });
      } else if (err.message === "City not found in database") {
        response.status(404).send({ message: "City not found in database" });
      } else {
        response.status(500).send({ message: "Internal server error" });
      }
    });
}

function patchingCityToilets(request, response, next) {
  const { toilet_id } = request.params;
  const { inc_votes } = request.body;

  updateCityToilets(toilet_id, inc_votes)
    .then((data) => {
      response.status(201).send({ data: data });
    })
    .catch((error) => {
      if (error === "No toilet to vote on.") {
        response.status(404).send({ msg: "No toilet to vote on." });
      } else if (error === "Invalid vote value.") {
        response.status(400).send({ msg: "Invalid vote value." });
      }
    });
}

function fetchReviewsById(request, response, next) {
  const { toilet_id } = request.params;
  getReviewsById(toilet_id).then((data) => {
    response.status(200).send({ reviews: data });
  });
}

function postReviewById(request, response, next) {
  const { toilet_id } = request.params;
  const { review } = request.body;
  insertReviewById(toilet_id, review)
    .then((data) => {
      response.status(201).send({ posted: data });
    })
    .catch((error) => {
      if (error === "No toilet to review.") {
        response.status(404).send({ msg: "No toilet to review." });
      } else if (error === "Cannot post an empty review.") {
        response.status(400).send({ msg: "Cannot post an empty review." });
      } else if (error === "Missing toilet id.") {
        response.status(400).send({ msg: "Missing toilet id." });
      }
    });
}
function fetchingEndpoints(request, response, next) {
  getEndpoints().then((data) => {
    response.status(200).send({ endPoints: data });
  });
}

module.exports = {
  fetchingCities,
  fetchingCityToilets,
  patchingCityToilets,
  fetchReviewsById,
  postReviewById,
  fetchingEndpoints
};
