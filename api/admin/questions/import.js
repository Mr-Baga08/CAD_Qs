// api/admin/questions/import.js
import connectDB from '../../../lib/db';
import Question from '../../../lib/models/question';
import { authMiddleware, adminMiddleware } from '../../../lib/middleware';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { questions } = req.body;
    
    // Insert new questions
    const result = await Question.insertMany(questions, { ordered: false });
    
    res.json({ 
      message: 'Questions imported successfully',
      count: result.length 
    });
  } catch (error) {
    console.error('Error importing questions:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      res.status(400).json({ message: 'Some questions already exist' });
    } else {
      res.status(500).json({ message: 'Error importing questions' });
    }
  }
}

export default adminMiddleware(authMiddleware(handler));