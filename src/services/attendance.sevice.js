const httpStatus = require('http-status');
const axios = require('axios');
const { School, Attendance } = require('../models');
const ApiError = require('../utils/ApiError');

async function fetchStudentDataForSchool(schoolId, password, date) {
  try {
    // Format the date as needed for the API

    // Construct the API URL
    const apiUrl = `https://www.edudel.nic.in//mis/EduWebService_Other/vidyasamikshakendra.asmx/Student_Attendence_School?password=${password}&School_ID=${schoolId}&Date=${date}`;

    const response = await axios.get(apiUrl);
    console.log(`Fetched student data for school ${response.data}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for school ${schoolId}:`, error);
    return null;
  }
}

async function storeAttendanceDataInMongoDB() {
  const schools = await School.find().exec();
  const date = '20/10/2023'; // Format it as needed

  const password = 'VSK@9180'; // Replace with your password

  for (const school of schools) {
    const studentData = await fetchStudentDataForSchool(school.Schoolid, password, date);

    if (studentData && Array.isArray(studentData)) {
      await processStudentData(studentData);
    }
  }
}

async function processStudentData(studentData) {
  try {
    for (const student of studentData) {
      const record = new Attendance(student);
      await record.save();
    }
  } catch (error) {
    console.error(`Error saving student data to MongoDB:`, error);
  }
}

// Helper function to format the date as 'DD/MM/YYYY'
// function formatDate(date) {
//   // Implement date formatting logic here
//   return date; // For now, return the same date
// }

module.exports = {
  storeAttendanceDataInMongoDB,
};
