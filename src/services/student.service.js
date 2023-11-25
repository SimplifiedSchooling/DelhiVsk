const axios = require('axios');
const cron = require('node-cron');
const { School, Student } = require('../models');
const redis = require('../utils/redis');

// async function fetchStudentDataForSchool(schoolId, password) {
//   const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Student_Registstry?Schoolid=${schoolId}&password=${password}`;

//   try {
//     const response = await axios.get(apiUrl);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching data for school ${schoolId}:`, error);
//     return null;
//   }
// }

// async function processStudentData(studentData, Schoolid, School_Name, medium, shift, Zone_Name, District_name) {
//   const totalStudentCount = studentData.length;
//   const genderCounts = { M: 0, F: 0, T: 0 };
//   const classGenderCounts = {};

//   for (const student of studentData) {
//     const gender = student.Gender || 'T';
//     genderCounts[gender]++;

//     const className = student.CLASS || 'Unknown';
//     if (!classGenderCounts[className]) {
//       classGenderCounts[className] = { M: 0, F: 0, T: 0 };
//     }
//     classGenderCounts[className][gender]++;
//   }

//   // Check if data already exists for the school
//   const existingStudentData = await StudentCounts.findOne({ Schoolid });

//   if (existingStudentData) {
//     // Update the existing record
//     existingStudentData.School_Name = School_Name;
//     existingStudentData.medium = medium;
//     existingStudentData.shift = shift;
//     existingStudentData.Zone_Name = Zone_Name;
//     existingStudentData.District_name = District_name;
//     existingStudentData.totalStudent = totalStudentCount;
//     existingStudentData.maleStudents = genderCounts.M;
//     existingStudentData.femaleStudents = genderCounts.F;
//     existingStudentData.otherStudents = genderCounts.T;
//     existingStudentData.classes = Object.entries(classGenderCounts).map(([className, counts]) => ({
//       class: className.toString(),
//       male: counts.M,
//       feMale: counts.F,
//       other: counts.T,
//     }));

//     await existingStudentData.save();
//   } else {
//     // Create a new student record
//     const studentRecord = new StudentCounts({
//       Schoolid,
//       School_Name,
//       medium,
//       shift,
//       Zone_Name,
//       District_name,
//       totalStudent: totalStudentCount,
//       maleStudents: genderCounts.M,
//       femaleStudents: genderCounts.F,
//       otherStudents: genderCounts.T,
//       classes: Object.entries(classGenderCounts).map(([className, counts]) => ({
//         class: className.toString(),
//         male: counts.M,
//         feMale: counts.F,
//         other: counts.T,
//       })),
//     });

//     // Save the new student record
//     await studentRecord.save();
//   }
// }

// async function storeStudentDataInMongoDB() {
//   const schools = await School.find().exec();
//   const password = 'VSK@9180';
//   for (const school of schools) {
//     const studentData = await fetchStudentDataForSchool(school.Schoolid, password);

//     if (studentData && studentData.Cargo) {
//       await processStudentData(
//         studentData.Cargo,
//         school.Schoolid,
//         school.School_Name,
//         school.medium,
//         school.shift,
//         school.Zone_Name,
//         school.District_name
//       );
//     }
//   }
// }

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

async function processStudentData(studentData) {
  const promises = studentData.map(async (student) => {
    const filter = { S_ID: student.S_ID };
    const update = student;

    // Use { new: true, upsert: true } to return the modified document and create it if it doesn't exist
    const options = { new: true, upsert: true };

    // Use findOneAndUpdate to update or create a document based on the filter
    const updatedStudent = await Student.findOneAndUpdate(filter, update, options).exec();

    return updatedStudent;
  });

  return Promise.all(promises);
}

async function storeStudentDataInMongoDB() {
  const schools = await School.find().exec();
  const password = 'VSK@9180'; // Replace with your password

  for (const school of schools) {
    const studentData = await fetchStudentDataForSchool(school.Schoolid, password);

    if (studentData && studentData.Cargo) {
      await processStudentData(studentData.Cargo);
    }
  }
}

// Schedule the job to run every Sunday at 3 AM
cron.schedule('0 3 * * 0', async () => {
  try {
    logger.info(`Running the attendance data update job...`);
    await storeStudentDataInMongoDB();
    logger.info(`Student data update job completed.`);
  } catch (error) {
    logger.info('Error running the job:', error);
  }
});

const getStudentCountBySchoolName = async (Schoolid) => {
  const cacheKey = `SCHOOL_NAME:${Schoolid}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const result = await Student.find({ Schoolid });
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};
const getStudentCountBySchoolNameAndGender = async (Schoolid, Gender) => {
  const result = await Student.find({ Schoolid, Gender });
  return result;
};

const getStudentCountBySchoolNameAndStatus = async (Schoolid, status) => {
  const result = await Student.find({ Schoolid, status });
  return result;
};
module.exports = {
  storeStudentDataInMongoDB,
  getStudentCountBySchoolName,
  getStudentCountBySchoolNameAndGender,
  getStudentCountBySchoolNameAndStatus,
};
