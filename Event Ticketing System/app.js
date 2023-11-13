/* eslint-disable import/extensions */
import express from 'express';
import morgan from 'morgan';
import eventRouter from './routes/eventRouter.js';
import userRouter from './routes/userRoutes.js';
import bookingRouter from './routes/bookingRoute.js';
import globalErrorHandler from './errors/errorHandler.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/events', eventRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use(globalErrorHandler);

export default app;
