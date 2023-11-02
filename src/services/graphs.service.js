const { School, Student, Teacher } = require('../models');
const redis = require('../utils/redis');

const getStudentCountBySchCategoryByGenders = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$SchCategory', // Group by SchCategory
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];

  const schCategorySchoolIds = await School.aggregate(pipeline);

  const studentCounts = [];

  for (const category of schCategorySchoolIds) {
    const pipeline = [
      {
        $match: {
          Schoolid: { $in: category.schoolIds },
        },
      },
      {
        $group: {
          _id: '$Gender', // Group by Gender
          studentCount: { $sum: 1 }, // Count students
        },
      },
    ];

    const genderWiseCounts = await Student.aggregate(pipeline);

    studentCounts.push({
      SchCategory: category._id,
      genderCounts: genderWiseCounts,
    });
  }

  return studentCounts;
};

const getStudentCountBySchCategory = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$SchCategory', // Group by SchCategory
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];

  const schCategorySchoolIds = await School.aggregate(pipeline);

  const studentCounts = [];

  for (const category of schCategorySchoolIds) {
    const studentCount = await Student.countDocuments({ Schoolid: { $in: category.schoolIds } });
    studentCounts.push({
      SchCategory: category._id,
      studentCount,
    });
  }

  return studentCounts;
};

const getStudentsEnrollmentGraph = async () => {
  // Check if the data is already cached in Redis
  const cachedData = await redis.get('getStudentsEnrollmentGraph');

  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const enrollmentBySchoolCatogory = await getStudentCountBySchCategory();
  const genderWiseEnrollmentPerSchCategory = await getStudentCountBySchCategoryByGenders();
  const result = {
    enrollmentBySchoolCatogory,
    genderWiseEnrollmentPerSchCategory,
  };
  // Cache the result in Redis for future use
  await redis.set('getStudentsEnrollmentGraph', JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};
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
  const zoneWiseCounts = [];

  Object.keys(zoneWiseCount).forEach((zone) => {
    zoneWiseCounts.push({
      zone,
      count: zoneWiseCount[zone],
    });
  });
  const result = {
    totalSchools,
    schoolManagementWise,
    zoneWiseCounts,
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
  // Check if the data is already cached in Redis
  const cachedData = await redis.get('getAllSchoolStudentTeacherData');

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
  const afiliationCount = {};
  const minorityCount = {};
  const streamCount = {};
  const typeOfSchoolCount = {};

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

    // Afiliation Count
    const afiliation = school.afiliation || 'Unknown';
    afiliationCount[afiliation] = (afiliationCount[afiliation] || 0) + 1;

    // Minority Count
    const minority = school.minority || 'Unknown';
    minorityCount[minority] = (minorityCount[minority] || 0) + 1;

    // Stream Count
    const stream = school.stream || 'Unknown';
    streamCount[stream] = (streamCount[stream] || 0) + 1;

    // Stream Count
    const typeOfSchool = school.typeOfSchool || 'Unknown';
    typeOfSchoolCount[typeOfSchool] = (typeOfSchoolCount[typeOfSchool] || 0) + 1;
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

  const zoneWiseCounts = [];
  Object.keys(zoneWiseCount).forEach((zone) => {
    zoneWiseCounts.push({
      zone,
      count: zoneWiseCount[zone],
    });
  });

  const afiliationCounts = [];
  Object.keys(afiliationCount).forEach((afiliation) => {
    afiliationCounts.push({
      afiliation,
      count: afiliationCount[afiliation],
    });
  });

  const minorityCounts = [];
  Object.keys(minorityCount).forEach((minority) => {
    minorityCounts.push({
      minority,
      count: minorityCount[minority],
    });
  });

  const streamCounts = [];
  Object.keys(streamCount).forEach((stream) => {
    streamCounts.push({
      stream,
      count: streamCount[stream],
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
    zoneWiseCounts,
    districtWiseCount,
    mediumWiseCount,
    lowClassCount,
    highClassCount,
    shiftWiseCount,
    afiliationCounts,
    minorityCounts,
    streamCounts,
    typeOfSchoolCounts,
  };

  // Cache the result in Redis for future use
  await redis.set('getAllSchoolStudentTeacherData', JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};



/**
 * Get all school, student, teacher graph data by districtName
 * @param {string} districtName - The district name to filter the counts
 * @returns {Promise<Object>} School, teacher, student graph data
 */
const getAllSchoolStudentTeacherDataByDistrictName = async (districtName) => {
  const cacheKey = `districtData:${districtName}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const [schoolData, teacherData, studentData] = await Promise.all([
    School.find({ District_name: districtName }),
    Teacher.find({ districtname: districtName }),
    Student.find({ District: districtName }),
  ]);

  const countByField = (data, field) => {
    const countMap = {};
    data.forEach((item) => {
      const value = item[field] || 'Unknown';
      countMap[value] = (countMap[value] || 0) + 1;
    });
    return countMap;
  };

  const schoolManagementWise = countByField(schoolData, 'SchManagement');
  const zoneWiseCount = countByField(schoolData, 'Zone_Name');
  const mediumWiseCount = countByField(schoolData, 'medium');

  const districtWiseCount = countByField(schoolData, 'District_name');

  let lowClassCount = 0;
  let highClassCount = 0;
  const shiftWiseCount = { Morning: 0, Afternoon: 0, Evening: 0 };

  schoolData.forEach((school) => {
    lowClassCount += parseInt(school.low_class, 10) || 0;
    highClassCount += parseInt(school.High_class, 10) || 0;
    const shift = school.shift || 'Unknown';
    shiftWiseCount[shift] = (shiftWiseCount[shift] || 0) + 1;
  });

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

  const zoneWiseCounts = [];
  Object.keys(zoneWiseCount).forEach((zone) => {
    zoneWiseCounts.push({
      zone,
      count: zoneWiseCount[zone],
    });
  });
  const result = {
    districtName,
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
    zoneWiseCounts,
    districtWiseCount,
    mediumWiseCount,
    lowClassCount,
    highClassCount,
    shiftWiseCount,
  };
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};



/**
 * Get all school, student, teacher graph data by districtName
 * @param {string} districtName - The district name to filter the counts
 * @returns {Promise<Object>} School, teacher, student graph data
 */

const getAggregatedSchoolDataByDistrictName = async (districtName) => {
  const cacheKey = `districtData:${districtName}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const schoolData = await School.find({ District_name: districtName });

  if (!schoolData || schoolData.length === 0) {
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
    const schManagement = school.SchManagement || 'Unknown';
    schoolManagementWise[schManagement] = (schoolManagementWise[schManagement] || 0) + 1;
    const zone = school.Zone_Name || 'Unknown';
    zoneWiseCount[zone] = (zoneWiseCount[zone] || 0) + 1;
    const medium = school.medium || 'Unknown';
    mediumWiseCount[medium] = (mediumWiseCount[medium] || 0) + 1;
    lowClassCount += parseInt(school.low_class, 10) || 0;
    highClassCount += parseInt(school.High_class, 10) || 0;
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
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};

const getSchoolStudentCountByDistricts = async () => {
  // Check if the data is already cached in Redis
  const cachedData = await redis.get('getSchoolStudentCountByDistricts');

  if (cachedData) {
    return JSON.parse(cachedData);
  }
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
  await redis.set('getSchoolStudentCountByDistricts', JSON.stringify(counts), 'EX', 24 * 60 * 60);
  return counts;
};
module.exports = {
  getSchoolStats,
  getAggregatedSchoolData,
  getAggregatedSchoolDataByDistrictName,
  getAllSchoolStudentTeacherDataByDistrictName,
  getAllSchoolStudentTeacherData,
  getSchoolStudentCountByDistricts,
  getStudentsEnrollmentGraph,
};
