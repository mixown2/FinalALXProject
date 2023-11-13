import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest';
import User from '../models/userModel';
import authController from '../controllers/authController';
import { mockRequest, mockResponse } from '../__mock__/mockObject';
import { createSendToken } from '../lib/utility';
import AppError from '../errors/AppError';

vi.mock('../lib/Email', () => ({
  default: vi.fn().mockImplementation(() => ({
    sendEmailVerification: vi.fn().mockResolvedValue(),
    sendPasswordRecoveryEmail: vi.fn().mockResolvedValue(),
  })),
}));

vi.mock('../models/userModel');

vi.mock('../lib/utility.js');

const mockUser = {
  _id: '114',
  firstName: 'naod',
  lastName: 'ararsa',
  email: 'test@gmail.com',
  password: 'test-password',
  passwordConfirm: 'test-password',
  city: 'test-city',
  phoneNumber: '+251946612595',
  hashPassword: vi.fn().mockResolvedValue(`++${this.password}`),
  generateEmailVerificationToken: vi.fn().mockReturnValue('token'),
  checkPassword: vi.fn().mockResolvedValue(true),
  save: vi.fn().mockImplementation(() => Promise.resolve()),
};

describe('signup', () => {
  User.create.mockResolvedValue(mockUser);

  const request = mockRequest({
    firstName: 'naod',
    lastName: 'ararsa',
    email: 'test@gmail.com',
    password: 'test-password',
    passwordConfirm: 'test-password',
    city: 'test-city',
    phoneNumber: '+251946612595',
  });

  const response = mockResponse();

  beforeEach(async () => {
    await authController.signup(request, response, vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call mongoose create method', () => {
    expect(User.create).toHaveBeenCalledOnce();
  });

  it('should call the hash the password method', () => {
    expect(mockUser.hashPassword).toHaveBeenCalledOnce();
  });

  it('should generate verification token', async () => {
    await authController.signup(request, response, vi.fn());
    expect(mockUser.generateEmailVerificationToken).toHaveBeenCalledOnce();

    vi.clearAllMocks();
  });

  it('should call save mongoose method with validateBeforeSave to false', () => {
    expect(mockUser.save).toHaveBeenCalledOnce();
    expect(mockUser.save).toHaveBeenCalledWith({ validateBeforeSave: false });
  });

  it('should have a status code of 201', () => {
    expect(response.status).toHaveBeenCalledOnce();
    expect(response.status).toHaveBeenCalledWith(201);
  });

  it('should not let the response object get executed if something fails', async () => {
    vi.clearAllMocks();
    User.create.mockRejectedValueOnce();

    await authController.signup(request, response, vi.fn());

    expect(response.status).not.toHaveBeenCalled();
  });
});

describe('login()', () => {
  User.findOne.mockResolvedValue(mockUser);

  const request = mockRequest({
    email: 'test@gmail.com',
    password: 'test-password',
  });

  const response = mockResponse();

  beforeEach(async () => {
    await authController.login(request, response, vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call createSendToken if everything goes perfectly', async () => {
    await authController.login(request, response, vi.fn());
    await authController.login(request, response, vi.fn());
    expect(createSendToken).toHaveBeenCalled();
    expect(createSendToken).toHaveBeenCalledOnce();
  });

  it('should call next with the app error if password or email is missing', async () => {
    vi.clearAllMocks();
    const mockNext = vi.fn();
    delete request.body.email;
    await authController.login(request, response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(
      new AppError('email and password are required', 400),
    );
  });
});
