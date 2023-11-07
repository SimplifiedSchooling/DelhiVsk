// const httpStatus = require('http-status');
const axios = require('axios');
const { School, Attendance, Student, StudentCounts } = require('../models');
// const ApiError = require('../utils/ApiError');

/**
 * Get Attendance data from server
 * @param {string} schoolId
 * @param {string} password
 * @param {string} date
 * @returns {Promise<Attendance>}
 */
async function fetchStudentDataForSchool(schoolId, password, date) {
  try {
    const apiUrl = `https://www.edudel.nic.in//mis/EduWebService_Other/vidyasamikshakendra.asmx/Student_Attendence_School?password=${password}&School_ID=${schoolId}&Date=${date}`;

    const response = await axios.get(apiUrl);

    if (Array.isArray(response.data.Cargo)) {
      return response.data.Cargo;
    }
    return [response.data.Cargo];
  } catch (error) {
    return null;
  }
}

/**
 * Get Attendance data from server and store in databae
 * @returns {Promise<Attendance>}
 */


const storeAttendanceDataInMongoDB = async () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  const date = '03/11/2023';
  // `${day}/${month}/${year}`;
  const password = 'VSK@9180';

  const schools = await School.find().exec();
  for (const school of schools) {
    const studentData = await fetchStudentDataForSchool(school.Schoolid, password, date);

    if (studentData) {
      // Create a unique identifier based on school and date
      const identifier = `${school.Schoolid}-${date}`;

      // Check if an entry with the same identifier exists
      const existingAttendance = await Attendance.findOne({ identifier });

      const genderCounts = studentData.reduce(
        (count, student) => {
          count[student.Gender] = (count[student.Gender] || 0) + 1;
          return count;
        },
        { M: 0, F: 0, T: 0 }
      );

      const studentgenderWiseCount = await StudentCounts.findOne({ Schoolid: school.Schoolid });

      const genderAbsentCount = {
        male: studentgenderWiseCount.maleStudents - genderCounts.M,
        female: studentgenderWiseCount.femaleStudents - genderCounts.F,
        others: studentgenderWiseCount.otherStudents - genderCounts.T,
      };

      const totalStudentCount =
        studentgenderWiseCount.maleStudents +
        studentgenderWiseCount.femaleStudents +
        studentgenderWiseCount.otherStudents;

      if (existingAttendance) {
        // If an entry with the same identifier exists, update it
        await Attendance.updateOne(
          { identifier },
          {
            district_name: school.District_name,
            Z_name: school.Zone_Name,
            School_ID: school.Schoolid,
            school_name: school.School_Name,
            shift: school.shift,
            attendance_DATE: date,
            totalStudentCount,
            PreasentCount: studentData.length,
            malePresentCount: genderCounts.M,
            feMalePresentCount: genderCounts.F,
            otherPresentCount: genderCounts.T,
            maleAbsentCount: genderAbsentCount.male,
            feMaleAbsentCount: genderAbsentCount.female,
            othersAbsentCount: genderAbsentCount.others,
          }
        );
      } else {
        // If no entry with the same identifier exists, create a new one
        await Attendance.create({
          identifier, // Add the identifier to the entry
          district_name: school.District_name,
          Z_name: school.Zone_Name,
          School_ID: school.Schoolid,
          school_name: school.School_Name,
          shift: school.shift,
          attendance_DATE: date,
          totalStudentCount,
          PreasentCount: studentData.length,
          malePresentCount: genderCounts.M,
          feMalePresentCount: genderCounts.F,
          otherPresentCount: genderCounts.T,
          maleAbsentCount: genderAbsentCount.male,
          feMaleAbsentCount: genderAbsentCount.female,
          othersAbsentCount: genderAbsentCount.others,
        });
      }
    }
  }
};

// const storeAttendanceDataInMongoDB = async () => {
//   const now = new Date();
//   const day = String(now.getDate()).padStart(2, '0');
//   const month = String(now.getMonth() + 1).padStart(2, '0');
//   const year = now.getFullYear();

//   const date = '03/11/2023'
//   //`${day}/${month}/${year}`;
//   const password = 'VSK@9180';

//   const schools = await School.find().exec();
//   for (const school of schools) {
//     const studentData = await fetchStudentDataForSchool(school.Schoolid, password, date);

//     if (studentData) {
//       const studentgenderWiseCount = await StudentCounts.find({Schoolid: school.Schoolid})
//       const genderCounts = studentData.reduce(
//         (count, student) => {
//           count[student.Gender] = (count[student.Gender] || 0) + 1;
//           return count;
//         },
//         { M: 0, F: 0, T: 0 }
//       );

//       console.log(studentgenderWiseCount, studentgenderWiseCount.maleStudents,  studentgenderWiseCount.femaleStudents, studentgenderWiseCount.otherStudents)

//       const genderAbsentCount = {
//         male: studentgenderWiseCount.maleStudents - genderCounts.M,
//         female: studentgenderWiseCount.femaleStudents - genderCounts.F,
//         others: studentgenderWiseCount.otherStudents - genderCounts.T,
//       };
//       const totalStudentCount = studentgenderWiseCount.maleStudents + studentgenderWiseCount.femaleStudents + studentgenderWiseCount.otherStudents;
// console.log(genderAbsentCount, totalStudentCount);
//       await Attendance.create({
//         district_name: school.District_name,
//         Z_name: school.Zone_Name,
//         School_ID: school.Schoolid,
//         school_name: school.School_Name,
//         shift: school.shift,
//         attendance_DATE: date,
//         totalStudentCount,
//         PreasentCount: studentData.length,
//         malePresentCount: genderCounts.M,
//         feMalePresentCount: genderCounts.F,
//         otherPresentCount: genderCounts.T,
//         maleAbsentCount: genderAbsentCount.male,
//         feMaleAbsentCount: genderAbsentCount.female,
//         othersAbsentCount: genderAbsentCount.others,
//       });
//     }
//   }
// };

const getAttendanceCounts = async (date) => {
  const match = {
    attendance_DATE: date,
  };
  const totalStudentCount = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        count: { $sum: '$totalStudentCount' },
      },
    },
  ]);

  const presentStudentCount = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        count: { $sum: '$PreasentCount' },
      },
    },
  ]);

  const malePresentCount = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        count: { $sum: '$malePresentCount' },
      },
    },
  ]);

  const femalePresentCount = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        count: { $sum: '$feMalePresentCount' },
      },
    },
  ]);

  const otherPresentCount = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        count: { $sum: '$otherPresentCount' },
      },
    },
  ]);

  const maleAbsentCount = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        count: { $sum: '$maleAbsentCount' },
      },
    },
  ]);

  const femaleAbsentCount = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        count: { $sum: '$feMaleAbsentCount' },
      },
    },
  ]);

  const otherAbsentCount = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        count: { $sum: '$othersAbsentCount' },
      },
    },
  ]);

  return {
    totalStudentCount: totalStudentCount[0] ? totalStudentCount[0].count : 0,
    presentStudentCount: presentStudentCount[0] ? presentStudentCount[0].count : 0,
    malePresentCount: malePresentCount[0] ? malePresentCount[0].count : 0,
    femalePresentCount: femalePresentCount[0] ? femalePresentCount[0].count : 0,
    otherPresentCount: otherPresentCount[0] ? otherPresentCount[0].count : 0,
    maleAbsentCount: maleAbsentCount[0] ? maleAbsentCount[0].count : 0,
    femaleAbsentCount: femaleAbsentCount[0] ? femaleAbsentCount[0].count : 0,
    otherAbsentCount: otherAbsentCount[0] ? otherAbsentCount[0].count : 0,
  };
};

const getAttendanceCountsDistrictWise = async (body) => {
  const {date, districtName } = body;
  const dateMatch = {
    $match: {
      attendance_DATE: date,
      district_name: districtName,
    },
  };
  const totalStudentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$totalStudentCount' },
      },
    },
  ]);

  const presentStudentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$PreasentCount' },
      },
    },
  ]);

  const malePresentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$malePresentCount' },
      },
    },
  ]);

  const femalePresentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$feMalePresentCount' },
      },
    },
  ]);

  const otherPresentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$otherPresentCount' },
      },
    },
  ]);

  const maleAbsentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$maleAbsentCount' },
      },
    },
  ]);

  const femaleAbsentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$feMaleAbsentCount' },
      },
    },
  ]);

  const otherAbsentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$othersAbsentCount' },
      },
    },
  ]);

  return {
    totalStudentCount: totalStudentCount[0].count,
    presentStudentCount: presentStudentCount[0].count,
    malePresentCount: malePresentCount[0].count,
    femalePresentCount: femalePresentCount[0].count,
    otherPresentCount: otherPresentCount[0].count,
    maleAbsentCount: maleAbsentCount[0].count,
    femaleAbsentCount: femaleAbsentCount[0].count,
    otherAbsentCount: otherAbsentCount[0].count,
  };
};

const getAttendanceCountsZoneWise = async (date, Z_name) => {
  const dateMatch = {
    $match: {
      attendance_DATE: date,
      Z_name,
    },
  };

  const totalStudentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$totalStudentCount' },
      },
    },
  ]);

  const presentStudentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$PreasentCount' },
      },
    },
  ]);

  const malePresentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$malePresentCount' },
      },
    },
  ]);

  const femalePresentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$feMalePresentCount' },
      },
    },
  ]);

  const otherPresentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$otherPresentCount' },
      },
    },
  ]);

  const maleAbsentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$maleAbsentCount' },
      },
    },
  ]);

  const femaleAbsentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$feMaleAbsentCount' },
      },
    },
  ]);

  const otherAbsentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$othersAbsentCount' },
      },
    },
  ]);

  return {
    totalStudentCount: totalStudentCount[0].count,
    presentStudentCount: presentStudentCount[0].count,
    malePresentCount: malePresentCount[0].count,
    femalePresentCount: femalePresentCount[0].count,
    otherPresentCount: otherPresentCount[0].count,
    maleAbsentCount: maleAbsentCount[0].count,
    femaleAbsentCount: femaleAbsentCount[0].count,
    otherAbsentCount: otherAbsentCount[0].count,
  };
};


const getAttendanceCountsShiftWise = async (date, shift) => {
  const dateMatch = {
    $match: {
      attendance_DATE: date,
      shift,
    },
  };

  const totalStudentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$totalStudentCount' },
      },
    },
  ]);

  const presentStudentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$PreasentCount' },
      },
    },
  ]);

  const malePresentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$malePresentCount' },
      },
    },
  ]);

  const femalePresentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$feMalePresentCount' },
      },
    },
  ]);

  const otherPresentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$otherPresentCount' },
      },
    },
  ]);

  const maleAbsentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$maleAbsentCount' },
      },
    },
  ]);

  const femaleAbsentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$feMaleAbsentCount' },
      },
    },
  ]);

  const otherAbsentCount = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        count: { $sum: '$othersAbsentCount' },
      },
    },
  ]);

  return {
    totalStudentCount: totalStudentCount[0].count,
    presentStudentCount: presentStudentCount[0].count,
    malePresentCount: malePresentCount[0].count,
    femalePresentCount: femalePresentCount[0].count,
    otherPresentCount: otherPresentCount[0].count,
    maleAbsentCount: maleAbsentCount[0].count,
    femaleAbsentCount: femaleAbsentCount[0].count,
    otherAbsentCount: otherAbsentCount[0].count,
  };
};
module.exports = {
  storeAttendanceDataInMongoDB,
  getAttendanceCounts,
  getAttendanceCountsDistrictWise,
  getAttendanceCountsZoneWise,
  getAttendanceCountsShiftWise,
};
