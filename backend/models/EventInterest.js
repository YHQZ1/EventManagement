import mongoose from 'mongoose';

const eventInterestSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['interested', 'registered'],
    default: 'interested'
  }
}, {
  timestamps: true
});

// Prevent duplicate interests
eventInterestSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model('EventInterest', eventInterestSchema);