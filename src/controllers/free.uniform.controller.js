const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { freeUniformService } = require('../services');

const fetchAndSaveStudentOrientationData = catchAsync(async (req, res) => {
  // Fetch data from the external API
  const data = await freeUniformService.fetchDataFromExternalAPI();
  // Save data to the MongoDB database
  await freeUniformService.saveFreeUniform(data);

  res.status(httpStatus.OK).json({ message: 'Data fetched and saved successfully' });
});

const getAllData = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['SchName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await freeUniformService.queryData(filter, options);
  res.status(httpStatus.OK).json(result);
});

const getStudentOrientation = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['district', 'zone', 'SchoolID']); // You can add more parameters here
  const result = await freeUniformService.getStudentOrientationData(filter);
  res.status(httpStatus.OK).json(result);
});

module.exports = { fetchAndSaveStudentOrientationData, getAllData, getStudentOrientation };
