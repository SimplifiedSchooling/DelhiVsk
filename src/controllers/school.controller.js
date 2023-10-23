const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { schoolService } = require('../services');

const storeSchoolDataInMongoDB = catchAsync(async (req, res) => {
  const result = await schoolService.storeSchoolDataInMongoDB();
  res.status(httpStatus.CREATED).send(result);
});

const schoolData = catchAsync(async (req, res) => {
  const result = await schoolService.schoolData();
  res.status(httpStatus.CREATED).send(result);
});
module.exports = {
  storeSchoolDataInMongoDB,
  schoolData,
};
