const app = require("../server/app");
const request = require("supertest");
const { client, connectToMongoDB, ENV } = require("../server/connection");
// const seedTestData = require("../util-funcs/seed-test-data");
const seed = require("../util-funcs/seedTestDatabase/seedDbs");

beforeAll(async () => {
  await connectToMongoDB(); // Connect to the MongoDB server
  console.log(`Connected to : ${client.options.dbName}`);
  // await seedTestData(); // Seed test data
});
beforeEach(async () => {
  await seed();
});

afterAll(async () => {
  await client.close(); // Close the MongoDB connection
});

describe("API FLUSHME", () => {
  describe("GET /api/cities", () => {
    test("200 - should response with the cities array with the correct information", () => {
      return request(app)
        .get("/api/cities")
        .expect(200)
        .then(({ _body }) => {
          const { cities } = _body;
          console.log(cities);
          cities.forEach((city) => {
            expect(city).toHaveProperty("_id", expect.any(String)),
              expect(city).toHaveProperty("latitude", expect.any(String)),
              expect(city).toHaveProperty("longitude", expect.any(String)),
              expect(city).toHaveProperty("name", expect.any(String)),
              expect(cities[0]).toEqual(
                expect.objectContaining({
                  _id: "65dc9936a1e3139997b18172",
                  latitude: "53.4071991",
                  longitude: "-2.99168",
                  name: "Liverpool",
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
    test("200- Returns an aray with information.", () => {
      return request(app)
        .get("/api/Belfast/toilets")
        .then(({ _body }) => {
          const { cityToilets } = _body;
          expect(cityToilets).toBeInstanceOf(Array);
          expect(cityToilets[0]).toEqual(
            expect.objectContaining({
              _id: "65dc9936a1e3139997b18179",
              latitude: "54.596391",
              longitude: "-5.9301829",
              name: "Belfast",
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
        .get("/api/Belfast/toilets?unisex=false")
        .expect(200)
        .then((response) => {
          const toilets = response.body.cityToilets[0].toilets;
          console.log(toilets);
          toilets.forEach((toilet) => {
            expect(toilet).toHaveProperty("unisex", expect.any(Boolean));
          });
        });
    });
    test("200- Returns a city object with toilets filtered by changing_table property.", () => {
      return request(app)
        .get("/api/Belfast/toilets?changing_table=false")
        .expect(200)
        .then((response) => {
          const toilets = response.body.cityToilets[0].toilets;
          console.log(toilets);
          toilets.forEach((toilet) => {
            expect(toilet).toHaveProperty(
              "changing_table",
              expect.any(Boolean)
            );
          });
        });
    });
    test("200- Returns a city object with toilets filtered by multiple criteria properties.", () => {
      return request(app)
        .get("/api/Belfast/toilets?unisex=true&changing_table=false")
        .expect(200)
        .then((response) => {
          const toilets = response.body.cityToilets[0].toilets;
          console.log(toilets);
          toilets.forEach((toilet) => {
            expect(toilet).toHaveProperty(
              "changing_table",
              expect.any(Boolean),
              expect(toilet).toHaveProperty("unisex", expect.any(Boolean))
            );
          });
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
  describe("GET /api/reviews/:toilet_id", () => {
    test("200 should return all reviews for the specific toilet_id", () => {
      return request(app)
        .get(`/api/reviews/65dc718934d18479d71de6e2`)
        .expect(200)
        .then((response) => {
          console.log(response._body, "get reviews from test line 155");

          const { reviews } = response.body;
          expect(reviews[0]).toEqual(
            expect.objectContaining({
              toilet_id: "65dc718934d18479d71de6e2",
              comment: "Great facilities, very clean!",
            })
          );
        });
    });
    test("200 should return an empty array if there are no reviews for a toilet", () => {
      return request(app)
        .get(`/api/reviews/65dc718934d18479d71de6e5`)
        .expect(200)
        .then((response) => {
          console.log(response.body, "<<< response body in the testin suite");
          const { reviews } = response.body;
          expect(reviews.length).toBe(0);
        });
    });
  });
  describe("POST /api/review/:toilet_id", () => {
    test.only("Should return all reviews for the specific toilet_id", async () => {
      const testReview = {
        toilet_id: "65dc9862030140170e867eff",
        review: "Bananas!",
      };
      return request(app)
        .post(`/api/review/${testReview.toilet_id}`)
        .send(testReview)
        .expect(201)
        .then((response) => {
          const { posted } = response.body;
          console.log(posted, "<<< the response in the test");
          expect(posted).toEqual({
            results: {
              _id: "65dc9862030140170e867eff",
              refuge_id: 4182,
              name: "Barburrito Liverpool 1",
              street: "Liverpool 1 shopping area",
              city: "Liverpool",
              country: "UK",
              unisex: true,
              changing_table: false,
              accessible: false,
              comment: null,
              latitude: 53.4083714,
              longitude: -2.9915726,
              distance: 0.08111880563522755,
              votes: 0,
              comment_count: expect.any(Number),
            },
            review: {
              toilet_id: "65dc9862030140170e867eff",
              review: "Bananas!",
              created_at: expect.any(String),
              _id: expect.any(String),
            },
          });
        });
    });
  });
});
