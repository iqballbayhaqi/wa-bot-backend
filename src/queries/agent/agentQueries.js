const ADD_AGENT = "INSERT INTO agent (username, password) VALUES ($1, $2)";
const GET_LOGIN_AGENT =
  "SELECT * FROM agent WHERE username = $1 AND password = $2;";

module.exports = {
  ADD_AGENT,
  GET_LOGIN_AGENT,
};
