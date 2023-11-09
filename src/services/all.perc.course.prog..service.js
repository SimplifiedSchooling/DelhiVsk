const { Percentageenrollmentcertification, Programstarted, Coursemedium, AllDashboard } = require('../models');

const bulkUpload = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    return { error: true, message: 'Missing array' };
  }

  const savePromises = modifiedSchoolArray.map(async (school) => {
    const record = new Percentageenrollmentcertification(school);
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
    const record = new Programstarted(school);
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
    const record = new Coursemedium(school);
    return record.save();
  });

  return Promise.all(savePromises);
};

const bulkUploadFileForConsumptionByDistrict = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    return { error: true, message: 'Missing array' };
  }

  const savePromises = modifiedSchoolArray.map(async (school) => {
    const record = new AllDashboard(school);
    return record.save();
  });

  return Promise.all(savePromises);
};

/**
 * Query for board
 * @returns {Promise<QueryResult>}
 */
const getAllLearningSessions = async () => {
  const learningSessions = await Percentageenrollmentcertification.find();
  return learningSessions;
};

/**
 * @returns {Promise<QueryResult>}
 */
const getAllPlaysPerCapita = async () => {
  const getAllPlaysPerCapitas = await Programstarted.find();
  return getAllPlaysPerCapitas;
};

const getAllConsumptionByCourse = async () => {
  const getAllConsumptionByCourses = await Coursemedium.find();
  return getAllConsumptionByCourses;
};

/**
 * Query for board
 * @returns {Promise<QueryResult>}
 */
const getAllConsumptionByDistrict = async () => {
  const getAllConsumptionByCourses = await AllDashboard.find();
  return getAllConsumptionByCourses;
};

/**
 * Get all AllDashboard data by grade,subject and learning_outcome_code
 * @param {string} query - The grade,subject,learning_outcome_code name to filter the data
 * @returns {Promise<Object>} Get all AllDashboard data by grade,subject and learning_outcome_code
 */

async function getDashboardData(query) {
  const dashboardData = await AllDashboard.find(query);
  return dashboardData;
}

module.exports = {
  getAllLearningSessions,
  getAllPlaysPerCapita,
  getAllConsumptionByCourse,
  bulkUpload,
  bulkUploadFileForPlaysPerCapita,
  bulkUploadFileForConsumptionByCourse,
  bulkUploadFileForConsumptionByDistrict,
  getAllConsumptionByDistrict,
  getDashboardData,
};
