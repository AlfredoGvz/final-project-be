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
    test("201 Successful patch to the database taking away votes", () => {
      return request(app)
        .patch(`/api/toilets/65dc718934d18479d71de6e3`)
        .send({ inc_votes: -30 })
        .then(({ body }) => {
          expect(body.data).toEqual({
            _id: "65dc718934d18479d71de6e3",
            refuge_id: 15965,
            name: "Liverpool Guild Sphinx Bar",
            street: "160 Mount Pleasant",
            city: "Liverpool",
            country: "GB",
            unisex: true,
            changing_table: false,
            accessible: true,
            comment:
              "Should be able to use regardless, many students go in and out without paying for anything",
            latitude: 53.4050214,
            longitude: -2.9658354,
            distance: 1.075100618056547,
            votes: -30,
            comment_count: 0,
          });
        });
    });

    test("201 Successful patch to the database adding up votes", () => {
      return request(app)
        .patch(`/api/toilets/65dc718934d18479d71de6e3`)
        .send({ inc_votes: 40 })
        .then(({ body }) => {
          expect(body.data).toEqual({
            _id: "65dc718934d18479d71de6e3",
            refuge_id: 15965,
            name: "Liverpool Guild Sphinx Bar",
            street: "160 Mount Pleasant",
            city: "Liverpool",
            country: "GB",
            unisex: true,
            changing_table: false,
            accessible: true,
            comment:
              "Should be able to use regardless, many students go in and out without paying for anything",
            latitude: 53.4050214,
            longitude: -2.9658354,
            distance: 1.075100618056547,
            votes: 40,
            comment_count: 0,
          });
        });
    });
  });
  describe("GET /api/reviews/:toilet_id", () => {
    test("200 should return all reviews for the specific toilet_id", () => {
      return request(app)
        .get(`/api/reviews/65dc9862030140170e867eff`)
        .expect(200)
        .then((response) => {
          const { reviews } = response.body;
          reviews.forEach((review) => {
            expect(review).toHaveProperty("_id", expect.any(String));
            expect(review).toHaveProperty("toilet_id", expect.any(String));
            expect(review).toHaveProperty("review", expect.any(String));
            expect(review).toHaveProperty("created_at", expect.any(String));
          });
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
    test("Should return all reviews for the specific toilet_id", async () => {
      const testReview = {
        toilet_id: "65dc718934d18479d71de6e3",
        review: "Ran out of toilet paper quite a often",
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
              _id: "65dc718934d18479d71de6e3",
              refuge_id: 15965,
              name: "Liverpool Guild Sphinx Bar",
              street: "160 Mount Pleasant",
              city: "Liverpool",
              country: "GB",
              unisex: true,
              changing_table: false,
              accessible: true,
              comment:
                "Should be able to use regardless, many students go in and out without paying for anything",
              latitude: 53.4050214,
              longitude: -2.9658354,
              distance: 1.075100618056547,
              votes: 0,
              comment_count: expect.any(Number),
            },
            review: {
              toilet_id: "65dc718934d18479d71de6e3",
              review: "Ran out of toilet paper quite a often",
              created_at: expect.any(String),
              _id: expect.any(String),
            },
          });
        });
    });
  });
});
