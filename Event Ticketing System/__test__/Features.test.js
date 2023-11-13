import { it, expect, describe, vi } from 'vitest';
import Features from '../lib/Features';
import Event from '../models/eventModel';

vi.mock('../models/eventModel', () => ({
  default: {
    find: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  },
}));

describe('filter()', () => {
  it('should filter based on the query string', async () => {
    const featuresObj = new Features(Event.find(), { price: 'free' }).filter();

    await featuresObj.query;

    expect(Event.find).toHaveBeenCalledWith({ price: 'free' });
  });

  it('should remove page, sort, limit and field', async () => {
    const featuresOj = new Features(Event.find(), {
      page: 1,
      price: 'free',
      limit: 10,
      filed: '_id',
    }).filter();

    await featuresOj.query;

    expect(Event.find).toHaveBeenCalledWith({ price: 'free' });
  });

  it('should work for $gte, $lte, $gt ...', async () => {
    const featuresObj = new Features(Event.find(), {
      price: { gte: 200 },
    }).filter();

    await featuresObj.query;

    expect(Event.find).toHaveBeenCalledWith({
      price: {
        $gte: 200,
      },
    });
  });
});

describe('sort()', () => {
  it('should call the sort method with the query string', async () => {
    const featuresObj = new Features(Event.find(), { sort: 'price' }).sort();

    await featuresObj.query;

    expect(Event.sort).toHaveBeenCalledWith('price');
  });
});

describe('limitFields()', () => {
  it('should call the select method with the query string if query string is present', async () => {
    const featuresObj = new Features(Event.find(), {
      field: 'eventName',
    }).limitFields();

    await featuresObj.query;

    expect(Event.select).toHaveBeenCalledWith('eventName');
  });

  it('should call the select method with -__v if query string is not present', async () => {
    const featuresObj = new Features(Event.find(), {}).limitFields();

    await featuresObj.query;

    expect(Event.select).toHaveBeenCalledWith('-__v');
  });
});

describe('paginate()', () => {
  it('should call the skip method with a value of 0 if page is not provided', async () => {
    const featuresObj = new Features(Event.find(), {}).paginate();

    await featuresObj.query;

    expect(Event.skip).toHaveBeenCalledWith(0);
  });

  it('should call the skip method with a value of 0 if page is 1', async () => {
    const featuresObj = new Features(Event.find(), { page: 1 }).paginate();

    await featuresObj.query;

    expect(Event.skip).toHaveBeenCalledWith(0);
  });

  it('should call the limit method with the value of 12 if limit filed is not provided', async () => {
    const featuresObj = new Features(Event.find(), {}).paginate();

    await featuresObj.query;

    expect(Event.limit).toHaveBeenCalledWith(12);
  });

  it('should call the limit method with the value of the query string', async () => {
    const featuresObj = new Features(Event.find(), { limit: 10 }).paginate();

    await featuresObj.query;

    expect(Event.limit).toHaveBeenCalledWith(10);
  });

  it('should call the skip and limit method based on the value of the page', async () => {
    const featuresObj = new Features(Event.find(), { page: 2 }).paginate();

    await featuresObj.query;

    expect(Event.skip).toHaveBeenCalledWith(12);
    expect(Event.limit).toHaveBeenCalledWith(12);
  });
});
