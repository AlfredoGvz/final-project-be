const app = require("../server/app");
const request = require("supertest");
const client = require("../server/connection");

afterAll(() => {
  return client.close();
});
beforeEach(() => {
  return client.connect();
});

describe("API FLUSHME", () => {
  describe("GET /api/cities", () => {
    test("200- Should respond with an array of city objects.", () => {
      return request(app)
        .get("/api/cities")
        .expect(200)
        .then(({ _body }) => {
          expect(_body.cities.length).toBe(10);
          expect(_body.cities).toBeInstanceOf(Array);
        });
    });
    test("200- City objects must have the right properties and values.", () => {
      return request(app)
        .get("/api/cities")
        .expect(200)
        .then(({ _body }) => {
          console.log();
          const { cities } = _body;
          cities.forEach((city) => {
            expect(city).toHaveProperty("_id", expect.any(String)),
              expect(city).toHaveProperty("latitude", expect.any(Number)),
              expect(city).toHaveProperty("longitude", expect.any(Number)),
              expect(city).toHaveProperty("name", expect.any(String)),
              expect(city).toHaveProperty("display_name", expect.any(String)),
              expect(city).toHaveProperty("__v", expect.any(Number));
          });
        });
    });
    test('404- Returns message of "Not Found" if request URL is misspelled.', () => {
      return request(app)
        .get("/api/citieeeeeees")
        .expect(404)
        .then(({ res }) => {
          expect(res.statusMessage).toBe("Not Found");
        });
    });
  });
  describe("GET /api/:city_name/toilets", () => {
    test("200- Returns an aray with information.", () => {
      return request(app)
        .get("/api/manchester/toilets")
        .then(({ _body }) => {
          expect(_body.cityToilets).toBeInstanceOf(Array);
        });
    });
    test("200- City object must have the right properties and values.", () => {
      const manCity = {
        _id: "65d278858bd0d5a142920a77",
        latitude: 53.4794892,
        longitude: -2.2451148,
        name: "Manchester",
        display_name: "Manchester, Greater Manchester, England, United Kingdom",
        __v: 0,
        toilets: expect.any(Array),
      };
      return request(app)
        .get("/api/manchester/toilets")
        .then(({ _body }) => {
          const city = _body.cityToilets;

          expect(city[0]).toHaveProperty("_id");
          expect(city[0]).toHaveProperty("latitude");
          expect(city[0]).toHaveProperty("longitude");
          expect(city[0]).toHaveProperty("name");
          expect(city[0]).toHaveProperty("display_name");
          expect(city[0]).toHaveProperty("__v");
          expect(city[0]).toHaveProperty("toilets");
          expect(city[0]).toEqual(manCity);
        });
    });
    test.skip("404- Returns a message of 'Not Found' if city is not in database.", () => {
      return request(app)
        .get("/api/tachileik/toilets")
        .expect(404)
        .then(({ res }) => {});
    });
  });
});
