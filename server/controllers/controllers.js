const { getCities, getCityToilets, updateCityToilets} = require("../models/models");

function fetchingCities(request, response, next) {
  getCities().then((data) => {
    response.status(200).send({ cities: data });
  });
}

function fetchingCityToilets(request, response, next) {
  const { city_name } = request.params;
  getCityToilets(city_name)
    .then((data) => {
      response.status(200).send({ cityToilets: data });
    })
    .catch((err) => {
      if(err.message === "City not found in database") {
        response.status(404).send({message: 'City not found in database'})
      }
      else {
        response.status(500).send({message: 'Internal server error'})
      }

    });
}

function patchingCityToilets (request, response, next) {
  const {toilet_id } = request.params
  const {inc_votes} = request.body
  updateCityToilets(toilet_id, inc_votes)
  .then((data) => {
    console.log(data, '<<< in the controller for patch');
    response.status(201)
  })
}



module.exports = { fetchingCities, fetchingCityToilets, patchingCityToilets};
