const httpStatus = require('http-status');
const axios = require('axios');
const { School, Teacher } = require('../models');
const ApiError = require('../utils/ApiError');

async function fetchStudentDataForSchool(schoolId, password) {
  const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Employee_Registry?Schoolid=${schoolId}&password=${password}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for school ${schoolId}:`, error);
    return null;
  }
}

async function storeTeacherDataInMongoDB() {
  const schools = await School.find().exec();
  const password = 'VSK@9180'; // Replace with your password
  const records = [];
  const dups = [];

  for (const school of schools) {
    const studentData = await fetchStudentDataForSchool(school.Schoolid, password);

    if (studentData && studentData.Cargo) {
      await processStudentData(studentData.Cargo, dups, records);
    }
  }

  // const duplicates = {
  //     totalDuplicates: dups.length,
  //     data: dups,
  // };

  // const nonduplicates = {
  //     totalNonDuplicates: records.length,
  //     data: records,
  // };

  // return { nonduplicates, duplicates };
}

async function processStudentData(studentData, dups, records) {
  for (const student of studentData) {
    // const existingStudent = await Student.findOne({ S_ID: student.S_ID });

    // if (existingStudent) {
    //     dups.push(student);
    // } else {
    let record = new Teacher(student);
    record = await record.save();
    //     if (record) {
    //         records.push(student);
    //     }
    // }
  }
}

module.exports = {
  storeTeacherDataInMongoDB,
};
