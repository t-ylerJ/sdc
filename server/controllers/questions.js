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
    SELECT * FROM qnaschema.questions WHERE qnaschema.questions.product_id = ${question.product}
    ORDER BY qnaschema.questions.id
    OFFSET ${offset} ROWS
    FETCH FIRST ${question.count} ROWS ONLY;
    `
    res.status(201).json(questions);
  } catch(err) {
    res.status(500).send('Error getting questions')
    console.error('Error getting questions', err)
  }
}



export async function getAnswersWithPhotos(req, res) {

  const answer = {
    question_id: req.query.question_id,
    page_num: req.query.page || 1,
    count: req.query.count || 5,
  }
  const offset = (answer.page_num - 1) * answer.count;
console.log('test')
  try {
    const answers = await sql`
    SELECT
    qnaschema.answers.id, qnaschema.answers.question_id, qnaschema.answers.body, qnaschema.answers.date_written, qnaschema.answers.answerer_name, qnaschema.answers.answerer_email, qnaschema.answers.reported, qnaschema.answers.helpful,
    COALESCE(
      jsonb_agg(jsonb_build_object(
        'id', qnaschema.answers_photos.id,
        'url', qnaschema.answers_photos.url))
      FILTER (WHERE qnaschema.answers_photos.id IS NOT NULL), '{}') AS photos
    FROM qnaschema.answers
    LEFT JOIN qnaschema.answers_photos ON qnaschema.answers_photos.answer_id = qnaschema.answers.id
    WHERE qnaschema.answers.question_id = ${answer.question_id} AND qnaschema.answers.reported = 0
    GROUP BY qnaschema.answers.id
    ORDER BY qnaschema.answers.id
    OFFSET ${offset} ROWS
    FETCH FIRST ${answer.count} ROWS ONLY;
    `
    res.status(201).json(answers);
  } catch(err) {
      res.status(500).send('Error getting answers')
      console.error('Error getting answers', err)
  }
}



