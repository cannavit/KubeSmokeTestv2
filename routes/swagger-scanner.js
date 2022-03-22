// http://localhost:5009/api-docs/swagger-ui-init.js
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
// Import shell
const shell = require("shelljs");
var uuid = require("uuid");
const execByService = require("../utils/execByService");
const axios = require("axios");

async function example_getBasicApi(namespace) {
  const urlSwagger = HOST + "/api-docs/swagger-ui-init.js";

  request = await axios.get(urlSwagger);

  console.log(request.data);

  if (request.status != 200) {
    return {
      status: request.status,
      message: "Error in the request",
    };
  }

  data = request.data;

  initPosition = data.search('"paths": ') + 8;
  endPosition = data.search('"definitions": ') - 6;

  data = data.substring(initPosition, endPosition);

  // Parse Json Data
  data = JSON.parse(data);
  console.log(Object.keys(data));

  dataRequest = [];

  for (var key in data) {
    criterial = data[key].get.tags[0];

    parameters = data[key].get.parameters;
    pamarsObj = {};

    for (const params of parameters) {
      if (params.name == "namespace") {
        pamarsObj[params.name] = namespace;
      } else {
        pamarsObj[params.name] = params["x-example"];
      }
    }
    // http://localhost:5009/service-coverage/check-deployments?namespace=smoke-test&runTests=true
    body = {
      path: HOST + key,
      parameters: pamarsObj,
      criterial: criterial,
    };

    if (criterial != "swagger-scanner") {
      dataRequest.push(body);
    }
  }

  // Create one for by data items
  return dataRequest;
}

// example_getBasicApi();

HOST = "http://localhost:5009";

/**
 * @swagger
 *  /swagger-scanner/apis-list:
 *    get:
 *      tags:
 *      - "swagger-scanner"
 *      summary: "Apply the smoke-test using all test with the criteria swagger-scanner"
 *      parameters:
 *      - in: query
 *        name: "namespace"
 *        description: "The namespace of the cluster"
 *        x-example: "smoke-test"
 *      - in: query
 *        name: "runTests"
 *        description: "Run the smoke-test generated and get results"
 *        x-example: true
 *      security:
 *      - bearerAuth: []
 *      responses:
 *        200:
 *          description: "successful operation"
 */

router.get("/apis-list", async function (request, response) {
  // Calculate the delta time for execute the test

  namespace = request.query.namespace;

  data = await example_getBasicApi(namespace);

  return response.status(200).send({
    apis: data,
  });
});

module.exports = router;
