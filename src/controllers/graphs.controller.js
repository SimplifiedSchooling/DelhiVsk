const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { graphsService } = require('../services');

const getSchoolStats = catchAsync(async (req, res) => {
  const result = await graphsService.getSchoolStats();
  res.status(httpStatus.CREATED).send(result);
});

const getSchoolStatistics = catchAsync(async (req, res) => {
  const { SchCategory, shift, School_Name } = req.body;
  const result = await graphsService.getSchoolStatistics(SchCategory, shift, School_Name);
  res.status(httpStatus.CREATED).send(result);
});

const getAggregatedSchoolDataController = async (req, res) => {
  const result = await graphsService.getAggregatedSchoolData();
  res.status(httpStatus.CREATED).send(result);
};
const getAggregatedSchoolDataByDistrictNameController = async (req, res) => {
  const { District_name } = req.body;
  const result = await graphsService.getAggregatedSchoolDataByDistrictName(District_name);
  res.status(httpStatus.CREATED).send(result);
};

module.exports = {
  getSchoolStats,
  getSchoolStatistics,
  getAggregatedSchoolDataController,
  getAggregatedSchoolDataByDistrictNameController,
};
