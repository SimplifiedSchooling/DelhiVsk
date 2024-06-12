const axios = require('axios');
const cron = require('node-cron');
const logger = require('../config/logger');
const { School, TeacherAttendace } = require('../models');

// async function fetchTeacherDataForSchool(schoolId, password, dd) {
//   const apiUrl = `https://www.edudel.nic.in//mis/EduWebService_Other/vidyasamikshakendra.asmx/emp_AttnDetails?day=d_${dd}&schid=${schoolId}&caseNo=2&Password=${password}`;
//   //   const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Employee_Registry?Schoolid=${schoolId}&password=${password}`;

//   try {
//     const response = await axios.get(apiUrl);
//     return response.data;
//   } catch (error) {
//     logger.info(`Error fetching data for school ${schoolId}:`, error);
//     return null;
//   }
// }

// async function processTeacherData(teacherData, school, dd, month, year) {
//   for (const teacher of teacherData) {
//     const data = {
//       day: `d_${dd}`,
//       month,
//       year,
//       district_name: school.District_name,
//       Latitude: school.Latitude,
//       Longitude: school.Longitude,
//       Z_name: school.Zone_Name,
//       schoolID: school.Schoolid,
//       school_name: school.School_Name,
//       shift: school.shift,
//       SchManagement: school.SchManagement,
//       TotalGovtSchools: teacher.TotalGovtSchools,
//       TotalEmployees: teacher.TotalEmployees,
//       AllPresent: teacher.AllPresent,
//       AllAbsent: teacher.AllAbsent,
//       AllHCL: teacher.AllHCL,
//       AllCL: teacher.AllCL,
//       AllEL: teacher.AllEL,
//       AllOL: teacher.AllOL,
//       AllOD: teacher.AllOD,
//       AllSuspended: teacher.AllSuspended,
//       AllVacation: teacher.AllVacation,
//       TotalEmployeesMarkedAtt: teacher.TotalEmployeesMarkedAtt,
//       SchoolsMarkedAttn: teacher.SchoolsMarkedAttn,
//       SchoolsNotMarkedAttn: teacher.SchoolsNotMarkedAttn,
//     };

//     await TeacherAttendace.create(data);
//   }
// }

// async function storeTeacherDataInMongoDB() {
//   const today = new Date();
//   const dd = String(today.getDate()).padStart(2, '0');
//   const mm = String(today.getMonth() + 1).padStart(2, '0');
//   const year = String(today.getFullYear() + 1).padStart(2, '0');
//   const schools = await School.find().exec();
//   const password = 'VSK@9180';
//   for (const school of schools) {
//     const teacherData = await fetchTeacherDataForSchool(school.Schoolid, password, dd, mm);
//     if (teacherData && teacherData.Cargo) {
//       await processTeacherData(teacherData.Cargo, school, dd, mm, year);
//     }
//   }
// }

// // Schedule the job to run every day at 11 PM  0 23 * * *
// cron.schedule('*/5 * * * *', async () => {
//   try {
//     logger.info(`Running the attendance data update job...`);
//     await storeTeacherDataInMongoDB();
//     logger.info(`Student data update job completed.`);
//   } catch (error) {
//     logger.info('Error running the job:', error);
//   }
// });
////////////////////////////////////////////
async function fetchTeacherData(password, day) {
  const apiUrl = `https://www.edudel.nic.in//mis/EduWebService_Other/vidyasamikshakendra.asmx/emp_ConsolidatedAttnDetails?schid=0&caseNo=1&day=d_11&Shift=0&password=VSK@9180`;
  
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching data:`, error);
    return null;
  }
}

async function processTeacherDataCounsolated(teacherData, day, month, year) {
  for (const teacher of teacherData) {
const school = await School.findOne({Schoolid: teacher.schid })
    const data = {
      day: `d_11`,
      month,
      year,
      district_name: school.District_name,
      Latitude: school.Latitude,
      Longitude: school.Longitude,
      Z_name: school.Zone_Name,
      schoolID: school.Schoolid,
      school_name: school.School_Name,
      shift: school.shift,
      SchManagement: school.SchManagement,
      Present: teacher.Present || 0,
      TotAbsent: teacher.TotAbsent || 0,
      HalfCL: teacher.HalfCL || 0,
      CL: teacher.CL || 0,
      EL: teacher.EL || 0,
      OtherLeave: teacher.OtherLeave || 0,
      OD: teacher.OD || 0,
      Suspended: teacher.Suspended || 0,
      vacation: teacher.vacation || 0,
    };

    await TeacherAttendace.create(data);
  }
}

async function storeTeacherDataConsolatedInMongoDB() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const year = String(today.getFullYear());
  const schools = await School.find().exec();
  const password = 'VSK@9180';
  
//   for (const school of schools) {
    const teacherData = await fetchTeacherData(password, dd);
    if (teacherData && teacherData.Cargo) {
      await processTeacherDataCounsolated(teacherData.Cargo, dd, mm, year);
    }
//   }
}

cron.schedule('2 0 * * *', async () => {
  try {
    logger.info(`Running the attendance data update job...`);
    await storeTeacherDataConsolatedInMongoDB();
    logger.info(`Student data update job completed.`);
  } catch (error) {
    logger.info('Error running the job:', error);
  }
});
// // Schedule the job to run every 5 minutes
// cron.schedule('*/2 * * * *', async () => {
//   try {
//     logger.info(`Running the attendance data update job...`);
//     await storeTeacherDataConsolatedInMongoDB();
//     logger.info(`Attendance data update job completed.`);
//   } catch (error) {
//     logger.error('Error running the job:', error);
//   }
// });
// storeTeacherDataConsolatedInMongoDB()
const topBottomAttendanceCount = async (query) => {
  // Perform aggregation to get the top 5 districts by attendance
  const topDistricts = await TeacherAttendace.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$district_name",
        totalPresent: { $sum: "$Present" }
      }
    },
    { $sort: { totalPresent: -1 } },
    { $limit: 5 }
  ]);

  // Perform aggregation to get the bottom 5 districts by attendance
  const bottomDistricts = await TeacherAttendace.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$district_name",
        totalPresent: { $sum: "$Present" }
      }
    },
    { $sort: { totalPresent: 1 } },
    { $limit: 5 }
  ]);

  return {
    topDistricts,
    bottomDistricts,
  };
};

const getAttendanceData = async (day, month, year) => {
  try {
    // Build the query object
    const query = {};
    if (day) query.day = day;
    if (month) query.month = month;
    if (year) query.year = year;

    const topBottom = await topBottomAttendanceCount(query);

    // Perform aggregation for the attendance summary
    const attendanceSummary = await TeacherAttendace.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            day: "$day",
            month: "$month",
            year: "$year"
          },
          totalPresent: { $sum: "$Present" },
          totalTotAbsent: { $sum: "$TotAbsent" },
          totalHalfCL: { $sum: "$HalfCL" },
          totalCL: { $sum: "$CL" },
          totalEL: { $sum: "$EL" },
          totalOtherLeave: { $sum: "$OtherLeave" },
          totalOD: { $sum: "$OD" },
          totalSuspended: { $sum: "$Suspended" },
          totalVacation: { $sum: "$vacation" }
        }
      }
    ]);

    return { attendanceSummary, topBottom };
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw new Error('Internal Server Error');
  }
};

// // Example usage of the getAttendanceData function
// getAttendanceData('12', '06', '2024')
//   .then((result) => {
//     console.log('Attendance Data:', result);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

  // getAttendanceData('d_12', '06', '2024');

  const treandGraph = async (startDay, endDay, month, year) => {

    // Build the query object
    const query = {
      day: { $gte: startDay, $lte: endDay },
      month,
      year,
    };

    // Perform aggregation
    const attendanceTrend = await TeacherAttendace.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            day: "$day",
            month: "$month",
            year: "$year"
          },
          totalPresent: { $sum: "$Present" },
          totalTotAbsent: { $sum: "$TotAbsent" },
          totalHalfCL: { $sum: "$HalfCL" },
          totalCL: { $sum: "$CL" },
          totalEL: { $sum: "$EL" },
          totalOtherLeave: { $sum: "$OtherLeave" },
          totalOD: { $sum: "$OD" },
          totalSuspended: { $sum: "$Suspended" },
          totalVacation: { $sum: "$vacation" }
        }
      },
      {
        $sort: { "_id.day": 1 } // Sort by day in ascending order
      }
    ]);
return attendanceTrend
  }

//   (async () => {
//   try {
//     const schManagementType = 'Government'; // Replace with the desired SchManagement type
//     const result = await getAttendanceData('d_11', '06', '2024') //;(schManagementType);
//     console.log(result);
//   } catch (error) {
//     console.error('Error fetching data by SchManagement:', error);
//   }
// })();


module.exports = {
    // storeTeacherDataConsolatedInMongoDB,
    getAttendanceData,
};
