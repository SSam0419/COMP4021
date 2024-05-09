const express = require("express");
const router = express.Router();

const {
  validate,
  signIn,
  signUp,
  signOut,
} = require("../controllers/auth.controller.js");

router.get("/validate", validate);

router.post("/sign-in", signIn);

router.post("/sign-up", signUp);

router.get("/sign-out", signOut);

module.exports = router;
