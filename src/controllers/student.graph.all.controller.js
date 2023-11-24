const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { studentGraphsAllService } = require('../services');

const getStudentStats = catchAsync(async (req, res) => {
  const result = await studentGraphsAllService.getStudentCount();
  res.status(httpStatus.CREATED).send(result);
});
const getStudentStatsByDistrictName = catchAsync(async (req, res) => {
  const { districtName } = req.body;
  const result = await studentGraphsAllService.getStudentCountByDistrictName(districtName);
  res.status(httpStatus.CREATED).send(result);
});
const getStudentStatsByZoneName = catchAsync(async (req, res) => {
  const { zoneName } = req.body;
  const result = await studentGraphsAllService.getStudentCountByZoneName(zoneName);
  res.status(httpStatus.CREATED).send(result);
});
const getStudentStatsBySchoolName = catchAsync(async (req, res) => {
  const { schoolName } = req.body;
  const result = await studentGraphsAllService.getStudentCountBySchoolName(schoolName);
  res.status(httpStatus.CREATED).send(result);
});
module.exports = {
  getStudentStats,
  getStudentStatsByDistrictName,
  getStudentStatsByZoneName,
  getStudentStatsBySchoolName,
};