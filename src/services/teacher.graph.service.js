const { School, Student, Teacher } = require('../models');
const redis = require('../utils/redis');

const getSchoolIdByShiftWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$shift', // Group by SchCategory
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
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
        _id: '$SchManagement', // Group by SchCategory
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
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
        _id: '$SchCategory', // Group by SchCategory
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];

  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

const getTeacherStats = async () => {
  const schCategorySchoolIds = await getSchoolIdBySchCategoryWise();
  const teacherCounts = [];

  for (const category of schCategorySchoolIds) {
    const teacherCount = await Teacher.countDocuments({ schoolid: { $in: category.schoolIds } });
    teacherCounts.push({
      SchCategory: category._id,
      teacherCount,
    });
  }
  const shiftWiseSchoolid = await getSchoolIdByShiftWise();
  const teacherShiftWiseCounts = [];
  for (const shift of shiftWiseSchoolid) {
    const teacherShiftWiseCount = await Teacher.countDocuments({ schoolid: { $in: shift.schoolIds } });
    teacherShiftWiseCounts.push({
      shift: shift._id,
      teacherShiftWiseCount,
    });
  }

  const managmentWiseCountId = await getSchoolIdByManagmentWise();
  const teacherManagmentWiseCounts = [];
  for (const managment of managmentWiseCountId) {
    const teacherManagmentWiseCount = await Teacher.countDocuments({ schoolid: { $in: managment.schoolIds } });
    teacherManagmentWiseCounts.push({
      shift: managment._id,
      teacherManagmentWiseCount,
    });
  }
  const pipeline3 = [
    // Group teachers by post description and count
    {
      $group: {
        _id: '$postdesc',
        teacherCount: { $sum: 1 },
      },
    },
    // Sort the result if needed
    {
      $sort: { _id: 1 },
    },
  ];

  const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline3);

  return {
    teacherCounts,
    teacherShiftWiseCounts,
    postdescWiseTeacherCounts,
    teacherManagmentWiseCounts,
  };
};

const getTeacherCountBySchoolManagement = async () => {
  // Check if the data is already cached in Redis
  const cachedData = await redis.get('getTeacherData');

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const teacherStats = await getTeacherStats();

  // Cache the result in Redis for future use
  await redis.set('getTeacherData', JSON.stringify(teacherStats), 'EX', 24 * 60 * 60);

  return teacherStats;
};

module.exports = {
  getTeacherCountBySchoolManagement,
};
