const { School, Teacher } = require('../models');
const redis = require('../utils/redis');

///  Get all teacher statistics ////
// Function to calculate teacher experience based on JoiningDate and get counts by experience range
const getTeacherExperienceCountByRange = async () => {
  try {
    const currentDate = new Date(); // Current date
    const teachers = await Teacher.find({});

    // Initialize an object to store the count in each experience range
    const experienceCounts = {
      under5Years: 0,
      fiveTo10Years: 0,
      tenTo15Years: 0,
      fifteenTo20Years: 0,
      twentyTo25Years: 0,
      over25Years: 0,
    };

    teachers.forEach((teacher) => {
      const joiningDate = new Date(teacher.JoiningDate); // Parse the JoiningDate string to a Date object
      const experienceInMilliseconds = currentDate - joiningDate;
      const yearsOfExperience = experienceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

      if (yearsOfExperience < 5) {
        experienceCounts.under5Years += 1;
      } else if (yearsOfExperience >= 5 && yearsOfExperience < 10) {
        experienceCounts.fiveTo10Years += 1;
      } else if (yearsOfExperience >= 10 && yearsOfExperience < 15) {
        experienceCounts.tenTo15Years += 1;
      } else if (yearsOfExperience >= 15 && yearsOfExperience < 20) {
        experienceCounts.fifteenTo20Years += 1;
      } else if (yearsOfExperience >= 20 && yearsOfExperience < 25) {
        experienceCounts.twentyTo25Years += 1;
      } else {
        experienceCounts.over25Years += 1;
      }
    });

    return experienceCounts;
  } catch (error) {
    throw error;
  }
};

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
  const experianceOfTeachers = await getTeacherExperienceCountByRange();
  return {
    teacherCounts,
    teacherShiftWiseCounts,
    postdescWiseTeacherCounts,
    teacherManagmentWiseCounts,
    experianceOfTeachers,
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

/// ///////////////////////////////////Get all teacher statistics by District ////////////////////////////////////////////////

// Function to calculate teacher experience based on JoiningDate and get counts by experience range
const getTeacherExperienceCountByRangeDistrictWise = async (districtname) => {
  try {
    const currentDate = new Date(); // Current date
    const teachers = await Teacher.find({ districtname });

    // Initialize an object to store the count in each experience range
    const experienceCounts = {
      under5Years: 0,
      fiveTo10Years: 0,
      tenTo15Years: 0,
      fifteenTo20Years: 0,
      twentyTo25Years: 0,
      over25Years: 0,
    };

    teachers.forEach((teacher) => {
      const joiningDate = new Date(teacher.JoiningDate); // Parse the JoiningDate string to a Date object
      const experienceInMilliseconds = currentDate - joiningDate;
      const yearsOfExperience = experienceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

      if (yearsOfExperience < 5) {
        experienceCounts.under5Years += 1;
      } else if (yearsOfExperience >= 5 && yearsOfExperience < 10) {
        experienceCounts.fiveTo10Years += 1;
      } else if (yearsOfExperience >= 10 && yearsOfExperience < 15) {
        experienceCounts.tenTo15Years += 1;
      } else if (yearsOfExperience >= 15 && yearsOfExperience < 20) {
        experienceCounts.fifteenTo20Years += 1;
      } else if (yearsOfExperience >= 20 && yearsOfExperience < 25) {
        experienceCounts.twentyTo25Years += 1;
      } else {
        experienceCounts.over25Years += 1;
      }
    });

    return experienceCounts;
  } catch (error) {
    throw error;
  }
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
  const experianceOfTeachers = await getTeacherExperienceCountByRangeDistrictWise(districtName);
  return {
    teacherCounts,
    teacherShiftWiseCounts,
    postdescWiseTeacherCounts,
    teacherManagmentWiseCounts,
    experianceOfTeachers,
  };
};

/// ////////////////////////////Get all teacher statistics by Zone ///////////////////////////////////////////

// Function to calculate teacher experience based on JoiningDate and get counts by experience range
const getTeacherExperienceCountByRangeZoneWise = async (zonename) => {
  try {
    const currentDate = new Date(); // Current date
    const teachers = await Teacher.find({ zonename });

    // Initialize an object to store the count in each experience range
    const experienceCounts = {
      under5Years: 0,
      fiveTo10Years: 0,
      tenTo15Years: 0,
      fifteenTo20Years: 0,
      twentyTo25Years: 0,
      over25Years: 0,
    };

    teachers.forEach((teacher) => {
      const joiningDate = new Date(teacher.JoiningDate); // Parse the JoiningDate string to a Date object
      const experienceInMilliseconds = currentDate - joiningDate;
      const yearsOfExperience = experienceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

      if (yearsOfExperience < 5) {
        experienceCounts.under5Years += 1;
      } else if (yearsOfExperience >= 5 && yearsOfExperience < 10) {
        experienceCounts.fiveTo10Years += 1;
      } else if (yearsOfExperience >= 10 && yearsOfExperience < 15) {
        experienceCounts.tenTo15Years += 1;
      } else if (yearsOfExperience >= 15 && yearsOfExperience < 20) {
        experienceCounts.fifteenTo20Years += 1;
      } else if (yearsOfExperience >= 20 && yearsOfExperience < 25) {
        experienceCounts.twentyTo25Years += 1;
      } else {
        experienceCounts.over25Years += 1;
      }
    });

    return experienceCounts;
  } catch (error) {
    throw error;
  }
};

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
  const experianceOfTeachers = await getTeacherExperienceCountByRangeZoneWise(cleanedZoneName);
  return {
    teacherCounts,
    teacherShiftWiseCounts,
    postdescWiseTeacherCounts,
    teacherManagmentWiseCounts,
    experianceOfTeachers,
  };
};

/// ////////////////////////////Get all teacher statistics by School ///////////////////////////////////////////

// Function to calculate teacher experience based on JoiningDate and get counts by experience range
const getTeacherExperienceCountByRangeSchool = async (schname) => {
  try {
    const currentDate = new Date(); // Current date
    const teachers = await Teacher.find({ schname });

    // Initialize an object to store the count in each experience range
    const experienceCounts = {
      under5Years: 0,
      fiveTo10Years: 0,
      tenTo15Years: 0,
      fifteenTo20Years: 0,
      twentyTo25Years: 0,
      over25Years: 0,
    };

    teachers.forEach((teacher) => {
      const joiningDate = new Date(teacher.JoiningDate); // Parse the JoiningDate string to a Date object
      const experienceInMilliseconds = currentDate - joiningDate;
      const yearsOfExperience = experienceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

      if (yearsOfExperience < 5) {
        experienceCounts.under5Years += 1;
      } else if (yearsOfExperience >= 5 && yearsOfExperience < 10) {
        experienceCounts.fiveTo10Years += 1;
      } else if (yearsOfExperience >= 10 && yearsOfExperience < 15) {
        experienceCounts.tenTo15Years += 1;
      } else if (yearsOfExperience >= 15 && yearsOfExperience < 20) {
        experienceCounts.fifteenTo20Years += 1;
      } else if (yearsOfExperience >= 20 && yearsOfExperience < 25) {
        experienceCounts.twentyTo25Years += 1;
      } else {
        experienceCounts.over25Years += 1;
      }
    });

    return experienceCounts;
  } catch (error) {
    throw error;
  }
};

const getSchoolAndTeacherInfo = async (schname) => {
  try {
    // Find the school by Schoolid
    const school = await School.findOne({ School_Name: schname });

    if (!school) {
      throw new Error('School not found');
    }

    // Get school shift, management, and category
    const schoolInfo = {
      School_Name: school.School_Name,
      shift: school.shift,
      SchManagement: school.SchManagement,
      SchCategory: school.SchCategory,
    };

    // Find teachers in the same school
    const teachers = await Teacher.find({ schname });

    // Get teacher counts by post description
    const teacherCountsDesignation = {};
    teachers.forEach((teacher) => {
      const { postdesc } = teacher;
      if (teacherCountsDesignation[postdesc]) {
        teacherCountsDesignation[postdesc]++;
      } else {
        teacherCountsDesignation[postdesc] = 1;
      }
    });
    const experianceOfTeachers = await getTeacherExperienceCountByRangeSchool(schname);
    return {
      schoolInfo,
      teacherCountsDesignation,
      experianceOfTeachers,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTeacherCountBySchoolManagement,
  getTeacherStatsByDistrict,
  getTeacherCountByZone,
  getTeacherExperienceCountByRange,
  getSchoolAndTeacherInfo,
};
