require('dotenv').config();
const { Client } = require('pg');
const Promise = require('bluebird');

const config = {
  host: process.env.HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  post: process.env.PORT
};

const connection = new Client(config);

const db = Promise.promisifyAll(connection, {multiArgs: true});

db.connectAsync()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.log(err));

const getQuestions = (product_id, start, count) => {
  return db.queryAsync(
    `SELECT q.question_id, q.question_body, q.question_date, q.asker_name, q.question_helpfulness, q.reported,
    a.id, a.question_id, a.body, a.date, a.answerer_name, a.helpfulness, a.reported
    FROM questions q, answers a
    WHERE q.reported = 0
    OFFSET ${start} ROWS
    FETCH NEXT ${count} ROWS ONLY;`
  )
  .then((data) => {
    console.log(data[0].rows);
  })
  .then(() => {
    return db.queryAsync(
      `SELECT id, body, date, answerer_name, helpfulness
      FROM answers
      WHERE reported = 0 AND question_id IN
      (SELECT question_id
      FROM questions
      WHERE reported = 0
      OFFSET ${start} ROWS
      FETCH NEXT ${count} ROWS ONLY)
      ORDER BY question_id;`
    )
  })
  .then((data) => console.log(data[0].rows))
  .catch((err) => console.log(err))
};

module.exports = {
  db,
  getQuestions
};