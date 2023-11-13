/* eslint-disable import/extensions */
import multer from 'multer';
import Features from '../lib/Features.js';
import Event from '../models/eventModel.js';
import AppError from '../errors/AppError.js';
import catchAsync from '../errors/catchAsync.js';

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/events');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const filename = `event-${req.user._id}-${Date.now()}.${ext}`;
    req.user.filename = filename;
    cb(null, filename);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('File must be an image', 400));
  }
};

const upload = multer({
  storage: multerStorage,
  filter: multerFilter,
  limits: {
    fileSize: 5242880,
  },
});

const uploadCoverImage = upload.single('imageCover');

const createEvent = catchAsync(async (req, res, next) => {
  const requestBody = { ...req.body };
  requestBody.organizer = req.user;
  requestBody.imageCover = req.user.filename;
  const event = await Event.create(requestBody);

  res.status(201).json({
    status: 'success',
    data: {
      event,
    },
  });
});

const deleteEvent = catchAsync(async (req, res, next) => {
  await Event.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getAllEvents = catchAsync(async (req, res, next) => {
  const queryObject = new Features(Event.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const events = await queryObject.query;

  res.status(200).json({
    status: 'success',
    data: {
      events,
    },
  });
});

const getEventById = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      event,
    },
  });
});

const getMyEvents = catchAsync(async (req, res, next) => {
  const events = await Event.find({ organizer: req.user._id.toString() });

  res.status(200).json({
    status: 'success',
    data: {
      events,
    },
  });
});

const updateEvent = catchAsync(async (req, res, next) => {
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidation: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      event: updatedEvent,
    },
  });
});

export default {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
  getEventById,
  getMyEvents,
  uploadCoverImage,
};
