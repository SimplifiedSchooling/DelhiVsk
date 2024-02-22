const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { totalTeacherService } = require('../services');

const getTeacherStats = catchAsync(async (req, res) => {
  const result = await totalTeacherService.getTeacherStats();
  res.status(httpStatus.CREATED).send(result);
});

const getTeacherStatsByDistrict = catchAsync(async (req, res) => {
  const result = await totalTeacherService.getTeacherStatsByDistrict(req.body.districtName);
  res.status(httpStatus.CREATED).send(result);
});

const getTeacherStatsByZone = catchAsync(async (req, res) => {
  const result = await totalTeacherService.getTeacherStatsByZone(req.body.zoneName);
  res.status(httpStatus.CREATED).send(result);
});

const getTeacherStatsBySchool = catchAsync(async (req, res) => {
  const result = await totalTeacherService.getTeacherStatsBySchool(req.body.schoolId);
  res.status(httpStatus.CREATED).send(result);
});

const searchTeachers = catchAsync(async (req, res) => {
  const result = await totalTeacherService.searchTeachers(req.body.searchQuery);
  res.status(httpStatus.CREATED).send(result);
});

const getTeachersAndGuestTeachersBySchoolId = catchAsync(async (req, res) => {
  const result = await totalTeacherService.getTeachersAndGuestTeachersBySchoolId(req.body.schoolId);
  res.status(httpStatus.CREATED).send(result);
});
module.exports = {
  getTeacherStats,
  getTeacherStatsByDistrict,
  getTeacherStatsByZone,
  getTeacherStatsBySchool,
  searchTeachers,
  getTeachersAndGuestTeachersBySchoolId,
};
