const httpStatus = require('http-status');
const { ImageGallery } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a ImageGallery
 * @param {Object} reqBody
 * @returns {Promise<ImageGallery>}
 */
const createGallary = async (reqBody) => {
  return ImageGallery.create(reqBody);
};

/**
 * Query for gallary
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryGalary = async (filter, options) => {
  const result = await ImageGallery.paginate(filter, options);
  return result;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<ImageGallery>}
 */
const getGalleryById = async (id) => {
  return ImageGallery.findById(id);
};

/**
 * Update gallery by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<ImageGallery>}
 */
const updateGalleryById = async (userId, updateBody) => {
  const user = await getGalleryById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gallary not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete gallery by id
 * @param {ObjectId} userId
 * @returns {Promise<ImageGallery>}
 */
const deleteGalleryById = async (userId) => {
  const user = await getGalleryById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gallery not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createGallary,
  queryGalary,
  getGalleryById,
  updateGalleryById,
  deleteGalleryById,
};
