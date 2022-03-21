const router = require("express").Router();
const fs = require("fs");
const path = require("path");
// Import shell
const shell = require("shelljs");
var uuid = require('uuid');


/**
 * @swagger
 *  /cluster-coverage/check-nodes:
 *    get:
 *      tags:
 *      - "cluster-coverage"
 *      summary: "Apply the smoke-test using all test with the criteria cluster-coverage"
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

router.get("/check-nodes", async function (request, response) {

  let args = [
    "",
    "",
    "--check-nodes",
    "--namespace=" + request.query.namespace,
  ];

    // Calculate the delta time for execute the test
    let startTime = new Date();


    command = "kubectl get nodes | grep -v \"NAME\" | grep -v \"Ready\""
    reportCommand = "kubectl get nodes"
    jestTestPath = null
    defaultValue = null

    let passTest = 'failure'

    let testRespone = await shell.exec(command, {
      silent: true
    }).stdout;

    let statusCode = 200;

    if (testRespone == '' ) {
      passTest = 'success'
      statusCode = 600;
    }

    console.log(testRespone)

    let endTime = new Date();

    let deltaTime = endTime - startTime;

    return response.status(statusCode).send({
      duration: deltaTime,
      criterial: 'cluster-coverage',
      smokeTest: "check-nodes",
      message: "This is one smoke-test",
      testId: uuid.v4(),
      testSuccess: passTest,
      numPassedTests: 1,
      numFailedTestSuites: 1,
      testResults: testRespone,
    });
  
});


/**
 * @swagger
 *  /cluster-coverage/check-memory:
 *    get:
 *      tags:
 *      - "cluster-coverage"
 *      summary: "Apply the smoke-test using all test with the criteria cluster-coverage"
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

 router.get("/check-memory", async function (request, response) {

    command = "kubectl describe nodes | head -32 | tail -4 | grep \"MemoryPressure\" | grep -v \"False\""
    reportCommand =  "kubectl describe nodes | head -32 | tail -4 | grep \"MemoryPressure\""
    jestTestPath = null
    defaultValue = null

    // Calculate the delta time for execute the test
    let startTime = new Date();

    let passTest = 'failure'

    let testRespone = await shell.exec(command, {
      silent: true
    }).stdout;

    let statusCode = 200;

    if (testRespone == '' ) {
      passTest = 'success'
      statusCode = 600;
    }

    console.log(testRespone)

    let endTime = new Date();
    let deltaTime = endTime - startTime;

    return response.status(statusCode).send({
      duration: deltaTime,
      criterial: 'cluster-coverage',
      smokeTest: "check-memory",
      message: "This is one smoke-test",
      testId: uuid.v4(),
      criteriaDictionary: 'cluster-coverage',
      testSuccess: passTest,
      numPassedTests: 1,
      numFailedTestSuites: 1,
      testResults: testRespone,
    });
  
});


/**
 * @swagger
 *  /cluster-coverage/check-disk:
 *    get:
 *      tags:
 *      - "cluster-coverage"
 *      summary: "Apply the smoke-test using all test with the criteria cluster-coverage"
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

 router.get("/check-disk", async function (request, response) {

    command ="kubectl describe nodes | head -32 | tail -4 | grep \"DiskPressure\" | grep -v \"False\""
    reportCommand =  "kubectl describe nodes | head -32 | tail -4 | grep \"DiskPressure\""

    let passTest = 'failure'

    // Calculate the delta time for execute the test
    let startTime = new Date();

    let testRespone = await shell.exec(command, {
      silent: true
    }).stdout;

    let statusCode = 200;

    if (testRespone == '' ) {
      passTest = 'success'
      statusCode = 600;
    }

    console.log(testRespone)

    let endTime = new Date();
    let deltaTime = endTime - startTime;

    return response.status(statusCode).send({
      duration: deltaTime,
      criterial: 'cluster-coverage',
      smokeTest: "check-disk",
      message: "This is one smoke-test",
      testId: uuid.v4(),
      criteriaDictionary: 'cluster-coverage',
      testSuccess: passTest,
      numPassedTests: 1,
      numFailedTestSuites: 1,
      testResults: testRespone,
    });
  
});





/**
 * @swagger
 *  /cluster-coverage/check-events:
 *    get:
 *      tags:
 *      - "cluster-coverage"
 *      summary: "Apply the smoke-test using all test with the criteria cluster-coverage"
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

 router.get("/check-events", async function (request, response) {

  command = `kubectl get events -n ${request.query.namespace}| grep -i \"ERROR\"`

  let passTest = 'failure'

  // Calculate the delta time for execute the test
  let startTime = new Date();

  let testRespone = await shell.exec(command, {
    silent: true
  }).stdout;

  let statusCode = 200;

  if (testRespone == '' ) {
    passTest = 'success'
    statusCode = 600;
  }

  console.log(testRespone)

  // Calculate the delta time for execute the test
  let endTime = new Date();
  let deltaTime = endTime - startTime;

  return response.status(statusCode).send({
    duration: deltaTime,
    criterial: 'cluster-coverage',
    smokeTest: "check-events",
    message: "This is one smoke-test",
    testId: uuid.v4(),
    criteriaDictionary: 'cluster-coverage',
    testSuccess: passTest,
    numPassedTests: 1,
    numFailedTestSuites: 1,
    testResults: testRespone,
  });

});




module.exports = router;
