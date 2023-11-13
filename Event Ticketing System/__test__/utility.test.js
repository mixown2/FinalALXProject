import { it, describe, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { signToken, createSendToken } from '../lib/utility';
import { mockResponse } from '../__mock__/mockObject';

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockReturnValue('a signed token'),
  },
}));

describe('signToken()', () => {
  it('should sign a jwt token and return it', () => {
    const userId = '114';
    process.env.JWT_SECRET = 'this is the jwt secret';
    process.env.JWT_EXPIRES_IN = '90d';

    const token = signToken(userId);

    expect(token).toBeDefined();
    expect(jwt.sign).toHaveBeenCalledOnce();
    expect(jwt.sign).toHaveBeenCalledWith({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  });
});

describe('createSendToken()', () => {
  const user = {
    _id: '114',
  };
  it('should send a cookie in the response', () => {
    const response = mockResponse();
    createSendToken(user, 200, response);

    expect(response.cookie).toHaveBeenCalledOnce();
  });

  it('should have a status code of 200', () => {
    const response = mockResponse();
    createSendToken(user, 200, response);

    expect(response.status).toHaveBeenCalledOnce();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledOnce();
  });
});
