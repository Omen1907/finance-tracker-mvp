const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // add this to .env
});

module.exports = pool;
