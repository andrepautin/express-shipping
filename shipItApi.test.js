"use strict";

const AxiosMockAdapter = require("axios-mock-adapter");
const axios = require("axios");
const axiosMock = new AxiosMockAdapter(axios);
const {shipProduct, SHIPIT_SHIP_URL} = require("./shipItApi");

test("shipProduct", async function () {
  axiosMock.onPost(SHIPIT_SHIP_URL).reply(200, {shipId: 1000});
  const res = await shipProduct({productId: 2000, name: "Test", addr: "123 Test", zipcode: "12345"});
  expect(res).toEqual(1000);
});
