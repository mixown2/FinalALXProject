import { it, describe, expect, vi, beforeEach } from 'vitest';
import nodemailer from 'nodemailer';
import Email from '../lib/Email';
import AppError from '../errors/AppError';

vi.mock('nodemailer');

describe('Email class', () => {
  let email;
  const user = {
    firstName: 'naod',
    lastName: 'ararsa',
    email: 'test@gmail.com',
  };
  const url = 'some string';
  process.env.EMAIL = 'organization@gmail.com';
  process.env.NODE_ENV = 'development';

  beforeEach(() => {
    nodemailer.createTransport.mockClear();
    email = new Email(user, url);
  });

  it('should create a email object with name, to , from and url properties', () => {
    expect(email).toHaveProperty('name', 'naod ararsa');
    expect(email).toHaveProperty('to', user.email);
    expect(email).toHaveProperty('from', 'organization@gmail.com');
    expect(email).toHaveProperty('url', 'some string');
  });

  it('should call the nodemailer.createTransport() method', () => {
    email.createTransport();

    expect(nodemailer.createTransport).toHaveBeenCalledOnce();
  });

  it('should  call sendMail method from nodemailer', async () => {
    const mockedTransporter = {
      sendMail: vi.fn(),
    };

    nodemailer.createTransport.mockReturnValueOnce(mockedTransporter);
    await email.send('verifyEmail', 'subject');

    expect(mockedTransporter.sendMail).toHaveBeenCalledOnce();
  });

  it('should return an AppError with message something went wrong and a status code of 500', () => {
    process.env.NODE_ENV = 'undefined';

    const result = email.createTransport();

    expect(result).toBeInstanceOf(AppError);
    expect(result).toHaveProperty('statusCode', 500);
    expect(result).toHaveProperty('status', 'error');
    expect(result).toHaveProperty('isOperational', true);
    expect(result).toHaveProperty('message', 'Something went wrong');
  });
});
