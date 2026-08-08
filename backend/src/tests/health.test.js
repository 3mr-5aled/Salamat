const request = require("supertest");
const app = require("../app");

describe("GET /health", () => {
  it("should return 200 OK and health status", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.message).toEqual("Hospital STD API is running");
  });
});
