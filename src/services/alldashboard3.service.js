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

const getSubjectAverageByMediumAndGrade = async (medium, grade) => {
  const documents = await Coveragestatus.find({ medium, grade });

  // Initialize an object to store sums and counts for each subject
  const subjectData = {};

  documents.forEach((doc) => {
    const subject = doc.subject;
    const linkedQRCount = parseFloat(doc.linked_qr_count);
    const resourceCount = parseFloat(doc.resource_count);

    if (!subjectData[subject]) {
      subjectData[subject] = { sumLinkedQRCount: 0, sumResourceCount: 0, count: 0 };
    }

    subjectData[subject].sumLinkedQRCount += linkedQRCount;
    subjectData[subject].sumResourceCount += resourceCount;
    subjectData[subject].count++;
  });

  // Calculate averages for each subject
  const subjectAverages = Object.keys(subjectData).map((subject) => {
    const data = subjectData[subject];
    return {
      subject,
      averageLinkedQRCount: data.sumLinkedQRCount / data.count,
      averageResourceCount: data.sumResourceCount / data.count,
    };
  });
  return subjectAverages;
};


const getAveragesByMediumAndGrade = async (medium, grade) => {
  const documents = await Coverageqr.find({ medium, grade });

  // Initialize objects to store sums and counts
  const averageData = {
    averageQRCodeCoverage: 0,
    averageQRCodeLinkedToContent: 0,
    averageTotalQRCode: 0,
    count: 0,
  };

  documents.forEach((doc) => {
    const qrCoverage = doc.qr_coverage;
    const qrLinkedToContent = parseFloat(doc.qr_codes_linked_to_content);
    const totalQRCode = parseFloat(doc.total_qr_codes);

    averageData.averageQRCodeCoverage += qrCoverage;
    averageData.averageQRCodeLinkedToContent += qrLinkedToContent;
    averageData.averageTotalQRCode += totalQRCode;
    averageData.count++;
  });

  // Calculate averages
  const averages = {
    averageQRCodeCoverage: averageData.averageQRCodeCoverage / averageData.count,
    averageQRCodeLinkedToContent: averageData.averageQRCodeLinkedToContent / averageData.count,
    averageTotalQRCode: averageData.averageTotalQRCode / averageData.count,
  };
  return averages;
};

module.exports = {
  getAllLearningSessions,
  getAllPlaysPerCapita,
  bulkUpload,
  bulkUploadFileForPlaysPerCapita,
  getSubjectAverageByMediumAndGrade,
  getAveragesByMediumAndGrade,
};
