/* eslint-disable import/no-import-module-exports */
/* eslint-disable import/no-extraneous-dependencies */
import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'User must have first name'],
    validate: [validator.isAlpha, 'Please provide your real first name'],
  },
  lastName: {
    type: String,
    required: [true, 'User must have last name'],
    validate: [validator.isAlpha, 'Please provide your real last name'],
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  emailStatus: {
    type: String,
    enum: ['unverified', 'verified'],
    default: 'unverified',
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationTokenExpiresIn: {
    type: Date,
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    min: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (pass) {
        return this.password === pass;
      },
      message: 'password should be the same',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  country: {
    type: String,
    default: 'Ethiopia',
    enum: ['Ethiopia'],
  },
  city: {
    type: String,
    required: [true, 'Please provide your city'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
  },
  passwordRecoveryToken: String,
  passwordRecoveryTokenExpiresIn: Date,
  profileImage: String,
});

userSchema.virtual('events', {
  ref: 'Event',
  foreignField: 'organizer',
  localField: '_id',
});

const createToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  return token;
};

userSchema.methods.hashPassword = async function () {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
};

userSchema.methods.checkPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.generateEmailVerificationToken = function () {
  const token = createToken();

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.emailVerificationTokenExpiresIn = Date.now() + 10 * 60 * 1000;

  return token;
};

userSchema.methods.generatePasswordRecoveryToken = function () {
  const token = createToken();

  this.passwordRecoveryToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.passwordRecoveryTokenExpiresIn = Date.now() + 10 * 60 * 1000;

  return token;
};

userSchema.methods.checkEmailTokenExpires = function () {
  return this.emailVerificationTokenExpiresIn > new Date(Date.now());
};

userSchema.methods.checkPasswordRecoveryTokenExpires = function () {
  return this.passwordRecoveryTokenExpiresIn > new Date(Date.now());
};

const User = mongoose.model('User', userSchema);
export default User;
