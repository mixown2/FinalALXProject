import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: [true, 'eventId is required'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'userId is required'],
  },
  bookedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
