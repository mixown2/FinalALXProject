/* eslint-disable import/extensions */
import multer from 'multer';
import User from '../models/userModel.js';
import AppError from '../errors/AppError.js';
import catchAsync from '../errors/catchAsync.js';
import Email from '../lib/Email.js';

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const filename = `user-${req.user._id}-${Date.now()}.${ext}`;
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

const uploadUserProfile = upload.single('userImage');

const getMe = catchAsync(async (req, res, next) => {
  const query = User.findById(req.user._id.toString());

  const user = await query.select('-password -role -__v');

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'To change your password use this endpoint /api/v1/users/updatePassword',
        400,
      ),
    );
  }

  if (req.body.email) {
    return next(
      new AppError(
        'To change your email use this endpoint /api/v1/users/updateEmail',
        400,
      ),
    );
  }

  const query = User.findByIdAndUpdate(
    req.user._id.toString(),
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      country: req.body.country,
      city: req.body.city,
      phoneNumber: req.body.phoneNumber,
      profileImage: req.user.filename,
    },
    { new: true, runValidation: true },
  );

  const user = await query.select('-password -role -__v');

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id.toString(),
    {
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    },
    { new: true, runValidation: true },
  );

  await user.hashPassword();

  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

const updateEmail = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id.toString(),
    {
      email: req.body.email,
    },
    { new: true, runValidation: true },
  );

  const token = user.generateEmailVerificationToken();

  user.emailStatus = 'unverified';

  const url = `${req.protocol}://${req.hostname}:${process.env.PORT}${req.baseUrl}/verifyEmail/${token}`;

  user.save({ validateBeforeSave: false });

  await new Email(user, url).sendEmailVerification();

  res.status(200).json({
    status: 'success',
    data: {
      email: user.email,
    },
  });
});

export default {
  getMe,
  updateMe,
  updatePassword,
  updateEmail,
  uploadUserProfile,
};
