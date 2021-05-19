"use strict";

const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const shipmentSchema = require("../schemas/shipmentSchema");

const { shipProduct } = require("../shipItApi");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  let {productId, name, addr, zipcode} = req.body;
  const result = jsonschema.validate({productId, name, addr, zipcode}, shipmentSchema);
  // console.log("RESULT OF VALIDATION-->", result);
  if (!result.valid) {
    let errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }
  
  const shipId = await shipProduct({ productId, name, addr, zipcode });
  return res.json({ shipped: shipId });
});


module.exports = router;