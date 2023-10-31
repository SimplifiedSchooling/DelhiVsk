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

module.exports = {
  storeSchoolDataInMongoDB,
  schoolData,
  bulkUpload,
};
