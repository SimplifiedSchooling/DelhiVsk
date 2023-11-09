const { Nasprogramstarted, Pgialldashboard, UdiseallDashboard, Udiseprogramstarted } = require('../models');

const bulkUpload = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    return { error: true, message: 'Missing array' };
  }

  const savePromises = modifiedSchoolArray.map(async (school) => {
    const record = new Nasprogramstarted(school);
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
    const record = new Pgialldashboard(school);
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
    const record = new UdiseallDashboard(school);
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
    const record = new Udiseprogramstarted(school);
    return record.save();
  });

  return Promise.all(savePromises);
};

/**
 * Query for board
 * @returns {Promise<QueryResult>}
 */
const getAllLearningSessions = async () => {
  const learningSessions = await Nasprogramstarted.find();
  return learningSessions;
};

/**
 * Query for board
 * @returns {Promise<QueryResult>}
 */
const getAllPlaysPerCapita = async () => {
  const getAllPlaysPerCapitas = await Pgialldashboard.find();
  return getAllPlaysPerCapitas;
};

/**
 * Query for board
 * @returns {Promise<QueryResult>}
 */
const getAllConsumptionByCourse = async () => {
  const getAllConsumptionByCourses = await UdiseallDashboard.find();
  return getAllConsumptionByCourses;
};

/**
 * Query for board
 * @returns {Promise<QueryResult>}
 */
const getAllConsumptionByDistrict = async () => {
  const getAllConsumptionByCourses = await Udiseprogramstarted.find();
  return getAllConsumptionByCourses;
};

module.exports = {
  getAllLearningSessions,
  getAllPlaysPerCapita,
  getAllConsumptionByCourse,
  bulkUpload,
  bulkUploadFileForPlaysPerCapita,
  bulkUploadFileForConsumptionByCourse,
  bulkUploadFileForConsumptionByDistrict,
  getAllConsumptionByDistrict,
};
