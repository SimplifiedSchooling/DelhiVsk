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

module.exports = {
  getTeacherCountBySchoolManagement,
  getTeacherStatsByDistrict,
  getTeacherCountByZone,
};
