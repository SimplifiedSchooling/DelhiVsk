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

const getTeacherStatsZone = catchAsync(async (req, res) => {
  const result = await guestTeacherService.getTeacherStatsZone(req.body.zoneName);
  res.status(httpStatus.CREATED).send(result);
});

const getTeacherStatsSchool = catchAsync(async (req, res) => {
  const result = await guestTeacherService.getTeacherStatsSchool(req.body.Schoolid);
  res.status(httpStatus.CREATED).send(result);
});

const getGuestTeacherSearch = catchAsync(async (req, res) => {
    const result = await guestTeacherService.searchTeachers(req.body.searchQuery);
    res.status(httpStatus.CREATED).send(result);
  });

  const getGuestTeacherList = catchAsync(async (req, res) => {
    const result = await guestTeacherService.getTeacherStatsSchool(req.params.Schoolid);
    res.status(httpStatus.CREATED).send(result);
  });
module.exports = {
  getTeacherCountBySchoolManagement,
  getTeacherStatsDistrict,
  getTeacherStatsZone,
  getTeacherStatsSchool,
  getGuestTeacherSearch,
  getGuestTeacherList,
};
