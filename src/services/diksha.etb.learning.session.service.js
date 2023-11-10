const { Learningsession, Playspercapita, Consumptionbycourse, Consumptionbydistrict } = require('../models');

// const bulkUpload = async (schoolArray, csvFilePath = null) => {
//   let modifiedSchoolArray = schoolArray;
//   if (csvFilePath) {
//     modifiedSchoolArray = csvFilePath;
//   }

//   if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
//     return { error: true, message: 'Missing array' };
//   }

//   const savePromises = modifiedSchoolArray.map(async (school) => {
//     const record = new Learningsession(school);
//     return record.save();
//   });

//   return Promise.all(savePromises);
// };

const bulkUpload = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  try {
    if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
      throw new Error('Missing array');
    }

    const savePromises = modifiedSchoolArray.map(async (school) => {
      const record = new Learningsession(school);
      return await record.save();
    });

    const result = await Promise.all(savePromises);
    return { error: false, result };
  } catch (error) {
    return { error: true, message: error.message };
  }
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

const bulkUploadFileForConsumptionByDistrict = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    return { error: true, message: 'Missing array' };
  }

  const savePromises = modifiedSchoolArray.map(async (school) => {
    const record = new Consumptionbydistrict(school);
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
 * @returns {Promise<QueryResult>}
 */
const getAllLearningSessions = async () => {
  const learningSessions = await Learningsession.find();
  return learningSessions;
};

/**
 * Query for board
 * @returns {Promise<QueryResult>}
 */
const getAllPlaysPerCapita = async () => {
  const getAllPlaysPerCapitas = await Playspercapita.find();
  return getAllPlaysPerCapitas;
};

/**
 * Query for board
 * @returns {Promise<QueryResult>}
 */
const getAllConsumptionByCourse = async () => {
  const getAllConsumptionByCourses = await Consumptionbycourse.find();
  return getAllConsumptionByCourses;
};

/**
 * Get range-wise count of enrollment, completion, certification data by course
 * @param {string} program - The program name to filter the counts
 * @returns {Promise<Object>} Range-wise counts for enrollment, completion, certification
 */

async function calculateRangeWiseCounts(program) {
  const ranges = [0, 10000, 20000, 30000, 40000, 50000]; // Define your ranges as needed

  const enrollmentRanges = new Array(ranges.length - 1).fill(0);
  const completionRanges = new Array(ranges.length - 1).fill(0);
  const certificationRanges = new Array(ranges.length - 1).fill(0);
  const schoolData = await Consumptionbycourse.find({ program });

  schoolData.forEach((data) => {
    const { enrollments, completion, certification } = data;
    /* eslint-disable-next-line no-plusplus */
    for (let i = 0; i < ranges.length - 1; i++) {
      const startRange = ranges[i];
      const endRange = ranges[i + 1];

      if (enrollments >= startRange && enrollments < endRange) {
        /* eslint-disable-next-line no-plusplus */
        enrollmentRanges[i]++;
      }

      if (completion >= startRange && completion < endRange) {
        /* eslint-disable-next-line no-plusplus */
        completionRanges[i]++;
      }

      if (certification >= startRange && certification < endRange) {
        /* eslint-disable-next-line no-plusplus */
        certificationRanges[i]++;
      }
    }
  });

  const result = {
    enrollmentRanges: enrollmentRanges.map((count, i) => ({ range: `${ranges[i]}-${ranges[i + 1]}`, count })),
    completionRanges: completionRanges.map((count, i) => ({ range: `${ranges[i]}-${ranges[i + 1]}`, count })),
    certificationRanges: certificationRanges.map((count, i) => ({ range: `${ranges[i]}-${ranges[i + 1]}`, count })),
  };

  return result;
}
/**
 * Query for board
 * @returns {Promise<QueryResult>}
 */
const getAllConsumptionByDistrict = async () => {
  const getAllConsumptionByCourses = await Consumptionbydistrict.find();
  return getAllConsumptionByCourses;
};

async function calculateMimeTypeCounts(query) {
  // Aggregate pipeline to group counts by mime_type
  const pipeline = [
    { $match: query },
    {
      $group: {
        _id: '$mime_type',
        counts: { $sum: '$total_no_of_plays_App_and_Portal' },
        average_no_of_plays: { $avg: '$total_no_of_plays_App_and_Portal' },
        average_play_time: { $avg: '$total_play_time_App_and_Portal' },
      },
    },
  ];

  // Execute the aggregation pipeline
  const counts = await Learningsession.aggregate(pipeline);

  // Return the counts
  return counts;
}

module.exports = {
  createLearningSession,
  getAllLearningSessions,
  getAllPlaysPerCapita,
  getAllConsumptionByCourse,
  bulkUpload,
  bulkUploadFileForPlaysPerCapita,
  bulkUploadFileForConsumptionByCourse,
  bulkUploadFileForConsumptionByDistrict,
  getAllConsumptionByDistrict,
  calculateRangeWiseCounts,
  calculateMimeTypeCounts,
};
