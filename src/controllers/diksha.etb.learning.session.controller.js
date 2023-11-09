const httpStatus = require('http-status');
const { join } = require('path');
const csv = require('csvtojson');
const catchAsync = require('../utils/catchAsync');
const { learningSessionService } = require('../services');
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
    const result = await learningSessionService.bulkUpload(csvJsonArray);

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
    const result = await learningSessionService.bulkUploadFileForPlaysPerCapita(csvJsonArray);

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
    const result = await learningSessionService.bulkUploadFileForConsumptionByCourse(csvJsonArray);

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
    const result = await learningSessionService.bulkUploadFileForConsumptionByDistrict(csvJsonArray);

    res.status(httpStatus.CREATED).json(result);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});

const getAllLearningSessions = catchAsync(async (req, res) => {
  const result = await learningSessionService.getAllLearningSessions();
  res.send(result);
});

const getAllPlaysPerCapita = catchAsync(async (req, res) => {
  const result = await learningSessionService.getAllPlaysPerCapita();
  res.send(result);
});

const getAllConsumptionByCourse = catchAsync(async (req, res) => {
  const result = await learningSessionService.getAllConsumptionByCourse();
  res.send(result);
});

const getAllConsumptionByDistrict = catchAsync(async (req, res) => {
  const result = await learningSessionService.getAllConsumptionByDistrict();
  res.send(result);
});

async function getCounts(req, res) {
  const { subject, grade, medium } = req.body;

  // Build query based on request parameters
  const query = {};
  if (subject) query.subject = subject;
  if (grade) query.grade = grade;
  if (medium) query.medium = medium;
  const counts = await learningSessionService.calculateMimeTypeCounts(query);
  res.send(counts);
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
  getCounts,
};
