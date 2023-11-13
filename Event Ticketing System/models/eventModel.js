/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-import-module-exports */
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, 'Event must have a name'],
  },
  eventDate: {
    type: Date,
    required: [true, 'Event must have a starting date'],
  },
  postedDate: {
    type: Date,
    default: Date.now(),
  },
  category: {
    type: [String],
    required: [true, 'Event must have at least one category'],
  },
  eventLocation: {
    type: String,
    required: [
      true,
      'Event must have a location if its an online event put online in the event location field',
    ],
  },
  summary: {
    type: String,
    required: [true, 'Event must have a summary'],
  },
  price: {
    type: mongoose.Schema.Types.Mixed,
    required: [
      true,
      'Price is required if the price is free just put free on the price field',
    ],
    validate: {
      validator: function (data) {
        if (typeof data === 'string') {
          return data === 'free';
        }
        if (typeof data === 'number') {
          return true;
        }
        return false;
      },
      message: 'if the price is free just put "free"',
    },
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Event need an organizer'],
  },
  description: {
    type: String,
    required: [true, 'Event must have a description'],
  },
  imageCover: {
    type: String,
    required: [true, 'Event must have an image cover'],
  },
});

eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'organizer',
    select: 'firstName lastName',
  });

  next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
