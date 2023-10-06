const httpError = require("http-errors");

const getError = (code) => {
  switch (code) {
    case "23502":
      return httpError.BadRequest();
    default:
      return httpError.InternalServerError();
  }
};

module.exports = getError;
