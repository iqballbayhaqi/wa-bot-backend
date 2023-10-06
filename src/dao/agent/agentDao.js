// dao/departmentDao.js
const pool = require("../../../db");
const agentQueries = require("../../queries/agent/agentQueries");
const errorHelper = require("../../helpers/dbErrorHelper");

const createAgent = async (username, password) => {
  try {
    await pool.query(agentQueries.ADD_AGENT, [username, password]);
  } catch (error) {
    const { code } = error;
    throw errorHelper(code);
  }
};

const getLoginAgent = async (username, password) => {
  try {
    return await pool.query(agentQueries.GET_LOGIN_AGENT, [username, password]);
  } catch (error) {
    const { code } = error;
    throw errorHelper(code);
  }
};

module.exports = { createAgent, getLoginAgent };
