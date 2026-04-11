import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "postgres",
  database: "notifications",
  password: "postgres",
  port: 5432,
  max: 10
});

export default pool;