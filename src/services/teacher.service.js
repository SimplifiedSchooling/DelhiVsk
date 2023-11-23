// const axios = require('axios');
// const { School, Teacher } = require('../models');

// async function fetchStudentDataForSchool(schoolId, password) {
//   const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Employee_Registry?Schoolid=${schoolId}&password=${password}`;

//   try {
//     const response = await axios.get(apiUrl);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching data for school ${schoolId}:`, error);
//     return null;
//   }
// }

// async function processStudentData(studentData) {
//   for (const student of studentData) {
//     let record = new Teacher(student);
//     record = await record.save();
//   }
// }

// async function storeTeacherDataInMongoDB() {
//   const schools = await School.find().exec();
//   const password = 'VSK@9180'; // Replace with your password
//   const records = [];
//   const dups = [];

//   for (const school of schools) {
//     const studentData = await fetchStudentDataForSchool(school.Schoolid, password);

//     if (studentData && studentData.Cargo) {
//       await processStudentData(studentData.Cargo);
//     }
//   }
// }

const axios = require('axios');
const cron = require('node-cron');
const { School, Teacher } = require('../models');

async function fetchTeacherDataForSchool(schoolId, password) {
  const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Employee_Registry?Schoolid=${schoolId}&password=${password}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for school ${schoolId}:`, error);
    return null;
  }
}

async function processTeacherData(teacherData) {
  for (const teacher of teacherData) {
    // Assuming 'empid' is a unique identifier for teachers in your data
    const filter = { empid: teacher.empid };

    // Set the 'upsert' option to true to create a new document if no match is found
    const update = teacher;
    const options = { upsert: true, new: true };

    // Use findOneAndUpdate to either update the existing document or insert a new one
    await Teacher.findOneAndUpdate(filter, update, options);
  }
}

async function storeTeacherDataInMongoDB() {
  const schools = await School.find().exec();
  const password = 'VSK@9180'; // Replace with your password

  for (const school of schools) {
    const teacherData = await fetchTeacherDataForSchool(school.Schoolid, password);

    if (teacherData && teacherData.Cargo) {
      await processTeacherData(teacherData.Cargo);
    }
  }
}

// Schedule the job to run every day at 11 PM  0 23 * * *
cron.schedule('0 0 * * *', async () => {
  try {
    console.log(`Running the attendance data update job...`);
    await storeTeacherDataInMongoDB();
    logger.info(`Student data update job completed.`);
  } catch (error) {
    logger.info('Error running the job:', error);
  }
});

const getTeacher = async () => {
  const data = await Teacher.find().limit(10000);
  return data;
};

const getTeacherBySchoolAndGender = async (gender, schname) => {
  const data = await Teacher.find({ gender, schname });
  return data;
};

module.exports = {
  storeTeacherDataInMongoDB,
  getTeacher,
  getTeacherBySchoolAndGender,
};
