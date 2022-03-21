const router = require("express").Router();
const fs = require("fs");
const path = require("path");
// Import shell
const shell = require("shelljs");
var uuid = require("uuid");
const execByService = require("../utils/execByService");

/**
 * @swagger
 *  /resource-up/volumes-free-space:
 *    get:
 *      tags:
 *      - "resource-up"
 *      summary: "Apply the smoke-test using all test with the criteria resource-up"
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

router.get("/volumes-free-space", async function (request, response) {
  let args = [
    "",
    "",
    "--volumes-free-space",
    "--namespace=" + request.query.namespace,
  ];

  // Calculate the delta time for execute the test
  let startTime = new Date();

  testCommand = `kubectl --namespace=${request.query.namespace}  exec service/$$serviceName -- df -h --block-size=1GB $mountPath | awk \"{print $5}\" | grep -v \"Use%\"| sed \"s/%//\" | awk -F: \"$1>=90\"`;
  resultServiceTest = await execByService(request.query.namespace, testCommand);

  console.log(resultServiceTest);

  let passTest = resultServiceTest.passTestAll;

  let statusCode = 200;
  if (passTest == "failure") {
    statusCode = 600;
  }

  let endTime = new Date();
  let deltaTime = endTime - startTime;

  return response.status(statusCode).send({
    duration: deltaTime,
    criterial: "resource-up",
    smokeTest: "volumes-free-space",
    message: "This is one smoke-test",
    testId: uuid.v4(),
    criteriaDictionary: "service-coverage",
    testSuccess: passTest,
    numPassedTests: 1,
    numFailedTestSuites: 1,
    testResults: resultServiceTest.resultServiceTest,
  });
});

/**
 * @swagger
 *  /resource-up/volumes-free-space:
 *    get:
 *      tags:
 *      - "resource-up"
 *      summary: "Apply the smoke-test using all test with the criteria resource-up"
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

router.get("/volumes-free-space", async function (request, response) {
  let args = [
    "",
    "",
    "--volumes-free-space",
    "--namespace=" + request.query.namespace,
  ];

  testCommand = `kubectl --namespace=${request.query.namespace}  exec service/$$serviceName -- df -h --block-size=1GB $mountPath | awk \"{print $5}\" | grep -v \"Use%\"| sed \"s/%//\" | awk -F: \"$1>=90\"`;
  resultServiceTest = await execByService(request.query.namespace, testCommand);

  console.log(resultServiceTest);

  let passTest = resultServiceTest.passTestAll;

  let statusCode = 200;
  if (passTest == "failure") {
    statusCode = 600;
  }

  return response.status(statusCode).send({
    message: "This is one smoke-test",
    testId: uuid.v4(),
    criteriaDictionary: "service-coverage",
    testSuccess: passTest,
    numPassedTests: 1,
    numFailedTestSuites: 1,
    testResults: resultServiceTest.resultServiceTest,
  });
});

module.exports = router;
