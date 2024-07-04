import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { getQuestions, getAnswers, postQuestion, postAnswer, markQuestionHelpful, markAnswerHelpful, reportQuestion, reportAnswer } from './controllers/questions.js';
const router = express.Router();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join('/Users/tylerjohnson/hackreactor/rfp2404/arrow_sdc/questions/client/public')));




router.get('/answers', getAnswers);
router.post('/answers', postAnswer);
router.put('/helpful', markQuestionHelpful);
router.put('/report', reportQuestion);
app.use('/qa/questions/:question_id', router);


router.get('/questions', getQuestions);
router.post('/questions', postQuestion);
router.put('/answers/:answer_id/helpful', markAnswerHelpful);
router.put('/answers/:answer_id/report', reportAnswer);
app.use('/qa', router);





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});