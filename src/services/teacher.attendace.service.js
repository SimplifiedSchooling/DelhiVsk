const axios = require('axios');
const cron = require('node-cron');
const logger = require('../config/logger');
const { School, TeacherAttendace, Teacher } = require('../models');

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
/**
 * Get teacher counselate attendance 
 * @param {Object} d_1
 * @returns {Promise<TeacherAttendace>}
 */

async function fetchTeacherDataFromOldApi(password, day) {
  const apiUrl = `https://www.edudel.nic.in//mis/EduWebService_Other/vidyasamikshakendra.asmx/emp_ConsolidatedAttnDetails?schid=0&caseNo=1&day=d_${day}&Shift=0&password=${password}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching data from old API:`, error);
    return null;
  }
}

async function fetchTeacherDataFromNewApi(schoolId, password, day) {
  const apiUrl = `https://www.edudel.nic.in//mis/EduWebService_Other/vidyasamikshakendra.asmx/emp_AttnDetails?day=d_${day}&schid=${schoolId}&caseNo=2&Password=${password}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching data for school ${schoolId} from new API:`, error);
    return null;
  }
}

async function processTeacherData(teacherData, school, additionalData, day, month, year) {
  const data = teacherData
    .filter(teacher => teacher.schid === school.Schoolid)
    .map(teacher => ({
      day: `d_${day}`,
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
      TotalEmployees: additionalData.TotalEmployees || 0,
      TotalEmployeesMarkedAtt: additionalData.TotalEmployeesMarkedAtt || 0,
    }));

  if (data.length > 0) {
    await TeacherAttendace.insertMany(data);
  }
}

async function storeTeacherDataInMongoDB() {
  console.log('Starting data fetch and store process');
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const year = String(today.getFullYear());
  const password = 'VSK@9180';

  const oldApiData = await fetchTeacherDataFromOldApi(password, dd);
  if (!oldApiData || !oldApiData.Cargo) {
    logger.error('No data returned from old API');
    return;
  }

  const schools = await School.find().exec();

  const newApiDataPromises = schools.map(school => fetchTeacherDataFromNewApi(school.Schoolid, password, dd));
  const newApiDataResults = await Promise.all(newApiDataPromises);

  const processTeacherDataPromises = schools.map((school, index) => {
    const newApiData = newApiDataResults[index];
    if (newApiData && newApiData.Cargo && newApiData.Cargo.length > 0) {
      const additionalData = newApiData.Cargo[0];
      return processTeacherData(oldApiData.Cargo, school, additionalData, dd, mm, year);
    } else {
      logger.error(`No data returned for school ${school.Schoolid} from new API`);
      return Promise.resolve();
    }
  });

  await Promise.all(processTeacherDataPromises);
  console.log('Data stored successfully');
}


// // Example usage
// storeTeacherDataInMongoDB()
//   .then(() => {
//     console.log('Data stored successfully');
//   })
//   .catch((error) => {
//     console.error('Error storing data:', error);
//   });
// async function fetchTeacherData(password, day) {
//   const apiUrl = `https://www.edudel.nic.in//mis/EduWebService_Other/vidyasamikshakendra.asmx/emp_ConsolidatedAttnDetails?schid=0&caseNo=1&day=d_${day}&Shift=0&password=VSK@9180`;
  
//   try {
//     const response = await axios.get(apiUrl);
//     return response.data;
//   } catch (error) {
//     logger.error(`Error fetching data:`, error);
//     return null;
//   }
// }

// async function processTeacherDataCounsolated(teacherData, day, month, year) {
//   for (const teacher of teacherData) {
// const school = await School.findOne({Schoolid: teacher.schid })
//     const data = {
//       day: `d_${day}`,
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
//       Present: teacher.Present || 0,
//       TotAbsent: teacher.TotAbsent || 0,
//       HalfCL: teacher.HalfCL || 0,
//       CL: teacher.CL || 0,
//       EL: teacher.EL || 0,
//       OtherLeave: teacher.OtherLeave || 0,
//       OD: teacher.OD || 0,
//       Suspended: teacher.Suspended || 0,
//       vacation: teacher.vacation || 0,
//     };

//     await TeacherAttendace.create(data);
//   }
// }

// async function storeTeacherDataConsolatedInMongoDB() {
//   const today = new Date();
//   const dd = String(today.getDate()).padStart(2, '0');
//   const mm = String(today.getMonth() + 1).padStart(2, '0');
//   const year = String(today.getFullYear());
//   const schools = await School.find().exec();
//   const password = 'VSK@9180';
  
// //   for (const school of schools) {
//     const teacherData = await fetchTeacherData(password, dd);
//     if (teacherData && teacherData.Cargo) {
//       await processTeacherDataCounsolated(teacherData.Cargo, dd, mm, year);
//     }
// //   }
// }

cron.schedule('2 11 * * *', async () => {
  try {
    logger.info(`Running the attendance data update job...`);
    await storeTeacherDataInMongoDB();
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

/**
 * Get teacher attendance top 5 district bottom 5 district
 * @param {Object} d_1
 * @returns {Promise<TeacherAttendace>}
 */

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

/**
 * Get teacher attendance counts for statistic graph
 * @param {Object} d_1
 * @returns {Promise<TeacherAttendace>}
 */
const getAttendanceData = async (day, month, year, shift) => {
  try {
    // Build the query object
    const query = {};
    if (day) query.day = day;
    if (month) query.month = month;
    if (year) query.year = year;
    if(shift) query.shift = shift;

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
          TotalEmployees: {$sum: "$TotalEmployees"},
          TotalEmployeesMarkedAtt: {$sum: "$TotalEmployeesMarkedAtt"},
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
    let query1 = {}
    if(shift) query1.shift = shift;
const totalSchool = await School.countDocuments(query1)
    return { attendanceSummary,totalSchool, topBottom };
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw new Error('Internal Server Error');
  }
};

// Example usage of the getAttendanceData function
// getAttendanceData('d_11', '06', '2024')
//   .then((result) => {
//     console.log('Attendance Data:', result);
//   })
//   .catch((error) => {  
//     console.error('Error:', error);
//   });

  // getAttendanceData('d_12', '06', '2024');

  /**
 * Get teacher attendance treand graph
 * @param {Object} d_1
 * @param {Object} startDay
 * @param {Object} endDay
 * @param {Object} month
 * @param {Object} year
 * @returns {Promise<TeacherAttendace>}
 */

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


  /**
 * Get teacher attendance top 5 district bottom 5 district
 * @param {Object} query
 * @returns {Promise<TeacherAttendace>}
 */

const topBottomAttendanceCountByDistrict = async (query) => {
  // Perform aggregation to get the top 5 districts by attendance
  const topDistricts = await TeacherAttendace.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$Z_name",
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
        _id: "$Z_name",
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

/**
 * Get teacher attendance counts for statistic graph
 * @param {Object} d_1
 * @returns {Promise<TeacherAttendace>}
 */
const getAttendanceDataByDistrict = async (day, month, year, district, shift) => {
  try {
    // Build the query object
    const query = {};
    if (day) query.day = day;
    if (month) query.month = month;
    if (year) query.year = year;
    if(district) query.district_name = district;
    if(shift) query.shift = shift;

    const topBottom = await topBottomAttendanceCountByDistrict(query);

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
          TotalEmployees: {$sum: "$TotalEmployees"},
          TotalEmployeesMarkedAtt: {$sum: "$TotalEmployeesMarkedAtt"},
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
    let query1 = {}
    if(district) query1.District_name = district;
    if(shift) query1.shift = shift;
const totalSchool = await School.countDocuments(query1)
    return { attendanceSummary, totalSchool, topBottom };
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw new Error('Internal Server Error');
  }
};

  /**
 * Get teacher attendance top 5 district bottom 5 district
 * @param {Object} query
 * @returns {Promise<TeacherAttendace>}
 */

  const topBottomAttendanceCountByZone = async (query) => {
    // Perform aggregation to get the top 5 districts by attendance
    const topDistricts = await TeacherAttendace.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$schoolID",
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
          _id: "$schoolID",
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
  
  /**
   * Get teacher attendance counts for statistic graph
   * @param {Object} day
   * @param {Object} month
   * @param {Object} year
   * @param {Object} zone
   * @returns {Promise<TeacherAttendace>}
   */
  const getAttendanceDataByZone = async (day, month, year, zone, shift) => {
    try {
      // Build the query object
      const query = {};
      if (day) query.day = day;
      if (month) query.month = month;
      if (year) query.year = year;
      if(zone) query.Z_name = zone;
      if(shift) query.shift = shift;
  
      const topBottom = await topBottomAttendanceCountByZone(query);
  
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
            TotalEmployees: {$sum: "$TotalEmployees"},
            TotalEmployeesMarkedAtt: {$sum: "$TotalEmployeesMarkedAtt"},
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
      let query1 = {}
      if(zone) query.Zone_Name = zone;
    if(shift) query1.shift = shift;
const totalSchool = await School.countDocuments(query1)
      return { attendanceSummary, totalSchool, topBottom };
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      throw new Error('Internal Server Error');
    }
  };

  
  /**
   * Get teacher attendance counts for statistic graph
   * @param {Object} day
   * @param {Object} month
   * @param {Object} year
   * @param {Object} zone
   * @returns {Promise<TeacherAttendace>}
   */
  const getAttendanceDataByschoolID = async (day, month, year, schoolID) => {
    try {
      // Build the query object
      const query = {};
      if (day) query.day = day;
      if (month) query.month = month;
      if (year) query.year = year;
      if(schoolID) query.schoolID = schoolID;
  
      // const topBottom = await topBottomAttendanceCountByDistrict(query);
  
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
            TotalEmployees: {$sum: "$TotalEmployees"},
            TotalEmployeesMarkedAtt: {$sum: "$TotalEmployeesMarkedAtt"},
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
      let query1 = {}
      if(schoolID) query.Schoolid = Number(schoolID);
const totalSchool = await School.countDocuments(query1)
      return { attendanceSummary };
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      throw new Error('Internal Server Error');
    }
  };

//   (async () => {
//   try {
//     const schManagementType = 'Government'; // Replace with the desired SchManagement type
//     const schoolData = await School.find({SchManagement:'Government' })
//     const schoolIds = schoolData.map((school) => school.Schoolid.toString());
//     const teacher = await Teacher.countDocuments({schoolid: {$in: schoolIds}})
//     const result = await getAttendanceDataByschoolID('d_11', '06', '2024', '1001001') //;(schManagementType);
//     console.log(result, teacher);
//   } catch (error) {
//     console.error('Error fetching data by SchManagement:', error);
//   }
// })();


module.exports = {
    getAttendanceData,
    getAttendanceDataByDistrict,
    getAttendanceDataByZone,
    getAttendanceDataByschoolID,
    treandGraph,
};
