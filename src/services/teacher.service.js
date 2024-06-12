const axios = require('axios');
const cron = require('node-cron');
const logger = require('../config/logger');
const { School, Teacher } = require('../models');

async function fetchTeacherDataForSchool(schoolId, password) {
  const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Employee_Registry?Schoolid=${schoolId}&password=${password}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    logger.info(`Error fetching data for school ${schoolId}:`, error);
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
cron.schedule('0 1 * * *', async () => {
  try {
    logger.info(`Running the attendance data update job...`);
    await storeTeacherDataInMongoDB();
    logger.info(`Student data update job completed.`);
  } catch (error) {
    logger.info('Error running the job:', error);
  }
});

// cron.schedule('06 11 * * *', async () => {
//   try {
//     logger.info(`Running the Teacher data update job...`);
//     await storeTeacherDataInMongoDB();
//     logger.info(`Student data update job completed.`);
//   } catch (error) {
//     logger.info('Error running the job:', error);
//   }
// });

async function fetchTeacherUpdate(empid, password) {
  try {
    const response = await axios.get('https://www.edudel.nic.in/mis/eduwebservice/webappsmob.asmx/EmployeePersonnelDetail', {
      params: {
        userid: empid,
        password,
      },
    });
    return response.data;
  } catch (error) {
    logger.info(`Error fetching data for teacher ${empid}:`, error);
    return null;
  }
}

function getpassword() {
  const dateValue = new Date();
  return `Mob#${dateValue.getFullYear() * dateValue.getDate() + dateValue.getMonth() + 1}37t@Zr`;
}

async function storeTeacherDataUpdate() {
  const teachers = await Teacher.find().exec();

  const password = getpassword();
  for (const teacher of teachers) {
    const teacherData = await fetchTeacherUpdate(teacher.empid, password);

    for (const apiEmployee of teacherData.Cargo) {
      const { name, joining_date } = apiEmployee;
      const part = name.split('-');
      const empid = part;
      // Find the corresponding teacher in the MongoDB collection
      const teacher = await Teacher.findOne({ empid });

      // If the teacher is found, update the initJoiningDate field
      if (teacher) {
        teacher.initJoiningDate = joining_date;
        await teacher.save();
        logger.info(`Updated initJoiningDate for teacher with empid ${empid}`);
      } else {
        logger.info(`Teacher with empid ${empid} not found in the database`);
      }
    }
  }
}

// Schedule the job to run every day at 11 PM  0 23 * * *
cron.schedule('0 0 * * *', async () => {
  try {
    logger.info(`Running the attendance data update job...`);
    await storeTeacherDataUpdate();
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
  const data = await Teacher.find({ gender, schoolid: schname });
  return data;
};

/**
 * Search for teachers based on schname, Name, or schoolid
 * @param {Object} filters - Filters for the search
 * @returns {Promise<Array>} - Array of matching teachers
 */
// Function to escape special characters in a string for RegExp
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const searchTeachers = async (searchQuery) => {
  const query = {
    $or: [
      // { schname: new RegExp(`^${escapeRegExp(searchQuery)}`, 'i') },
      { Name: new RegExp(`^${escapeRegExp(searchQuery)}`, 'i') },
      { empid: searchQuery },
      // { postdesc: new RegExp(`^${escapeRegExp(searchQuery)}`, 'i') },
    ],
  };

  const teachers = await Teacher.find(query).exec();
  return teachers;
};

module.exports = {
  storeTeacherDataInMongoDB,
  getTeacher,
  getTeacherBySchoolAndGender,
  searchTeachers,
};
