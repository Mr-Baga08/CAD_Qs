// api/admin/questions/delete.js
import connectDB from '../../../lib/db';
import Question from '../../../lib/models/question';
import { authMiddleware, adminMiddleware } from '../../../lib/middleware';

async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { id } = req.query;
    
    const question = await Question.findByIdAndDelete(id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Error deleting question' });
  }
}

export default adminMiddleware(authMiddleware(handler));