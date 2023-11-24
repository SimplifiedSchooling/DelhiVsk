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

const getStudentCountBySchoolName = catchAsync(async (req, res) => {
  const { SCHOOL_NAME } = req.body;
  const result = await studentService.getStudentCountBySchoolName(SCHOOL_NAME);
  res.send(result);
});

const getStudentCountBySchoolNameAndGender = catchAsync(async (req, res) => {
  const { SCHOOL_NAME, Gender } = req.body;
  const result = await studentService.getStudentCountBySchoolNameAndGender(SCHOOL_NAME, Gender);
  res.send(result);
});
module.exports = {
  getStudentData,
  studentData,
  getStudentCountBySchoolName,
  getStudentCountBySchoolNameAndGender,
};
