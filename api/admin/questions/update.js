// api/admin/questions/update.js
import connectDB from '../../../lib/db';
import Question from '../../../lib/models/question';
import { authMiddleware, adminMiddleware } from '../../../lib/middleware';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { id } = req.query;
    const updates = req.body;
    
    const question = await Question.findByIdAndUpdate(id, updates, { new: true });
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json({ message: 'Question updated successfully', question });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Error updating question' });
  }
}

export default adminMiddleware(authMiddleware(handler));