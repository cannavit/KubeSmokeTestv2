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
      version: "1.0.0"
    }
    // schemes: ["http"],
    // basePath: "/api/v1",
  },
  // ['.routes/*.js']
  apis: ["./routes/*"]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Create Swagger documentation declaration
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/cluster-coverage", require("./routes/cluster-coverage"));

// app.use("/service-coverage", require("./routes/service-coverage"));
// app.use("/ingress-coverage", require("./routes/ingress-coverage"));
// app.use("/resource-up", require("./routes/resource-up"));
// app.use("/endpoint-coverage", require("./routes/endpoint-coverage"));

app.listen(5004, () => {
  console.log("Server is running on port 5004");
});

