const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { imageGalleryService } = require('../services');

const createGallery = catchAsync(async (req, res) => {
  const gallery = await imageGalleryService.createGallary(req.body);
  res.status(httpStatus.CREATED).send(gallery);
});

const getgallerys = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await imageGalleryService.queryGalary(filter, options);
  res.send(result);
});

const getGallery = catchAsync(async (req, res) => {
  const result = await imageGalleryService.getGalleryById(req.params.id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gallery not found');
  }
  res.send(result);
});

const updateGallery = catchAsync(async (req, res) => {
  const user = await imageGalleryService.updateGalleryById(req.params.id, req.body);
  res.send(user);
});

const deleteGallery = catchAsync(async (req, res) => {
  await imageGalleryService.deleteGalleryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createGallery,
    getgallerys,
    getGallery,
    updateGallery,
    deleteGallery,
};
