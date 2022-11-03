CREATE DATABASE qanda;

\c qanda;

CREATE TABLE questions (
  id serial PRIMARY KEY,
  product_id INT NOT NULL,
  body VARCHAR (255),
  date BIGINT,
  asker_name VARCHAR (50),
  asker_email VARCHAR (75),
  helpfulness INT DEFAULT 0,
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
    REFERENCES questions (id)
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

/*  Execute this file from the command line by typing:
 *    psql postgres < dbConfig.sql
 *  to create the database and the tables.*/