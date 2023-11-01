const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { graphsService } = require('../services');

const getSchoolStats = catchAsync(async (req, res) => {
  const result = await graphsService.getSchoolStats();
  res.status(httpStatus.CREATED).send(result);
});

const getAggregatedSchoolDataController = async (req, res) => {
  const result = await graphsService.getAggregatedSchoolData();
  res.status(httpStatus.CREATED).send(result);
};
const getAllSchoolStudentTeacherData = async (req, res) => {
  const result = await graphsService.getAllSchoolStudentTeacherData();
  res.status(httpStatus.CREATED).send(result);
};
const getAggregatedSchoolDataByDistrictNameController = async (req, res) => {
  const { DistrictName } = req.body;
  const result = await graphsService.getAggregatedSchoolDataByDistrictName(DistrictName);
  res.status(httpStatus.CREATED).send(result);
};
const getAllSchoolStudentTeacherDataByDistrictName = async (req, res) => {
  const { districtName } = req.body;
  const result = await graphsService.getAllSchoolStudentTeacherDataByDistrictName(districtName);
  res.status(httpStatus.CREATED).send(result);
};
const getAllSchoolStudentTeacherDataByZoneName = async (req, res) => {
  const { zoneName } = req.body;
  const result = await graphsService.getAllSchoolStudentTeacherDataByZoneName(zoneName);
  res.status(httpStatus.CREATED).send(result);
};
const getSchoolStudentCountByDistrictsController = async (req, res) => {
  const result = await graphsService.getSchoolStudentCountByDistricts();
  res.status(httpStatus.CREATED).send(result);
};
module.exports = {
  getSchoolStats,
  getAggregatedSchoolDataController,
  getAggregatedSchoolDataByDistrictNameController,
  getAllSchoolStudentTeacherData,
  getAllSchoolStudentTeacherDataByDistrictName,
  getAllSchoolStudentTeacherDataByZoneName,
  getSchoolStudentCountByDistrictsController,
};
