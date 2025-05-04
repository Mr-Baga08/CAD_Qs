// api/admin/questions/get.js
import connectDB from '../../../lib/db';
import Question from '../../../lib/models/question';
import { authMiddleware, adminMiddleware } from '../../../lib/middleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const questions = await Question.find().sort({ _id: 1 });
    res.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
}

export default adminMiddleware(authMiddleware(handler));