const { spec } = require("pactum");
const Promise = require('bluebird');

const specSync = Promise.promisifyAll(spec);

describe("GET requests", function() {

  it("should make GET questions request correctly", function() {
    specSync()
      .get("http://localhost:3000/qa/questions?product_id=1")
      .expectStatus(200)
      .expectJsonLike({
        "product_id": 1,
        "results": [
          {
            "question_id": 3518964,
            "question_body": "Does it fly like an eagle?",
            "question_date": "2022-11-10T12:10:09:000Z",
            "asker_name": "sarah7834",
            "question_helpfulness": 0,
            "reported": false,
            "answers": {
              "6879309": {
                "id": 6879309,
                "body": "test answer1",
                "date": "2022-11-10T12:16:15:000Z",
                "answerer_name": "answerer12345",
                "helpfulness": 0,
                "photos": [
                  {
                    "id": 2063764,
                    "url": "https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80"
                  },
                  {
                    "id": 2063765,
                    "url": "https://images.unsplash.com/photo-1511127088257-53ccfcc769fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
                  }
                ]
              },
              "6879310": {
                "id": 6879310,
                "body": "test answer2",
                "date": "2022-11-10T12:16:39:000Z",
                "answerer_name": "answerer12345",
                "helpfulness": 0,
                "photos": []
              }
            }
          },
          {
            "question_id": 3518965,
            "question_body": "Is it fluffy?",
            "question_date": "2022-11-10T12:10:51:000Z",
            "asker_name": "sarah7834",
            "question_helpfulness": 0,
            "reported": false,
            "answers": {}
          },
          {
            "question_id": 3518966,
            "question_body": "Can I light it on fire?",
            "question_date": "2022-11-10T12:14:11:000Z",
            "asker_name": "sarah7834",
            "question_helpfulness": 0,
            "reported": false,
            "answers": {}
          }
        ]
      })
  });

  it("should make GET answers request correctly", function() {
    specSync()
      .get("http://localhost:3000/qa/questions/1/answers?page=1&count=5")
      .expectStatus(200)
      .expectJsonLike(
        {
          "question": 1,
          "page": 1,
          "count": 5,
          "results": [
            {
              "answer_id": 6879311,
              "body": "test answer",
              "date": "2022-11-10T14:42:41:000Z",
              "answerer_name": "answerer12345",
              "helpfulness": 0,
              "photos": []
            }
          ]
        }
      )
  });

});

describe("POST requests", function() {

  it("should make POST question request correctly", function() {
    specSync()
      .post("http://localhost:3000/qa/questions?body=Does it fly like an eagle?&name=sarah7834&email=sar7834@gmail.com&product_id=4")
      .expectStatus(201)
    specSync()
      .get("http://localhost:3000/qa/questions?product_id=4")
      .expectJsonLike(
        {
          "product_id": "4",
          "results": [
              {
                  "question_id": 3518969,
                  "question_body": "Does it fly like an eagle?",
                  "question_date": "2022-11-10T15:56:12.000Z",
                  "asker_name": "sarah7834",
                  "question_helpfulness": 0,
                  "reported": false,
                  "answers": {}
              }
          ]
        }
      )
  });

  it("should make POST answer request correctly", function() {
    specSync()
      .post("http://localhost:3000/qa/questions/:question_id/answers?body=test answer&name=answerer12345&email=test@gmail.com&photos=[]")
      .expectStatus(201)
    specSync()
      .get("http://localhost:3000/qa/questions/1/answers?page=1&count=5")
      .expectJsonLike(
        {
          "question": 3518969,
          "page": 1,
          "count": 5,
          "results": [
            {
              "answer_id": 6879312,
              "body": "test answer",
              "date": "2022-11-10T14:42:41:000Z",
              "answerer_name": "answerer12345",
              "helpfulness": 0,
              "photos": []
            }
          ]
        }
      )
  });

});

describe("question PUT requests", function() {

  it("should make question helpful PUT request correctly", function() {
    specSync()
      .put("http://localhost:3000/qa/questions/:question_id/helpful")
      .expectStatus(204)
  });

  it("should make report question PUT request correctly", function() {
    specSync()
      .put("http://localhost:3000/qa/questions/:question_id/report")
      .expectStatus(204)
  });

});

describe("answer PUT requests", function() {

  it("should make answer helpful PUT request correctly", function() {
    specSync()
      .put("http://localhost:3000/qa/answers/:answer_id/helpful")
      .expectStatus(204)
  });

  it("should make report answer PUT request correctly", function() {
    specSync()
      .put("http://localhost:3000/qa/answers/:answer_id/report")
      .expectStatus(204)
  });

});