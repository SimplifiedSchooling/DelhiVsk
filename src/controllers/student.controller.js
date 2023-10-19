const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { studentService } = require('../services');

const getStudentData = catchAsync(async (req, res) => {
  const result = await studentService.storeStudentDataInMongoDB();
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  getStudentData,
};
