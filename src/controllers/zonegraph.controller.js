const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { zonegraph } = require('../services');

const getAllSchoolStudentTeacherDataByZoneName = catchAsync(async (req, res) => {
  const { zoneName } = req.body;
  const result = await zonegraph.getAllSchoolStudentTeacherDataByZoneName(zoneName);
  res.status(httpStatus.CREATED).send(result);
});

const getAllSchoolStudentTeacherDataByDistrict = catchAsync(async (req, res) => {
  const { districtName } = req.body;
  const result = await zonegraph.getAllSchoolStudentTeacherDataByDistrict(districtName);
  res.status(httpStatus.CREATED).send(result);
});
const getAllSchoolStudentTeacherDataBySchoolName = catchAsync(async (req, res) => {
  const { schoolId } = req.body;
  const result = await zonegraph.getAllSchoolStudentTeacherDataBySchoolName(schoolId);
  res.status(httpStatus.CREATED).send(result);
});


const getBySchManagement = catchAsync(async (req, res) => {
  const { SchManagement } = req.query;
  const result = await zonegraph.getBySchManagement(SchManagement);
  res.status(httpStatus.CREATED).send(result);
});
module.exports = {
  getAllSchoolStudentTeacherDataByZoneName,
  getAllSchoolStudentTeacherDataByDistrict,
  getAllSchoolStudentTeacherDataBySchoolName,
  getBySchManagement,
};
