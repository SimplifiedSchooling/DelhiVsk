const { School, Student, Teacher } = require('../models');
const redis = require('../utils/redis');

/**
 * Get school statistics
 * @returns {Promise<Object>} School statistics
 */
const getSchoolStats = async () => {
  // Check if the data is already cached in Redis
  const cachedData = await redis.get('schoolStats');

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // If data is not cached, fetch it from the database
  const [totalSchools, totalStudents, totalTeachers, totalFemaleTeachers, totalMaleTeachers, totalGirls, totalBoys] =
    await Promise.allSettled([
      School.countDocuments().exec(),
      Student.countDocuments().exec(),
      Teacher.countDocuments().exec(),
      Teacher.countDocuments({ gender: 'Female' }).exec(),
      Teacher.countDocuments({ gender: 'Male' }).exec(),
      Student.countDocuments({ Gender: 'F' }).exec(),
      Student.countDocuments({ Gender: 'M' }).exec(),
    ]);

  const teacherStudentRatio = totalStudents.value / totalTeachers.value;
  const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
  const averageStudentOfSchool = totalStudents.value / totalSchools.value;

  const schoolStats = {
    totalSchools: totalSchools.value,
    totalStudents: totalStudents.value,
    totalTeachers: totalTeachers.value,
    totalFemaleTeachers: totalFemaleTeachers.value,
    totalMaleTeachers: totalMaleTeachers.value,
    totalGirls: totalGirls.value,
    totalBoys: totalBoys.value,
    teacherStudentRatio,
    averageTeacherOfSchool,
    averageStudentOfSchool,
  };

  // Cache the result in Redis for future use
  await redis.set('schoolStats', JSON.stringify(schoolStats), 'EX', 24 * 60 * 60);

  return schoolStats;
};

/**
 * Get school graph data
 * @returns {Promise<Object>} School graph data
 */
const getAggregatedSchoolData = async () => {
  // Check if the data is already cached in Redis
  const cachedData = await redis.get('getAggregatedSchoolData');

  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const schoolData = await School.find();

  const schoolManagementWise = {};
  const zoneWiseCount = {};
  const districtWiseCount = {};
  const mediumWiseCount = {};
  let lowClassCount = 0;
  let highClassCount = 0;
  const shiftWiseCount = { Morning: 0, Afternoon: 0, Evening: 0 };

  schoolData.forEach((school) => {
    // School Management Wise
    const schManagement = school.SchManagement || 'Unknown';
    schoolManagementWise[schManagement] = (schoolManagementWise[schManagement] || 0) + 1;

    // Zone Wise School Count
    const zone = school.Zone_Name || 'Unknown';
    zoneWiseCount[zone] = (zoneWiseCount[zone] || 0) + 1;

    // District Wise School Count
    const district = school.District_name || 'Unknown';
    districtWiseCount[district] = (districtWiseCount[district] || 0) + 1;

    // Medium Wise School Count
    const medium = school.medium || 'Unknown';
    mediumWiseCount[medium] = (mediumWiseCount[medium] || 0) + 1;

    // Low and High Class Count
    lowClassCount += parseInt(school.low_class, 10) || 0;
    highClassCount += parseInt(school.High_class, 10) || 0;

    // Shift Wise School Count
    const shift = school.shift || 'Unknown';
    shiftWiseCount[shift] = (shiftWiseCount[shift] || 0) + 1;
  });
  const totalSchools = schoolData.length;
  const result = {
    totalSchools,
    schoolManagementWise,
    zoneWiseCount,
    districtWiseCount,
    mediumWiseCount,
    lowClassCount,
    highClassCount,
    shiftWiseCount,
  };
  // Cache the result in Redis for future use
  await redis.set('getAggregatedSchoolData', JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};
/**
 * Get all school, student, teacher graph data
 * @returns {Promise<Object>} School, teacher, student graph data
 */
const getAllSchoolStudentTeacherData = async () => {
  const schoolData = await School.find();

  const schoolManagementWise = {};
  const zoneWiseCount = {};
  const districtWiseCount = {};
  const mediumWiseCount = {};
  let lowClassCount = 0;
  let highClassCount = 0;
  const shiftWiseCount = { Morning: 0, Afternoon: 0, Evening: 0 };

  schoolData.forEach((school) => {
    // School Management Wise
    const schManagement = school.SchManagement || 'Unknown';
    schoolManagementWise[schManagement] = (schoolManagementWise[schManagement] || 0) + 1;

    // Zone Wise School Count
    const zone = school.Zone_Name || 'Unknown';
    zoneWiseCount[zone] = (zoneWiseCount[zone] || 0) + 1;

    // District Wise School Count
    const district = school.District_name || 'Unknown';
    districtWiseCount[district] = (districtWiseCount[district] || 0) + 1;

    // Medium Wise School Count
    const medium = school.medium || 'Unknown';
    mediumWiseCount[medium] = (mediumWiseCount[medium] || 0) + 1;

    // Low and High Class Count
    lowClassCount += parseInt(school.low_class, 10) || 0;
    highClassCount += parseInt(school.High_class, 10) || 0;

    // Shift Wise School Count
    const shift = school.shift || 'Unknown';
    shiftWiseCount[shift] = (shiftWiseCount[shift] || 0) + 1;
  });

  const [totalSchools, totalStudents, totalTeachers, totalFemaleTeachers, totalMaleTeachers, totalGirls, totalBoys] =
    await Promise.allSettled([
      School.countDocuments().exec(),
      Student.countDocuments().exec(),
      Teacher.countDocuments().exec(),
      Teacher.countDocuments({ gender: 'Female' }).exec(),
      Teacher.countDocuments({ gender: 'Male' }).exec(),
      Student.countDocuments({ Gender: 'F' }).exec(),
      Student.countDocuments({ Gender: 'M' }).exec(),
    ]);

  const teacherStudentRatio = totalStudents.value / totalTeachers.value;
  const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
  const averageStudentOfSchool = totalStudents.value / totalSchools.value;

  return {
    totalSchools: totalSchools.value,
    totalStudents: totalStudents.value,
    totalTeachers: totalTeachers.value,
    totalFemaleTeachers: totalFemaleTeachers.value,
    totalMaleTeachers: totalMaleTeachers.value,
    totalGirls: totalGirls.value,
    totalBoys: totalBoys.value,
    teacherStudentRatio,
    averageTeacherOfSchool,
    averageStudentOfSchool,
    schoolManagementWise,
    zoneWiseCount,
    districtWiseCount,
    mediumWiseCount,
    lowClassCount,
    highClassCount,
    shiftWiseCount,
  };
};
// const getAggregatedSchoolData = async () => {
//   const schoolData = await School.find();

//   const schoolManagementWise = countByAttribute(schoolData, 'SchManagement', 'Unknown');
//   const zoneWiseCount = countByAttribute(schoolData, 'Zone_Name', 'Unknown');
//   const districtWiseCount = countByAttribute(schoolData, 'District_name', 'Unknown');
//   const lowClassCount = sumAttribute(schoolData, 'low_class');
//   const highClassCount = sumAttribute(schoolData, 'High_class');
//   const shiftWiseCount = countByAttribute(schoolData, 'shift', 'Unknown');

//   return {
//     schoolManagementWise,
//     zoneWiseCount,
//     districtWiseCount,
//     lowClassCount,
//     highClassCount,
//     shiftWiseCount,
//   };
// };

// const countByAttribute = (data, attribute, defaultValue) => {
//   const countMap = {};
//   data.forEach((item) => {
//     const value = item[attribute] || defaultValue;
//     countMap[value] = (countMap[value] || 0) + 1;
//   });
//   return countMap;
// };

// const sumAttribute = (data, attribute) => {
//   return data.reduce((sum, item) => sum + (parseInt(item[attribute]) || 0), 0);
// };

const getAggregatedSchoolDataByDistrictName = async (districtName) => {
  // Check if the data is already cached in Redis
  const cachedData = await redis.get('getAggregatedSchoolDataByDistrictName');

  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const schoolData = await School.find({ District_name: districtName });

  if (!schoolData || schoolData.length === 0) {
    // Handle case when no schools found for the given districtName
    return {
      totalSchools: 0,
      schoolManagementWise: {},
      zoneWiseCount: {},
      mediumWiseCount: {},
      lowClassCount: 0,
      highClassCount: 0,
      shiftWiseCount: { Morning: 0, Afternoon: 0, Evening: 0 },
    };
  }

  const schoolManagementWise = {};
  const zoneWiseCount = {};
  const mediumWiseCount = {};
  let lowClassCount = 0;
  let highClassCount = 0;
  const shiftWiseCount = { Morning: 0, Afternoon: 0, Evening: 0 };

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
  });

  const totalSchools = schoolData.length;
  const result = {
    districtName,
    totalSchools,
    schoolManagementWise,
    zoneWiseCount,
    mediumWiseCount,
    lowClassCount,
    highClassCount,
    shiftWiseCount,
  };
  await redis.set('getAggregatedSchoolDataByDistrictName', JSON.stringify(result), 'EX', 24 * 60 * 60);
   return result;
};

const getSchoolStudentCountByDistricts = async () => {
  const districts = await School.distinct('District_name');
  const counts = await Promise.all(
    districts.map(async (districtName) => {
      const schoolCount = await School.countDocuments({ District_name: districtName });
      const studentCount = await Student.countDocuments({ District: districtName });

      return {
        districtName,
        totalSchoolCount: schoolCount,
        totalStudentCount: studentCount,
      };
    })
  );

  return counts;
};
module.exports = {
  getSchoolStats,
  getAggregatedSchoolData,
  getAggregatedSchoolDataByDistrictName,
  getAllSchoolStudentTeacherData,
  getSchoolStudentCountByDistricts,
};
