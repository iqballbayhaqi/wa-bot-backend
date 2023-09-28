const Pool = require("pg").Pool;
require("dotenv").config({ path: "./.env.local" });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

module.exports = pool;
