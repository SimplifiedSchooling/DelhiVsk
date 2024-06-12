const axios = require('axios');
const cron = require('node-cron');
const logger = require('../config/logger');
const { School, TeacherAttendace } = require('../models');

async function fetchTeacherDataForSchool(schoolId, password) {
  const apiUrl = `https://www.edudel.nic.in//mis/EduWebService_Other/vidyasamikshakendra.asmx/emp_AttnDetails?day=d_1&schid=${schoolId}&caseNo=2&Password=${password}`;
  //   const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Employee_Registry?Schoolid=${schoolId}&password=${password}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    logger.info(`Error fetching data for school ${schoolId}:`, error);
    return null;
  }
}

async function processTeacherData(teacherData, school) {
    for (const teacher of teacherData) {
      const data = {
        district_name: school.District_name,
        Latitude: school.Latitude,
        Longitude: school.Longitude,
        Z_name: school.Zone_Name,
        schoolID: school.Schoolid,
        school_name: school.School_Name,
        shift: school.shift,
        SchManagement: school.SchManagement,
        TotalGovtSchools: teacher.TotalGovtSchools,
        TotalEmployees: teacher.TotalEmployees,
        AllPresent: teacher.AllPresent,
        AllAbsent: teacher.AllAbsent,
        AllHCL: teacher.AllHCL,
        AllCL: teacher.AllCL,
        AllEL: teacher.AllEL,
        AllOL: teacher.AllOL,
        AllOD: teacher.AllOD,
        AllSuspended: teacher.AllSuspended,
        AllVacation: teacher.AllVacation,
        TotalEmployeesMarkedAtt: teacher.TotalEmployeesMarkedAtt,
        SchoolsMarkedAttn: teacher.SchoolsMarkedAttn,
        SchoolsNotMarkedAttn: teacher.SchoolsNotMarkedAttn,
      };
      
      await TeacherAttendace.create(data);
    }
  }

async function storeTeacherDataInMongoDB() {
  const schools = await School.find().exec();
  const password = 'VSK@9180';
  for (const school of schools) {
    const teacherData = await fetchTeacherDataForSchool(school.Schoolid, password);
    if (teacherData && teacherData.Cargo) {
      await processTeacherData(teacherData.Cargo, school);
    }
  }
}

// Schedule the job to run every day at 11 PM  0 23 * * *
// cron.schedule('*/5 * * * *', async () => {
//   try {
//     logger.info(`Running the attendance data update job...`);
//     await storeTeacherDataInMongoDB();
//     logger.info(`Student data update job completed.`);
//   } catch (error) {
//     logger.info('Error running the job:', error);
//   }
// });

module.exports = {
  storeTeacherDataInMongoDB,
};
