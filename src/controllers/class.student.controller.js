const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {classStudentsService} = require('../services');

const getClasswiseCounts = catchAsync(async (req, res) => {
  const classwiseCounts = await classStudentsService.getClasswiseCounts();
  res.status(httpStatus.OK).json(classwiseCounts);
});

const getClasswiseCountsDistrict = catchAsync(async (req, res) => {
  const classwiseCounts = await classStudentsService.getClasswiseCountsDistrict(req.body.district);
  res.status(httpStatus.OK).json(classwiseCounts);
});

const getClasswiseCountsZone = catchAsync(async (req, res) => {
  const classwiseCounts = await classStudentsService.getClasswiseCountsZone(req.body.zone);
  res.status(httpStatus.OK).json(classwiseCounts);
});

const getClasswiseCountsSchool = catchAsync(async (req, res) => {
  const classwiseCounts = await classStudentsService.getClasswiseCountsSchool(req.body.Schoolid);
  res.status(httpStatus.OK).json(classwiseCounts);
});
module.exports = {
  getClasswiseCounts,
  getClasswiseCountsDistrict,
  getClasswiseCountsZone,
  getClasswiseCountsSchool,
};

