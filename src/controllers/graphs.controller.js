const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { graphsService } = require('../services');

const getStudentsEnrollmentGraph = catchAsync(async (req, res) => {
  const result = await graphsService.getStudentsEnrollmentGraph();
  res.status(httpStatus.CREATED).send(result);
});

const getSchoolStats = catchAsync(async (req, res) => {
  const result = await graphsService.getSchoolStats();
  res.status(httpStatus.CREATED).send(result);
});

const getAggregatedSchoolDataController = catchAsync(async (req, res) => {
  const result = await graphsService.getAggregatedSchoolData();
  res.status(httpStatus.CREATED).send(result);
});

const getAllSchoolStudentTeacherData = catchAsync(async (req, res) => {
  const result = await graphsService.getAllSchoolStudentTeacherData();
  res.status(httpStatus.CREATED).send(result);
});

const getAggregatedSchoolDataByDistrictNameController = catchAsync(async (req, res) => {
  const { DistrictName } = req.body;
  const result = await graphsService.getAggregatedSchoolDataByDistrictName(DistrictName);
  res.status(httpStatus.CREATED).send(result);
});

const getAllSchoolStudentTeacherDataByDistrictName = catchAsync(async (req, res) => {
  const { districtName } = req.body;
  const result = await graphsService.getAllSchoolStudentTeacherDataByDistrictName(districtName);
  res.status(httpStatus.CREATED).send(result);
});

const getSchoolStudentCountByDistrictsController = catchAsync(async (req, res) => {
  const result = await graphsService.getSchoolStudentCountByDistricts();
  res.status(httpStatus.CREATED).send(result);
});

const getSchoolStudentCountByZone = catchAsync(async (req, res) => {
  const result = await graphsService.getSchoolStudentCountByZone(req.body.district);
  res.status(httpStatus.CREATED).send(result);
});

const getSchoolStudentCountByDistrict = catchAsync(async (req, res) => {
  const result = await graphsService.getDistrictWiseCounts(req.body.district);
  res.status(httpStatus.CREATED).send(result);
});

const getDistrictWiseCountsGraphs = catchAsync(async (req, res) => {
  const result = await graphsService.getDistrictWiseCountsGraphs();
  if (!result) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Data not found');
  }
  res.status(httpStatus.CREATED).send(result);
});
module.exports = {
  getSchoolStats,
  getAggregatedSchoolDataController,
  getAggregatedSchoolDataByDistrictNameController,
  getAllSchoolStudentTeacherData,
  getAllSchoolStudentTeacherDataByDistrictName,
  getSchoolStudentCountByDistrictsController,
  getStudentsEnrollmentGraph,
  getSchoolStudentCountByZone,
  getSchoolStudentCountByDistrict,
  getDistrictWiseCountsGraphs,
};
