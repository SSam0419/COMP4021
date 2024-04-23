const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const router = express.Router();
const session = require("express-session");
const gameSession = session({
  secret: "game",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 300000 },
});
router.use(gameSession);

router.get("/validate", (req, res) => {
  console.log("Validate request received");
  const user = req.session.user;
  console.log(user);
  if (!user) {
    return {
      status: "error",
      error: "User is not signed in",
    };
  }

  const users = JSON.parse(fs.readFileSync("./data/users.json"));

  if (user.username in users) {
    return res.json({
      status: "success",
      user: { username: user.username },
    });
  }
});

router.post("/sign-in", (req, res) => {
  console.log("Sign-in request received");

  const { username, password } = req.body;

  // read data from data/users.json
  const users = JSON.parse(fs.readFileSync("data/users.json"));

  if (users[username]) {
    // compare the password
    bcrypt.compare(password, users[username].password, (error, result) => {
      if (result) {
        req.session.user = { username };
        res.json({ status: "success", message: "Sign-in successful" });
      } else {
        res.json({ status: "error", message: "Incorrect password" });
      }
    });
  } else {
    res.json({ status: "error", message: "Username does not exist" });
  }
});

router.post("/sign-up", (req, res) => {
  console.log("Sign-up request received");

  const { username, password } = req.body;
  console.log({ username, password });
  // read data from data/users.json
  const users = JSON.parse(fs.readFileSync("data/users.json"));

  if (users[username]) {
    res.json({ status: "error", message: "Username already exists" });
  } else {
    // hash the password
    bcrypt.hash(password, 10, (error, hash) => {
      if (error) {
        res.json({ status: "error", message: "Internal server error" });
      } else {
        // save the user
        users[username] = { password: hash };
        fs.writeFileSync("data/users.json", JSON.stringify(users));
        res.json({ status: "success", message: "Sign-up successful" });
      }
    });
  }
});

module.exports = router;
