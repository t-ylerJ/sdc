(async () => {
  const { getQuestions, postQuestion, markQuestionHelpful, reportQuestion, getAnswers, postAnswer, markAnswerHelpful, reportAnswer } = await import('./server/controllers/questions.js');

  try{
      exports.getQuestion;
      exports.postQuestion;
      exports.markQuestionHelpful;
      exports.reportQuestion;
      exports.getAnswers;
      exports.postAnswer;
      exports.markAnswerHelpful;
      exports.reportAnswer;
    } catch(err) {
      console.error('Error importing modules', err);
    }

  })();
