import { vi } from 'vitest';

const mockRequest = (body) => {
  const req = {};
  req.body = body;

  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  return res;
};

export { mockResponse, mockRequest };
