// api/feedback/submit.js
import connectDB from '../../lib/db';
import Feedback from '../../lib/models/feedback';
import { authMiddleware } from '../../lib/middleware';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { experience, clarity, suggestions, recommend } = req.body;
    const userId = req.user.id;

    const feedback = new Feedback({
      userId,
      experience,
      clarity,
      suggestions,
      recommend
    });

    await feedback.save();

    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
}

export default authMiddleware(handler);