require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('../db/index.js').db;
const getQuestions = require('../db/index.js').getQuestions;
const getAnswers = require('../db/index.js').getAnswers;
const addQuestion = require('../db/index.js').addQuestion;
const addAnswer = require('../db/index.js').addAnswer;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * Routes
 */
app.get('/qa/questions', (req, res) => {
  let product_id = req.query.product_id;
  let page = req.query.page ? req.query.page : 1;
  let count = req.query.count ? req.query.count : 5;
  let start = (page - 1) * count;
  getQuestions(product_id, start, count)
    .then(() => console.log('questions req made it back to server'))
    .catch((err) => console.log('questions req failure'))
});

app.get('/qa/questions/:question_id/answers', (req, res) => {
  let question_id = req.params.question_id;
  let page = req.query.page ? req.query.page : 1;
  let count = req.query.count ? req.query.count : 5;
  let start = (page - 1) * count;
  getAnswers(question_id, start, count)
    .then((data) => res.send({
      'question': question_id,
      'page': page,
      'count': count,
      'results': data
    }))
    .catch((err) => {
      console.log('answers req failure', err);
      res.status(501);
    })
});

app.post('/qa/questions', (req, res) => {
  addQuestion(req.query)
    .then(() => {
      console.log('question post req success');
      res.end();
    })
    .catch((err) => {
      console.log('question post req failure', err)
      res.status(502);
    })
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  addAnswer(req.params.question_id, req.query)
    .then(() => {
      console.log('answer post req success');
      res.end();
    })
    .catch((err) => {
      console.log('answer post req failure', err)
      res.status(502);
    })
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  console.log('finish put question helpful req');
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  console.log('finish put question report req');
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  console.log('finish put answer helpful req');
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  console.log('finish put answer report req');
});

app.listen(process.env.PORT);
console.log(`server is listening at ${process.env.HOST}:${process.env.PORT}`);