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

async function storeSchoolDataInMongoDB() {
  const studentData = await fetchStudentDataForSchool();

  if (studentData && studentData.Cargo) {
    await processStudentData(studentData.Cargo);
  }
}

async function processStudentData(studentData) {
  for (const student of studentData) {
    let record = new School(student);
    record = await record.save();
  }
}

module.exports = {
  storeSchoolDataInMongoDB,
};
