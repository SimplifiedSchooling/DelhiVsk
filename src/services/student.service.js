const httpStatus = require('http-status');
const axios = require('axios');
const { School, StudentCounts, Teacher } = require('../models');
const redis = require('../utils/redis');
const ApiError = require('../utils/ApiError');

async function fetchStudentDataForSchool(schoolId, password) {
  const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Student_Registstry?Schoolid=${schoolId}&password=${password}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for school ${schoolId}:`, error);
    return null;
  }
}

async function processStudentData(studentData, Schoolid, School_Name, medium, shift, Zone_Name, District_name) {
  const totalStudentCount = studentData.length;
  const genderCounts = { M: 0, F: 0, T: 0 };
  const classGenderCounts = {};

  for (const student of studentData) {
    const gender = student.Gender || 'T';
    genderCounts[gender]++;

    const className = student.CLASS || 'Unknown';
    if (!classGenderCounts[className]) {
      classGenderCounts[className] = { M: 0, F: 0, T: 0 };
    }
    classGenderCounts[className][gender]++;
  }

  // Create a student record
  const studentRecord = new StudentCounts({
    Schoolid,
    School_Name,
    medium,
    shift,
    Zone_Name,
    District_name,
    totalStudent: totalStudentCount,
    maleStudents: genderCounts.M,
    femaleStudents: genderCounts.F,
    otherStudents: genderCounts.T,
    classes: Object.entries(classGenderCounts).map(([className, counts]) => ({
      class: className.toString(),
      male: counts.M,
      feMale: counts.F,
      other: counts.T,
    })),
  });

  // Save the student record
  await studentRecord.save();
}

async function storeStudentDataInMongoDB() {
  const schools = await School.find().exec();
  const password = 'VSK@9180';
  const records = [];
  const dups = [];

  for (const school of schools) {
    const studentData = await fetchStudentDataForSchool(school.Schoolid, password);

    if (studentData && studentData.Cargo) {
      await processStudentData(
        studentData.Cargo,
        school.Schoolid,
        school.School_Name,
        school.medium,
        school.shift,
        school.Zone_Name,
        school.District_name
      );
    }
  }
}

module.exports = {
  storeStudentDataInMongoDB,
};
