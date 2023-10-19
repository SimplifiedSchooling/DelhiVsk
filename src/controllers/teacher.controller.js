const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { teacherService } = require('../services');

const getTeacherData = catchAsync(async (req, res) => {
  const result = await teacherService.storeTeacherDataInMongoDB();
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  getTeacherData,
};
