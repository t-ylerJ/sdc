--Initialize Questions table
CREATE TABLE questions (
  id SERIAL,
  product_id INTEGER,
  body VARCHAR(255),
  date_written VARCHAR(14) DEFAULT current_date,
  asker_name VARCHAR(255),
  asker_email VARCHAR(50),
  reported SMALLINT DEFAULT 0,
  helpful SMALLINT DEFAULT 0,
  PRIMARY KEY (id)
);
--Load Questions table using .csv files
COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
  FROM '/Users/tylerjohnson/hackreactor/sdc/questions.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX IF NOT EXISTS product_idx ON questions(product_id);
ALTER TABLE questions ALTER COLUMN date_written TYPE date USING to_timestamp(date_written::bigint/1000)::text::date;
-- ALTER TABLE questions ALTER COLUMN dates TYPE VARCHAR(30) USING to_char(dates, 'Mon/DD/YYYY')

CREATE TABLE answers (
  id SERIAL,
  question_id INTEGER,
  body VARCHAR(255),
  date_written VARCHAR(14) DEFAULT current_date,
  answerer_name VARCHAR(255),
  answerer_email VARCHAR(50),
  reported SMALLINT DEFAULT 0,
  helpful SMALLINT DEFAULT 0,
  PRIMARY KEY (id)
);
COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
  FROM '/Users/tylerjohnson/hackreactor/sdc/answers.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX IF NOT EXISTS answer_idx ON answers (question_id, reported);
ALTER TABLE answers ALTER COLUMN date_written TYPE date USING to_timestamp(date_written::bigint/1000)::text::date;

CREATE TABLE answers_photos (
  id SERIAL,
  answer_id INTEGER,
  url VARCHAR(255),
  PRIMARY KEY(id)
);
COPY answers_photos(id, answer_id, url)
  FROM '/Users/tylerjohnson/hackreactor/sdc/answers_photos.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX IF NOT EXISTS answer_photos_idx ON answers_photos(id);

--INITAL QUERIES:

-- GET /qa/questions, parameters(product_id, page, count)
CREATE OR REPLACE FUNCTION getQuestions(product INT, page_num INT, count INT)
RETURNS TABLE(id INT, product_id INT, body VARCHAR(255), date_written DATE, asker_name VARCHAR(255), asker_email VARCHAR(50), reported SMALLINT, helpful SMALLINT) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM questions WHERE questions.product_id = $1
  ORDER BY questions.id OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY;
END;
$$ LANGUAGE PLPGSQL;

SELECT * FROM getQuestions(45000, 1, 5);
-- 7.520 ms


-- GET /qa/questions/:question_id/answers
CREATE OR REPLACE FUNCTION getAnswersWithPhotos(question INT, page_num INT, count INT)
RETURNS TABLE(id INT, question_id INT, body VARCHAR(255), date_written DATE, answerer_name VARCHAR(255), answerer_email VARCHAR(50), reported SMALLINT, helpful SMALLINT, photos jsonb) AS $$
BEGIN
  RETURN QUERY
  SELECT
    answers.id, answers.question_id, answers.body, answers.date_written, answers.answerer_name, answers.answerer_email, answers.reported, answers.helpful,
    COALESCE(
      jsonb_agg(jsonb_build_object(
        'id', answers_photos.id,
        'url', answers_photos.url))
      FILTER (WHERE answers_photos.id IS NOT NULL), '{}') AS photos
  FROM answers
    LEFT JOIN answers_photos ON answers_photos.answer_id = answers.id
  WHERE answers.question_id = $1 AND answers.reported = 0
  GROUP BY answers.id
  ORDER BY answers.id OFFSET ($2-1) ROWS FETCH FIRST $3 ROWS ONLY;
END;
$$ LANGUAGE PLPGSQL;

SELECT * FROM getAnswersWithPhotos(70,1,5);
--311.423 ms

CREATE EXTENSION pg_trgm;
CREATE EXTENSION btree_gin;
CREATE INDEX IF NOT EXISTS answer_photos_idx ON answers_photos USING GIN (id::INTEGER);

