const axios = require('axios');
const cron = require('node-cron');
const { School, Student, StudentMob } = require('../models');
const redis = require('../utils/redis');

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
