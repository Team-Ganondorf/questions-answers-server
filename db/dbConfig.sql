CREATE DATABASE qanda;

\c qanda;

CREATE TABLE questions (
  question_id serial PRIMARY KEY,
  product_id INT NOT NULL,
  question_body VARCHAR (255),
  question_date BIGINT,
  asker_name VARCHAR (50),
  asker_email VARCHAR (75),
  question_helpfulness INT DEFAULT 0,
  reported INT DEFAULT 0
);

COPY questions
FROM '/Users/sarahhandley/Desktop/Atelier_API_Info/questions.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE answers (
  id serial PRIMARY KEY,
  question_id INT NOT NULL,
  body VARCHAR (255),
  date BIGINT,
  answerer_name VARCHAR (50),
  answerer_email VARCHAR (75),
  helpfulness INT DEFAULT 0,
  reported INT DEFAULT 0,
  FOREIGN KEY (question_id)
    REFERENCES questions (question_id)
);

COPY answers
FROM '/Users/sarahhandley/Desktop/Atelier_API_Info/answers.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE photos (
  id serial PRIMARY KEY,
  answer_id INT NOT NULL,
  url VARCHAR (255),
  FOREIGN KEY (answer_id)
    REFERENCES answers (id)
);

COPY photos
FROM '/Users/sarahhandley/Desktop/Atelier_API_Info/answers_photos.csv'
DELIMITER ','
CSV HEADER;

SELECT setval(pg_get_serial_sequence('questions', 'question_id'), MAX(question_id)) FROM questions;
SELECT setval(pg_get_serial_sequence('answers', 'id'), MAX(id)) FROM answers;
SELECT setval(pg_get_serial_sequence('photos', 'id'), MAX(id)) FROM photos;

CREATE INDEX product_id_index ON questions(product_id);
CREATE INDEX reported_questions ON questions(reported);

CREATE INDEX question_id_index ON answers(question_id);
CREATE INDEX reported_answers ON answers(reported);

CREATE INDEX answer_id_index ON photos(answer_id);

/*  Execute this file from the command line by typing:
 *    psql postgres < db/dbConfig.sql
 *  to create the database and the tables.*/