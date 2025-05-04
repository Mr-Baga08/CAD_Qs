// lib/models/feedback.js
import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  experience: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  clarity: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  suggestions: {
    type: String,
    default: ''
  },
  recommend: {
    type: String,
    enum: ['Yes', 'No'],
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
export default Feedback;