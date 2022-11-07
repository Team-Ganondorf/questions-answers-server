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
    `SELECT q.question_id, q.question_body, TO_CHAR(TO_TIMESTAMP(q.question_date / 1000), 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') as question_date,
    q.asker_name, q.question_helpfulness,
    CASE q.reported
      WHEN 0 THEN false
      ELSE true
    END as reported,
    CASE
      WHEN count(a.id) = 0 THEN '{}'
      ELSE (json_build_object(a.id, json_build_object(
        'id', a.id, 'body', a.body, 'date', TO_CHAR(TO_TIMESTAMP(a.date / 1000), 'YYYY-MM-DD"T"HH24:MI:SS.MSZ'), 'answerer_name', a.answerer_name, 'helpfulness', a.helpfulness
      )))
    END as answers
    FROM questions q LEFT JOIN answers a
    ON q.question_id = a.question_id AND a.reported = 0
    WHERE q.reported = 0
    GROUP BY q.question_id, a.id
    OFFSET ${start} ROWS
    FETCH NEXT ${count} ROWS ONLY;`
  )
  .then((data) => {
    console.log(data[0].rows);
  })
  .catch((err) => console.log(err))
};

const getAnswers = (question_id, start, count) => {
  return db.queryAsync(
    `SELECT a.id as answer_id, a.body, TO_CHAR(TO_TIMESTAMP(a.date / 1000), 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') as date, a.answerer_name, a.helpfulness,
    CASE
      WHEN count(p.id) = 0 THEN '[]'
      ELSE json_agg(json_build_object('id', p.id, 'url', p.url))
    END as photos
    FROM answers a LEFT JOIN photos p
    ON a.id = p.answer_id
    WHERE a.question_id = ${question_id} AND a.reported = 0
    GROUP BY a.id, p.id
    OFFSET ${start} ROWS
    FETCH NEXT ${count} ROWS ONLY;`
  )
  .then((data) => {
    return data[0].rows;
  })
  .catch((err) => console.log(err))
};

module.exports = {
  db,
  getQuestions,
  getAnswers
};