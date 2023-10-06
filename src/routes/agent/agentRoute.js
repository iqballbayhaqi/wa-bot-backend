const express = require("express");
const router = express.Router();

const {
  createAgent,
  login,
} = require("../../controllers/agent/agentController");

router.post("/agent", createAgent);
router.post("/login", login);

module.exports = router;
