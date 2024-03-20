const { School, Student, Teacher, StudentCounts, GuestTeacher } = require('../models');
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

  const genderWiseEnrollmentPerSchCategory = await Promise.all(
    schCategorySchoolIds.map(async (category) => {
      const pipeline2 = [
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

      return {
        SchCategory: category._id,
        genderCounts: await Student.aggregate(pipeline2),
      };
    })
  );
  const enrollmentBySchoolCatogory = await Promise.all(
    schCategorySchoolIds.map(async (category) => {
      const studentCount = await Student.countDocuments({ Schoolid: { $in: category.schoolIds } });
      return {
        SchCategory: category._id,
        studentCount,
      };
    })
  );
  return {
    genderWiseEnrollmentPerSchCategory,
    enrollmentBySchoolCatogory,
  };
};
/**
 * Get student enrolment by school category and gender wise
 * @returns {Promise<Object>} School statistics
 */
const getStudentsEnrollmentGraph = async () => {
  // Check if the data is already cached in Redis
  const cachedData = await redis.get('getStudentsEnrollmentGraph');

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const result = await getStudentCountBySchCategoryByGenders();

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
  const [totalSchools, totalTeachers, totalFemaleTeachers, totalMaleTeachers] = await Promise.allSettled([
    School.countDocuments().exec(),
    Teacher.countDocuments().exec(),
    Teacher.countDocuments({ gender: 'Female' }).exec(),
    Teacher.countDocuments({ gender: 'Male' }).exec(),
  ]);
  const studentCount = await StudentCounts.aggregate([
    {
      $group: {
        _id: null,
        totalStudents: { $sum: '$totalStudent' },
        maleStudents: { $sum: '$maleStudents' },
        femaleStudents: { $sum: '$femaleStudents' },
        otherStudents: { $sum: '$otherStudents' },
      },
    },
  ]);

  const teacherStudentRatio = studentCount[0].totalStudents / totalTeachers.value;
  const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
  const averageStudentOfSchool = studentCount[0].totalStudents / totalSchools.value;

  const schoolStats = {
    totalSchools: totalSchools.value,
    totalStudents: studentCount.totalStudents,
    totalTeachers: totalTeachers.value,
    totalFemaleTeachers: totalFemaleTeachers.value,
    totalMaleTeachers: totalMaleTeachers.value,
    totalGirls: studentCount.femaleStudents,
    totalBoys: studentCount.maleStudents,
    averageStudentOfSchool,
    averageTeacherOfSchool,
    teacherStudentRatio,
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

const getStudentStatusCountsAggregation = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ];

  return Student.aggregate(pipeline);
};
/**
 * Get all school, student, teacher graph data
 * @returns {Promise<Object>} School, teacher, student graph data
 */
const getAllSchoolStudentTeacherData = async () => {
  /// /
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
    // Stream Count
    const typeOfSchool = school.gender || 'Unknown';
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
    School.countDocuments().exec(),
    Teacher.countDocuments().exec(),
    Teacher.countDocuments({ gender: 'Female' }).exec(),
    Teacher.countDocuments({ gender: 'Male' }).exec(),
    Student.countDocuments({ Gender: 'M' }).exec(),
    Student.countDocuments({ Gender: 'F' }).exec(),
    Student.countDocuments({ Gender: 'T' }).exec(),
    Student.countDocuments().exec(),
    Student.countDocuments({ status: 'Studying' }).exec(),
  ]);

  const totalGuestTeacher = await GuestTeacher.countDocuments().exec();

  const total = totalGuestTeacher + totalTeachers.value;
  const teacherStudentRatio = totalStydyingStudent.value / total;
  const averageTeacherOfSchool = total / totalSchools.value;
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
  const statusCounts = await getStudentStatusCountsAggregation();

  const result = {
    totalSchools: totalSchools.value,
    totalStudents: totalStudent.value,
    totalTeachers: total,
    regularTeachers: totalTeachers.value,
    guestTeachers: totalGuestTeacher,
    studentStatusCounts: statusCounts,
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
    // afiliationCounts,
    // minorityCounts,
    // streamCounts,
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
  /// ////to work
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
      afiliationCount: {},
      minorityCount: {},
      streamCount: {},
      typeOfSchoolCount: {},
    };
  }

  const schoolManagementWise = {};
  const zoneWiseCount = {};
  const mediumWiseCount = {};
  let lowClassCount = 0;
  let highClassCount = 0;
  const shiftWiseCount = { Morning: 0, Afternoon: 0, Evening: 0 };
  const afiliationCount = {};
  const minorityCount = {};
  const streamCount = {};
  const typeOfSchoolCount = {};

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

    // Afiliation Count
    const afiliation = school.affiliation || 'Unknown';
    afiliationCount[afiliation] = (afiliationCount[afiliation] || 0) + 1;

    // Minority Count
    const minority = school.minority || 'Unknown';
    minorityCount[minority] = (minorityCount[minority] || 0) + 1;

    // Stream Count
    const stream = school.stream || 'Unknown';
    streamCount[stream] = (streamCount[stream] || 0) + 1;

    // Stream Count
    const typeOfSchool = school.gender || 'Unknown';
    typeOfSchoolCount[typeOfSchool] = (typeOfSchoolCount[typeOfSchool] || 0) + 1;
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
    afiliationCount,
    minorityCount,
    streamCount,
    typeOfSchoolCount,
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

  const districtStats = await School.aggregate([
    {
      $group: {
        _id: '$District_name',
        D_ID: { $first: '$D_ID' }, // Include district ID in the result
        totalSchools: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'students', // Assuming your student collection is named 'students'
        localField: '_id',
        foreignField: 'District',
        as: 'students',
      },
    },
    {
      $unwind: {
        path: '$students',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$_id',
        D_ID: { $first: '$D_ID' },
        totalStudents: { $sum: 1 },
        totalSchools: { $first: '$totalSchools' },
      },
    },
    {
      $project: {
        _id: 0,
        districtName: '$_id',
        D_ID: 1,
        totalStudentCount: '$totalStudents',
        totalSchoolCount: '$totalSchools',
      },
    },
  ]);

  // return districtStats;
  await redis.set('getSchoolStudentCountByDistricts', JSON.stringify(districtStats), 'EX', 24 * 60 * 60);
  return districtStats;
};

const getSchoolStudentCountByZone = async (district) => {
  // Check if the data is already cached in Redis
  const cachedData = await redis.get(`getSchoolStudentCountByDistricts:${district}`);

  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const districtStats = await School.aggregate([
    {
      $match: { District_name: district },
    },
    {
      $group: {
        _id: '$Zone_Name',
        Z_ID: { $first: '$Z_ID' }, // Include zone ID in the result
        totalSchools: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'students',
        let: { zoneName: { $toLower: '$_id' } },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [{ $toLower: '$z_name' }, '$$zoneName'],
              },
            },
          },
        ],
        as: 'students',
      },
    },
    {
      $unwind: {
        path: '$students',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$_id',
        Zone_Name: { $first: '$Zone_Name' },
        Z_ID: { $first: '$Z_ID' },
        totalStudents: { $sum: 1 },
        totalSchools: { $first: '$totalSchools' },
      },
    },
    {
      $project: {
        _id: 0,
        zoneName: '$_id',
        Z_ID: 1,
        totalStudentCount: '$totalStudents',
        totalSchoolCount: '$totalSchools',
      },
    },
  ]);

  await redis.set(`getSchoolStudentCountByDistricts:${district}`, JSON.stringify(districtStats), 'EX', 24 * 60 * 60);
  return districtStats;
};

const getDistrictWiseCounts = async (District_name) => {
  const schoolData = await School.find({ District_name });
  const schoolManagementWise = {};
  schoolData.forEach((school) => {
    // School Management Wise
    const schManagement = school.SchManagement || 'Unknown';
    schoolManagementWise[schManagement] = (schoolManagementWise[schManagement] || 0) + 1;
  });
  schoolManagementWise
  const [
    // totalSchools,
    // totalAided,
    // totalGovernment,
    totalTeachers,
    totalFemaleTeachers,
    totalMaleTeachers,
    totalMaleStudent,
    totalGirlsStudent,
    Other,
    totalStudent,
    totalStydyingStudent,
  ] = await Promise.allSettled([
    // School.countDocuments({ District_name }).exec(),
    // School.countDocuments({ District_name, SchManagement: 'Aided' }).exec(),
    // School.countDocuments({ District_name, SchManagement: 'Government' }).exec(),
    Teacher.countDocuments({ districtname: District_name }).exec(),
    Teacher.countDocuments({ gender: 'Female', districtname: District_name }).exec(),
    Teacher.countDocuments({ gender: 'Male', districtname: District_name }).exec(),
    Student.countDocuments({ Gender: 'M', District: District_name }).exec(),
    Student.countDocuments({ Gender: 'F', District: District_name }).exec(),
    Student.countDocuments({ Gender: 'T', District: District_name }).exec(),
    Student.countDocuments({ District: District_name }).exec(),
    Student.countDocuments({ status: 'Studying', District: District_name }).exec(),
  ]);
  return {
    // totalSchools: totalSchools.value,
    // totalAided: totalAided.value,
    // totalGovernment: totalGovernment.value ,
    schoolManagementWise,
    totalTeachers: totalTeachers.value,
    totalFemaleTeachers: totalFemaleTeachers.value,
    totalMaleTeachers: totalMaleTeachers.value,
    totalBoys: totalMaleStudent.value,
    totalGirls: totalGirlsStudent.value,
    Other: Other.value,
    totalStudent: totalStudent.value,
    totalStydyingStudent: totalStydyingStudent.value,
  };
};

const getDashboardByZone = async (zone) => {
  // Check if the data is already cached in Redis
  // const cachedData = await redis.get('getSchoolStudentCountByDistricts');

  // if (cachedData) {
  //   return JSON.parse(cachedData);
  // }

  const districtStats = await School.aggregate([
    {
      $match: { Zone_Name: zone },
    },
    {
      $group: {
        _id: '$School_Name',
        School_Name: { $first: '$School_Name' }, // Include district ID in the result
        totalSchools: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'students', // Assuming your student collection is named 'students'
        localField: '_id',
        foreignField: 'SCHOOL_NAME',
        as: 'students',
      },
    },
    {
      $unwind: {
        path: '$students',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$_id',
        // D_ID: { $first: '$D_ID' },
        totalStudents: { $sum: 1 },
        totalSchools: { $first: '$totalSchools' },
      },
    },
    {
      $project: {
        _id: 0,
        School_Name: '$_id',
        D_ID: 1,
        totalStudentCount: '$totalStudents',
        totalSchoolCount: '$totalSchools',
      },
    },
  ]);

  // return districtStats;
  // await redis.set('getSchoolStudentCountByDistricts', JSON.stringify(districtStats), 'EX', 24 * 60 * 60);
  return districtStats;
};

// getDashboardByZone('Zone-01').then((result) => {
//   console.log(result)
// })
const getDistrictWiseCountsGraphs = async () => {
  // try {
  // Check if the data is already cached in Redis
  const cachedData = await redis.get('getDistrictWiseCountsGraphicalRepresentation');

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const schoolResult = await School.aggregate([
    {
      $group: {
        _id: '$District_name',
        totalSchools: { $sum: 1 },
      },
    },
  ]);

  const studentResult = await Student.aggregate([
    {
      $group: {
        _id: '$District',
        totalStudents: { $sum: 1 },
      },
    },
  ]);

  const teacherResult = await Teacher.aggregate([
    {
      $group: {
        _id: '$districtname',
        totalTeachers: { $sum: 1 },
      },
    },
  ]);

  // Combine the results into a single array
  const combinedResults = schoolResult.map((district) => {
    const studentDistrict = studentResult.find((s) => s._id === district._id) || {};
    const teacherDistrict = teacherResult.find((t) => t._id === district._id) || {};

    return {
      _id: district._id,
      totalSchools: district.totalSchools || 0,
      totalStudents: studentDistrict.totalStudents || 0,
      totalTeachers: teacherDistrict.totalTeachers || 0,
    };
  });
  await redis.set('getDistrictWiseCountsGraphicalRepresentation', JSON.stringify(combinedResults), 'EX', 24 * 60 * 60);
  return combinedResults;
};

module.exports = {
  getSchoolStats,
  getAggregatedSchoolData,
  getAggregatedSchoolDataByDistrictName,
  getAllSchoolStudentTeacherDataByDistrictName,
  getAllSchoolStudentTeacherData,
  getSchoolStudentCountByDistricts,
  getStudentsEnrollmentGraph,
  getSchoolStudentCountByZone,
  getDistrictWiseCounts,
  getDistrictWiseCountsGraphs,
};
