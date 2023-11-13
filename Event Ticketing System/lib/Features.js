export default class Features {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const excludedQuery = ['page', 'sort', 'limit', 'field'];
    const queryObject = { ...this.queryString };
    Object.keys(queryObject).forEach((el) => {
      if (excludedQuery.includes(el)) {
        delete queryObject[el];
      }
    });

    let stringQuery = JSON.stringify(queryObject);
    stringQuery = stringQuery.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(stringQuery));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort);
    }

    return this;
  }

  limitFields() {
    if (this.queryString.field) {
      this.query = this.query.select(this.queryString.field);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
