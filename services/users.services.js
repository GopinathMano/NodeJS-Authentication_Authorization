const mongo = require("../mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const services = {
  async register(req, res) {
    try {
      // request body validation

      // check Email exists
      const user = await mongo.users.findOne({ email: req.body.email });
      if (user) return res.status(400).send({ error: "user already exists" });
      //   encrypting password

      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);

      // insert data if user is new
      await mongo.users.insertOne(req.body);
      res.send({ message: "user registered successfully" });
    } catch (error) {
      console.log("error registering user", error);
      res.sendStatus(500);
    }
  },
  async login(req, res) {
    try {
      // request body validation

      // check email exists are not?
      const user = await mongo.users.findOne({ email: req.body.email });
      if (!user) return res.status(401).send({ error: "user not exists" });

      // check password validation

      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (!isValid)
        return res
          .status(403)
          .send({ error: "Email or password is invalid please try again" });

      // generating toke for authendication
      const authToken = jwt.sign(
        { userid: user._id, emal: user.email },
        "Dangerlog",{expiresIn:"10d"}
      );
      console.log(authToken);
      res.send({ authToken });
    } catch (error) {
      console.log("error Login user", error);
      res.sendStatus(500);
    }
  },
};

module.exports = services;
