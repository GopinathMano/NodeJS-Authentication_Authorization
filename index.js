const express = require("express");
const postRoute = require("./routes/post.route");
const usersRoute = require("./routes/users.route");
const mongo = require("./mongo");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3001;
(async () => {
  try {
    // connecting to mongoDB database
    await mongo.connect();

    // parse req body to json format:
    app.use(express.json());

    // Logging  middleware
    app.use("/", (req, res, next) => {
      console.log("middleware");
      next();
    });

    // Routes
    app.use("/users", usersRoute);

    // auth token middleware
    app.use((req, res, next) => {
      const token = req.headers["auth-token"];
      if (token) {
        try {
          req.user = jwt.verify(token, "Dangerlog");

          next();
        } catch (error) {
          res.sendStatus(401);
        }
      } else {
        res.sendStatus(401);
      }
    });
    app.use("/post", postRoute);

    // listener
    app.listen(port, () => {
      console.log(`server is running in port ${port}`);
    });
  } catch (error) {
    console.log("error in starting the server", error);
  }
})();
