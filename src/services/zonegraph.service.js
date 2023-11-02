const { School, Student, Teacher } = require('../models');
const redis = require('../utils/redis');

/**
 * Get all school, student, teacher graph data by zoneName
 * @param {string} zoneName - The zoneName name to filter the counts
 * @returns {Promise<Object>} School, teacher, student graph data
 */

const getAllSchoolStudentTeacherDataByZoneName = async (zoneName) => {
  const cleanedZoneName = zoneName.replace(/[^0-9]/g, '');
  const cacheKey = `zoneName:${cleanedZoneName}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const [schoolData, teacherData, studentData] = await Promise.all([
    School.find({ Zone_Name: zoneName }),
    Teacher.find({ zonename: cleanedZoneName }),
    Student.find({ z_name: zoneName.toLowerCase() }),
  ]);

  const countByField = (data, field) => {
    return data.reduce((countMap, item) => {
      const value = item[field] || 'Unknown';
      return { ...countMap, [value]: (countMap[value] || 0) + 1 };
    }, {});
  };

  const calculateTotal = (data, field) => {
    return data.reduce((total, item) => {
      return total + parseInt(item[field], 10) || 0;
    }, 0);
  };

  const schoolManagementWise = countByField(schoolData, 'SchManagement');
  const zoneWiseCount = countByField(schoolData, 'Zone_Name');
  const mediumWiseCount = countByField(schoolData, 'medium');

  const districtWiseCount = countByField(schoolData, 'District_name');

  const lowClassCount = calculateTotal(schoolData, 'low_class');
  const highClassCount = calculateTotal(schoolData, 'High_class');

  const shiftWiseCount = schoolData.reduce(
    (countMap, school) => {
      const shift = school.shift || 'Unknown';
      return { ...countMap, [shift]: (countMap[shift] || 0) + 1 };
    },
    { Morning: 0, Afternoon: 0, Evening: 0 }
  );

  const getGenderCounts = (data, gender) => data.filter((item) => item.gender === gender).length;
  const getGenderCountsStudents = (data, Gender) => data.filter((item) => item.Gender === Gender).length;

  const totalSchools = schoolData.length;
  const totalStudents = studentData.length;
  const totalTeachers = teacherData.length;
  const totalFemaleTeachers = getGenderCounts(teacherData, 'Female');
  const totalMaleTeachers = getGenderCounts(teacherData, 'Male');
  const totalGirls = getGenderCountsStudents(studentData, 'F');
  const totalBoys = getGenderCountsStudents(studentData, 'M');

  const teacherStudentRatio = totalStudents / totalTeachers;
  const averageTeacherOfSchool = totalTeachers / totalSchools;
  const averageStudentOfSchool = totalStudents / totalSchools;

  const result = {
    zoneName,
    totalSchools,
    totalStudents,
    totalTeachers,
    totalFemaleTeachers,
    totalMaleTeachers,
    totalGirls,
    totalBoys,
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

  await redis.set(cacheKey, JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};

module.exports = {
  getAllSchoolStudentTeacherDataByZoneName,
};
