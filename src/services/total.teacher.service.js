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

const getSchoolIdByTypeOfSchoolWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$gender',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];
  const typeOfSchoolWiseSchoolIds = await School.aggregate(pipeline);
  return typeOfSchoolWiseSchoolIds;
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

  const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWise();
  const teacherTypeOfSchoolWiseCounts = [];

  for (const typeOfSchool of typeOfSchoolWiseCountIds) {
    const teacherCount = await Teacher.countDocuments({ schoolid: { $in: typeOfSchool.schoolIds } });
    const guestTeacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: typeOfSchool.schoolIds.map(String) } });
    const totalTeacherCount = teacherCount + guestTeacherCount;
    teacherTypeOfSchoolWiseCounts.push({
      typeOfSchool: typeOfSchool._id,
      totalTeacherCount,
    });
  }

  const categoryMapping = {
    PRINCIPAL: ['PRINCIPAL'],
    'VICE PRINCIPAL': ['VICE PRINCIPAL'],
    EVGC: ['EVGC'],
    'PGT – Lecturer all except lecturer, computer science and PGT special education teacher': [
      'LECTURER BIOLOGY',
      'LECTURER CHEMISTRY',
      'LECTURER COMMERCE',
      'LECTURER ECONOMICS',
      'LECTURER ENGG. DRAWING',
      'LECTURER ENGLISH',
      'LECTURER FINEART(PAINTING)',
      'LECTURER GEOGRAPHY',
      'LECTURER HINDI',
      'LECTURER HISTORY',
      'LECTURER HOME SCIENCE',
      'LECTURER MATH',
      'LECTURER MUSIC',
      'LECTURER PHYSICAL EDUCATION',
      'LECTURER PHYSICS',
      'LECTURER POLITICAL SCIENCE',
      'LECTURER PUNJABI',
      'LECTURER SANSKRIT',
      'LECTURER SOCIOLOGY',
      'LECTURER URDU',
      'LECTURER AGRICULTURE',
      'LECTURER PSYCHOLOGY',
      'PGT (Hindi, Sanskrit, Home Science, PET, DRG for GLNSSSD, Delhi Gate)',
      'PGT for GSSSBB, Kingsway Camp',
    ],
    'TGT/TGT(MIL)': [
      'TGT ENGLISH',
      'TGT MATH',
      'TGT SOCIAL SCIENCE',
      'TGT NATURAL SCIENCE',
      'TGT HINDI',
      'TGT SANSKRIT',
      'TGT URDU',
      'TGT PUNJABI',
      'TGT BENGALI',
    ],
    'TGT(Miscellaneous Category)': ['PET', 'DRAWING TEACHER', 'MUSIC TEACHER', 'DOMESTIC SCIENCE TEACHER'],
    'PGT(Special Education)': ['PGT SPECIAL EDUCATION TEACHER'],
    'TGT(Special Education)': ['TGT SPECIAL EDUCATION TEACHER'],
    'PGT (Computer Science)': ['LECTURER COMPUTER SCIENCE'],
    'TGT (Computer Science)': ['TGT COMPUTER SCIENCE'],
    'Assistant Teacher': ['ASSISTANT TEACHER (PRIMARY)', 'ASSISTANT TEACHER (NURSERY)', 'Asst. Teacher for Deaf'],
    'Librarian/Lab Assistant': ['LIBRARIAN', 'LAB ASSISTANT'],
  };

  const pipeline = [
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

  const pipeline2 = [
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
  const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline);
  const postdescWiseGuestTeacherCounts = await GuestTeacher.aggregate(pipeline2);
  const aggregateCounts = (data, mapping) => {
    const result = {};

    data.forEach(({ _id, teacherCount }) => {
      for (const [category, posts] of Object.entries(mapping)) {
        if (posts.includes(_id)) {
          if (!result[category]) {
            result[category] = 0;
          }
          result[category] += teacherCount;
          break;
        }
      }
    });

    return Object.entries(result).map(([category, count]) => ({
      _id: category,
      teacherCount: count,
    }));
  };

  const totalPostWiseTeachers = aggregateCounts(postdescWiseTeacherCounts, categoryMapping);
  const totalPostWiseGuestTeachers = aggregateCounts(postdescWiseGuestTeacherCounts, categoryMapping);

  const combinedCounts = [...totalPostWiseGuestTeachers, ...totalPostWiseTeachers];

  const uniquePosts = [...new Set(combinedCounts.map((count) => count._id))];

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
    teacherTypeOfSchoolWiseCounts,
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
const getSchoolIdByTypeOfSchoolWiseAndDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$gender',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];
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
  const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWiseAndDistrict(districtName);
  const teacherTypeOfSchoolWiseCounts = [];

  for (const typeOfSchool of typeOfSchoolWiseCountIds) {
    const teacherCount = await Teacher.countDocuments({ schoolid: { $in: typeOfSchool.schoolIds } });
    const guestTeacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: typeOfSchool.schoolIds.map(String) } });
    const totalTeacherCount = teacherCount + guestTeacherCount;
    teacherTypeOfSchoolWiseCounts.push({
      typeOfSchool: typeOfSchool._id,
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
    teacherTypeOfSchoolWiseCounts,
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

const getSchoolIdByTypeOfSchoolWiseAndZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$gender',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];

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

  const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWiseAndZone(zoneName);
  const teacherTypeOfSchoolWiseCounts = [];

  for (const typeOfSchool of typeOfSchoolWiseCountIds) {
    const teacherCount = await Teacher.countDocuments({ schoolid: { $in: typeOfSchool.schoolIds } });
    const guestTeacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: typeOfSchool.schoolIds.map(String) } });
    const totalTeacherCount = teacherCount + guestTeacherCount;
    teacherTypeOfSchoolWiseCounts.push({
      typeOfSchool: typeOfSchool._id,
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
  const totalSchool = await School.countDocuments({ Zone_Name: zoneName }).exec();

  // Get the total number of guest teachers in the district
  const totalGuestTeacher = await GuestTeacher.countDocuments({ Zonename: cleanedZoneName }).exec();

  // Get the total number of regular teachers in the district
  const totalRegularTeachers = await Teacher.countDocuments({ zonename: cleanedZoneName }).exec();

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
    teacherTypeOfSchoolWiseCounts,
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
const getSchoolIdByTypeOfSchoolWiseAndSchoolName = async (schoolId) => {
  const pipeline = [
    {
      $match: {
        Schoolid: Number(schoolId),
      },
    },
    {
      $group: {
        _id: '$gender',
        schoolIds: { $push: '$Schoolid' },
      },
    },
  ];

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
  const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWiseAndSchoolName(schoolId);
  const teacherTypeOfSchoolWiseCounts = [];

  for (const typeOfSchool of typeOfSchoolWiseCountIds) {
    const teacherCount = await Teacher.countDocuments({ schoolid: { $in: typeOfSchool.schoolIds } });
    const guestTeacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: typeOfSchool.schoolIds.map(String) } });
    const totalTeacherCount = teacherCount + guestTeacherCount;
    teacherTypeOfSchoolWiseCounts.push({
      typeOfSchool: typeOfSchool._id,
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
    teacherTypeOfSchoolWiseCounts,
    totalTeacherCategoryWiseCounts,
    totalTeacherShiftWiseCounts,
  };

  return result;
};

// Function to get teachers and guest teachers by schoolid
// const getTeachersAndGuestTeachersBySchoolId = async (schoolId) => {
//   try {
//     const result = await Teacher.aggregate([
//       {
//         $match: {
//           schoolid: schoolId,
//         },
//       },
//       {
//         $lookup: {
//           from: 'guestteachers',
//           localField: 'schoolid',
//           foreignField: 'SchoolID',
//           as: 'guestTeachers',
//         },
//       },
//       {
//         $project: {
//           _id: 0, // Exclude _id field
//           Name: 1,
//           EmpId: '$empid', // Rename empid to EmpId
//           JoiningDate: 1,
//           School: '$schname', // Rename schname to School
//           Designation: '$postdesc', // Rename postdesc to Designation
//           Dob: 1,
//           District: '$districtname', // Rename districtname to District
//         },
//       },
//     ]);

//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

// const getTeachersAndGuestTeachersBySchoolId = async (schoolId) => {
//   try {
//     const result = await Teacher.aggregate([
//       {
//         $match: {
//           schoolid: schoolId,
//         },
//       },
//       {
//         $lookup: {
//           from: 'guestteachers',
//           localField: 'schoolid',
//           foreignField: 'SchoolID',
//           as: 'guestTeachers',
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           Name: 1,
//           EmpId: { $ifNull: ['$empid', '$ApplicationId'] },
//           JoiningDate: { $ifNull: ['$JoiningDate', '$JoiningDate'] },
//           School: { $ifNull: ['$schname', '$SchoolName'] },
//           Designation: { $ifNull: ['$postdesc', '$Post'] },
//           Dob: { $ifNull: ['$dob', null] },
//           District: { $ifNull: ['$districtname', '$Districtname'] },
//           // UserType: { $literal: 'Regular Teacher' },
//         },
//       },
//       {
//         $addFields: {
//           combinedTeachers: { $mergeObjects: [ { teachers: '$$ROOT' }, { guestTeachers: '$guestTeachers' } ] },
//         },
//       },
//       {
//         $unwind: '$combinedTeachers',
//       },
//       {
//         $replaceRoot: { newRoot: '$combinedTeachers' },
//       },
//     ]);
// console.log(result.length)
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

/**
 * Search for teachers based on schname, Name, or schoolid
 * @param {Object} filters - Filters for the search
 * @returns {Promise<Array>} - Array of matching teachers
 */

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const searchTeachers = async (searchQuery) => {
  const escapedQuery = escapeRegExp(searchQuery);

  const teacherQuery = {
    $or: [{ Name: new RegExp(`^${escapedQuery}`, 'i') }, { empid: searchQuery }],
  };

  const guestTeacherQuery = {
    $or: [{ Name: new RegExp(`^${escapedQuery}`, 'i') }, { ApplicationId: searchQuery }],
  };

  const [teachers, guestTeachers] = await Promise.all([
    Teacher.find(teacherQuery).lean().exec(),
    GuestTeacher.find(guestTeacherQuery).lean().exec(),
  ]);

  const combinedResults = [...teachers, ...guestTeachers];

  return combinedResults;
};

const getTeachersAndGuestTeachersBySchoolId = async (schoolId) => {
  const teachersRegular = await Teacher.aggregate([
    { $match: { schoolid: schoolId } },
    {
      $project: {
        Name: '$Name',
        EmpId: '$empid',
        JoiningDate: '$JoiningDate',
        School: '$schname',
        Designation: '$postdesc',
        SchoolID: '$schoolid',
        District: '$districtname',
        UserType: 'Regular Teacher',
      },
    },
  ]);

  const teachersGuest = await GuestTeacher.aggregate([
    { $match: { SchoolID: schoolId } },
    {
      $project: {
        Name: '$Name',
        EmpId: '$ApplicationId',
        JoiningDate: '$JoiningDate',
        School: '$SchoolName',
        Designation: '$Post',
        SchoolID: '$SchoolID', // You can set this to a default value or modify based on your data
        District: '$Districtname',
        UserType: 'Guest Teacher',
      },
    },
  ]);

  const result = [...teachersRegular, ...teachersGuest];

  return result;
};

module.exports = {
  getTeacherStats,
  getTeacherStatsByDistrict,
  getTeacherStatsByZone,
  getTeacherStatsBySchool,
  searchTeachers,
  getTeachersAndGuestTeachersBySchoolId,
};
