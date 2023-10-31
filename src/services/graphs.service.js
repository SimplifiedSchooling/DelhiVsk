const { School, Student, Teacher } = require('../models');

/**
 * Get school statistics
 * @returns {Promise<Object>} School statistics
 */
async function getSchoolStats() {
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
  };
}

/**
 * Get school graph data
 * @returns {Promise<Object>} School graph data
 */
const getAggregatedSchoolData = async () => {
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
    lowClassCount += parseInt(school.low_class) || 0;
    highClassCount += parseInt(school.High_class) || 0;

    // Shift Wise School Count
    const shift = school.shift || 'Unknown';
    shiftWiseCount[shift] = (shiftWiseCount[shift] || 0) + 1;
  });

  const totalSchools = schoolData.length;

  return {
    totalSchools,
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
    lowClassCount += parseInt(school.low_class) || 0;
    highClassCount += parseInt(school.High_class) || 0;

    // Shift Wise School Count
    const shift = school.shift || 'Unknown';
    shiftWiseCount[shift] = (shiftWiseCount[shift] || 0) + 1;
  });

  const totalSchools = schoolData.length;

  return {
    districtName,
    totalSchools,
    schoolManagementWise,
    zoneWiseCount,
    mediumWiseCount,
    lowClassCount,
    highClassCount,
    shiftWiseCount,
  };
};

module.exports = {
  getSchoolStats,
  getAggregatedSchoolData,
  getAggregatedSchoolDataByDistrictName,
};
