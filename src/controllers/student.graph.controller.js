const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { studentGraphService } = require('../services');

const getStudentStats = catchAsync(async (req, res) => {
  const result = await studentGraphService.getStudentCount();
  res.status(httpStatus.CREATED).send(result);
});
const getStudentStatsByDistrictName = catchAsync(async (req, res) => {
  const { districtName } = req.body;
  const result = await studentGraphService.getStudentCountByDistrictName(districtName);
  res.status(httpStatus.CREATED).send(result);
});
const getStudentStatsByZoneName = catchAsync(async (req, res) => {
  const { zoneName } = req.body;
  const result = await studentGraphService.getStudentCountByZoneName(zoneName);
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  getStudentStats,
  getStudentStatsByDistrictName,
  getStudentStatsByZoneName,
};