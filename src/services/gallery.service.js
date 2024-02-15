const httpStatus = require('http-status');
const { Gallery } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a gallery
 * @param {Object} reqBody
 * @returns {Promise<Gallery>}
 */
const createGallery = async (reqBody) => {
  return Gallery.create(reqBody);
};

/**
 * Query for gallery
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryGallery = async (filter, options) => {
  const result = await Gallery.paginate(filter, options);
  return result;
};

/**
 * Get gallery by id
 * @param {ObjectId} id
 * @returns {Promise<Gallery>}
 */
const getGalleryById = async (id) => {
  return Gallery.findById(id);
};



module.exports = {
  createGallery,
  queryGallery,
  getGalleryById,
};
