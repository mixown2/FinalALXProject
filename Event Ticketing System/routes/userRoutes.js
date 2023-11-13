/* eslint-disable import/extensions */
import express from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.route('/signup').post(authController.signup);

router.route('/login').post(authController.login);

router.route('/verifyEmail/:token').get(authController.verifyEmail);

router.route('/forgetPassword').post(authController.forgetPassword);

router.route('/recoverPassword/:token').get(authController.recoverPassword);

router.route('/me').get(authController.protectRoute, userController.getMe);

router
  .route('/updateMe')
  .patch(
    authController.protectRoute,
    userController.uploadUserProfile,
    userController.updateMe,
  );

router
  .route('/updatePassword')
  .patch(authController.protectRoute, userController.updatePassword);

router
  .route('/updateEmail')
  .patch(authController.protectRoute, userController.updateEmail);

export default router;
