require('dotenv').config();
const { Client } = require('pg');

const connection = {
  host: process.env.HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  post: process.env.PORT
};

const db = new Client(connection);

module.exports = db;