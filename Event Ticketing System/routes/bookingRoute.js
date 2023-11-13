/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
import express from 'express';
import bookingController from '../controllers/bookingController.js';
import authController from '../controllers/authController.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protectRoute, bookingController.createBooking);

router
  .route('/myBookings')
  .get(authController.protectRoute, bookingController.getMyBooking);

export default router;
