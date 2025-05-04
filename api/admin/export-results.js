// api/admin/export-results.js
import connectDB from '../../lib/db';
import QuizResult from '../../lib/models/quiz-result';
import { authMiddleware, adminMiddleware } from '../../lib/middleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const results = await QuizResult.find()
      .populate('userId', 'name rollNumber email')
      .sort({ completedAt: -1 });

    // Generate CSV
    let csvContent = 'Name,Roll Number,Email,Score,Completion Date\n';
    results.forEach(result => {
      const row = [
        result.userId.name,
        result.userId.rollNumber,
        result.userId.email,
        result.score,
        new Date(result.completedAt).toLocaleString()
      ].join(',');
      csvContent += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=quiz_results.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Error exporting results' });
  }
}

export default adminMiddleware(authMiddleware(handler));