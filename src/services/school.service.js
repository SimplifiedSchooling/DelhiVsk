const axios = require('axios');
const { School } = require('../models');

async function fetchStudentDataForSchool() {
  const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/School_Registry?password=VSK@9180`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for school `, error);
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

const apiUrl = 'http://165.22.216.223:3000/v1/school';

async function fetchSchoolData() {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getDistrictSchools() {
  try {
    const response = await axios.get(apiUrl);
    const schools = response.data;
    const districtSchools = {};
    schools.forEach((school) => {
      const district = school.District_name;
      const schoolName = school.School_Name;

      if (!districtSchools[district]) {
        districtSchools[district] = [];
      }
      districtSchools[district].push(schoolName);
    });
    return districtSchools;
  } catch (error) {
    throw new Error('Error fetching data: ' + error.message);
  }
}

async function getZoneNameSchools() {
  try {
    const response = await axios.get(apiUrl);
    const schools = response.data;
    const ZoneSchool = {};
    schools.forEach((school) => {
      const zone = school.Zone_Name;
      const schoolName = school.School_Name;

      if (!ZoneSchool[zone]) {
        ZoneSchool[zone] = [];
      }
      ZoneSchool[zone].push(schoolName);
    });
    return ZoneSchool;
  } catch (error) {
    throw new Error('Error fetching data: ' + error.message);
  }
}

module.exports = {
  storeSchoolDataInMongoDB,
  schoolData,
  bulkUpload,
  fetchSchoolData,
  getDistrictSchools,
  getZoneNameSchools,
};
