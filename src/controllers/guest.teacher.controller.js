const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { guestTeacherService } = require('../services');

const getTeacherCountBySchoolManagement = catchAsync(async (req, res) => {
  const result = await guestTeacherService.getTeacherStats();
  res.status(httpStatus.CREATED).send(result);
});

const getTeacherStatsDistrict = catchAsync(async (req, res) => {
    const result = await guestTeacherService.getTeacherStatsDistrict(req.body.DistrictName);
    res.status(httpStatus.CREATED).send(result);
  });

module.exports = {
    getTeacherCountBySchoolManagement,
    getTeacherStatsDistrict,
}