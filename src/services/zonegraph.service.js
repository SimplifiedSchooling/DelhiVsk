const { School, Teacher, Student } = require('../models');
const redis = require('../utils/redis');

/**
 * Get all school, student, teacher graph data by districtName
 * @param {string} districtName - The district name to filter the data
 * @returns {Promise<Object>} School, teacher, student graph data
 */
const getAllSchoolStudentTeacherDataByDistrict = async (districtName) => {
  // Create a cache key based on the district name
  const cacheKey = `districtName:${districtName}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const schoolData = await School.find({ District_name: districtName });

  const schoolManagementWise = {};
  const zoneWiseCount = {};
  const mediumWiseCount = {};
  let lowClassCount = 0;
  let highClassCount = 0;
  const shiftWiseCount = { Morning: 0, Afternoon: 0, Evening: 0 };
  // const afiliationCount = {};
  // const minorityCount = {};
  // const streamCount = {};
  const typeOfSchoolCount = {};

  schoolData.forEach((school) => {
    // School Management Wise
    const schManagement = school.SchManagement || 'Unknown';
    schoolManagementWise[schManagement] = (schoolManagementWise[schManagement] || 0) + 1;

    // Zone Wise School Count
    const zone = school.Zone_Name || 'Unknown';
    zoneWiseCount[zone] = (zoneWiseCount[zone] || 0) + 1;

    // Medium Wise School Count
    const medium = school.medium || 'Unknown';
    mediumWiseCount[medium] = (mediumWiseCount[medium] || 0) + 1;

    // Low and High Class Count
    lowClassCount += parseInt(school.low_class, 10) || 0;
    highClassCount += parseInt(school.High_class, 10) || 0;

    // Shift Wise School Count
    const shift = school.shift || 'Unknown';
    shiftWiseCount[shift] = (shiftWiseCount[shift] || 0) + 1;

    // // Afiliation Count
    // const afiliation = school.affiliation || 'Unknown';
    // afiliationCount[afiliation] = (afiliationCount[afiliation] || 0) + 1;

    // // Minority Count
    // const minority = school.minority || 'Unknown';
    // minorityCount[minority] = (minorityCount[minority] || 0) + 1;

    // // Stream Count
    // const stream = school.stream || 'Unknown';
    // streamCount[stream] = (streamCount[stream] || 0) + 1;

    // Stream Count
    const typeOfSchool = school.typeOfSchool || 'Unknown';
    typeOfSchoolCount[typeOfSchool] = (typeOfSchoolCount[typeOfSchool] || 0) + 1;
  });

  const [
    totalSchools,
    totalTeachers,
    totalFemaleTeachers,
    totalMaleTeachers,
    totalMaleStudent,
    totalGirlsStudent,
    totalStudent,
    totalStudyingStudent,
  ] = await Promise.allSettled([
    School.countDocuments({ District_name: districtName }).exec(),
    Teacher.countDocuments({ districtname: districtName }).exec(),
    Teacher.countDocuments({ gender: 'Female', districtname: districtName }).exec(),
    Teacher.countDocuments({ gender: 'Male', districtname: districtName }).exec(),
    Student.countDocuments({ Gender: 'M', District: districtName }).exec(),
    Student.countDocuments({ Gender: 'F', District: districtName }).exec(),
    Student.countDocuments({ District: districtName }).exec(),
    Student.countDocuments({ status: 'Studying', District: districtName }).exec(),
  ]);

  // const studentCount = await Student.aggregate([
  //   {
  //     $match: {
  //       District_name: districtName,
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       totalStudents: { $sum: '$totalStudent' },
  //       maleStudents: { $sum: '$maleStudents' },
  //       femaleStudents: { $sum: '$femaleStudents' },
  //       otherStudents: { $sum: '$otherStudents' },
  //     },
  //   },
  // ]);
  const teacherStudentRatio = totalStudyingStudent.value / totalTeachers.value;
  const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
  const averageStudentOfSchool = totalStudent.value / totalSchools.value;
  const zoneWiseCounts = [];
  Object.keys(zoneWiseCount).forEach((zone) => {
    zoneWiseCounts.push({
      zone,
      count: zoneWiseCount[zone],
    });
  });

  // const afiliationCounts = [];
  // Object.keys(afiliationCount).forEach((afiliation) => {
  //   afiliationCounts.push({
  //     afiliation,
  //     count: afiliationCount[afiliation],
  //   });
  // });

  // const minorityCounts = [];
  // Object.keys(minorityCount).forEach((minority) => {
  //   minorityCounts.push({
  //     minority,
  //     count: minorityCount[minority],
  //   });
  // });

  // const streamCounts = [];
  // Object.keys(streamCount).forEach((stream) => {
  //   streamCounts.push({
  //     stream,
  //     count: streamCount[stream],
  //   });
  // });

  const typeOfSchoolCounts = [];
  Object.keys(typeOfSchoolCount).forEach((typeOfSchool) => {
    typeOfSchoolCounts.push({
      typeOfSchool,
      count: typeOfSchoolCount[typeOfSchool],
    });
  });

  const result = {
    totalSchools: totalSchools.value,
    totalStudents: totalStudent.value,
    totalTeachers: totalTeachers.value,
    totalFemaleTeachers: totalFemaleTeachers.value,
    totalMaleTeachers: totalMaleTeachers.value,
    totalGirls: totalGirlsStudent.value,
    totalBoys: totalMaleStudent.value,
    teacherStudentRatio,
    averageTeacherOfSchool,
    averageStudentOfSchool,
    schoolManagementWise,
    zoneWiseCounts,
    mediumWiseCount,
    lowClassCount,
    highClassCount,
    shiftWiseCount,
    // afiliationCounts,
    // minorityCounts,
    // streamCounts,
    typeOfSchoolCounts,
  };

  // Cache the result in Redis for future use
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};

/**
 * Get all school, student, teacher graph data by zoneName
 * @param {string} zoneName - The zoneName name to filter the data
 * @returns {Promise<Object>} School, teacher, student graph data
 */
const getAllSchoolStudentTeacherDataByZoneName = async (zoneName) => {
  const cleanedZoneName = zoneName.replace(/[^0-9]/g, '');
  const nameZone = zoneName.toLowerCase();
  const cacheKey = `zoneName:${zoneName}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const schoolData = await School.find({ Zone_Name: zoneName });

  const schoolManagementWise = {};
  const zoneWiseCount = {};
  const mediumWiseCount = {};
  let lowClassCount = 0;
  let highClassCount = 0;
  const shiftWiseCount = { Morning: 0, Afternoon: 0, Evening: 0 };
  // const afiliationCount = {};
  // const minorityCount = {};
  // const streamCount = {};
  const typeOfSchoolCount = {};

  schoolData.forEach((school) => {
    // School Management Wise
    const schManagement = school.SchManagement || 'Unknown';
    schoolManagementWise[schManagement] = (schoolManagementWise[schManagement] || 0) + 1;

    // Zone Wise School Count
    const zone = school.Zone_Name || 'Unknown';
    zoneWiseCount[zone] = (zoneWiseCount[zone] || 0) + 1;

    // Medium Wise School Count
    const medium = school.medium || 'Unknown';
    mediumWiseCount[medium] = (mediumWiseCount[medium] || 0) + 1;

    // Low and High Class Count
    lowClassCount += parseInt(school.low_class, 10) || 0;
    highClassCount += parseInt(school.High_class, 10) || 0;

    // Shift Wise School Count
    const shift = school.shift || 'Unknown';
    shiftWiseCount[shift] = (shiftWiseCount[shift] || 0) + 1;

    // // Afiliation Count
    // const afiliation = school.affiliation || 'Unknown';
    // afiliationCount[afiliation] = (afiliationCount[afiliation] || 0) + 1;

    // // Minority Count
    // const minority = school.minority || 'Unknown';
    // minorityCount[minority] = (minorityCount[minority] || 0) + 1;

    // // Stream Count
    // const stream = school.stream || 'Unknown';
    // streamCount[stream] = (streamCount[stream] || 0) + 1;

    // Stream Count
    const typeOfSchool = school.typeOfSchool || 'Unknown';
    typeOfSchoolCount[typeOfSchool] = (typeOfSchoolCount[typeOfSchool] || 0) + 1;
  });

  const [
    totalSchools,
    totalTeachers,
    totalFemaleTeachers,
    totalMaleTeachers,
    totalMaleStudent,
    totalGirlsStudent,
    totalStudent,
    totalStydyingStudent,
  ] = await Promise.allSettled([
    School.countDocuments({ Zone_Name: zoneName }).exec(),
    Teacher.countDocuments({ zonename: cleanedZoneName }).exec(),
    Teacher.countDocuments({ gender: 'Female', zonename: cleanedZoneName }).exec(),
    Teacher.countDocuments({ gender: 'Male', zonename: cleanedZoneName }).exec(),
    Student.countDocuments({ Gender: 'M', z_name: nameZone }).exec(),
    Student.countDocuments({ Gender: 'F', z_name: nameZone }).exec(),
    Student.countDocuments({ z_name: nameZone }).exec(),
    Student.countDocuments({ status: 'Studying', z_name: nameZone }).exec(),
  ]);
  // const studentCount = await StudentCounts.aggregate([
  //   {
  //     $match: {
  //       Zone_Name: zoneName,
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       totalStudents: { $sum: '$totalStudent' },
  //       maleStudents: { $sum: '$maleStudents' },
  //       femaleStudents: { $sum: '$femaleStudents' },
  //       otherStudents: { $sum: '$otherStudents' },
  //     },
  //   },
  // ]);
  const teacherStudentRatio = totalStydyingStudent.value / totalTeachers.value;
  const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
  const averageStudentOfSchool = totalStudent.value / totalSchools.value;

  const zoneWiseCounts = [];
  Object.keys(zoneWiseCount).forEach((zone) => {
    zoneWiseCounts.push({
      zone,
      count: zoneWiseCount[zone],
    });
  });

  // const afiliationCounts = [];
  // Object.keys(afiliationCount).forEach((afiliation) => {
  //   afiliationCounts.push({
  //     afiliation,
  //     count: afiliationCount[afiliation],
  //   });
  // });

  // const minorityCounts = [];
  // Object.keys(minorityCount).forEach((minority) => {
  //   minorityCounts.push({
  //     minority,
  //     count: minorityCount[minority],
  //   });
  // });

  // const streamCounts = [];
  // Object.keys(streamCount).forEach((stream) => {
  //   streamCounts.push({
  //     stream,
  //     count: streamCount[stream],
  //   });
  // });

  const typeOfSchoolCounts = [];
  Object.keys(typeOfSchoolCount).forEach((typeOfSchool) => {
    typeOfSchoolCounts.push({
      typeOfSchool,
      count: typeOfSchoolCount[typeOfSchool],
    });
  });

  const result = {
    totalSchools: totalSchools.value,
    totalStudents: totalStudent.value,
    totalTeachers: totalTeachers.value,
    totalFemaleTeachers: totalFemaleTeachers.value,
    totalMaleTeachers: totalMaleTeachers.value,
    totalGirls: totalGirlsStudent.value,
    totalBoys: totalMaleStudent.value,
    teacherStudentRatio,
    averageTeacherOfSchool,
    averageStudentOfSchool,
    schoolManagementWise,
    zoneWiseCounts,
    mediumWiseCount,
    lowClassCount,
    highClassCount,
    shiftWiseCount,
    // afiliationCounts,
    // minorityCounts,
    // streamCounts,
    typeOfSchoolCounts,
  };

  // Cache the result in Redis for future use
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};

// /**
//  * Get all school, student, teacher graph data by zoneName
//  * @param {string} zoneName - The zoneName name to filter the counts
//  * @returns {Promise<Object>} School, teacher, student graph data
//  */

// const getAllSchoolStudentTeacherDataByZoneName = async (zoneName) => {
//   const cleanedZoneName = zoneName.replace(/[^0-9]/g, '');
//   const cacheKey = `zoneName:${cleanedZoneName}`;
//   const cachedData = await redis.get(cacheKey);

//   if (cachedData) {
//     return JSON.parse(cachedData);
//   }

//   const [schoolData, teacherData, studentData] = await Promise.all([
//     School.find({ Zone_Name: zoneName }),
//     Teacher.find({ zonename: cleanedZoneName }),
//     Student.find({ z_name: zoneName.toLowerCase() }),
//   ]);

//   const countByField = (data, field) => {
//     return data.reduce((countMap, item) => {
//       const value = item[field] || 'Unknown';
//       return { ...countMap, [value]: (countMap[value] || 0) + 1 };
//     }, {});
//   };

//   const calculateTotal = (data, field) => {
//     return data.reduce((total, item) => {
//       return total + parseInt(item[field], 10) || 0;
//     }, 0);
//   };

//   const schoolManagementWise = countByField(schoolData, 'SchManagement');
//   const zoneWiseCount = countByField(schoolData, 'Zone_Name');
//   const mediumWiseCount = countByField(schoolData, 'medium');

//   const districtWiseCount = countByField(schoolData, 'District_name');

//     // Add the following lines to count by affiliation, minority, stream, and typeOfSchool
//     const affiliationWiseCount = countByField(schoolData, 'affiliation');
//     const minorityWiseCount = countByField(schoolData, 'minority');
//     const streamWiseCount = countByField(schoolData, 'stream');
//     const typeOfSchoolWiseCount = countByField(schoolData, 'typeOfSchool');

//   const lowClassCount = calculateTotal(schoolData, 'low_class');
//   const highClassCount = calculateTotal(schoolData, 'High_class');

//   const shiftWiseCount = schoolData.reduce(
//     (countMap, school) => {
//       const shift = school.shift || 'Unknown';
//       return { ...countMap, [shift]: (countMap[shift] || 0) + 1 };
//     },
//     { Morning: 0, Afternoon: 0, Evening: 0 }
//   );

//   const getGenderCounts = (data, gender) => data.filter((item) => item.gender === gender).length;
//   const getGenderCountsStudents = (data, Gender) => data.filter((item) => item.Gender === Gender).length;

//   const totalSchools = schoolData.length;
//   const totalStudents = studentData.length;
//   const totalTeachers = teacherData.length;
//   const totalFemaleTeachers = getGenderCounts(teacherData, 'Female');
//   const totalMaleTeachers = getGenderCounts(teacherData, 'Male');
//   const totalGirls = getGenderCountsStudents(studentData, 'F');
//   const totalBoys = getGenderCountsStudents(studentData, 'M');

//   const teacherStudentRatio = totalStudents / totalTeachers;
//   const averageTeacherOfSchool = totalTeachers / totalSchools;
//   const averageStudentOfSchool = totalStudents / totalSchools;
//   const affiliationWiseCounts = [];
//   Object.keys(affiliationWiseCount).forEach((afiliation) => {
//     affiliationWiseCounts.push({
//       afiliation,
//       count: affiliationWiseCount[afiliation],
//     });
//   });

//   const minorityWiseCounts = [];
//   Object.keys(minorityWiseCount).forEach((minority) => {
//     minorityWiseCounts.push({
//       minority,
//       count: minorityWiseCounts[minority],
//     });
//   });

//   const streamWiseCounts = [];
//   Object.keys(streamWiseCount).forEach((stream) => {
//     streamWiseCounts.push({
//       stream,
//       count: streamWiseCounts[stream],
//     });
//   });

//   const typeOfSchoolWiseCounts = [];
//   Object.keys(typeOfSchoolWiseCount).forEach((typeOfSchool) => {
//     typeOfSchoolWiseCounts.push({
//       typeOfSchool,
//       count: typeOfSchoolWiseCounts[typeOfSchool],
//     });
//   });
//   const result = {
//     zoneName,
//     totalSchools,
//     totalStudents,
//     totalTeachers,
//     totalFemaleTeachers,
//     totalMaleTeachers,
//     totalGirls,
//     totalBoys,
//     teacherStudentRatio,
//     averageTeacherOfSchool,
//     averageStudentOfSchool,
//     schoolManagementWise,
//     zoneWiseCount,
//     districtWiseCount,
//     mediumWiseCount,
//     lowClassCount,
//     highClassCount,
//     shiftWiseCount,
//     affiliationWiseCounts,
//     minorityWiseCounts,
//     streamWiseCounts,
//     typeOfSchoolWiseCounts,
//   };

//   await redis.set(cacheKey, JSON.stringify(result), 'EX', 24 * 60 * 60);
//   return result;
// };
/**
 * Get all school, student, teacher graph data by schoolName
 * @param {string} schoolName - The schoolName name to filter the data
 * @returns {Promise<Object>} School, teacher, student graph data
 */
const getAllSchoolStudentTeacherDataBySchoolName = async (schoolName) => {
  // Create a cache key based on the district name
  const cacheKey = `schoolName:${schoolName}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const schoolData = await School.find({ School_Name: schoolName });

  const schoolManagementWise = {};
  const zoneWiseCount = {};
  const mediumWiseCount = {};
  let lowClassCount = 0;
  let highClassCount = 0;
  const shiftWiseCount = { Morning: 0, Afternoon: 0, Evening: 0 };
  // const afiliationCount = {};
  // const minorityCount = {};
  // const streamCount = {};
  const typeOfSchoolCount = {};

  schoolData.forEach((school) => {
    // School Management Wise
    const schManagement = school.SchManagement || 'Unknown';
    schoolManagementWise[schManagement] = (schoolManagementWise[schManagement] || 0) + 1;

    // Zone Wise School Count
    const zone = school.Zone_Name || 'Unknown';
    zoneWiseCount[zone] = (zoneWiseCount[zone] || 0) + 1;

    // Medium Wise School Count
    const medium = school.medium || 'Unknown';
    mediumWiseCount[medium] = (mediumWiseCount[medium] || 0) + 1;

    // Low and High Class Count
    lowClassCount += parseInt(school.low_class, 10) || 0;
    highClassCount += parseInt(school.High_class, 10) || 0;

    // Shift Wise School Count
    const shift = school.shift || 'Unknown';
    shiftWiseCount[shift] = (shiftWiseCount[shift] || 0) + 1;

    // Afiliation Count
    // const afiliation = school.affiliation || 'Unknown';
    // afiliationCount[afiliation] = (afiliationCount[afiliation] || 0) + 1;

    // // Minority Count
    // const minority = school.minority || 'Unknown';
    // minorityCount[minority] = (minorityCount[minority] || 0) + 1;

    // // Stream Count
    // const stream = school.stream || 'Unknown';
    // streamCount[stream] = (streamCount[stream] || 0) + 1;

    // Stream Count
    const typeOfSchool = school.typeOfSchool || 'Unknown';
    typeOfSchoolCount[typeOfSchool] = (typeOfSchoolCount[typeOfSchool] || 0) + 1;
  });

  const [
    totalSchools,
    totalTeachers,
    totalFemaleTeachers,
    totalMaleTeachers,
    totalMaleStudent,
    totalGirlsStudent,
    totalStudent,
    totalStudyingStudent,
  ] = await Promise.allSettled([
    School.countDocuments({ School_Name: schoolName }).exec(),
    Teacher.countDocuments({ schname: schoolName }).exec(),
    Teacher.countDocuments({ gender: 'Female', schname: schoolName }).exec(),
    Teacher.countDocuments({ gender: 'Male', schname: schoolName }).exec(),
    Student.countDocuments({ Gender: 'M', SCHOOL_NAME: schoolName }).exec(),
    Student.countDocuments({ Gender: 'F', SCHOOL_NAME: schoolName }).exec(),
    Student.countDocuments({ SCHOOL_NAME: schoolName }).exec(),
    Student.countDocuments({ status: 'Studying', SCHOOL_NAME: schoolName }).exec(),
  ]);
  // for studentCounts
  // const studentCount = await Student.aggregate([
  //   {
  //     $match: {
  //       SCHOOL_NAME: schoolName,
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       totalStudents: { $sum: '$totalStudent' },
  //       maleStudents: { $sum: '$maleStudents' },
  //       femaleStudents: { $sum: '$femaleStudents' },
  //       otherStudents: { $sum: '$otherStudents' },
  //     },
  //   },
  // ]);

  const teacherStudentRatio = totalStudyingStudent.value / totalTeachers.value;
  const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
  const averageStudentOfSchool = totalStudent.value / totalSchools.value;
  const zoneWiseCounts = [];
  Object.keys(zoneWiseCount).forEach((zone) => {
    zoneWiseCounts.push({
      zone,
      count: zoneWiseCount[zone],
    });
  });

  // const afiliationCounts = [];
  // Object.keys(afiliationCount).forEach((afiliation) => {
  //   afiliationCounts.push({
  //     afiliation,
  //     count: afiliationCount[afiliation],
  //   });
  // });

  // const minorityCounts = [];
  // Object.keys(minorityCount).forEach((minority) => {
  //   minorityCounts.push({
  //     minority,
  //     count: minorityCount[minority],
  //   });
  // });

  // const streamCounts = [];
  // Object.keys(streamCount).forEach((stream) => {
  //   streamCounts.push({
  //     stream,
  //     count: streamCount[stream],
  //   });
  // });

  const typeOfSchoolCounts = [];
  Object.keys(typeOfSchoolCount).forEach((typeOfSchool) => {
    typeOfSchoolCounts.push({
      typeOfSchool,
      count: typeOfSchoolCount[typeOfSchool],
    });
  });

  const result = {
    totalSchools: totalSchools.value,
    totalStudents: totalStudent.value,
    totalTeachers: totalTeachers.value,
    totalFemaleTeachers: totalFemaleTeachers.value,
    totalMaleTeachers: totalMaleTeachers.value,
    totalGirls: totalGirlsStudent.value,
    totalBoys: totalMaleStudent.value,
    teacherStudentRatio,
    averageTeacherOfSchool,
    averageStudentOfSchool,
    schoolManagementWise,
    zoneWiseCounts,
    mediumWiseCount,
    lowClassCount,
    highClassCount,
    shiftWiseCount,
    // afiliationCounts,
    // minorityCounts,
    // streamCounts,
    typeOfSchoolCounts,
  };

  // Cache the result in Redis for future use
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};
module.exports = {
  getAllSchoolStudentTeacherDataByZoneName,
  getAllSchoolStudentTeacherDataByDistrict,
  getAllSchoolStudentTeacherDataBySchoolName,
};
