const { Learningsession, Playspercapita, Consumptionbycourse } = require('../models');

const bulkUpload = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    return { error: true, message: 'Missing array' };
  }

  const savePromises = modifiedSchoolArray.map(async (school) => {
    const record = new Learningsession(school);
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
    const record = new Playspercapita(school);
    return record.save();
  });

  return Promise.all(savePromises);
};

const bulkUploadFileForConsumptionByCourse = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    return { error: true, message: 'Missing array' };
  }

  const savePromises = modifiedSchoolArray.map(async (school) => {
    const record = new Consumptionbycourse(school);
    return record.save();
  });

  return Promise.all(savePromises);
};

/**
 * Create a board
 * @param {Object} learningSessionBody
 * @returns {Promise<Learningsession>}
 */
const createLearningSession = async (learningSessionBody) => {
  return Learningsession.create(learningSessionBody);
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
  const learningSessions = await Learningsession.paginate(filter, options);
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
  const getAllPlaysPerCapitas = await Playspercapita.paginate(filter, options);
  return getAllPlaysPerCapitas;
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
const getAllConsumptionByCourse = async (filter, options) => {
  const getAllConsumptionByCourses = await Consumptionbycourse.paginate(filter, options);
  return getAllConsumptionByCourses;
};

module.exports = {
  createLearningSession,
  getAllLearningSessions,
  getAllPlaysPerCapita,
  getAllConsumptionByCourse,
  bulkUpload,
  bulkUploadFileForPlaysPerCapita,
  bulkUploadFileForConsumptionByCourse,
};
