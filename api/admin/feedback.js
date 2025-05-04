// api/admin/feedback.js
import connectDB from '../../lib/db';
import Feedback from '../../lib/models/feedback';
import { authMiddleware, adminMiddleware } from '../../lib/middleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const feedback = await Feedback.find()
      .populate('userId', 'name rollNumber email')
      .sort({ submittedAt: -1 });

    const stats = {
      avgExperience: 0,
      avgClarity: 0,
      recommendPercentage: 0
    };

    if (feedback.length > 0) {
      stats.avgExperience = feedback.reduce((sum, f) => sum + f.experience, 0) / feedback.length;
      stats.avgClarity = feedback.reduce((sum, f) => sum + f.clarity, 0) / feedback.length;
      stats.recommendPercentage = (feedback.filter(f => f.recommend === 'Yes').length / feedback.length) * 100;
    }

    res.json({ feedback, stats });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback' });
  }
}

export default adminMiddleware(authMiddleware(handler));