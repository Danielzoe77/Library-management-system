// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management API',
      version: '1.0.0',
      description: 'API documentation for the Library Management System',
    },
    servers: [
      {
        url: 'http://localhost:3003', // change this if needed
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./Routes/bookRoutes.js', './Routes/userRoutes.js', './controllers/*.js'], // paths to route/controller files
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
