const { School, Student, Teacher, StudentCounts } = require('../models');
const redis = require('../utils/redis');

const getSchoolIdByShiftWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$shift',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByTypeOfSchoolWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$typeOfSchool',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByStreamWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: { $ifNull: ['$stream', null] },  // Group by stream or null for missing values
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByMinortyWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$minority',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByManagmentWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$SchManagement',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByAffiliationWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$affiliation',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getCountByCriteria = async (criteria, field) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const counts = await StudentCounts.aggregate([
        {
          $match: {
            Schoolid: { $in: item.Schoolid },
          },
        },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: '$totalStudent' },
          },
        },
      ]);
      return counts;
    })
  );
  return counts;
};

const getSchoolCountsByCriteria = async (criteria, field) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const counts = await School.aggregate([
        {
          $match: {
            Schoolid: { $in: item.Schoolid },
          },
        },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 }, // Count schools
          },
        },
      ]);
      return counts;
    })
  );
  return counts;
};


const getStudentCount = async () => {
  // const managmentWiseCountId = await getSchoolIdByManagmentWise();

  const studentManagementWiseCounts = await getSchoolIdByManagmentWise();
  const streamWisehoolIds = await getSchoolIdByStreamWise();
  const streanWiseCount = await getSchoolCountsByCriteria(streamWisehoolIds, 'stream');

  const minorityWiseSchoolIds = await getSchoolIdByMinortyWise();
  const minortyWiseCount = await getSchoolCountsByCriteria(minorityWiseSchoolIds, 'minority');

  const affiliationWiseSchoolIds = await getSchoolIdByAffiliationWise();
  const affiliationWiseCount = await getSchoolCountsByCriteria(affiliationWiseSchoolIds, 'affiliation');

  const shiftWiseSchoolid = await getSchoolIdByShiftWise();
  const studentShiftWiseCounts = await getSchoolCountsByCriteria(shiftWiseSchoolid, 'shift');

  const typeOfSchoolsWiseSchoolid = await getSchoolIdByTypeOfSchoolWise();
  const typeOfSchoolWiseCounts = await getSchoolCountsByCriteria(typeOfSchoolsWiseSchoolid, 'typeOfSchool');
  try {
    const totalStudentCount = await StudentCounts.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: '$totalStudent' },
          maleStudents: { $sum: '$maleStudents' },
          femaleStudents: { $sum: '$femaleStudents' },
          otherStudents: { $sum: '$otherStudents' },
        },
      },
    ]);

    const result = await StudentCounts.aggregate([
      {
        $unwind: '$classes',
      },
      {
        $group: {
          _id: '$classes.class',
          totalMaleStudents: { $sum: '$classes.male' },
          totalFemaleStudents: { $sum: '$classes.feMale' },
          totalOtherStudents: { $sum: '$classes.other' },
        },
      },
    ]);
    return {
      typeOfSchoolWiseCounts,
      studentShiftWiseCounts,
      minortyWiseCount,
      affiliationWiseCount,
      streanWiseCount,
      // studentManagementWiseCounts,
      totalStudentCount,
      result,
    };
  } catch (error) {
    console.error('Error updating student statistics:', error);
  }
};

// const getSchoolIdBySchCategoryWise = async () => {
//   const pipeline = [
//     {
//       $group: {
//         _id: '$SchCategory',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };
// const getSchoolIdByMinorityWise = async () => {
//   const pipeline = [
//     {
//       $group: {
//         _id: '$minority',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };

// const getSchoolIdByAffiliationWise = async () => {
//   const pipeline = [
//     {
//       $group: {
//         _id: '$affiliation',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };
// const getSchoolIdByTypeOfSchool = async () => {
//   const pipeline = [
//     {
//       $group: {
//         _id: '$typeOfSchool',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };

// const getStudentStats = async () => {
//   const schCategorySchoolIds = await getSchoolIdBySchCategoryWise();
//   const studentCounts = await getCountByCriteria(schCategorySchoolIds, 'SchCategory');

//   const streamWiseSchoolIds = await getSchoolIdByStreamWise();
//   const streanWiseCount = await getCountByCriteria(streamWiseSchoolIds, 'stream');

//   const minorityWiseSchoolIds = await getSchoolIdByMinorityWise();
//   const minorityWiseCount = await getCountByCriteria(minorityWiseSchoolIds, 'minority');

//   const affiliationWiseSchoolIds = await getSchoolIdByAffiliationWise();
//   const affiliationWiseCount = await getCountByCriteria(affiliationWiseSchoolIds, 'affiliation');

//   const typeOfSchoolSchoolIds = await getSchoolIdByTypeOfSchool();
//   const typeOfSchoolSchoolCount = await getCountByCriteria(typeOfSchoolSchoolIds, 'typeOfSchool');

//   const managmentWiseCountId = await getSchoolIdByManagmentWise();
//   const studentManagementWiseCounts = await getCountByCriteria(managmentWiseCountId, 'SchManagement');
//   const [totalSchools, totalStudent, totalTeacher, totalFemaleTeacher, totalMaleTeacher, totalGirl, totalBoy, totalOtherStudent] =
//     await Promise.allSettled([
//       School.countDocuments().exec(),
//       Student.countDocuments().exec(),
//       Teacher.countDocuments().exec(),
//       Teacher.countDocuments({ gender: 'Female'}).exec(),
//       Teacher.countDocuments({ gender: 'Male' }).exec(),
//       Student.countDocuments({ Gender: 'F' }).exec(),
//       Student.countDocuments({ Gender: 'M' }).exec(),
//       Student.countDocuments({ Gender: 'T' }).exec(),
//     ]);
//   const teacherStudentRatio = totalStudent.value / totalTeacher.value;
//   const averageTeacherOfSchool = totalTeacher.value / totalSchools.value;
//   const averageStudentOfSchool = totalStudent.value / totalSchools.value;

// const totalStudents = totalStudent.value;
// const  totalGirls = totalGirl.value;
// const  totalBoys = totalBoy.value;
// const totalTeachers = totalTeacher.value
// const totalFemaleTeachers = totalFemaleTeacher.value;
// const totalMaleTeachers = totalMaleTeacher.value;
// const totalOtherStudents = totalOtherStudent.value
//   return {
//     studentCounts,
//     streanWiseCount,
//     affiliationWiseCount,
//     typeOfSchoolSchoolCount,
//     minorityWiseCount,
//     studentShiftWiseCounts,
//     studentManagementWiseCounts,
//     teacherStudentRatio,
//     averageTeacherOfSchool,
//     averageStudentOfSchool,
//     totalTeachers,
//     totalFemaleTeachers,
//     totalMaleTeachers,
//     totalStudents,
//     totalGirls,
//     totalBoys,
//     totalOtherStudents,
//   };
// };

// const getStudentCount = async () => {
//   // Check if the data is already cached in Redis
//   const cachedData = await redis.get('getStudentCount');

//   if (cachedData) {
//     return JSON.parse(cachedData);
//   }

//   const studentStats = await getStudentStats();

//   // Cache the result in Redis for future use
//   await redis.set('getStudentCount', JSON.stringify(studentStats), 'EX', 24 * 60 * 60);

//   return studentStats;
// };

/// ///////////////////////////////////////////////////////
// // Function to get school IDs by a specific field (e.g., SchCategory, stream, etc.)
// const getSchoolIdsByField = async (field) => {
//   const pipeline = [
//     {
//       $group: {
//         _id: `$${field}`,
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };

// // Function to get gender counts of students by district
// const getGenderCountsStudents = async () => {
//   const pipeline = [
//     {
//       $group: {
//         _id: '$Gender',
//         count: { $sum: 1 },
//       },
//     },
//   ];

//   return Student.aggregate(pipeline);
// };

// // Function to get gender counts of teachers by district
// const getGenderCountsTeachers = async () => {
//   const pipeline = [
//     {
//       $group: {
//         _id: '$gender',
//         count: { $sum: 1 },
//       },
//     },
//   ];

//   return Teacher.aggregate(pipeline);
// };
// // Function to get student counts by a specific field (e.g., SchCategory, stream, etc.)
// const getStudentCountsByField = async (schoolIds, field) => {
//   const counts = await Promise.all(
//     schoolIds.map(async (item) => {
//       const count = await Student.countDocuments({ Schoolid: { $in: item.Schoolid } });
//       return { [field]: item._id, count };
//     })
//   );
//   return counts;
// };

// // Function to get statistics about students
// const getStudentStats = async () => {
//   const fields = ['SchCategory', 'stream', 'minority', 'affiliation', 'typeOfSchool', 'shift', 'SchManagement'];
//   const fieldPromises = fields.map(async (field) => {
//     const schoolIds = await getSchoolIdsByField(field);
//     const counts = await getStudentCountsByField(schoolIds, field);
//     return { [field]: counts };
//   });
//   const statusCounts = await getStudentStatusCountsAggregation();
//   const genderCountsStudents = await getGenderCountsStudents();
//   const genderCountsTeachers = await getGenderCountsTeachers();
//   const fieldResults = await Promise.all(fieldPromises);

//   // Fetch other statistics
//   const [totalSchools, totalStudent, totalTeachers] = await Promise.allSettled([
//     School.countDocuments().exec(),
//     Student.countDocuments().exec(),
//     Teacher.countDocuments().exec(),
//   ]);

//   const teacherStudentRatio = totalStudent.value / totalTeachers.value;
//   const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
//   const averageStudentOfSchool = totalStudent.value / totalSchools.value;

//   const totalStudents = totalStudent.value;

//   return {
//     studentStats: fieldResults,
//     studentStatusCounts: statusCounts,
//     studentGenderCounts: genderCountsStudents,
//     teacherGenderCounts: genderCountsTeachers,
//     teacherStudentRatio,
//     averageTeacherOfSchool,
//     averageStudentOfSchool,
//     totalStudents,
//   };
// };

// // Function to get student counts
// const getStudentCount = async () => {
//   // Check if the data is already cached in Redis
//   const cachedData = await redis.get('getStudentCount');

//   if (cachedData) {
//     return JSON.parse(cachedData);
//   }

//   const studentStats = await getStudentStats();

//   // Cache the result in Redis for future use
//   await redis.set('getStudentCount', JSON.stringify(studentStats), 'EX', 24 * 60 * 60);

//   return studentStats;
// };

/// /////////////////////////////////////////////////////////
// const getSchoolIdByShiftWiseByDistrictName = async (districtName) => {
//   const pipeline = [
//     {
//       $match: {
//         District_name: districtName,
//       },
//     },
//     {
//       $group: {
//         _id: '$shift',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };
// const getSchoolIdByStreamWiseByDistrictName = async (districtName) => {
//   const pipeline = [
//     {
//       $match: {
//         District_name: districtName,
//       },
//     },
//     {
//       $group: {
//         _id: '$stream',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };

// const getSchoolIdByManagmentWiseByDistrictName = async (districtName) => {
//   const pipeline = [
//     {
//       $match: {
//         District_name: districtName,
//       },
//     },
//     {
//       $group: {
//         _id: '$SchManagement',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };

// const getSchoolIdBySchCategoryWiseByDistrictName = async (districtName) => {
//   const pipeline = [
//     {
//       $match: {
//         District_name: districtName,
//       },
//     },
//     {
//       $group: {
//         _id: '$SchCategory',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };
// const getSchoolIdByMinorityWiseByDistrictName = async (districtName) => {
//   const pipeline = [
//     {
//       $match: {
//         District_name: districtName,
//       },
//     },
//     {
//       $group: {
//         _id: '$minority',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };

// const getSchoolIdByAffiliationWiseByDistrictName = async (districtName) => {
//   const pipeline = [
//     {
//       $match: {
//         District_name: districtName,
//       },
//     },
//     {
//       $group: {
//         _id: '$affiliation',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };
// const getSchoolIdByTypeOfSchoolByDistrictName = async (districtName) => {
//   const pipeline = [
//     {
//       $match: {
//         District_name: districtName,
//       },
//     },
//     {
//       $group: {
//         _id: '$typeOfSchool',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };

// const getStudentStatsByDistrictName = async (districtName) => {
//   const schCategorySchoolIds = await getSchoolIdBySchCategoryWiseByDistrictName(districtName);
//   const studentCounts = await getCountByCriteriaByDistrictName(schCategorySchoolIds, 'SchCategory');

//   const streamWiseSchoolIds = await getSchoolIdByStreamWiseByDistrictName(districtName);
//   const streanWiseCount = await getCountByCriteriaByDistrictName(streamWiseSchoolIds, 'stream');

//   const minorityWiseSchoolIds = await getSchoolIdByMinorityWiseByDistrictName(districtName);
//   const minorityWiseCount = await getCountByCriteriaByDistrictName(minorityWiseSchoolIds, 'minority');

//   const affiliationWiseSchoolIds = await getSchoolIdByAffiliationWiseByDistrictName(districtName);
//   const affiliationWiseCount = await getCountByCriteriaByDistrictName(affiliationWiseSchoolIds, 'affiliation');

//   const typeOfSchoolSchoolIds = await getSchoolIdByTypeOfSchoolByDistrictName(districtName);
//   const typeOfSchoolSchoolCount = await getCountByCriteriaByDistrictName(typeOfSchoolSchoolIds, 'typeOfSchool');

//   const shiftWiseSchoolid = await getSchoolIdByShiftWiseByDistrictName(districtName);
//   const studentShiftWiseCounts = await getCountByCriteriaByDistrictName(shiftWiseSchoolid, 'shift');

//   const managmentWiseCountId = await getSchoolIdByManagmentWiseByDistrictName(districtName);
//   const studentManagementWiseCounts = await getCountByCriteriaByDistrictName(managmentWiseCountId, 'SchManagement');

//   const [totalSchools, totalStudent, totalTeachers, totalGirl, totalBoy] =
//   await Promise.allSettled([
//     School.countDocuments({ District_name: districtName }).exec(),
//     Student.countDocuments({ District: districtName}).exec(),
//     Teacher.countDocuments({ districtname: districtName }).exec(),
//     Student.countDocuments({ District: districtName, Gender: 'F' }).exec(),
//     Student.countDocuments({ District: districtName, Gender: 'M' }).exec(),
//   ]);
// const teacherStudentRatio = totalStudent.value / totalTeachers.value;
// const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
// const averageStudentOfSchool = totalStudent.value / totalSchools.value;

// const totalStudents = totalStudent.value;
// const  totalGirls = totalGirl.value;
// const  totalBoys = totalBoy.value;
//   return {
//     studentCounts,
//     streanWiseCount,
//     affiliationWiseCount,
//     typeOfSchoolSchoolCount,
//     minorityWiseCount,
//     studentShiftWiseCounts,
//     studentManagementWiseCounts,
//     teacherStudentRatio,
//     averageTeacherOfSchool,
//     averageStudentOfSchool,
//     totalStudents,
//     totalGirls,
//     totalBoys,
//   };
// };

// const getCountByCriteriaByDistrictName = async (criteria, field) => {
//   const counts = await Promise.all(
//     criteria.map(async (item) => {
//       const count = await Student.countDocuments({ Schoolid: { $in: item.Schoolid } });
//       return { [field]: item._id, count };
//     })
//   );

//   return counts;
// };

// /**
//  * Get student graph data by districtName
//  * @param {string} districtName - The districtName name to filter the counts
//  * @returns {Promise<Object>} student graph data
//  */

// const getStudentCountByDistrictName = async (districtName) => {
//   // Check if the data is already cached in Redis
//   const cacheKey = `districtData:${districtName}`;
//   const cachedData = await redis.get(cacheKey);

//   if (cachedData) {
//     return JSON.parse(cachedData);
//   }

//   const studentStats = await getStudentStatsByDistrictName(districtName);

//   // Cache the result in Redis for future use
//   await redis.set(cacheKey, JSON.stringify(studentStats), 'EX', 24 * 60 * 60);
//   return studentStats;
// };

// Function to get student counts by a specific field and district
// const getStudentCountsByFieldAndDistrict = async (schoolIds, field, district) => {
//   const counts = await Promise.all(
//     schoolIds.map(async (item) => {
//       const count = await Student.countDocuments({
//         Schoolid: { $in: item.Schoolid },
//         District: district,
//       });
//       return { [field]: item._id, count };
//     })
//   );

//   return counts;
// };
// Function to get student counts by a specific field and schoolName
// const getStudentCountsByFieldAndSchoolName = async (schoolIds, field, schoolName) => {
//   const counts = await Promise.all(
//     schoolIds.map(async (item) => {
//       const count = await Student.countDocuments({
//         Schoolid: { $in: item.Schoolid },
//         School_Name: schoolName,
//       });
//       return { [field]: item._id, count };
//     })
//   );

//   return counts;
// };
// Function to get student status counts by district
// const getStudentStatusCountsByDistrict = async (district) => {
//   const pipeline = [
//     {
//       $match: { District_name: district },
//     },
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 },
//       },
//     },
//   ];

//   return StudentCounts.aggregate(pipeline);
// };

// const getStudentStatusCountsByDistrict = async (district) => {
//   const pipeline = [
//     {
//       $match: { District_name: district },
//     },
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 },
//       },
//     },
//   ];

//   return StudentCounts.aggregate(pipeline);
// };
// Function to get student status counts by district
// const getStudentStatusCountsBySchoolName = async (schoolNAme) => {
//   const pipeline = [
//     {
//       $match: { SCHOOL_NAME: schoolNAme },
//     },
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 },
//       },
//     },
//   ];

//   return Student.aggregate(pipeline);
// };
// Function to get gender counts of students by district
// const getGenderCountsStudentsByDistrict = async (district) => {
//   const pipeline = [
//     {
//       $match: { District: district },
//     },
//     {
//       $group: {
//         _id: '$Gender',
//         count: { $sum: 1 },
//       },
//     },
//   ];

//   return Student.aggregate(pipeline);
// };
// Function to get gender counts of students by schoolName
// const getGenderCountsStudentsBySchoolName = async (schoolName) => {
//   const pipeline = [
//     {
//       $match: { SCHOOL_NAME: schoolName },
//     },
//     {
//       $group: {
//         _id: '$Gender',
//         count: { $sum: 1 },
//       },
//     },
//   ];

//   return Student.aggregate(pipeline);
// };
// Function to get gender counts of teachers by district
// const getGenderCountsTeachersByDistrict = async (district) => {
//   const pipeline = [
//     {
//       $match: { districtname: district },
//     },
//     {
//       $group: {
//         _id: '$gender',
//         count: { $sum: 1 },
//       },
//     },
//   ];

//   return Teacher.aggregate(pipeline);
// };
// Function to get gender counts of teachers by schoolName
// const getGenderCountsTeachersBySchoolName = async (schoolName) => {
//   const pipeline = [
//     {
//       $match: { schname: schoolName },
//     },
//     {
//       $group: {
//         _id: '$gender',
//         count: { $sum: 1 },
//       },
//     },
//   ];

//   return Teacher.aggregate(pipeline);
// };
// Function to get statistics about students by district
// const getStudentCountByDistrictName = async (district) => {
//   const fields = ['SchCategory', 'stream', 'minority', 'affiliation', 'typeOfSchool', 'shift', 'SchManagement'];
//   const fieldPromises = fields.map(async (field) => {
//     const schoolIds = await getSchoolIdsByField(field);
//     const counts = await getStudentCountsByFieldAndDistrict(schoolIds, field, district);
//     return { [field]: counts };
//   });
//   const statusCounts = await getStudentStatusCountsByDistrict(district);
//   const genderCountsStudents = await getGenderCountsStudentsByDistrict(district);
//   const genderCountsTeachers = await getGenderCountsTeachersByDistrict(district);
//   const fieldResults = await Promise.all(fieldPromises);

//   // Fetch other statistics
//   const [totalSchools, totalStudent, totalTeachers] = await Promise.allSettled([
//     School.countDocuments({ District_name: district }).exec(),
//     Student.countDocuments({ District: district }).exec(),
//     Teacher.countDocuments({ districtname: district }).exec(),
//   ]);

//   const teacherStudentRatio = totalStudent.value / totalTeachers.value;
//   const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
//   const averageStudentOfSchool = totalStudent.value / totalSchools.value;

//   const totalStudents = totalStudent.value;

//   return {
//     studentStats: fieldResults,
//     studentStatusCounts: statusCounts,
//     studentGenderCounts: genderCountsStudents,
//     teacherGenderCounts: genderCountsTeachers,
//     teacherStudentRatio,
//     averageTeacherOfSchool,
//     averageStudentOfSchool,
//     totalStudents,
//   };
// };

// const getSchoolIdByShiftWiseByZoneName = async (zoneName) => {
//   const pipeline = [
//     {
//       $match: {
//         Zone_Name: zoneName,
//       },
//     },
//     {
//       $group: {
//         _id: '$shift',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };
// const getSchoolIdByStreamWiseByZoneName = async (zoneName) => {
//   const pipeline = [
//     {
//       $match: {
//         Zone_Name: zoneName,
//       },
//     },
//     {
//       $group: {
//         _id: '$stream',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };

// const getSchoolIdByManagmentWiseByZoneName = async (zoneName) => {
//   const pipeline = [
//     {
//       $match: {
//         Zone_Name: zoneName,
//       },
//     },
//     {
//       $group: {
//         _id: '$SchManagement',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };

// const getSchoolIdBySchCategoryWiseByZoneName = async (zoneName) => {
//   const pipeline = [
//     {
//       $match: {
//         Zone_Name: zoneName,
//       },
//     },
//     {
//       $group: {
//         _id: '$SchCategory',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };
// const getSchoolIdByMinorityWiseByZoneName = async (zoneName) => {
//   const pipeline = [
//     {
//       $match: {
//         Zone_Name: zoneName,
//       },
//     },
//     {
//       $group: {
//         _id: '$minority',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };

// const getSchoolIdByAffiliationWiseByZoneName = async (zoneName) => {
//   const pipeline = [
//     {
//       $match: {
//         Zone_Name: zoneName,
//       },
//     },
//     {
//       $group: {
//         _id: '$affiliation',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };
// const getSchoolIdByTypeOfSchoolByZoneName = async (zoneName) => {
//   const pipeline = [
//     {
//       $match: {
//         Zone_Name: zoneName,
//       },
//     },
//     {
//       $group: {
//         _id: '$typeOfSchool',
//         Schoolid: { $addToSet: '$Schoolid' },
//       },
//     },
//   ];

//   return School.aggregate(pipeline);
// };

// const getStudentStatsByZoneName = async (zoneName) => {
//   const schCategorySchoolIds = await getSchoolIdBySchCategoryWiseByZoneName(zoneName);
//   const studentCounts = await getCountByCriteriaByZoneName(schCategorySchoolIds, 'SchCategory');

//   const streamWiseSchoolIds = await getSchoolIdByStreamWiseByZoneName(zoneName);
//   const streanWiseCount = await getCountByCriteriaByZoneName(streamWiseSchoolIds, 'stream');

//   const minorityWiseSchoolIds = await getSchoolIdByMinorityWiseByZoneName(zoneName);
//   const minorityWiseCount = await getCountByCriteriaByZoneName(minorityWiseSchoolIds, 'minority');

//   const affiliationWiseSchoolIds = await getSchoolIdByAffiliationWiseByZoneName(zoneName);
//   const affiliationWiseCount = await getCountByCriteriaByZoneName(affiliationWiseSchoolIds, 'affiliation');

//   const typeOfSchoolSchoolIds = await getSchoolIdByTypeOfSchoolByZoneName(zoneName);
//   const typeOfSchoolSchoolCount = await getCountByCriteriaByZoneName(typeOfSchoolSchoolIds, 'typeOfSchool');

//   const shiftWiseSchoolid = await getSchoolIdByShiftWiseByZoneName(zoneName);
//   const studentShiftWiseCounts = await getCountByCriteriaByZoneName(shiftWiseSchoolid, 'shift');

//   const managmentWiseCountId = await getSchoolIdByManagmentWiseByZoneName(zoneName);
//   const studentManagementWiseCounts = await getCountByCriteriaByZoneName(managmentWiseCountId, 'SchManagement');

//   return {
//     zoneName,
//     studentCounts,
//     streanWiseCount,
//     affiliationWiseCount,
//     typeOfSchoolSchoolCount,
//     minorityWiseCount,
//     studentShiftWiseCounts,
//     studentManagementWiseCounts,
//   };
// };

// const getCountByCriteriaByZoneName = async (criteria, field) => {
//   const counts = await Promise.all(
//     criteria.map(async (item) => {
//       const count = await Student.countDocuments({ Schoolid: { $in: item.Schoolid } });
//       return { [field]: item._id, count };
//     })
//   );

//   return counts;
// };
// /**
//  * Get student graph data by zoneName
//  * @param {string} zoneName - The zoneName name to filter the counts
//  * @returns {Promise<Object>} student graph data
//  */
// const getStudentCountByZoneName = async (zoneName) => {
//   // Check if the data is already cached in Redis
//   const cacheKey = `Zone_Name:${zoneName}`;
//   const cachedData = await redis.get(cacheKey);

//   if (cachedData) {
//     return JSON.parse(cachedData);
//   }

//   const studentStats = await getStudentStatsByZoneName(zoneName);

//   // Cache the result in Redis for future use
//   await redis.set(cacheKey, JSON.stringify(studentStats), 'EX', 24 * 60 * 60);
//   return studentStats;
// };

// Function to get student counts by a specific field and district
// const getStudentCountsByFieldAndZone = async (schoolIds, field, zone) => {
//   const counts = await Promise.all(
//     schoolIds.map(async (item) => {
//       const count = await Student.countDocuments({
//         Schoolid: { $in: item.Schoolid },
//         z_name: zone.toLowerCase(),
//       });
//       return { [field]: item._id, count };
//     })
//   );

//   return counts;
// };

// Function to get student status counts by district
// const getStudentStatusCountsByZone = async (zone) => {
//   const pipeline = [
//     {
//       $match: { z_name: zone.toLowerCase() },
//     },
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 },
//       },
//     },
//   ];

//   return Student.aggregate(pipeline);
// };

// Function to get gender counts of students by district
// const getGenderCountsStudentsByZone = async (zone) => {
//   const pipeline = [
//     {
//       $match: { z_name: zone.toLowerCase() },
//     },
//     {
//       $group: {
//         _id: '$Gender',
//         count: { $sum: 1 },
//       },
//     },
//   ];

//   return Student.aggregate(pipeline);
// };

// Function to get gender counts of teachers by district
// const getGenderCountsTeachersByZone = async (zone) => {
//   const cleanedZoneName = zone.replace(/[^0-9]/g, '');
//   const pipeline = [
//     {
//       $match: { zonename: cleanedZoneName },
//     },
//     {
//       $group: {
//         _id: '$gender',
//         count: { $sum: 1 },
//       },
//     },
//   ];

//   return Teacher.aggregate(pipeline);
// };

// Function to get statistics about students by zone
// const getStudentCountByZoneName = async (zone) => {
//   const cleanedZoneName = zone.replace(/[^0-9]/g, '');
//   const fields = ['SchCategory', 'stream', 'minority', 'affiliation', 'typeOfSchool', 'shift', 'SchManagement'];
//   const fieldPromises = fields.map(async (field) => {
//     const schoolIds = await getSchoolIdsByField(field);
//     const counts = await getStudentCountsByFieldAndZone(schoolIds, field, zone);
//     return { [field]: counts };
//   });
//   const statusCounts = await getStudentStatusCountsByZone(zone);
//   const genderCountsStudents = await getGenderCountsStudentsByZone(zone);
//   const genderCountsTeachers = await getGenderCountsTeachersByZone(zone);
//   const fieldResults = await Promise.all(fieldPromises);

//   // Fetch other statistics
//   const [totalSchools, totalStudent, totalTeachers, totalFemaleTeacher, totalMaleTeacher, totalGirl, totalBoy] =
//     await Promise.allSettled([
//       School.countDocuments({ Zone_Name: zone }).exec(),
//       Student.countDocuments({ z_name: zone.toLowerCase() }).exec(),
//       Teacher.countDocuments({ zonename: cleanedZoneName }).exec(),
//     ]);

//   const teacherStudentRatio = totalStudent.value / totalTeachers.value;
//   const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
//   const averageStudentOfSchool = totalStudent.value / totalSchools.value;

//   const totalStudents = totalStudent.value;
//   return {
//     studentStats: fieldResults,
//     studentStatusCounts: statusCounts,
//     studentGenderCounts: genderCountsStudents,
//     teacherGenderCounts: genderCountsTeachers,
//     teacherStudentRatio,
//     averageTeacherOfSchool,
//     averageStudentOfSchool,
//     totalStudents,
//   };
// };

// const getStudentCountBySchoolName = async (schoolName) => {
//   const fields = ['SchCategory', 'stream', 'minority', 'affiliation', 'typeOfSchool', 'shift', 'SchManagement'];
//   const fieldPromises = fields.map(async (field) => {
//     const schoolIds = await getSchoolIdsByField(field);
//     const counts = await getStudentCountsByFieldAndSchoolName(schoolIds, field, schoolName);
//     return { [field]: counts };
//   });
//   const statusCounts = await getStudentStatusCountsBySchoolName(schoolName);
//   const genderCountsStudents = await getGenderCountsStudentsBySchoolName(schoolName);
//   const genderCountsTeachers = await getGenderCountsTeachersBySchoolName(schoolName);
//   const fieldResults = await Promise.all(fieldPromises);

//   // Fetch other statistics
//   const [totalSchools, totalStudent, totalTeachers] = await Promise.allSettled([
//     School.countDocuments({ School_Name: schoolName }).exec(),
//     Student.countDocuments({ SCHOOL_NAME: schoolName }).exec(),
//     Teacher.countDocuments({ schname: schoolName }).exec(),
//   ]);

//   const teacherStudentRatio = totalStudent.value / totalTeachers.value;
//   const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
//   const averageStudentOfSchool = totalStudent.value / totalSchools.value;

//   const totalStudents = totalStudent.value;

//   return {
//     studentStats: fieldResults,
//     studentStatusCounts: statusCounts,
//     studentGenderCounts: genderCountsStudents,
//     teacherGenderCounts: genderCountsTeachers,
//     teacherStudentRatio,
//     averageTeacherOfSchool,
//     averageStudentOfSchool,
//     totalStudents,
//   };
// };

const getSchoolIdByStreamWiseDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: { $ifNull: ['$stream', null] },  // Group by stream or null for missing values
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return StudentCounts.aggregate(pipeline);
};

const getSchoolIdByShiftWiseDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$shift',
        count: { $sum: 1 },
      },
    },
  ];
  return StudentCounts.aggregate(pipeline);
};

const getSchoolIdByTypeOfSchoolWiseDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$typeOfSchool',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByMinorityWiseDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$minority',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};
const getSchoolIdByManagementWiseDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$SchManagement',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByAffiliationWiseDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$affiliation',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolCountsByCriteriaDistrict = async (criteria, field, districtName) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const counts = await School.aggregate([
        {
          $match: {
            Schoolid: { $in: item.Schoolid },
            District_name: districtName,
          },
        },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 }, // Count schools
          },
        },
      ]);
      return counts;
    })
  );
  return counts;
};

const getStudentCountByDistrictName = async (districtName) => {
  const studentManagementWiseCounts = await getSchoolIdByShiftWiseDistrict(districtName);
  const studentTypeOfSchoolWiseCounts = await getSchoolIdByTypeOfSchoolWiseDistrict(districtName);
  const studentMinorityWiseCounts = await getSchoolIdByMinorityWiseDistrict(districtName);
  const studentManagemenetWiseCounts = await getSchoolIdByManagementWiseDistrict(districtName);
  const studentAffilitionWiseCounts = await getSchoolIdByAffiliationWiseDistrict(districtName);
  const schoolCriteria = await getSchoolIdByStreamWiseDistrict(districtName);
  const streamCounts = await getSchoolCountsByCriteriaDistrict(schoolCriteria, 'stream', districtName);
  return {
    studentManagementWiseCounts,
    studentTypeOfSchoolWiseCounts,
    studentMinorityWiseCounts,
    studentManagemenetWiseCounts,
    studentAffilitionWiseCounts,
    streamCounts,
  }
};


const getSchoolIdByStreamWiseZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: { $ifNull: ['$stream', null] },  // Group by stream or null for missing values
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return StudentCounts.aggregate(pipeline);
};

const getSchoolIdByShiftWisZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$shift',
        count: { $sum: 1 },
      },
    },
  ];
  return StudentCounts.aggregate(pipeline);
};

const getSchoolIdByTypeOfSchoolWiseZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$typeOfSchool',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByMinorityWiseZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$minority',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};
const getSchoolIdByManagementWiseZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$SchManagement',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByAffiliationWiseZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$affiliation',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolCountsByCriteriaZone = async (criteria, field, zone) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const counts = await School.aggregate([
        {
          $match: {
            Schoolid: { $in: item.Schoolid },
            Zone_Name: zone,
          },
        },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 }, // Count schools
          },
        },
      ]);
      return counts;
    })
  );
  return counts;
};

const getStudentCountByZoneName = async (zone) => {
  const ManagementCountsZoneWise = await getSchoolIdByShiftWisZone(zone);
  const TypeOfSchoolCountsZoneWise = await getSchoolIdByTypeOfSchoolWiseZone(zone);
  const MinorityCountsZoneWise = await getSchoolIdByMinorityWiseZone(zone);
  const ManagemenetCountsZoneWise = await getSchoolIdByManagementWiseZone(zone);
  const AffilitionCountsZoneWise = await getSchoolIdByAffiliationWiseZone(zone);
  const schoolCriteria = await getSchoolIdByStreamWiseZone(zone);
  const streamCountsZoneWise = await getSchoolCountsByCriteriaZone(schoolCriteria, 'stream', zone);

  return {
    ManagementCountsZoneWise,
    TypeOfSchoolCountsZoneWise,
    MinorityCountsZoneWise,
    ManagemenetCountsZoneWise,
    AffilitionCountsZoneWise,
    streamCountsZoneWise,
  }
};
const getSchoolIdByStreamWiseschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: { $ifNull: ['$stream', null] },  // Group by stream or null for missing values
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return StudentCounts.aggregate(pipeline);
};

const getSchoolIdByShiftWisschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: '$shift',
        count: { $sum: 1 },
      },
    },
  ];
  return StudentCounts.aggregate(pipeline);
};

const getSchoolIdByTypeOfSchoolWiseschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: '$typeOfSchool',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByMinorityWiseschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: '$minority',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};
const getSchoolIdByManagementWiseschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: '$SchManagement',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByAffiliationWiseschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: '$affiliation',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolCountsByCriteriaschoolName = async (criteria, field, schoolName) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const counts = await School.aggregate([
        {
          $match: {
            Schoolid: { $in: item.Schoolid },
            School_Name: schoolName,
          },
        },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 }, // Count schools
          },
        },
      ]);
      return counts;
    })
  );
  return counts;
};

const getStudentCountBySchoolName = async (schoolName) => {
  const ManagementCountsschoolNameWise = await getSchoolIdByShiftWisschoolName(schoolName);
  const TypeOfSchoolCountsschoolNameWise = await getSchoolIdByTypeOfSchoolWiseschoolName(schoolName);
  const MinorityCountsschoolNameWise = await getSchoolIdByMinorityWiseschoolName(schoolName);
  const ManagemenetCountsschoolNameWise = await getSchoolIdByManagementWiseschoolName(schoolName);
  const AffilitionCountsschoolNameWise = await getSchoolIdByAffiliationWiseschoolName(schoolName);
  const schoolCriteria = await getSchoolIdByStreamWiseschoolName(schoolName);
  const streamCountsschoolNameWise = await getSchoolCountsByCriteriaschoolName(schoolCriteria, 'stream', schoolName);

  return {
    ManagementCountsschoolNameWise,
    TypeOfSchoolCountsschoolNameWise,
    MinorityCountsschoolNameWise,
    ManagemenetCountsschoolNameWise,
    AffilitionCountsschoolNameWise,
    streamCountsschoolNameWise,
  }
};

module.exports = {
  getStudentCount,
  getStudentCountByDistrictName,
  getStudentCountByZoneName,
  getStudentCountBySchoolName,
};
