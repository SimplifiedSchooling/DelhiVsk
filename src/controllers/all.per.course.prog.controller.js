const httpStatus = require('http-status');
const { join } = require('path');
const csv = require('csvtojson');
const catchAsync = require('../utils/catchAsync');
const { PerCourseProgressAlldashboardService } = require('../services');
const ApiError = require('../utils/ApiError');

const staticFolder = join(__dirname, '../');
const uploadsFolder = join(staticFolder, 'uploads');

const bulkUploadFile = catchAsync(async (req, res) => {
  if (req.file) {
    if (req.file.mimetype !== 'text/csv') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
    }

    const csvFilePath = join(uploadsFolder, req.file.filename);
    const csvJsonArray = await csv().fromFile(csvFilePath);
    const result = await PerCourseProgressAlldashboardService.bulkUpload(csvJsonArray);

    res.status(httpStatus.CREATED).json(result);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});

const bulkUploadFileForPlaysPerCapita = catchAsync(async (req, res) => {
  if (req.file) {
    if (req.file.mimetype !== 'text/csv') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
    }

    const csvFilePath = join(uploadsFolder, req.file.filename);
    const csvJsonArray = await csv().fromFile(csvFilePath);
    const result = await PerCourseProgressAlldashboardService.bulkUploadFileForPlaysPerCapita(csvJsonArray);

    res.status(httpStatus.CREATED).json(result);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});

const bulkUploadFileForConsumptionByCourse = catchAsync(async (req, res) => {
  if (req.file) {
    if (req.file.mimetype !== 'text/csv') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
    }

    const csvFilePath = join(uploadsFolder, req.file.filename);
    const csvJsonArray = await csv().fromFile(csvFilePath);
    const result = await PerCourseProgressAlldashboardService.bulkUploadFileForConsumptionByCourse(csvJsonArray);

    res.status(httpStatus.CREATED).json(result);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});

const bulkUploadFileForConsumptionByDistrict = catchAsync(async (req, res) => {
  if (req.file) {
    if (req.file.mimetype !== 'text/csv') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
    }

    const csvFilePath = join(uploadsFolder, req.file.filename);
    const csvJsonArray = await csv().fromFile(csvFilePath);
    const result = await PerCourseProgressAlldashboardService.bulkUploadFileForConsumptionByDistrict(csvJsonArray);

    res.status(httpStatus.CREATED).json(result);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});

const getAllLearningSessions = catchAsync(async (req, res) => {
  const result = await PerCourseProgressAlldashboardService.getAllLearningSessions();
  res.send(result);
});

const getAllPlaysPerCapita = catchAsync(async (req, res) => {
  const result = await PerCourseProgressAlldashboardService.getAllPlaysPerCapita();
  res.send(result);
});

const getAllConsumptionByCourse = catchAsync(async (req, res) => {
  const result = await PerCourseProgressAlldashboardService.getAllConsumptionByCourse();
  res.send(result);
});

const getAllConsumptionByDistrict = catchAsync(async (req, res) => {
  const result = await PerCourseProgressAlldashboardService.getAllConsumptionByDistrict();
  res.send(result);
});

async function getDashboard(req, res) {
  const { subject, grade, learning_outcome_code } = req.body;

  // Build query based on request parameters
  const query = {};
  if (subject) query.subject = subject;
  if (grade) query.grade = grade;
  if (learning_outcome_code) query.learning_outcome_code = learning_outcome_code;
  const data = await PerCourseProgressAlldashboardService.getDashboardData(query);

  res.status(200).json({
    success: true,
    data,
  });
}
module.exports = {
  getAllLearningSessions,
  getAllPlaysPerCapita,
  getAllConsumptionByCourse,
  bulkUploadFile,
  bulkUploadFileForPlaysPerCapita,
  bulkUploadFileForConsumptionByCourse,
  bulkUploadFileForConsumptionByDistrict,
  getAllConsumptionByDistrict,
  getDashboard,
};
