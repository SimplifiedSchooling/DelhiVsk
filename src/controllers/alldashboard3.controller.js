const httpStatus = require('http-status');
const { join } = require('path');
const csv = require('csvtojson');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { allDashboard3 } = require('../services');
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
    const result = await allDashboard3.bulkUpload(csvJsonArray);

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
    const result = await allDashboard3.bulkUploadFileForPlaysPerCapita(csvJsonArray);

    res.status(httpStatus.CREATED).json(result);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});

const getAllLearningSessions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['state_name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await allDashboard3.getAllLearningSessions(filter, options);
  res.send(result);
});

const getAllPlaysPerCapita = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['state_name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await allDashboard3.getAllPlaysPerCapita(filter, options);
  res.send(result);
});

module.exports = {
  getAllLearningSessions,
  getAllPlaysPerCapita,
  bulkUploadFile,
  bulkUploadFileForPlaysPerCapita,
};
