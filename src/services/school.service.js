const axios = require('axios');
const cron = require('node-cron');
const logger = require('../config/logger');
const { School } = require('../models');

async function fetchStudentDataForSchool() {
  const apiUrl =
    'https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/School_Registry?password=VSK@9180';

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching data: ${error.message}`);
  }
}

async function processStudentData(studentData) {
  const saveResults = [];

  for (const student of studentData) {
    try {
      const filter = { Schoolid: student.Schoolid }; // Ensure the field name matches the schema
      const update = { $set: student };
      const options = { new: true, upsert: true };

      const result = await School.findOneAndUpdate(filter, update, options);

      if (result) {
        let type;
        let record;

        if (result.lastErrorObject) {
          // If lastErrorObject is present, use it
          type = result.lastErrorObject.updatedExisting ? 'update' : 'insert';
        } else if (result.value) {
          // If lastErrorObject is not present but value is, use value
          type = 'update';
        } else {
          // If both lastErrorObject and value are undefined, it's an insert
          type = 'insert';
        }

        record = result.lastErrorObject ? result.value : result;

        saveResults.push({ type, record });
      } else {
        saveResults.push({
          type: 'insert',
          record: student,
        });
      }
    } catch (error) {
      logger.error(`Error processing record for SchoolID ${student.Schoolid}: ${error.message}`);
    }
  }

  return saveResults;
}

async function removeOldDataNotInAPI(apiDataSchoolIDs) {
  try {
    const existingRecords = await School.find({}, { Schoolid: 1 });
    const existingSchoolIDs = existingRecords.map((record) => record.Schoolid);

    // Find IDs present in the database but not in the API response
    const idsToRemove = existingSchoolIDs.filter((id) => !apiDataSchoolIDs.includes(id));

    if (idsToRemove.length > 0) {
      // Remove records with IDs not present in the API response
      await School.deleteMany({ Schoolid: { $in: idsToRemove } });
      logger.info('Old records removed successfully.');
    } else {
      logger.info('No old records to remove.');
    }
  } catch (error) {
    logger.error(`Error removing old records: ${error.message}`);
  }
}

async function storeSchoolDataInMongoDB() {
  try {
    const studentData = await fetchStudentDataForSchool();

    if (studentData && studentData.Cargo) {
      const savedRecords = await processStudentData(studentData.Cargo);

      // Extract SchoolIDs from API data for removing old records
      const apiDataSchoolIDs = studentData.Cargo.map((record) => record.Schoolid);

      await removeOldDataNotInAPI(apiDataSchoolIDs);

      logger.info('Data fetch and store process completed.');
    }
  } catch (error) {
    logger.error(`Error storing school data in MongoDB: ${error.message}`);
  }
}

// cron.schedule('0 0 * * *', async () => {
//   try {
//     logger.info(`Running the attendance data update job...`);
//     await storeSchoolDataInMongoDB();
//     logger.info(`Student data update job completed.`);
//   } catch (error) {
//     logger.info('Error running the job:', error);
//   }
// });

const task = cron.schedule('0 0 * * *', async () => {
  try {
    logger.info(`Running the attendance data update job...`);
    await storeSchoolDataInMongoDB();
    logger.info(`Student data update job completed.`);

    // Stop the cron job after it has been executed once
    // task.destroy();
  } catch (error) {
    logger.error('Error running the job:', error);
  }
});

const schoolData = async () => {
  const data = await School.find();
  return data;
};

const bulkUpload = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    return { error: true, message: 'Missing array' };
  }

  const savePromises = modifiedSchoolArray.map(async (school) => {
    const record = new School(school);
    return record.save();
  });

  return Promise.all(savePromises);
};

const fetchSchoolData = async () => {
  const duplicates = await School.aggregate([
    {
      $group: {
        _id: { District_name: '$District_name', D_ID: '$D_ID' },
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        count: { $gt: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        districtName: '$_id.District_name',
        D_ID: '$_id.D_ID',
        // count: 1,
      },
    },
  ]);
  return duplicates;
};

const fetchSchoolZone = async () => {
  const uniqueZones = await School.aggregate([{ $group: { _id: { Zone_Name: '$Zone_Name', Z_ID: '$Z_ID' } } }]);

  const formattedZones = uniqueZones.map((zone) => ({
    Zone_Name: zone._id.Zone_Name,
    Z_ID: zone._id.Z_ID,
  }));

  return { ZoneInfo: formattedZones };
};
const getDistrictSchools = async (districtName) => {
  const schools = await School.find({ District_name: districtName }, 'Schoolid School_Name').exec();
  return schools;
};

const getDistrictZoneNames = async (districtName) => {
  const zones = await School.distinct('Zone_Name', { District_name: districtName }).exec();
  const zoneIds = await School.distinct('Z_ID', { District_name: districtName }).exec();

  // Combine the unique zone names with their corresponding unique zone IDs
  const result = zones.map((zone, index) => ({ Zone_Name: zone, Z_ID: zoneIds[index] }));

  return result;
};

const getZoneNameSchools = async (zoneName) => {
  const schools = await School.find({ Zone_Name: zoneName }).select('School_Name Schoolid').exec();
  return schools;
};

const getZoneNameSchoolsOfGoverment = async (zoneName) => {
  const schools = await School.find({ Zone_Name: zoneName, SchManagement: 'Government' })
    .select('School_Name Schoolid')
    .exec();
  return schools;
};

const getSchoolByName = async (query) => {
  const result = await School.find(query).select('School_Name Schoolid').exec();
  return result;
};


const fromUserIDGetData = async(id) => {
  let result;
  // Check if id is a valid D_ID
  const districtDetails = await School.findOne({ D_ID: id }, 'District_name');
  if (districtDetails) {
    result = districtDetails.District_name;
  }

  // Check if id is a valid Z_ID
  const zoneDetails = await School.findOne({ Z_ID: id }, 'Zone_Name');
  if (zoneDetails) {
    result = zoneDetails.Zone_Name;
  }

  // Check if id is a valid Schoolid
  const schoolDetails = await School.findOne({ Schoolid: id }, 'Schoolid School_Name');
  if (schoolDetails) {
    result =  schoolDetails.Schoolid ;
  }
  return result;
};

const getAllSchoolsNames = async () => {
    return await School.find({}, { School_Name: 1, Schoolid: 1, _id: 0 });
};

module.exports = {
  storeSchoolDataInMongoDB,
  schoolData,
  bulkUpload,
  fetchSchoolData,
  getDistrictZoneNames,
  getDistrictSchools,
  getZoneNameSchools,
  fetchSchoolZone,
  getZoneNameSchoolsOfGoverment,
  getSchoolByName,
  fromUserIDGetData,
  getAllSchoolsNames,
};
