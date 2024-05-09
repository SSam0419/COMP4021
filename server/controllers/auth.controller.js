const fs = require("fs");
const bcrypt = require("bcrypt");

const signOut = (req, res) => {
  console.log("Sign-out request received");
  const user = req.session.user;
  if (user) {
    delete global.onlinePlayerList[user.username];
    delete req.session.user;
    res.json({ status: "success", message: "Sign-out successful" });
  } else {
    res.json({ status: "error", message: "User is not signed in" });
  }
};

const validate = (req, res) => {
  console.log("Validate request received");
  const user = req.session.user;
  if (!user) {
    return res.json({
      status: "error",
      message: "User is not signed in",
    });
  }

  const users = JSON.parse(fs.readFileSync("data/users.json"));

  if (user.username in users) {
    return res.json({
      status: "success",
      user: { username: user.username },
    });
  }
};

const signIn = (req, res) => {
  console.log("Sign-in request received");
  const { username, password } = req.body;

  //check if already signed in
  if (global.onlinePlayerList[username]) {
    return res.json({
      status: "error",
      message: "User is already signed in",
    });
  }

  // read data from data/users.json
  const users = JSON.parse(fs.readFileSync("data/users.json"));

  if (users[username]) {
    // compare the password
    bcrypt.compare(password, users[username].password, (error, result) => {
      if (result) {
        req.session.user = { username };
        res.json({ status: "success", user: { username } });
      } else {
        res.json({ status: "error", message: "Incorrect password" });
      }
    });
  } else {
    res.json({ status: "error", message: "Username does not exist" });
  }
};

const signUp = (req, res) => {
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
};

module.exports = { signOut, signIn, signUp, validate };
