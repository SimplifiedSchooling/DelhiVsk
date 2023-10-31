const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { studentService } = require('../services');

const getStudentData = catchAsync(async (req, res) => {
  const result = await studentService.storeStudentDataInMongoDB();
  res.status(httpStatus.CREATED).send(result);
});

const studentData = catchAsync(async (req, res) => {
  const result = await studentService.studentData();
  res.send(result);
});
module.exports = {
  getStudentData,
  studentData,
};
