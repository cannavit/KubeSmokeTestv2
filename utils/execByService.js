const shell = require("shelljs");

async function execByService(namespace, testCommand) {

  getServices = `kubectl get services -n ${namespace} -o json`;

  let serviceList = await shell.exec(getServices, {
    silent: true,
  }).stdout;


  //Parse Json serviceList
  let serviceListJson = JSON.parse(serviceList);
  let resultServiceTest = []
  let passTestAll = "successs";
  //Save the result of the test by service
  for (let i = 0; i < serviceListJson.items.length; i++) {

    let serviceName = serviceListJson.items[i].metadata.name;

    let serviceTestResult = await shell.exec(testCommand.replace("$$serviceName", serviceName), {
      silent: true,
    }).stdout;


    // Check if test pass
    let passTest = "failure";
    if (serviceTestResult == "") {
      passTest = "success";
    }

    if (passTest == "failure") {
      passTestAll = "failure";
    }

    resultServiceTest.push({
      "serviceName": serviceName,
      "passTest": passTest,
      "testResult": serviceTestResult});

  }


  return {
    "resultServiceTest": resultServiceTest,
    "passTestAll": passTestAll
  };


}

module.exports = execByService;