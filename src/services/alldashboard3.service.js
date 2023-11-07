const { Coveragestatus, Coverageqr } = require('../models');

const bulkUpload = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    return { error: true, message: 'Missing array' };
  }

  const savePromises = modifiedSchoolArray.map(async (school) => {
    const record = new Coveragestatus(school);
    return record.save();
  });

  return Promise.all(savePromises);
};

const bulkUploadFileForPlaysPerCapita = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    return { error: true, message: 'Missing array' };
  }

  const savePromises = modifiedSchoolArray.map(async (school) => {
    const record = new Coverageqr(school);
    return record.save();
  });

  return Promise.all(savePromises);
};

/**
 * Query for board
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllLearningSessions = async (filter, options) => {
  const learningSessions = await Coveragestatus.paginate(filter, options);
  return learningSessions;
};

/**
 * Query for board
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllPlaysPerCapita = async (filter, options) => {
  const getAllPlaysPerCapitas = await Coverageqr.paginate(filter, options);
  return getAllPlaysPerCapitas;
};

module.exports = {
  getAllLearningSessions,
  getAllPlaysPerCapita,
  bulkUpload,
  bulkUploadFileForPlaysPerCapita,
};
