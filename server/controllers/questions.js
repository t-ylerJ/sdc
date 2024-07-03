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
    SELECT * FROM questions WHERE questions.product_id = ${question.product}
    ORDER BY questions.id
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
  console.log(question)
  try {
    await sql`
    INSERT INTO questions (body, asker_name, asker_email, product_id)
    VALUES (${question.body}, ${question.name}, ${question.email}, ${question.product_id});
    `
    res.status(201).send('Created')
  } catch(err) {
    res.status(500).send('Error posting question')
    console.error('Error posting question', err)
  }
}


export async function getAnswersWithPhotos(req, res) {
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



