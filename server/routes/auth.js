const express = require("express");
const router = express.Router();

const {
  validate,
  signIn,
  signUp,
} = require("../controllers/auth.controller.js");

router.get("/validate", validate);

router.post("/sign-in", signIn);

router.post("/sign-up", signUp);

module.exports = router;
