const { School, Teacher } = require('../models');
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


/**
 * Get teacher graph  by school managments
 * @returns {Promise<Object>} School statistics
 */
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


const getSchoolIdByShiftWiseAndDistrict = async (districtName) => {
    const pipeline = [
      {
        $match: {
          District_name: districtName,
        },
      },
      {
        $group: {
          _id: '$shift', // Group by shift
          schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
        },
      },
    ];
  
    const schCategorySchoolIds = await School.aggregate(pipeline);
    return schCategorySchoolIds;
  };
  
  const getSchoolIdByManagmentWiseAndDistrict = async (districtName) => {
    const pipeline = [
      {
        $match: {
          District_name: districtName,
        },
      },
      {
        $group: {
          _id: '$SchManagement', // Group by SchManagement
          schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
        },
      },
    ];
  
    const schCategorySchoolIds = await School.aggregate(pipeline);
    return schCategorySchoolIds;
  };
  
  const getSchoolIdBySchCategoryWiseAndDistrict = async (districtName) => {
    const pipeline = [
      {
        $match: {
          District_name: districtName,
        },
      },
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


  /**
 * Get teacher graph distrinct wise by school managments
 * @returns {Promise<Object>} School statistics
 */
  
  const getTeacherStatsByDistrict = async (districtName) => {
    const schCategorySchoolIds = await getSchoolIdBySchCategoryWiseAndDistrict(districtName);
    const teacherCounts = [];
  
    for (const category of schCategorySchoolIds) {
      const teacherCount = await Teacher.countDocuments({ schoolid: { $in: category.schoolIds } });
      teacherCounts.push({
        SchCategory: category._id,
        teacherCount,
      });
    }
    const shiftWiseSchoolid = await getSchoolIdByShiftWiseAndDistrict(districtName);
    const teacherShiftWiseCounts = [];
    for (const shift of shiftWiseSchoolid) {
      const teacherShiftWiseCount = await Teacher.countDocuments({ schoolid: { $in: shift.schoolIds } });
      teacherShiftWiseCounts.push({
        shift: shift._id,
        teacherShiftWiseCount,
      });
    }
  
    const managmentWiseCountId = await getSchoolIdByManagmentWiseAndDistrict(districtName);
    const teacherManagmentWiseCounts = [];
    for (const managment of managmentWiseCountId) {
      const teacherManagmentWiseCount = await Teacher.countDocuments({ schoolid: { $in: managment.schoolIds } });
      teacherManagmentWiseCounts.push({
        shift: managment._id,
        teacherManagmentWiseCount,
      });
    }
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
  
    const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline3);
  
    return {
      teacherCounts,
      teacherShiftWiseCounts,
      postdescWiseTeacherCounts,
      teacherManagmentWiseCounts,
    };
  };
  

  //////////////////////////////////////////////////////////////////////////
  const getSchoolIdByShiftWiseAndZone = async (zone) => {
    const pipeline = [
      {
        $match: {
            Zone_Name: zone,
        },
      },
      {
        $group: {
          _id: '$shift', // Group by shift
          schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
        },
      },
    ];
  
    const schCategorySchoolIds = await School.aggregate(pipeline);
    return schCategorySchoolIds;
  };
  
  const getSchoolIdByManagmentWiseAndZone = async (zone) => {
    const pipeline = [
      {
        $match: {
            Zone_Name: zone,
        },
      },
      {
        $group: {
          _id: '$SchManagement', // Group by SchManagement
          schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
        },
      },
    ];
  
    const schCategorySchoolIds = await School.aggregate(pipeline);
    return schCategorySchoolIds;
  };
  
  const getSchoolIdBySchCategoryWiseAndZone = async (zone) => {
    const pipeline = [
      {
        $match: {
            Zone_Name: zone,
        },
      },
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


  /**
 * Get teacher graph distrinct wise by school managments
 * @returns {Promise<Object>} School statistics
 */
  
  const getTeacherCountByZone = async (zone) => {
    const schCategorySchoolIds = await getSchoolIdBySchCategoryWiseAndZone(zone);
    const teacherCounts = [];
  
    for (const category of schCategorySchoolIds) {
      const teacherCount = await Teacher.countDocuments({ schoolid: { $in: category.schoolIds } });
      teacherCounts.push({
        SchCategory: category._id,
        teacherCount,
      });
    }
    const shiftWiseSchoolid = await getSchoolIdByShiftWiseAndZone(zone);
    const teacherShiftWiseCounts = [];
    for (const shift of shiftWiseSchoolid) {
      const teacherShiftWiseCount = await Teacher.countDocuments({ schoolid: { $in: shift.schoolIds } });
      teacherShiftWiseCounts.push({
        shift: shift._id,
        teacherShiftWiseCount,
      });
    }
  
    const managmentWiseCountId = await getSchoolIdByManagmentWiseAndZone(zone);
    const teacherManagmentWiseCounts = [];
    for (const managment of managmentWiseCountId) {
      const teacherManagmentWiseCount = await Teacher.countDocuments({ schoolid: { $in: managment.schoolIds } });
      teacherManagmentWiseCounts.push({
        shift: managment._id,
        teacherManagmentWiseCount,
      });
    }
    const cleanedZoneName = zone.replace(/[^0-9]/g, '');
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
  
    const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline3);

    return {
      teacherCounts,
      teacherShiftWiseCounts,
      postdescWiseTeacherCounts,
      teacherManagmentWiseCounts,
    };
  };

  

module.exports = {
  getTeacherCountBySchoolManagement,
  getTeacherStatsByDistrict,
  getTeacherCountByZone,
};
