import { respondWithSuccess, respondWithWarning } from '../helper/responseHandler';
import { catchAsync } from '../utils/catchAsync';

export const getUserHistory = catchAsync(async (req, res, next) => {
  const { paginatedResults } = res;
  if (!paginatedResults.data.length) return respondWithWarning(res, 404, 'no history found');
  const { data: histories } = paginatedResults;
  const historyDates = histories.map(history => history.updatedAt);
  const distinctDates = [...new Set(historyDates)];


  // const ress = distinctDates.map(date => histories.filter(history => console.log(history)));

  console.log(historyDates);

  return respondWithSuccess(res, 200, 'video history fetched successfully', paginatedResults);
});

export const js = () => {

};
