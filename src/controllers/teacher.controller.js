const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { teacherService } = require('../services');

const getTeacherData = catchAsync(async (req, res) => {
  const result = await teacherService.storeTeacherDataInMongoDB();
  res.status(httpStatus.CREATED).send(result);
});

const getTeacher = catchAsync(async (req, res) => {
  const result = await teacherService.getTeacher();
  res.send(result);
});

const getTeacherBySchoolAndGender = catchAsync(async (req, res) => {
  const { gender, schname } = req.body;
  const result = await teacherService.getTeacherBySchoolAndGender(gender, schname);
  res.send(result);
});

const searchTeachers = catchAsync(async (req, res) => {
  const result = await teacherService.searchTeachers(req.body.searchQuery);
  res.send(result);
});
module.exports = {
  getTeacherData,
  getTeacher,
  getTeacherBySchoolAndGender,
  searchTeachers,
};
