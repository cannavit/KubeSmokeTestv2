// Create ingress with express and swagger-jsdoc
// import dependencies
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

// define swagger options
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "KubeSomkeTest API",
      description: "Api Documentation",
      // servers: ['http://localhost:3000'],
      version: "1.0.0",
    },
    host: "localhost:5009",
    basePath: "/",
    swagger: "2.0",
    paths: { },
    definitions: { },
    responses: { },
    parameters: { },
    securityDefinitions: { }
  },
  // ['.routes/*.js']
  apis: ["./routes/*"],
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Create Swagger documentation declaration
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Add culster-coverage
app.use("/cluster-coverage", require("./routes/cluster-coverage"));
// Add service-coverage
app.use("/service-coverage", require("./routes/service-coverage"));
// Add resource-up
app.use("/resource-up", require("./routes/resource-up"));
// Add config-coverage
app.use("/config-coverage", require("./routes/config-coverage"));
// Add swagger-scanner
app.use("/swagger-scanner", require("./routes/swagger-scanner"));

// app.use("/resource-up", require("./routes/resource-up"));
// app.use("/endpoint-coverage", require("./routes/endpoint-coverage"));

const port = 5009;
app.listen(port, () => {
  console.log("Server is running on port " + port);
});

// sudo kill -9 $(sudo lsof -t -i:5000)

// sudo kill -9 $(sudo lsof -t -i:5005)
// fuser -n tcp -k 5000
// sh killport 5000 

// netstat -ltnp | grep -w '5000'