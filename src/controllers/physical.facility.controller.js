const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { schoolService } = require('../services');
const ApiError = require('../utils/ApiError');


const storeSchoolDataInMongoDB = catchAsync(async (req, res) => {
    const result = await schoolService.storeSchoolDataInMongoDB();
    res.status(httpStatus.CREATED).send(result);
  });
  module.exports = {
    storeSchoolDataInMongoDB,
  };