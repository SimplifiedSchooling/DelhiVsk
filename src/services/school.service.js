const axios = require('axios');
const { School } = require('../models');

async function fetchStudentDataForSchool() {
  const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/School_Registry?password=VSK@9180`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
    return null;
  }
}

async function processStudentData(studentData) {
  const savePromises = studentData.map(async (student) => {
    const record = new School(student);
    return record.save();
  });

  return Promise.all(savePromises);
}

async function storeSchoolDataInMongoDB() {
  const studentData = await fetchStudentDataForSchool();

  if (studentData && studentData.Cargo) {
    const savedRecords = await processStudentData(studentData.Cargo);
    return savedRecords;
  }
}

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
// async function getDistrictSchools() {
//   try {
//     const response = await axios.get(apiUrl);
//     const schools = response.data;
//     const districtSchools = {};
//     schools.forEach((school) => {
//       const district = school.District_name;
//       const schoolName = school.School_Name;

//       if (!districtSchools[district]) {
//         districtSchools[district] = [];
//       }
//       districtSchools[district].push(schoolName);
//     });
//     return districtSchools;
//   } catch (error) {
//     throw new Error('Error fetching data: ' + error.message);
//   }
// }

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
module.exports = {
  storeSchoolDataInMongoDB,
  schoolData,
  bulkUpload,
  fetchSchoolData,
  getDistrictZoneNames,
  getDistrictSchools,
  getZoneNameSchools,
  fetchSchoolZone,
};
