const httpStatus = require('http-status');
const { join } = require('path');
const csv = require('csvtojson');
const catchAsync = require('../utils/catchAsync');
const { udiseSchoolService } = require('../services');
const ApiError = require('../utils/ApiError');

const staticFolder = join(__dirname, '../');
const uploadsFolder = join(staticFolder, 'uploads');

const bulkUploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
  if (req.file.mimetype !== 'text/csv') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
  }
  const csvFilePath = join(uploadsFolder, req.file.filename);
  const csvJsonArray = await csv().fromFile(csvFilePath);
  const result = await udiseSchoolService.bulkUpload(csvJsonArray);
  res.status(httpStatus.CREATED).json(result);
});

const getUdiseSchoolStats = catchAsync(async (req, res) => {
  const result = await udiseSchoolService.udiseSchoolStats();
  res.status(httpStatus.CREATED).send(result);
});

const getUdiseSchoolStatsDistrict = catchAsync(async (req, res) => {
  const result = await udiseSchoolService.districtWiseCount(req.body.district);
  res.status(httpStatus.CREATED).send(result);
});

const getUdiseSchoolStatsZone = catchAsync(async (req, res) => {
  const result = await udiseSchoolService.ZoneWiseCount(req.body.zone);
  res.status(httpStatus.CREATED).send(result);
});

const getAllUdiseSchool = catchAsync(async (req, res) => {
  const result = await udiseSchoolService.getAllUdiseschool();
  res.status(httpStatus.CREATED).send(result);
});
const getUdiseSchoolDistrict = catchAsync(async (req, res) => {
  const result = await udiseSchoolService.fetchSchoolDataDistrict();
  res.status(httpStatus.CREATED).send(result);
});

const getUdiseSchoolZone = catchAsync(async (req, res) => {
  const result = await udiseSchoolService.fetchSchoolZone();
  res.status(httpStatus.CREATED).send(result);
});

const getUdiseSchoolCountSchooolWise = catchAsync(async (req, res) => {
  const result = await udiseSchoolService.ScholWiseCount(req.body.SchoolID);
  res.status(httpStatus.CREATED).send(result);
});

const getUdiseSchoolZoneByDistrict = catchAsync(async (req, res) => {
  const result = await udiseSchoolService.getDistrictZoneNames(req.body.districtName);
  res.status(httpStatus.CREATED).send(result);
});

const getUdiseSchoolByDistrict = catchAsync(async (req, res) => {
  const result = await udiseSchoolService.getDistrictSchools(req.body.district);
  res.status(httpStatus.CREATED).send(result);
});

const getZoneWiseSchools = catchAsync(async (req, res) => {
  const result = await udiseSchoolService.getZoneWiseSchools(req.body.zone);
  res.status(httpStatus.CREATED).send(result);
});

const getSchoolsTypeWise = catchAsync(async (req, res) => {
  const result = await udiseSchoolService.getSchoolsTypeWise(req.body.schoolType);
  res.status(httpStatus.CREATED).send(result);
});

const getSchoolsTypeWiseDistrict = catchAsync(async (req, res) => {
  const { schoolType, district } = req.body;
  const result = await udiseSchoolService.getSchoolsTypeWiseDistrict(schoolType, district);
  res.status(httpStatus.CREATED).send(result);
});

const getSchoolsTypeWiseZone = catchAsync(async (req, res) => {
  const { schoolType, zone } = req.body;
  const result = await udiseSchoolService.getSchoolsTypeWiseZone(schoolType, zone);
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  bulkUploadFile,
  getUdiseSchoolStats,
  getUdiseSchoolStatsDistrict,
  getUdiseSchoolStatsZone,
  getUdiseSchoolCountSchooolWise,
  getUdiseSchoolDistrict,
  getUdiseSchoolZone,
  getUdiseSchoolZoneByDistrict,
  getUdiseSchoolByDistrict,
  getZoneWiseSchools,
  getSchoolsTypeWise,
  getSchoolsTypeWiseDistrict,
  getSchoolsTypeWiseZone,
};
