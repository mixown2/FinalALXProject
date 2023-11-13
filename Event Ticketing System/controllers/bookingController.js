/* eslint-disable import/extensions */
import Booking from '../models/bookingModel.js';
import AppError from '../errors/AppError.js';
import catchAsync from '../errors/catchAsync.js';

const createBooking = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();
  const { eventId } = req.params;

  if (!eventId) {
    return next(new AppError('Event id is required', 400));
  }

  const booking = await Booking.create({
    event: eventId,
    user: userId,
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

const getMyBooking = catchAsync(async (req, res, next) => {
  const query = Booking.find({
    user: req.user._id.toString(),
  });

  const bookings = await query.populate({ path: 'event' });
  res.status(200).json({
    status: 'success',
    data: {
      bookings,
    },
  });
});

const deleteBooking = catchAsync(async (req, res, next) => {
  await Booking.findByIdAndDelete(req.params.eventId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export default { createBooking, deleteBooking, getMyBooking };
