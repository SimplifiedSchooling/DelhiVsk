const { Teacher, School, GuestTeacher, Student } = require('../models');

  const getSchoolIdByShiftWise = async () => {
    const pipeline = [
      {
        $group: {
          _id: '$shift',
          schoolIds: { $push: '$Schoolid' },
        },
      },
    ];
  
    const schCategorySchoolIds = await School.aggregate(pipeline);
    return schCategorySchoolIds;
  };
  
  const getSchoolIdByManagmentWise = async () => {
    const pipeline = [
      {
        $group: {
          _id: '$SchManagement',
          schoolIds: { $push: '$Schoolid' },
        },
      },
    ];
  
    const schCategorySchoolIds = await School.aggregate(pipeline);
    return schCategorySchoolIds;
  };
  

  
  const getSchoolIdBySchCategoryWise = async () => {
    const pipeline = [
      {
        $group: {
          _id: '$SchCategory',
          schoolIds: { $push: '$Schoolid' },
        },
      },
    ];
  
    const schCategorySchoolIds = await School.aggregate(pipeline);
    return schCategorySchoolIds;
  };


const getTeacherStats = async () => {
    const schCategorySchoolIds = await getSchoolIdBySchCategoryWise();
    const totalTeacherCategoryWiseCounts = [];
    
    for (const category of schCategorySchoolIds) {
      const teacherCount = await Teacher.countDocuments({ schoolid: { $in: category.schoolIds } });
      const guestTeacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: category.schoolIds.map(String) } });
    
      const totalTeacherCount = teacherCount + guestTeacherCount;
    
      totalTeacherCategoryWiseCounts.push({
        SchCategory: category._id,
        // teacherCount,
        // guestTeacherCount,
        totalTeacherCount,
      });
    }
    const shiftWiseSchoolid = await getSchoolIdByShiftWise();
    const totalTeacherShiftWiseCounts = []; // Add this array for total count by shift
  
    for (const shift of shiftWiseSchoolid) {
      const teacherShiftWiseCount = await Teacher.countDocuments({ schoolid: { $in: shift.schoolIds } });
      const guestTeacherShiftWiseCount = await GuestTeacher.countDocuments({
        SchoolID: { $in: shift.schoolIds.map(String) },
      });
  

  
      // Calculate total count by adding regular and guest teacher counts
      const totalTeacherCount = teacherShiftWiseCount + guestTeacherShiftWiseCount;
  
      totalTeacherShiftWiseCounts.push({
        shift: shift._id,
        teacherShiftWiseCount,
        guestTeacherShiftWiseCount,
        totalTeacherCount,
      });
    }
  
    // Rest of the code remains the same
    const schManagmentSchoolIds = await getSchoolIdByManagmentWise();
    const totalTeacherManagmentWiseCounts = [];
    
    for (const SchManagement of schManagmentSchoolIds) {
      const teacherCount = await Teacher.countDocuments({ schoolid: { $in: SchManagement.schoolIds } });
      const guestTeacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: SchManagement.schoolIds.map(String) } });
    
      const totalTeacherCount = teacherCount + guestTeacherCount;
    
      totalTeacherManagmentWiseCounts.push({
        SchCategory: SchManagement._id,
        totalTeacherCount,
      });
    }

    const pipeline3 = [
      {
        $group: {
          _id: '$postdesc',
          teacherCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const pipeline = [
      {
        $group: {
          _id: '$Post',
          teacherCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];
    const postdescWiseGuestTeacherCounts = await GuestTeacher.aggregate(pipeline);
    const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline3);

const combinedCounts = [
  ...postdescWiseGuestTeacherCounts,
  ...postdescWiseTeacherCounts,
];

const uniquePosts = [...new Set(combinedCounts.map((count) => count._id))];

// Create a new array with combined counts for common posts
const mergedCounts = uniquePosts.map((post) => {
  const totalCount = combinedCounts
    .filter((count) => count._id === post)
    .reduce((acc, count) => acc + count.teacherCount, 0);

  return { _id: post, teacherCount: totalCount };
});

const totoalStudent = await Student.countDocuments({ status: 'Studying' }).exec();
const totalSchool = await School.countDocuments().exec();
const totalGuestTeacher = await GuestTeacher.countDocuments().exec();
const totalRegularTeachers = await Teacher.countDocuments().exec();
 const totalTeachers = totalGuestTeacher + totalRegularTeachers;

const averageTeachers = totalTeachers / totalSchool;
const teacherStudentRatio = totoalStudent / totalTeachers;
    const result = {
      teacherStudentRatio,
      averageTeachers,
      totalSchool,
      totalTeachers,
      totalGuestTeacher,
      totalRegularTeachers,
      totalPostWiseTeachers: mergedCounts,
      totalTeacherManagmentWiseCounts,
      totalTeacherCategoryWiseCounts,
      totalTeacherShiftWiseCounts,
    };
  
    return result;
  };
  



/**
 * Get school IDs grouped by shift for a specific district.
 * @param {string} districtName - Name of the district.
 * @returns {Promise<Array>} - Array of objects containing shift-wise school IDs.
 */
const getSchoolIdByShiftDistrictWise = async (districtName) => {
  // MongoDB aggregation pipeline to group school IDs by shift
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$shift',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];

  // Execute the aggregation pipeline and return the result
  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

/**
 * Get school IDs grouped by management for a specific district.
 * @param {string} districtName - Name of the district.
 * @returns {Promise<Array>} - Array of objects containing management-wise school IDs.
 */
const getSchoolIdByManagmentDistrictWise = async (districtName) => {
  // MongoDB aggregation pipeline to group school IDs by management
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$SchManagement',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];

  // Execute the aggregation pipeline and return the result
  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

/**
 * Get school IDs grouped by school category for a specific district.
 * @param {string} districtName - Name of the district.
 * @returns {Promise<Array>} - Array of objects containing school category-wise school IDs.
 */
const getSchoolIdBySchCategoryDistrictWise = async (districtName) => {
  // MongoDB aggregation pipeline to group school IDs by school category
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$SchCategory',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];

  // Execute the aggregation pipeline and return the result
  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

/**
 * Get teacher statistics for a specific district.
 * @param {string} districtName - Name of the district.
 * @returns {Promise<Object>} - Object containing various teacher statistics for the district.
 */
const getTeacherStatsByDistrict = async (districtName) => {
  // Get school IDs grouped by school category for the district
  const schCategorySchoolIds = await getSchoolIdBySchCategoryDistrictWise(districtName);
  const totalTeacherCategoryWiseCounts = [];

  // Calculate total teacher counts for each school category in the district
  for (const category of schCategorySchoolIds) {
    const teacherCount = await Teacher.countDocuments({ schoolid: { $in: category.schoolIds } });
    const guestTeacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: category.schoolIds.map(String) } });

    const totalTeacherCount = teacherCount + guestTeacherCount;

    totalTeacherCategoryWiseCounts.push({
      SchCategory: category._id,
      totalTeacherCount,
    });
  }

  // Get school IDs grouped by shift for the district
  const shiftWiseSchoolid = await getSchoolIdByShiftDistrictWise(districtName);
  const totalTeacherShiftWiseCounts = [];

  // Calculate total teacher counts for each shift in the district
  for (const shift of shiftWiseSchoolid) {
    const teacherShiftWiseCount = await Teacher.countDocuments({ schoolid: { $in: shift.schoolIds } });
    const guestTeacherShiftWiseCount = await GuestTeacher.countDocuments({
      SchoolID: { $in: shift.schoolIds.map(String) },
    });

    // Calculate total count by adding regular and guest teacher counts
    const totalTeacherCount = teacherShiftWiseCount + guestTeacherShiftWiseCount;

    totalTeacherShiftWiseCounts.push({
      shift: shift._id,
      teacherShiftWiseCount,
      guestTeacherShiftWiseCount,
      totalTeacherCount,
    });
  }

  // Get school IDs grouped by management for the district
  const schManagmentSchoolIds = await getSchoolIdByManagmentDistrictWise(districtName);
  const totalTeacherManagmentWiseCounts = [];

  // Calculate total teacher counts for each management type in the district
  for (const SchManagement of schManagmentSchoolIds) {
    const teacherCount = await Teacher.countDocuments({ schoolid: { $in: SchManagement.schoolIds } });
    const guestTeacherCount = await GuestTeacher.countDocuments({
      SchoolID: { $in: SchManagement.schoolIds.map(String) },
    });

    const totalTeacherCount = teacherCount + guestTeacherCount;

    totalTeacherManagmentWiseCounts.push({
      SchCategory: SchManagement._id,
      totalTeacherCount,
    });
  }

  // MongoDB aggregation pipeline to group guest teachers by post description for the district
  const pipeline3 = [
    {
      $match: {
        districtname: districtName,
      },
    },
    {
      $group: {
        _id: '$postdesc',
        teacherCount: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  // MongoDB aggregation pipeline to group regular teachers by post description for the district
  const pipeline = [
    {
      $match: {
        Districtname: districtName,
      },
    },
    {
      $group: {
        _id: '$Post',
        teacherCount: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  // Execute the aggregation pipelines to get post-wise teacher counts for the district
  const postdescWiseGuestTeacherCounts = await GuestTeacher.aggregate(pipeline);
  const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline3);

  // Combine the post-wise counts for guest and regular teachers
  const combinedCounts = [...postdescWiseGuestTeacherCounts, ...postdescWiseTeacherCounts];

  // Get unique posts from the combined counts
  const uniquePosts = [...new Set(combinedCounts.map((count) => count._id))];

  // Create a new array with combined counts for common posts
  const mergedCounts = uniquePosts.map((post) => {
    const totalCount = combinedCounts
      .filter((count) => count._id === post)
      .reduce((acc, count) => acc + count.teacherCount, 0);

    return { _id: post, teacherCount: totalCount };
  });

  // Get total number of students studying in the district
  const totalStudent = await Student.countDocuments({ status: 'Studying', District: districtName }).exec();
  
  // Get the total number of schools in the district
  const totalSchool = await School.countDocuments({ District_name: districtName }).exec();

  // Get the total number of guest teachers in the district
  const totalGuestTeacher = await GuestTeacher.countDocuments({ Districtname: districtName }).exec();

  // Get the total number of regular teachers in the district
  const totalRegularTeachers = await Teacher.countDocuments({ districtname: districtName }).exec();

  // Calculate the total number of teachers in the district
  const totalTeachers = totalGuestTeacher + totalRegularTeachers;

  // Calculate the average number of teachers per school in the district
  const averageTeachers = totalTeachers / totalSchool;

  // Calculate the teacher-student ratio for the district
  const teacherStudentRatio = totalStudent / totalTeachers;

  // Construct the final result object
  const result = {
    teacherStudentRatio,
    averageTeachers,
    totalSchool,
    totalTeachers,
    totalGuestTeacher,
    totalRegularTeachers,
    totalPostWiseTeachers: mergedCounts,
    totalTeacherManagmentWiseCounts,
    totalTeacherCategoryWiseCounts,
    totalTeacherShiftWiseCounts,
  };

  return result;
};




























/**
 * Get school IDs grouped by shift for a specific district.
 * @param {string} districtName - Name of the district.
 * @returns {Promise<Array>} - Array of objects containing shift-wise school IDs.
 */
const getSchoolIdByShiftZoneWise = async (zoneName) => {
  // MongoDB aggregation pipeline to group school IDs by shift
  const pipeline = [
    {
      $match: {
        Zone_Name: zoneName,
      },
    },
    {
      $group: {
        _id: '$shift',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];

  // Execute the aggregation pipeline and return the result
  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

/**
 * Get school IDs grouped by management for a specific district.
 * @param {string} zoneName - Name of the district.
 * @returns {Promise<Array>} - Array of objects containing management-wise school IDs.
 */
const getSchoolIdByManagmentZoneWise = async (zoneName) => {
  // MongoDB aggregation pipeline to group school IDs by management
  const pipeline = [
    {
      $match: {
        Zone_Name: zoneName,
      },
    },
    {
      $group: {
        _id: '$SchManagement',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];

  // Execute the aggregation pipeline and return the result
  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

/**
 * Get school IDs grouped by school category for a specific district.
 * @param {string} districtName - Name of the district.
 * @returns {Promise<Array>} - Array of objects containing school category-wise school IDs.
 */
const getSchoolIdBySchCategoryZoneWise = async (zoneName) => {
  // MongoDB aggregation pipeline to group school IDs by school category
  const pipeline = [
    {
      $match: {
        Zone_Name: zoneName,
      },
    },
    {
      $group: {
        _id: '$SchCategory',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];

  // Execute the aggregation pipeline and return the result
  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

/**
 * Get teacher statistics for a specific district.
 * @param {string} zoneName - Name of the district.
 * @returns {Promise<Object>} - Object containing various teacher statistics for the district.
 */
const getTeacherStatsByZone = async (zoneName) => {
  // Get school IDs grouped by school category for the district
  const schCategorySchoolIds = await getSchoolIdBySchCategoryZoneWise(zoneName);
  const totalTeacherCategoryWiseCounts = [];

  // Calculate total teacher counts for each school category in the district
  for (const category of schCategorySchoolIds) {
    const teacherCount = await Teacher.countDocuments({ schoolid: { $in: category.schoolIds } });
    const guestTeacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: category.schoolIds.map(String) } });

    const totalTeacherCount = teacherCount + guestTeacherCount;

    totalTeacherCategoryWiseCounts.push({
      SchCategory: category._id,
      totalTeacherCount,
    });
  }

  // Get school IDs grouped by shift for the district
  const shiftWiseSchoolid = await getSchoolIdByShiftZoneWise(zoneName);
  const totalTeacherShiftWiseCounts = [];

  // Calculate total teacher counts for each shift in the district
  for (const shift of shiftWiseSchoolid) {
    const teacherShiftWiseCount = await Teacher.countDocuments({ schoolid: { $in: shift.schoolIds } });
    const guestTeacherShiftWiseCount = await GuestTeacher.countDocuments({
      SchoolID: { $in: shift.schoolIds.map(String) },
    });

    // Calculate total count by adding regular and guest teacher counts
    const totalTeacherCount = teacherShiftWiseCount + guestTeacherShiftWiseCount;

    totalTeacherShiftWiseCounts.push({
      shift: shift._id,
      teacherShiftWiseCount,
      guestTeacherShiftWiseCount,
      totalTeacherCount,
    });
  }

  // Get school IDs grouped by management for the district
  const schManagmentSchoolIds = await getSchoolIdByManagmentZoneWise(zoneName);
  const totalTeacherManagmentWiseCounts = [];

  // Calculate total teacher counts for each management type in the district
  for (const SchManagement of schManagmentSchoolIds) {
    const teacherCount = await Teacher.countDocuments({ schoolid: { $in: SchManagement.schoolIds } });
    const guestTeacherCount = await GuestTeacher.countDocuments({
      SchoolID: { $in: SchManagement.schoolIds.map(String) },
    });

    const totalTeacherCount = teacherCount + guestTeacherCount;

    totalTeacherManagmentWiseCounts.push({
      SchCategory: SchManagement._id,
      totalTeacherCount,
    });
  }
  const cleanedZoneName = zoneName.replace(/[^0-9]/g, '');
  // MongoDB aggregation pipeline to group guest teachers by post description for the district
  const pipeline3 = [
    {
      $match: {
        zonename: cleanedZoneName,
      },
    },
    {
      $group: {
        _id: '$postdesc',
        teacherCount: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  // MongoDB aggregation pipeline to group regular teachers by post description for the district
  const pipeline = [
    {
      $match: {
        Zonename: cleanedZoneName,
      },
    },
    {
      $group: {
        _id: '$Post',
        teacherCount: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  // Execute the aggregation pipelines to get post-wise teacher counts for the district
  const postdescWiseGuestTeacherCounts = await GuestTeacher.aggregate(pipeline);
  const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline3);

  // Combine the post-wise counts for guest and regular teachers
  const combinedCounts = [...postdescWiseGuestTeacherCounts, ...postdescWiseTeacherCounts];

  // Get unique posts from the combined counts
  const uniquePosts = [...new Set(combinedCounts.map((count) => count._id))];

  // Create a new array with combined counts for common posts
  const mergedCounts = uniquePosts.map((post) => {
    const totalCount = combinedCounts
      .filter((count) => count._id === post)
      .reduce((acc, count) => acc + count.teacherCount, 0);

    return { _id: post, teacherCount: totalCount };
  });

  // Get total number of students studying in the district
  const totalStudent = await Student.countDocuments({ status: 'Studying', z_name: zoneName.toLowerCase() }).exec();
  
  // Get the total number of schools in the district
  const totalSchool = await School.countDocuments({ Zone_Name: zoneName, }).exec();

  // Get the total number of guest teachers in the district
  const totalGuestTeacher = await GuestTeacher.countDocuments({ Zonename: cleanedZoneName, }).exec();

  // Get the total number of regular teachers in the district
  const totalRegularTeachers = await Teacher.countDocuments({ zonename: cleanedZoneName, }).exec();

  // Calculate the total number of teachers in the district
  const totalTeachers = totalGuestTeacher + totalRegularTeachers;

  // Calculate the average number of teachers per school in the district
  const averageTeachers = totalTeachers / totalSchool;

  // Calculate the teacher-student ratio for the district
  const teacherStudentRatio = totalStudent / totalTeachers;

  // Construct the final result object
  const result = {
    teacherStudentRatio,
    averageTeachers,
    totalSchool,
    totalTeachers,
    totalGuestTeacher,
    totalRegularTeachers,
    totalPostWiseTeachers: mergedCounts,
    totalTeacherManagmentWiseCounts,
    totalTeacherCategoryWiseCounts,
    totalTeacherShiftWiseCounts,
  };

  return result;
};





/**
 * Get school IDs grouped by shift for a specific school.
 * @param {string} schoolId - ID of the school.
 * @returns {Promise<Array>} - Array of objects containing shift-wise school IDs.
 */
const getSchoolIdByShiftSchoolWise = async (schoolId) => {
  // MongoDB aggregation pipeline to group school IDs by shift
  const pipeline = [
    {
      $match: {
        Schoolid: Number(schoolId), // Add this condition to filter by schoolId
      },
    },
    {
      $group: {
        _id: '$shift',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];

  // Execute the aggregation pipeline and return the result
  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

/**
 * Get school IDs grouped by management for a specific school.
 * @param {string} schoolId - ID of the school.
 * @returns {Promise<Array>} - Array of objects containing management-wise school IDs.
 */
const getSchoolIdByManagmentSchoolWise = async (schoolId) => {
  // MongoDB aggregation pipeline to group school IDs by management
  const pipeline = [
    {
      $match: {
        Schoolid: Number(schoolId), // Add this condition to filter by schoolId
      },
    },
    {
      $group: {
        _id: '$SchManagement',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];

  // Execute the aggregation pipeline and return the result
  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

/**
 * Get school IDs grouped by school category for a specific school.
 * @param {string} schoolId - ID of the school.
 * @returns {Promise<Array>} - Array of objects containing school category-wise school IDs.
 */
const getSchoolIdBySchCategorySchoolWise = async (schoolId) => {
  // MongoDB aggregation pipeline to group school IDs by school category
  const pipeline = [
    {
      $match: {
        Schoolid: Number(schoolId), // Add this condition to filter by schoolId
      },
    },
    {
      $group: {
        _id: '$SchCategory',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];

  // Execute the aggregation pipeline and return the result
  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

/**
 * Get teacher statistics for a specific school.
 * @param {string} schoolId - ID of the school.
 * @returns {Promise<Object>} - Object containing various teacher statistics for the school.
 */
const getTeacherStatsBySchool = async (schoolId) => {
  // Get school IDs grouped by school category for the district
  const schCategorySchoolIds = await getSchoolIdBySchCategorySchoolWise(schoolId);
  const totalTeacherCategoryWiseCounts = [];

  // Calculate total teacher counts for each school category in the district
  for (const category of schCategorySchoolIds) {
    const teacherCount = await Teacher.countDocuments({ schoolid: { $in: category.schoolIds } });
    const guestTeacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: category.schoolIds.map(String) } });

    const totalTeacherCount = teacherCount + guestTeacherCount;

    totalTeacherCategoryWiseCounts.push({
      SchCategory: category._id,
      totalTeacherCount,
    });
  }

  // Get school IDs grouped by shift for the district
  const shiftWiseSchoolid = await getSchoolIdByShiftSchoolWise(schoolId);
  const totalTeacherShiftWiseCounts = [];

  // Calculate total teacher counts for each shift in the district
  for (const shift of shiftWiseSchoolid) {
    const teacherShiftWiseCount = await Teacher.countDocuments({ schoolid: { $in: shift.schoolIds } });
    const guestTeacherShiftWiseCount = await GuestTeacher.countDocuments({
      SchoolID: { $in: shift.schoolIds.map(String) },
    });

    // Calculate total count by adding regular and guest teacher counts
    const totalTeacherCount = teacherShiftWiseCount + guestTeacherShiftWiseCount;

    totalTeacherShiftWiseCounts.push({
      shift: shift._id,
      teacherShiftWiseCount,
      guestTeacherShiftWiseCount,
      totalTeacherCount,
    });
  }

  // Get school IDs grouped by management for the district
  const schManagmentSchoolIds = await getSchoolIdByManagmentSchoolWise(schoolId);
  const totalTeacherManagmentWiseCounts = [];

  // Calculate total teacher counts for each management type in the district
  for (const SchManagement of schManagmentSchoolIds) {
    const teacherCount = await Teacher.countDocuments({ schoolid: { $in: SchManagement.schoolIds } });
    const guestTeacherCount = await GuestTeacher.countDocuments({
      SchoolID: { $in: SchManagement.schoolIds.map(String) },
    });

    const totalTeacherCount = teacherCount + guestTeacherCount;

    totalTeacherManagmentWiseCounts.push({
      SchCategory: SchManagement._id,
      totalTeacherCount,
    });
  }
  // MongoDB aggregation pipeline to group guest teachers by post description for the school
  const pipeline3 = [
    {
      $match: {
        schoolid: schoolId, // Add this condition to filter by schoolId
      },
    },
    {
      $group: {
        _id: '$postdesc',
        teacherCount: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  // MongoDB aggregation pipeline to group regular teachers by post description for the school
  const pipeline = [
    {
      $match: {
        SchoolID: schoolId, // Add this condition to filter by schoolId
      },
    },
    {
      $group: {
        _id: '$Post',
        teacherCount: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  // Execute the aggregation pipelines to get post-wise teacher counts for the school
  const postdescWiseGuestTeacherCounts = await GuestTeacher.aggregate(pipeline);
  const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline3);

  // Combine the post-wise counts for guest and regular teachers
  const combinedCounts = [...postdescWiseGuestTeacherCounts, ...postdescWiseTeacherCounts];

  // Get unique posts from the combined counts
  const uniquePosts = [...new Set(combinedCounts.map((count) => count._id))];

  // Create a new array with combined counts for common posts
  const mergedCounts = uniquePosts.map((post) => {
    const totalCount = combinedCounts
      .filter((count) => count._id === post)
      .reduce((acc, count) => acc + count.teacherCount, 0);

    return { _id: post, teacherCount: totalCount };
  });

  // Get total number of students studying in the school
  const totalStudent = await Student.countDocuments({ status: 'Studying', Schoolid: Number(schoolId) }).exec();

  // Get the total number of schools (in this case, it's just 1 since we are filtering by schoolId)
  const totalSchool = 1;

  // Get the total number of guest teachers in the school
  const totalGuestTeacher = await GuestTeacher.countDocuments({ SchoolID: schoolId }).exec();

  // Get the total number of regular teachers in the school
  const totalRegularTeachers = await Teacher.countDocuments({ schoolid: schoolId }).exec();

  // Calculate the total number of teachers in the school
  const totalTeachers = totalGuestTeacher + totalRegularTeachers;

  // Calculate the average number of teachers per school (in this case, it's just 1 since we are filtering by schoolId)
  const averageTeachers = totalTeachers / totalSchool;

  // Calculate the teacher-student ratio for the school
  const teacherStudentRatio = totalStudent / totalTeachers;

  // Construct the final result object
  const result = {
      teacherStudentRatio,
      averageTeachers,
      totalSchool,
      totalTeachers,
      totalGuestTeacher,
      totalRegularTeachers,
      totalPostWiseTeachers: mergedCounts,
      totalTeacherManagmentWiseCounts,
      totalTeacherCategoryWiseCounts,
      totalTeacherShiftWiseCounts,
  };

  return result;
};

// const schoolId = '1001004';


// (async () => {
//     try {
//       const teacherCounts = await  getTeacherStatsBySchool(schoolId);
//     //   const guestTeacherCounts = await getGuestTeacherStats();
//     //   const combinedCounts = {
//     //     ...teacherCounts,
//     //     ...guestTeacherCounts,
//     //   };
//       console.log('Total Teacher Counts:', teacherCounts);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   })();


module.exports = {
     getTeacherStats,
     getTeacherStatsByDistrict,
     getTeacherStatsByZone,
     getTeacherStatsBySchool
}