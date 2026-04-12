import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",   // FIX HERE
  database: "notifications",
  password: "#@Harsh123",
  port: 5432,
  max: 10
});

export default pool;