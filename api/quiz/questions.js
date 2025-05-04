// api/quiz/questions.js
import connectDB from '../../lib/db';
import Question from '../../lib/models/question';
import { authMiddleware } from '../../lib/middleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Get 50 random questions from the database
    const questions = await Question.aggregate([{ $sample: { size: 50 } }]);
    
    // Remove the correctAnswer field from the response
    const questionForUser = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options
    }));

    res.json({ questions: questionForUser });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
}

export default authMiddleware(handler);