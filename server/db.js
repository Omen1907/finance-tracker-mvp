const { Pool } = require("pg");
require("dotenv").config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });
const pool = new Pool({
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  // connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  // },

  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
