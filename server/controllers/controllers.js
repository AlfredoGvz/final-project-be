const {
  getCities,
  getCityToilets,
  updateCityToilets,
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

  updateCityToilets(toilet_id, inc_votes).then((data) => {
    response.status(201).send({ data: data });
  });
}
module.exports = {
  fetchingCities,
  fetchingCityToilets,
  patchingCityToilets,
};
