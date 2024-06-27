--Initialize Questions table
CREATE TABLE questions (
  id SERIAL,
  product_id INTEGER,
  body VARCHAR(255),
  date_written VARCHAR(14),
  asker_name VARCHAR(255),
  asker_email VARCHAR(50),
  reported INTEGER,
  helpful INTEGER,
  PRIMARY KEY (id)
);
--Load Questions table using .csv files
COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) FROM '/Users/tylerjohnson/hackreactor/sdc/questions.csv' DELIMITER ',' CSV HEADER;
--Convert date_written from Unix to date
ALTER TABLE questions ALTER COLUMN date_written TYPE date USING to_timestamp(date_written::bigint/1000)::text::date;
--Display dates in requred format
-- ALTER TABLE questions ALTER COLUMN dates TYPE VARCHAR(30) USING to_char(dates, 'Mon/DD/YYYY')

CREATE TABLE answers (
  id SERIAL,
  question_id INTEGER,
  body VARCHAR(255),
  date_written VARCHAR(14),
  answerer_name VARCHAR(255),
  answerer_email VARCHAR(50),
  reported INTEGER,
  helpful INTEGER,
  PRIMARY KEY (id)
);
COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) FROM '/Users/tylerjohnson/hackreactor/sdc/answers.csv' DELIMITER ',' CSV HEADER;
ALTER TABLE answers ALTER COLUMN date_written TYPE date USING to_timestamp(date_written::bigint/1000)::text::date;
CREATE TABLE answers_photos (
  id SERIAL,
  answer_id INTEGER,
  url VARCHAR(255),
  PRIMARY KEY(id)
);
COPY answers_photos(id, answer_id, url) FROM '/Users/tylerjohnson/hackreactor/sdc/answers_photos.csv' DELIMITER ',' CSV HEADER;

--Query data
-- GET /qa/questions, parameters(product_id, page, count)

CREATE OR REPLACE FUNCTION getQuestions(product INT, page_num INT, count INT)
RETURNS TABLE(id INT, product_id INT, body VARCHAR(255), date_written DATE, asker_name VARCHAR(255), asker_email VARCHAR(50), reported INT, helpful INT) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM questions WHERE questions.product_id = $1
  ORDER BY questions.id OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY;
END;
$$ LANGUAGE PLPGSQL;

SELECT * FROM getQuestions(45000, 1, 5);
-- 793.214 ms
