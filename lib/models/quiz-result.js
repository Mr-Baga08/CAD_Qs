// lib/models/quiz-result.js
import mongoose from 'mongoose';

const QuizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    type: Number,
    required: true
  }],
  score: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number
  }
});

const QuizResult = mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema);
export default QuizResult;