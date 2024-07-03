import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { getQuestions, getAnswersWithPhotos, postQuestion } from './controllers/questions.js';
const router = express.Router();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join('/Users/tylerjohnson/hackreactor/rfp2404/arrow_sdc/questions/client/public')));




router.get('/answers', getAnswersWithPhotos);
app.use('/qa/questions/:question_id', router);


router.get('/questions', getQuestions);
router.post('/questions', postQuestion);
app.use('/qa', router);





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});