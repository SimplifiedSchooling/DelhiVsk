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
 * @returns {Promise<QueryResult>}
 */
const getAllLearningSessions = async () => {
  const learningSessions = await Coveragestatus.find();
  return learningSessions;
};

/**
 * Query for board
 * @returns {Promise<QueryResult>}
 */
const getAllPlaysPerCapita = async () => {
  const getAllPlaysPerCapitas = await Coverageqr.find();
  return getAllPlaysPerCapitas;
};

module.exports = {
  getAllLearningSessions,
  getAllPlaysPerCapita,
  bulkUpload,
  bulkUploadFileForPlaysPerCapita,
};
