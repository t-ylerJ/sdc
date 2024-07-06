import sql from '../../db/index.js'


export async function getQuestions(req, res) {
  const question = {
    product:req.query['product_id'],
    page_num: req.query.page || 1,
    count: req.query.count || 5,
  }
  const offset = (question.page_num - 1) * question.count;

  try {
    const questions = await sql`
    SELECT * FROM questions WHERE product_id = ${question.product}
    AND reported = 0
    ORDER BY id
    OFFSET ${offset} ROWS
    FETCH FIRST ${question.count} ROWS ONLY;
    `
    res.status(200).json(questions);
  } catch(err) {
    res.status(500).send('Error getting questions')
    console.error('Error getting questions', err)
  }
}

export async function postQuestion(req, res) {
  const question = {
    body: req.body.body,
    name: req.body.asker_name,
    email: req.body.asker_email,
    product_id: req.body.product_id
  }

  try {
    await sql`
    INSERT INTO questions (body, asker_name, asker_email, product_id)
    VALUES (${question.body}, ${question.name}, ${question.email}, ${question.product_id});
    `
    res.status(201).send('Created');
  } catch(err) {
    res.status(500).send('Error posting question');
    console.error('Error posting question', err);
  }
}

export async function markQuestionHelpful(req, res) {
  try {
    await sql`
      UPDATE questions
      SET helpful = helpful +1
      WHERE id = ${req.query.question_id}
    `
    res.status(204).send();
  } catch(err) {
      res.status(500).send('Error marking question as helpful');
      console.error('Error marking question as helpful:', err);
  }
}

export async function reportQuestion(req, res) {

  try {
    await sql`
      UPDATE questions
      SET reported = reported +1
      WHERE id = ${req.query.question_id}
    `
    res.status(204).send();
  } catch(err) {
      res.status(500).send('Error marking question as reported');
      console.error('Error marking question as reported:', err);
  }
}

export async function getAnswers(req, res) {
  const answer = {
    question_id: req.query.question_id,
    page_num: req.query.page || 1,
    count: req.query.count || 5,
  }
  const offset = (answer.page_num - 1) * answer.count;

  try {
    const answers = await sql`
    SELECT
    answers.id, answers.question_id, answers.body, answers.date_written, answers.answerer_name, answers.answerer_email, answers.reported, answers.helpful,
    COALESCE(
      jsonb_agg(jsonb_build_object(
        'id', answers_photos.id,
        'url', answers_photos.url))
      FILTER (WHERE answers_photos.id IS NOT NULL), '{}') AS photos
    FROM answers
    LEFT JOIN answers_photos ON answers_photos.answer_id = answers.id
    WHERE answers.question_id = ${answer.question_id} AND answers.reported = 0
    GROUP BY answers.id
    ORDER BY answers.id
    OFFSET ${offset} ROWS
    FETCH FIRST ${answer.count} ROWS ONLY;
    `
    res.status(200).json(answers);
  } catch(err) {
      res.status(500).send('Error getting answers')
      console.error('Error getting answers', err)
  }
}


export async function postAnswer(req, res) {
  const answer = {
    question_id: req.query.question_id,
    body: req.body.body,
    name: req.body.answerer_name,
    email: req.body.answerer_email,
    photos: req.body.photos
  }
  try {
    const postedAnswer = await (sql`
      INSERT INTO answers (question_id, body, answerer_name, answerer_email, photos)
      VALUES (${answer.question_id}, ${answer.body}, ${answer.name}, ${answer.email}, ${answer.photos})
      RETURNING id;
      `
    )
    const answerID = postedAnswer[0].id;

    res.status(201).send('Answer posted');
  } catch(err) {
    res.status(500).send('Error posting Answer');
    console.error('Error posting Answer:', err);
  }
}

export async function markAnswerHelpful(req, res) {
  try {
    await sql`
      UPDATE answers
      SET helpful = helpful +1
      WHERE id = ${req.query.answer_id};
    `
    res.status(204).send();
  } catch(err) {
      res.status(500).send('Error marking answer as helpful');
      console.error('Error marking answer as helpful:', err);
  }
}
export async function reportAnswer(req, res) {

  try {
    await sql`
      UPDATE answers
      SET reported = reported +1
      WHERE id = ${req.query.answer_id};
    `
    res.status(204).send();
  } catch(err) {
      res.status(500).send('Error marking answer as reported');
      console.error('Error marking answer as reported:', err);
  }
}


