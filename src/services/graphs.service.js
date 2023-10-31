const { School, Student, Teacher } = require('../models');

/**
 * Get school statistics
 * @returns {Promise<Object>} School statistics
 */
async function getSchoolStats() {
  const [totalSchools, totalStudents, totalTeachers, totalGirls, totalBoys] = await Promise.all([
    School.countDocuments(),
    Student.countDocuments(),
    Teacher.countDocuments(),
    Student.countDocuments({ Gender: 'F' }),
    Student.countDocuments({ Gender: 'M' }),
  ]);

  const teacherStudentRatio = totalStudents / totalTeachers;
  return {
    totalSchools,
    totalStudents,
    totalTeachers,
    totalGirls,
    totalBoys,
    teacherStudentRatio,
  };
}

// async function getSchoolStatistics(SchCategory, shift, School_Name ) {
//   try {
//     const pipeline = [
//       // Filter data based on query parameters (SchCategory, shift, School_Name).
//       {
//         $match: {
//           $and: [
//             { SchCategory: SchCategory }, // You can replace "YourSchCategory" with the desired category or use a variable.
//             { shift: shift }, // You can replace "YourShift" with the desired shift or use a variable.
//             { School_Name: School_Name }, // You can replace "YourSchoolName" with the desired school name or use a variable.
//           ],
//         },
//       },
//       // Group data by SchCategory and calculate averages.
//       {
//         $group: {
//           _id: "$SchCategory",
//           totalSchools: { $sum: 1 },
//           averageTeachersPerSchool: { $avg: "$TotalTeachersField" }, // Replace "TotalTeachersField" with the actual field name.
//           averageStudentsPerSchool: { $avg: "$TotalStudentsField" }, // Replace "TotalStudentsField" with the actual field name.
//         },
//       },
//       // Get the total count of teachers.
//       {
//         $lookup: {
//           from: "teachers", // Replace with the actual teacher collection name.
//           localField: "SchCategory",
//           foreignField: "SchCategory",
//           as: "teachers",
//         },
//       },
//       {
//         $unwind: "$teachers",
//       },
//       {
//         $group: {
//           _id: "$_id",
//           totalTeachers: { $sum: 1 },
//           totalMaleTeachers: {
//             $sum: { $cond: [{ $eq: ["$teachers.Gender", "Male"] }, 1, 0] },
//           },
//           totalFemaleTeachers: {
//             $sum: { $cond: [{ $eq: ["$teachers.Gender", "Female"] }, 1, 0] },
//           },
//         },
//       },
//       // Calculate the teacher-student ratio.
//       {
//         $project: {
//           totalSchools: 1,
//           totalTeachers: 1,
//           totalMaleTeachers: 1,
//           totalFemaleTeachers: 1,
//           teacherStudentRatio: {
//             $cond: [
//               { $eq: ["$totalStudents", 0] }, // Avoid division by zero.
//               0,
//               { $divide: ["$totalTeachers", "$totalStudents"] },
//             ],
//           },
//         },
//       },
//     ];

//     const result = await School.aggregate(pipeline);
//     console.log(result)
//     return result;

//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// }

// getSchoolStatistics().then((stats) => {
//   console.log("School Statistics:", stats);
// });

// /**
//  * Get school statistics
//  * @param {Object} query - Query parameters
//  * @returns {Promise<Object>} School statistics
//  */
// async function getSchoolStatistics(query) {
//     const matchStage = {
//       $match: {
//         $and: [
//           { SchCategory: query.SchCategory },
//           { shift: query.shift },
//           { School_Name: query.School_Name },
//         ],
//       },
//     };

//     const groupStage = {
//       $group: {
//         _id: null,
//         totalSchools: { $sum: 1 },
//         teacherStudentRatio: {
//           $avg: {
//             $cond: [
//               { $gt: ['$totalTeachers', 0] },
//               { $divide: ['$totalTeachers', '$totalStudents'] },
//               0,
//             ],
//           },
//         },
//         averageTeachersPerSchool: { $avg: '$totalTeachers' },
//         averageStudentsPerSchool: { $avg: '$totalStudents' },
//         averageHeadStaffRatio: {
//           $avg: {
//             $cond: [
//               { $eq: ['$postdesc', 'VICE PRINCIPAL'] },
//               0,
//               { $cond: [{ $eq: ['$postdesc', 'PRINCIPAL'] }, 1, 0] },
//             ],
//           },
//         },
//         teacherBySchCategory: { $avg: '$totalTeachers' },
//         schoolsBySchCategory: { $sum: 1 },
//         enrollmentBySchCategory: { $avg: '$totalStudents' },
//       },
//     };

//     const projectStage = {
//       $project: {
//         _id: 0,
//       },
//     };

//     const aggregationPipeline = [matchStage, groupStage, projectStage];

//     const result = await School.aggregate(aggregationPipeline);

//     return result[0] || {};
//   }

//   // Example usage:
//   const query = {
//     SchCategory: 'YourCategory',
//     shift: 'YourShift',
//     School_Name: 'YourSchoolName',
//   };

//   getSchoolStatistics(query)
//     .then((stats) => {
//       console.log('School Statistics:', stats);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });

// async function getSchoolStatistics(SchCategory, shift, School_Name ) {
//   // Set up the base aggregation pipeline
//   const pipeline = [
//     {
//       $match: {}, // This will be filled based on query parameters
//     },
//     {
//       $group: {
//         _id: null,
//         totalSchools: { $sum: 1 },
//         totalTeachers: { $sum: 1 },
//         totalStudents: { $sum: 1 },
//         totalHeadStaff: {
//           $sum: {
//             $cond: [
//               {
//                 $or: [
//                   { $eq: ['$postdesc', 'VICE PRINCIPAL'] },
//                   { $eq: ['$postdesc', 'PRINCIPAL'] },
//                 ],
//               },
//               1,
//               0,
//             ],
//           },
//         },
//       },
//     },
//   ];

//   // Append additional groupings based on query parameters
//   if (SchCategory) {
//     pipeline[0].$match.SchCategory = SchCategory;
//   }
//   if (shift) {
//     pipeline[0].$match.shift = shift;
//   }
//   if (School_Name) {
//     pipeline[0].$match.School_Name = School_Name;
//   }

//   // Execute the aggregation pipeline
//   const result = await Teacher.aggregate(pipeline);

//   if (result && result.length > 0) {
//     const {
//       totalSchools,
//       totalTeachers,
//       totalStudents,
//       totalHeadStaff,
//     } = result[0];

//     // Calculate the required statistics
//     const teacherStudentRatio = totalStudents / totalTeachers;
//     const averageTeachersPerSchool = totalTeachers / totalSchools;
//     const averageStudentsPerSchool = totalStudents / totalSchools;
//     const headStaffRatio = totalHeadStaff / totalTeachers;

//     return {
//       totalSchools,
//       teacherStudentRatio,
//       averageTeachersPerSchool,
//       averageStudentsPerSchool,
//       headStaffRatio,
//     };
//   }

//   return null;
// }

// // Example usage
// const queryParams = {
//   SchCategory, // Replace with your desired values
//   shift,
//   School_Name,
// };

// getSchoolStatistics(SchCategory, shift, School_Name)
//   .then((stats) => {
//     if (stats) {
//       console.log('School Statistics:', stats);
//     } else {
//       console.log('No statistics found for the given parameters.');
//     }
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

const getSchoolStatistics = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'teachers', // Name of the Teacher collection
            localField: 'School_Name', // Field from the School collection
            foreignField: 'schname', // Field from the Teacher collection
            as: 'teachers', // Alias for the joined data
          },
        },
        {
          $unwind: '$teachers', // Unwind the teachers array created by $lookup
        },
        {
          $group: {
            _id: '$SchCategory', // Group by SchCategory
            School_Name: { $first: '$School_Name' }, // Get the School_Name
            Teacher_Count: { $sum: 1 }, // Count teachers
          },
        },
        {
          $project: {
            _id: 0,
            SchCategory: '$_id',
            School_Name: 1,
            Teacher_Count: 1,
          },
        },
      ];

      const result = await School.aggregate(pipeline);

      if (result.length > 0) {
        resolve(result);
      } else {
        reject('No data found.');
      }
    } catch (error) {
      reject(error);
    }
  });
};

const countOfHeadGender = async () => {
  // const pipeline = [
  //     {
  //       $match: {
  //         postdesc: { $in: ["PRINCIPAL", "VICE PRINCIPAL"] }
  //       }
  //     },
  //     {
  //       $group: {
  //         _id: "$gender",
  //         count: { $sum: 1 }
  //       }
  //     }
  //   ];

  const schoolPipeline = [
    {
      $match: $SchCategory,
    },
    {
      $project: {
        _id: 0,
        School_Name: 1, // Get the School_Name field
      },
    },
  ];

  const schools = await School.aggregate(schoolPipeline);

  //  const result = await Teacher.aggregate(pipeline);
  return schools;
};

// async function getSchoolStatistics() {
//     const schoolData = await getSchoolStats()
//    const headOfSchGenderRatio = await countOfHeadGender()
//  const techersRatioBySchool = schoolData.totalTeachers / schoolData.totalSchools
//  const avgEnrolmentOfStudentPerSchool = schoolData.totalStudents / schoolData.totalSchools
//  return {
//     schoolData,
//     techersRatioBySchool,
//     avgEnrolmentOfStudentPerSchool,
//     headOfSchGenderRatio,
//  }
// }

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

module.exports = {
  getSchoolStats,
  getSchoolStatistics,
  getAggregatedSchoolData,
};
