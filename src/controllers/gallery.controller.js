const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { galleryService } = require('../services');

const createGallery = catchAsync(async (req, res) => {
  const result = await galleryService.createGallery(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const queryGallery = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await galleryService.queryGallery(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await galleryService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});
