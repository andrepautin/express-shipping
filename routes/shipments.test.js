"use strict";

const request = require("supertest");
const app = require("../app");
const jsonschema = require("jsonschema");
const shipmentSchema = require("../schemas/shipmentSchema");

describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zipcode: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

  test("invalid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zipcode: 12345,
    });
    // console.log("RESPONSE BODY-->", resp.body);
    expect(resp.body).toEqual(
      {error: {
        message: ["instance.zipcode is not of a type(s) string"],
        status: 400}
    });
  });

  test("missing a required property", async function() {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St"
    });
    // console.log(resp.body);
    expect(resp.body).toEqual({
      "error": {
        "message": ["instance requires property \"zipcode\""],
        "status": 400}
    });
  });

  test("test against additional property", function() {
    const result = jsonschema.validate({productId: 2000, name: "Test", addr: "TestAddr", zipcode: "TestZip", discount: "save"}, shipmentSchema);
    expect(result.valid).toEqual(false);
  });
});
