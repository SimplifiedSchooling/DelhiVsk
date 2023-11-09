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


const getSubjectCountByGradeAndMedium = async (grade, medium, subject) => {
  const subjectCounts = await Coverageqr.aggregate([
    {
      $match: {
        grade: grade,
        medium: medium,
        subject: subject,
      },
    },
    {
      $group: {
        _id: '$qr_coverage',
        count: { $sum: 1 },
      },
    },
  ]);
  console.log(subjectCounts)
  return subjectCounts;
};

// Usage example
const grade = 'YourGrade'; // Replace with the desired grade
const medium = 'YourMedium'; // Replace with the desired medium
const subject = "English"
const subjects = getSubjectCountByGradeAndMedium(grade, medium, subject);



module.exports = {
  getAllLearningSessions,
  getAllPlaysPerCapita,
  bulkUpload,
  bulkUploadFileForPlaysPerCapita,
};
