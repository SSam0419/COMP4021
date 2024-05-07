const express = require("express");
const app = express();
const path = require("path");

// Serve static files from the "public" directory
const projectRoot = path.resolve(__dirname, "..", "..");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(projectRoot + "/public/pages/sign-in/sign-in.html");
});

router.get("/sign-up", (req, res) => {
  res.sendFile(projectRoot + "/public/pages/sign-up/sign-up.html");
});

router.get("/game-rooms", (req, res) => {
  res.sendFile(projectRoot + "/public/pages/game-rooms/game-rooms.html");
});

router.get("/game-play", (req, res) => {
  res.sendFile(projectRoot + "/public/pages/game-play/game-play.html");
});

module.exports = router;
