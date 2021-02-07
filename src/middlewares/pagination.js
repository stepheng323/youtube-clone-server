import { respondWithWarning } from '../helper/responseHandler';

// eslint-disable-next-line max-len
const paginate = (model, queryOption, selector, populate, sort, filter) => async (req, res, next) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  let query;

  const results = {};
  if (endIndex < (await model.countDocuments())) {
    results.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit,
    };
  }
  query = model.find(queryOption);

  if (filter === 'video') {
    query = model.find({ video: req.params.videoId });
  }
  if (filter === 'user') {
    query = model.find({ user: req.auth.id || req.params.userId });
  }
  if (filter === 'likedBy') {
    query = model.find({ likedBy: req.auth.id });
  }
  if (selector.length) {
    query = query.select(selector);
  }
  if (sort) {
    query = query.sort(sort);
  }
  if (populate.length) {
    populate.forEach((item) => {
      query = query.populate(item);
    });
  }
  try {
    results.data = await query.limit(limit).skip(startIndex);
  } catch (e) {
    return respondWithWarning(res, 500, e.message);
  }
  res.paginatedResults = results;
  return next();
};

export default paginate;