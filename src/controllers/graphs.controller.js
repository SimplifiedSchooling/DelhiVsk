const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { graphsService } = require('../services');

const getSchoolStats = catchAsync(async (req, res) => {
  const result = await graphsService.getSchoolStats();
  res.status(httpStatus.CREATED).send(result);
});

const getAggregatedSchoolDataController = async (req, res) => {
  const result = await graphsService.getAggregataddedSchoolData();
  res.status(httpStatus.CREATED).send(result);
};
const getAggregatedSchoolDataByDistrictNameController = async (req, res) => {
  const { DistrictName } = req.body;
  const result = await graphsService.getAggregatedSchoolDataByDistrictName(DistrictName);
  res.status(httpStatus.CREATED).send(result);
};

module.exports = {
  getSchoolStats,
  getAggregatedSchoolDataController,
  getAggregatedSchoolDataByDistrictNameController,
};
