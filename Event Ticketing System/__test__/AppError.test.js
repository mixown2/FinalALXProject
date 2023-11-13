import { it, describe, expect } from 'vitest';
import AppError from '../errors/AppError';

describe('AppError class', () => {
  it('should have an error message', () => {
    const error = new AppError('this is an error', 500);

    const result = 'this is an error';

    expect(error.message).toBe(result);
  });

  it('should have a status of failure if status code is from 400-499', () => {
    const error = new AppError('this is an error', 404);

    const result = 'failure';

    expect(error.status).toBe(result);
  });

  it('should have a status of error if status code is from above 400', () => {
    const error = new AppError('this is an error', 500);

    const result = 'error';

    expect(error.status).toBe(result);
  });
});
