const HTTP_STATUS = require("../../constants/httpStatus");
const agentService = require("../../services/agent/agentService");

const createAgent = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    await agentService.createAgent(username, password);
    res.status(HTTP_STATUS.CREATED).send("Success");
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const agent = await agentService.isValidAgent(username, password);
  } catch (error) {
    next(error);
  }
};

module.exports = { createAgent, login };
