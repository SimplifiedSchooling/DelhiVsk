const { School, Teacher, Student, GuestTeacher } = require('../models');
const redis = require('../utils/redis');

/**
 * Get all school, student, teacher graph data by districtName
 * @param {string} districtName - The district name to filter the data
 * @returns {Promise<Object>} School, teacher, student graph data
 */
const getAllSchoolStudentTeacherDataByDistrict = async (districtName) => {
  // Create a cache key based on the district name
  // const cacheKey = `districtName:${districtName}`;
  // const cachedData = await redis.get(cacheKey);

  // if (cachedData) {
  //   return JSON.parse(cachedData);
  // }

  const schoolData = await School.find({ District_name: districtName });

  const schoolManagementWise = {};
  const zoneWiseCount = {};
  const mediumWiseCount = {};
  let lowClassCount = 0;
  let highClassCount = 0;
  const shiftWiseCount = { Morning: 0, Afternoon: 0, Evening: 0 };
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
    Other,
    totalStudent,
    totalStudyingStudent,
  ] = await Promise.allSettled([
    School.countDocuments({ District_name: districtName }).exec(),
    Teacher.countDocuments({ districtname: districtName }).exec(),
    Teacher.countDocuments({ gender: 'Female', districtname: districtName }).exec(),
    Teacher.countDocuments({ gender: 'Male', districtname: districtName }).exec(),
    Student.countDocuments({ Gender: 'M', District: districtName }).exec(),
    Student.countDocuments({ Gender: 'F', District: districtName }).exec(),
    Student.countDocuments({ Gender: 'T', District: districtName }).exec(),
    Student.countDocuments({ District: districtName }).exec(),
    Student.countDocuments({ status: 'Studying', District: districtName }).exec(),
  ]);
  const totalGuestTeacher = await GuestTeacher.countDocuments({ Districtname: districtName }).exec();

  const totoal = totalGuestTeacher + totalTeachers.value;

  const teacherStudentRatio = totalStudyingStudent.value / totoal;
  const averageTeacherOfSchool = totoal / totalSchools.value;
  const averageStudentOfSchool = totalStudent.value / totalSchools.value;
  const zoneWiseCounts = [];
  Object.keys(zoneWiseCount).forEach((zone) => {
    zoneWiseCounts.push({
      zone,
      count: zoneWiseCount[zone],
    });
  });

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
    Other: Other.value,
    teacherStudentRatio,
    averageTeacherOfSchool,
    averageStudentOfSchool,
    schoolManagementWise,
    zoneWiseCounts,
    mediumWiseCount,
    lowClassCount,
    highClassCount,
    shiftWiseCount,
    typeOfSchoolCounts,
  };

  // Cache the result in Redis for future use
  // await redis.set(cacheKey, JSON.stringify(result), 'EX', 24 * 60 * 60);
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
    Other,
    totalStudent,
    totalStydyingStudent,
  ] = await Promise.allSettled([
    School.countDocuments({ Zone_Name: zoneName }).exec(),
    Teacher.countDocuments({ zonename: cleanedZoneName }).exec(),
    Teacher.countDocuments({ gender: 'Female', zonename: cleanedZoneName }).exec(),
    Teacher.countDocuments({ gender: 'Male', zonename: cleanedZoneName }).exec(),
    Student.countDocuments({ Gender: 'M', z_name: nameZone }).exec(),
    Student.countDocuments({ Gender: 'F', z_name: nameZone }).exec(),
    Student.countDocuments({ Gender: 'T', z_name: nameZone }).exec(),
    Student.countDocuments({ z_name: nameZone }).exec(),
    Student.countDocuments({ status: 'Studying', z_name: nameZone }).exec(),
  ]);

  const totalGuestTeacher = await GuestTeacher.countDocuments({ Zonename: cleanedZoneName }).exec();
  const totoal = totalGuestTeacher + totalTeachers.value;
  const teacherStudentRatio = totalStydyingStudent.value / totoal;
  const averageTeacherOfSchool = totoal / totalSchools.value;
  const averageStudentOfSchool = totalStudent.value / totalSchools.value;

  const zoneWiseCounts = [];
  Object.keys(zoneWiseCount).forEach((zone) => {
    zoneWiseCounts.push({
      zone,
      count: zoneWiseCount[zone],
    });
  });

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
    Other: Other.value,
    teacherStudentRatio,
    averageTeacherOfSchool,
    averageStudentOfSchool,
    schoolManagementWise,
    zoneWiseCounts,
    mediumWiseCount,
    lowClassCount,
    highClassCount,
    shiftWiseCount,
    typeOfSchoolCounts,
  };

  // Cache the result in Redis for future use
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};

/**
 * Get all school, student, teacher graph data by schoolName
 * @param {string} schoolId - The schoolName name to filter the data
 * @returns {Promise<Object>} School, teacher, student graph data
 */
const getAllSchoolStudentTeacherDataBySchoolName = async (schoolId) => {
  // Create a cache key based on the district name
  const cacheKey = `schoolId:${schoolId}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const schoolData = await School.find({ Schoolid: Number(schoolId) });

  const schoolManagementWise = {};
  const zoneWiseCount = {};
  const mediumWiseCount = {};
  let lowClassCount = 0;
  let highClassCount = 0;
  const shiftWiseCount = { Morning: 0, Afternoon: 0, Evening: 0 };
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
    Other,
    totalStudent,
    totalStudyingStudent,
  ] = await Promise.allSettled([
    School.countDocuments({ Schoolid: Number(schoolId) }).exec(),
    Teacher.countDocuments({ schoolid: schoolId }).exec(),
    Teacher.countDocuments({ gender: 'Female', schoolid: schoolId }).exec(),
    Teacher.countDocuments({ gender: 'Male', schoolid: schoolId }).exec(),
    Student.countDocuments({ Gender: 'M', Schoolid: Number(schoolId) }).exec(),
    Student.countDocuments({ Gender: 'F', Schoolid: Number(schoolId) }).exec(),
    Student.countDocuments({ Gender: 'T', Schoolid: Number(schoolId) }).exec(),
    Student.countDocuments({ Schoolid: Number(schoolId) }).exec(),
    Student.countDocuments({ status: 'Studying', Schoolid: Number(schoolId) }).exec(),
  ]);
  const totalGuestTeacher = await GuestTeacher.countDocuments({ SchoolID: schoolId }).exec();
  const totoal = totalGuestTeacher + totalTeachers.value;
  const teacherStudentRatio = totalStudyingStudent.value / totoal;
  const averageTeacherOfSchool = totoal / totalSchools.value;
  const averageStudentOfSchool = totalStudent.value / totalSchools.value;
  const zoneWiseCounts = [];
  Object.keys(zoneWiseCount).forEach((zone) => {
    zoneWiseCounts.push({
      zone,
      count: zoneWiseCount[zone],
    });
  });

  // const typeOfSchoolCounts = [];
  // Object.keys(typeOfSchoolCount).forEach((typeOfSchool) => {
  //   typeOfSchoolCounts.push({
  //     typeOfSchool,
  //     count: typeOfSchoolCount[typeOfSchool],
  //   });
  // });

  const typeOfSchoolCounts = [];

  if (totalMaleStudent.value > 0 && totalGirlsStudent.value > 0) {
    typeOfSchoolCounts.push({ typeOfSchool: 'Co-Ed', count: totalMaleStudent.value + totalGirlsStudent.value });
  } else if (totalMaleStudent.value > 0) {
    typeOfSchoolCounts.push({ typeOfSchool: 'Boys', count: totalMaleStudent.value });
  } else if (totalGirlsStudent.value > 0) {
    typeOfSchoolCounts.push({ typeOfSchool: 'Girls', count: totalGirlsStudent.value });
  } else {
    typeOfSchoolCounts.push({ typeOfSchool: 'Null', count: 136 }); // Change the count value accordingly
  }
  
  // // Assuming you want to send this as a response or use it somewhere
  // console.log(typeOfSchoolCounts);
  

  const result = {
    totalSchools: totalSchools.value,
    totalStudents: totalStudent.value,
    totalTeachers: totalTeachers.value,
    totalFemaleTeachers: totalFemaleTeachers.value,
    totalMaleTeachers: totalMaleTeachers.value,
    totalGirls: totalGirlsStudent.value,
    totalBoys: totalMaleStudent.value,
    Other: Other.value,
    teacherStudentRatio,
    averageTeacherOfSchool,
    averageStudentOfSchool,
    schoolManagementWise,
    zoneWiseCounts,
    mediumWiseCount,
    lowClassCount,
    highClassCount,
    shiftWiseCount,
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
