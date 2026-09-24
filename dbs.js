import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "sql0314",
  database: "smartrecommend",
});

export default pool;