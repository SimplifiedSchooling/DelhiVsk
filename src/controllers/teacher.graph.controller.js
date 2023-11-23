const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { teacherGraphService } = require('../services');

const getTeacherCountBySchoolManagement = catchAsync(async (req, res) => {
  const result = await teacherGraphService.getTeacherCountBySchoolManagement();
  res.status(httpStatus.CREATED).send(result);
});

const getTeacherStatsByDistrict = catchAsync(async (req, res) => {
  const result = await teacherGraphService.getTeacherStatsByDistrict(req.body.DistrictName);
  res.status(httpStatus.CREATED).send(result);
});

const getTeacherCountByZone = catchAsync(async (req, res) => {
  const result = await teacherGraphService.getTeacherCountByZone(req.body.zoneName);
  res.status(httpStatus.CREATED).send(result);
});

const getTeacherCountBySchool = catchAsync(async (req, res) => {
  const result = await teacherGraphService.getTeacherCountBySchoolName(req.body.schname);
  res.status(httpStatus.CREATED).send(result);
});

const getTeacherData = catchAsync(async (req, res) => {
  const { postdesc, schname } = req.body;
  const teacherData = await teacherGraphService.getTeacherCountByPostdescAndSchoolName(postdesc, schname);
  res.status(httpStatus.CREATED).send(teacherData);
});

const getTeacherCountBySchoolName = catchAsync(async (req, res) => {
  const teacherData = await teacherGraphService.getTeacherCountAndDataBySchoolName(req.body.schname);
  res.status(httpStatus.CREATED).send(teacherData);
});

module.exports = {
  getTeacherCountBySchoolManagement,
  getTeacherStatsByDistrict,
  getTeacherCountByZone,
  getTeacherCountBySchool,
  getTeacherData,
  getTeacherCountBySchoolName,
};
