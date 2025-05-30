import mysql from 'mysql2/promise';

export const singlestore = mysql.createPool({
  waitForConnections: true,
  connectionLimit: 10,
  host: process.env.SINGLESTORE_HOST,
  port: 3333,
  user: 'esma-82fb5',
  password: process.env.SINGLESTORE_PASSWORD,
  database: 'db_esma_5b01d',
  ssl: {}
});