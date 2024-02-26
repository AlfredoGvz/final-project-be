const app = require("../server/app");
const request = require("supertest");
const { client, connectToMongoDB, ENV } = require("../server/connection");
// const seedTestData = require("../util-funcs/seed-test-data");

beforeAll(async () => {
  await connectToMongoDB(); // Connect to the MongoDB server
  console.log(`Connected to : ${client.options.dbName}`);
  // await seedTestData(); // Seed test data
});

afterAll(async () => {
  await client.close(); // Close the MongoDB connection
});

describe("API FLUSHME", () => {
  describe("GET /api/cities", () => {
    test.only("200 - should response with the cities array with the correct information", () => {
      return request(app)
        .get("/api/cities")
        .expect(200)
        .then(({ _body }) => {
          const { cities } = _body;
          console.log(cities)
          expect(cities.length).toBe(10);
          cities.forEach((city) => {
            expect(city).toHaveProperty("_id", expect.any(String)),
              expect(city).toHaveProperty("latitude", expect.any(String)),
              expect(city).toHaveProperty("longitude", expect.any(String)),
              expect(city).toHaveProperty("name", expect.any(String)),
            expect(cities[0]).toEqual(
              expect.objectContaining({
                _id: '65dc6cbbba7ef3af0ad454ec',
                latitude: '53.4794892',
                longitude: '-2.2451148',
                name: "Manchester"
              })
            );
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
    /* RESEARCH HOW TO CONTROL URL QUERY PARAMTERS AS A DEFAULT
    test('400 - Returns a bad request if invalid query paramters were given', () => {
      return request(app)
        .get("/api/cities?invalid=123")
        .expect(400)
        .then(({ res }) => {
          expect(res.statusMessage).toBe("Bad Request");
          console.log(res.body);
        });
    });*/
  });

  describe("GET /api/:city_name/toilets", () => {
    test.only("200- Returns an aray with information.", () => {
      return request(app)
        .get("/api/manchester/toilets")
        .then(({ _body }) => {
          const { cityToilets } = _body;
          expect(cityToilets).toBeInstanceOf(Array);
          expect(cityToilets[0]).toEqual(
            expect.objectContaining({
              _id: '65dc6cbbba7ef3af0ad454ec',
              latitude: '53.4794892',
              longitude: '-2.2451148',
              name: "Manchester",
              toilets: expect.any(Array),
            })
          );
        });
    });
    test("404- Returns a message of 'Not Found' if city is not in database.", () => {
      return request(app)
        .get("/api/tachileik/toilets")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("City not found in database");
        });
    });
  });

  describe("GET /api/:city_name/toilets?query=query_val", () => {
    test("200- Returns a city object with toilets filtered by unisex property.", () => {
      return request(app)
        .get("/api/manchester/toilets?unisex=false")
        .expect(200)
        .then((response) => {
          console.log(response.body, "in test");
        });
    });
  });

  describe("PATCH /api/toilets/:toilet_id", () => {
    test("201 Successful patch to the database", () => {
      return request(app)
        .patch(`/api/toilets/65d872561c711aa554e78195`)
        .send({ inc_votes: -30 })
        .then();
    });
  });
});
