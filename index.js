require("dotenv").config();
const express = require("express");
const connectDB = require("./config.js");
const bookRoute = require("./Routes/bookRoutes.js");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const userRoute = require("./Routes/userRoutes");

var cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: [
    " Access-Control-Allow-Origins ",
    "Content-Type,",
    "Authorization",
  ],
};

const port = 3003;
//  connectDB();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post("/jwt", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2hrs",
  });
  res.send({ token });
});

app.use("/books", bookRoute);

app.use("/users", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World! Server is raedy!");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("error:", error.message);
  }
};
startServer();

module.exports = app;