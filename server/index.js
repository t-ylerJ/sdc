import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { getQuestions, getAnswers, postQuestion, postAnswer, markQuestionHelpful, markAnswerHelpful, reportQuestion, reportAnswer } from './controllers/questions.js';
const router = express.Router();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(path.join('/Users/tylerjohnson/hackreactor/rfp2404/arrow_sdc/questions/client/public')));


// router.get('/questions', getQuestions);
// router.post('/questions', postQuestion);
// router.put('questions/:question_id/helpful', markQuestionHelpful);
// router.put('questions/:question_id/report', reportQuestion);

// router.get('questions/:question_id/answers', getAnswers);
// router.post('questions/:question_id/answers', postAnswer);
// router.put('/answers/:answer_id/helpful', markAnswerHelpful);
// router.put('/answers/:answer_id/report', reportAnswer);

// app.use('/qa', router);

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


//Example requests to assist with testing:
//getQuestions:
//http://localhost:3000/qa/questions?product_id=998998 //update product_id in query
//getAnswer:
//postAnswer:
//http://localhost:3000/qa/questions/:question_id/answers?question_id=1
// {
//   "body": "Est eum rerum mollitia inventore veniam.",
//   "answerer_name": "Jayce.Romaguera17",
//   "answerer_email": "first.last@gmail.com",
//   "photos": ["https://images.unsplash.com/photo-1553830591-2f39e38a013c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2760&q=80", "https://images.unsplash.com/photo-1522032238811-74bc59578599?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"]
// }
