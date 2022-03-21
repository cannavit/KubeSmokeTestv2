const router = require("express").Router();
const fs = require("fs");
const path = require("path");
// Import shell
const shell = require("shelljs");
var uuid = require('uuid');
const execByService = require("../utils/execByService");

/**
 * @swagger
 *  /config-coverage/check-endpoint-services:
 *    get:
 *      tags:
 *      - "config-coverage"
 *      summary: "Apply the smoke-test using all test with the criteria config-coverage"
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

router.get("/check-endpoint-services", async function (request, response) {

  let args = [
    "",
    "",
    "--check-endpoint-services",
    "--namespace=" + request.query.namespace,
  ];

    // Calculate the delta time for execute the test
    let startTime = new Date();
    
    testCommand = `kubectl describe svc/$$serviceName -n ${request.query.namespace}  | grep -i 'endpoint' | grep -i 'none'`

    resultServiceTest = await execByService(request.query.namespace, testCommand);

    let passTest = resultServiceTest.passTestAll
  
    let statusCode = 200;
    if (passTest == "failure") {
      statusCode = 600;
    }

    let endTime = new Date();

    let deltaTime = endTime - startTime;
  
    return response.status(statusCode).send({
      duration: deltaTime,
      criterial: 'config-coverage',
      smokeTest: "check-endpoint-services",
      message: "This is one smoke-test",
      testId: uuid.v4(),
      testSuccess: passTest,
      numPassedTests: 1,
      numFailedTestSuites: 1,
      testResults: resultServiceTest.resultServiceTest,
    });
  
});


/**
 * @swagger
 *  /config-coverage/check-endpoint-services:
 *    get:
 *      tags:
 *      - "config-coverage"
 *      summary: "Apply the smoke-test using all test with the criteria config-coverage"
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

 router.get("/check-endpoint-services", async function (request, response) {

    let args = [
      "",
      "",
      "--check-endpoint-services",
      "--namespace=" + request.query.namespace,
    ];
      
  
      testCommand = `kubectl --namespace=${request.query.namespace}  exec service/$$serviceName -- df -h --block-size=1GB $mountPath | awk \"{print $5}\" | grep -v \"Use%\"| sed \"s/%//\" | awk -F: \"$1>=90\"`
      resultServiceTest = await execByService(request.query.namespace, testCommand);
    
      console.log(resultServiceTest)
    
      let passTest = resultServiceTest.passTestAll
    
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
