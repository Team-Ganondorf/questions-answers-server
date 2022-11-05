require('dotenv').config();
const express = require('express');
const db = require('../db/index.js').db;
const getQuestions = require('../db/index.js').getQuestions;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

/**
 * Routes
 */
app.get('/qa/questions', (req, res) => {
  let product_id = req.query.product_id;
  let page = req.query.page ? req.query.page : 1;
  let count = req.query.count ? req.query.count : 5;
  let start = (page - 1) * count;
  getQuestions(product_id, start, count)
    .then(() => console.log('success'))
    .catch((err) => console.log('failure'))
});


app.listen(process.env.PORT);
console.log(`server is listening at ${process.env.HOST}:${process.env.PORT}`);