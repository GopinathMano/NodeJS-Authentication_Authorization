const route = require("express").Router();
const service = require("../services/users.services");

// CRUD operations : route operations

// read /post
route.post("/register", service.register);

// POST /post
route.post("/login", service.login);

module.exports = route;
