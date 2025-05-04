// api/quiz/submit.js
import connectDB from '../../lib/db';
import Question from '../../lib/models/question';
import QuizResult from '../../lib/models/quiz-result';
import { authMiddleware } from '../../lib/middleware';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { answers, timeSpent } = req.body;
    const userId = req.user.id;

    // Get the questions with correct answers
    const questions = await Question.find({}).limit(50);
    
    // Calculate score
    let score = 0;
    answers.forEach((answer, index) => {
      if (index < questions.length && answer === questions[index].correctAnswer) {
        score++;
      }
    });

    const scorePercentage = (score / questions.length) * 100;

    // Save quiz result
    const result = new QuizResult({
      userId,
      answers,
      score: scorePercentage,
      timeSpent
    });

    await result.save();

    res.json({
      message: 'Quiz submitted successfully',
      score: scorePercentage,
      correctAnswers: questions.map(q => q.correctAnswer)
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
}

export default authMiddleware(handler);