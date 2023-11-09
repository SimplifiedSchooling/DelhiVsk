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

module.exports = {
  bulkUploadFile,
  getUdiseSchoolStats,
};
