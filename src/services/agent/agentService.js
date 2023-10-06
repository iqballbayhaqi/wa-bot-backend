// services/departmentService.js
const agentDao = require("../../dao/agent/agentDao");
const httpError = require("http-errors");

const createAgent = async (username, password) => {
  try {
    await agentDao.createAgent(username, password);
  } catch (error) {
    throw error;
  }
};

const isValidAgent = async (username, password) => {
  try {
    const agent = (await agentDao.getLoginAgent(username, password)).rows;
    if (agent.length) {
      return agent;
    } else {
      throw httpError.BadRequest();
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { createAgent, isValidAgent };
