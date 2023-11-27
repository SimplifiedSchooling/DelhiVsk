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
  const { Schoolid } = req.body;
  const result = await studentService.getStudentCountBySchoolName(Schoolid);
  res.send(result);
});

const getStudentCountBySchoolNameAndGender = catchAsync(async (req, res) => {
  const { Schoolid, Gender } = req.body;
  const result = await studentService.getStudentCountBySchoolNameAndGender(Schoolid, Gender);
  res.send(result);
});

const getStudentCountBySchoolNameAndStatus = catchAsync(async (req, res) => {
  const { Schoolid, status } = req.body;
  const result = await studentService.getStudentCountBySchoolNameAndStatus(Schoolid, status);
  res.send(result);
});
module.exports = {
  getStudentData,
  studentData,
  getStudentCountBySchoolName,
  getStudentCountBySchoolNameAndGender,
  getStudentCountBySchoolNameAndStatus,
};
