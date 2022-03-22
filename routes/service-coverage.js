const router = require("express").Router();
const fs = require("fs");
const { required } = require("nodemon/lib/config");
const path = require("path");
// Import shell
const shell = require("shelljs");
var uuid = require("uuid");
const execByService = require("../utils/execByService");

/**
 * @swagger
 *  /service-coverage/check-pods-running:
 *    get:
 *      tags:
 *      - "service-coverage"
 *      summary: "Apply the smoke-test using all test with the criteria service-coverage"
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

router.get("/check-pods-running", async function (request, response) {

  // Calculate the delta time for execute the test
  let startTime = new Date();


  command = `kubectl get pods --namespace=${request.query.namespace} | grep -v "NAME" | grep -v "Running"`;
  reportCommand = "kubectl get nodes --namespace=$$namespace";

  let passTest = "failure";

  let testRespone = await shell.exec(command, {
    silent: true,
  }).stdout;

  let statusCode = 200;

  if (testRespone == "") {
    passTest = "success";
    statusCode = 600;
  }

  console.log(testRespone);

  let endTime = new Date();
  let deltaTime = endTime - startTime;

  return response.status(statusCode).send({
    duration: deltaTime,
    criterial: 'service-coverage',
    smokeTest: "check-pods-running",
    message: "This is one smoke-test",
    testId: uuid.v4(),
    criteriaDictionary: "service-coverage",
    testSuccess: passTest,
    numPassedTests: 1,
    numFailedTestSuites: 1,
    testResults: testRespone,
    test: 2,
  });
});

/**
 * @swagger
 *  /service-coverage/check-deployments:
 *    get:
 *      tags:
 *      - "service-coverage"
 *      summary: "Apply the smoke-test using all test with the criteria service-coverage"
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

router.get("/check-deployments", async function (request, response) {

  
  // Calculate the delta time for execute the test
  let startTime = new Date();


  command = `kubectl get deployment -n ${request.query.namespace} | grep "/" | grep -v "1/"`;

  let passTest = "failure";

  let testRespone = await shell.exec(command, {
    silent: true,
  }).stdout;

  let statusCode = 200;

  if (testRespone == "") {
    passTest = "success";
    statusCode = 600;
  }

  console.log(testRespone);

  let endTime = new Date();
  let deltaTime = endTime - startTime;

  return response.status(statusCode).send({
    duration: deltaTime,
    criterial: 'service-coverage',
    smokeTest: "check-deployments",
    message: "This is one smoke-test",
    testId: uuid.v4(),
    criteriaDictionary: "service-coverage",
    testSuccess: passTest,
    numPassedTests: 1,
    numFailedTestSuites: 1,
    testResults: testRespone,
  });
});

module.exports = router;

/**
 * @swagger
 *  /service-coverage/check-pods-logs:
 *    get:
 *      tags:
 *      - "service-coverage"
 *      summary: "Apply the smoke-test using all test with the criteria service-coverage"
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

 router.get("/check-pods-logs", async function (request, response) {

  // Calculate the delta time for execute the test
  let startTime = new Date();


  testCommand = `kubectl logs --since=3m service/$$serviceName --namespace=${request.query.namespace} | grep -i \"error\"`

  resultServiceTest = await execByService(request.query.namespace, testCommand);

  console.log(resultServiceTest)

  let passTest = resultServiceTest.passTestAll

  let statusCode = 200;
  if (passTest == "failure") {
    statusCode = 600;
  }

  let endTime = new Date();
  let deltaTime = endTime - startTime;


  return response.status(statusCode).send({
    duration: deltaTime,
    criterial: 'service-coverage',
    smokeTest: "check-pods-logs",
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


// kubectl get events -n $NAMESPACE