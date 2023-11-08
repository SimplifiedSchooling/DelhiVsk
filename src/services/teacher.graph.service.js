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

const getSchoolIdByZoneNameWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$Zone_Name', // Group by Zone_Name
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];
  const zoneNameWiseSchoolIds = await School.aggregate(pipeline);
  return zoneNameWiseSchoolIds;
};

const getSchoolIdByStreamWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$stream', // Group by the stream field
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];
  const streamWiseSchoolIds = await School.aggregate(pipeline);
  return streamWiseSchoolIds;
};

const getSchoolIdByTypeOfSchoolWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$typeOfSchool', // Group by the typeOfSchool field
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];
  const typeOfSchoolWiseSchoolIds = await School.aggregate(pipeline);
  return typeOfSchoolWiseSchoolIds;
};

const getSchoolIdByMinorityWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$minority', // Group by the minority field
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];

  const minorityWiseSchoolIds = await School.aggregate(pipeline);
  return minorityWiseSchoolIds;
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

  const zoneNameWiseCountIds = await getSchoolIdByZoneNameWise();
  const teacherZoneWiseCounts = [];

  for (const zone of zoneNameWiseCountIds) {
    const teacherZoneWiseCount = await Teacher.countDocuments({ schoolid: { $in: zone.schoolIds } });
    teacherZoneWiseCounts.push({
      zoneName: zone._id,
      teacherZoneWiseCount,
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

  const streamWiseCountIds = await getSchoolIdByStreamWise();
  const teacherStreamWiseCounts = [];
  for (const stream of streamWiseCountIds) {
    const teacherStreamWiseCount = await Teacher.countDocuments({ schoolid: { $in: stream.schoolIds } });
    teacherStreamWiseCounts.push({
      stream: stream._id,
      teacherStreamWiseCount,
    });
  }

  const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWise();
  const teacherTypeOfSchoolWiseCounts = [];

  for (const typeOfSchool of typeOfSchoolWiseCountIds) {
    const teacherTypeOfSchoolWiseCount = await Teacher.countDocuments({ schoolid: { $in: typeOfSchool.schoolIds } });
    teacherTypeOfSchoolWiseCounts.push({
      typeOfSchool: typeOfSchool._id,
      teacherTypeOfSchoolWiseCount,
    });
  }

  const minorityWiseCountIds = await getSchoolIdByMinorityWise();
  const teacherMinorityWiseCounts = [];

  for (const minority of minorityWiseCountIds) {
    const teacherMinorityWiseCount = await Teacher.countDocuments({ schoolid: { $in: minority.schoolIds } });
    teacherMinorityWiseCounts.push({
      minority: minority._id,
      teacherMinorityWiseCount,
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

  const [totalSchools, totalTeachers, totalFemaleTeachers, totalMaleTeachers] = await Promise.allSettled([
    School.countDocuments({}).exec(),
    Teacher.countDocuments({}).exec(),
    Teacher.countDocuments({ gender: 'Female' }).exec(),
    Teacher.countDocuments({ gender: 'Male' }).exec(),
  ]);

  const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline3);
  const experianceOfTeachers = await getTeacherExperienceCountByRange();
  const averageTeachers = totalTeachers.value / totalSchools.value;

  return {
    averageTeachers,
    totalSchools: totalSchools.value,
    totalTeachers: totalTeachers.value,
    totalFemaleTeachers: totalFemaleTeachers.value,
    totalMaleTeachers: totalMaleTeachers.value,
    teacherCounts,
    teacherShiftWiseCounts,
    teacherStreamWiseCounts,
    teacherZoneWiseCounts,
    teacherTypeOfSchoolWiseCounts,
    teacherMinorityWiseCounts,
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
  // const cachedData = await redis.get('getTeacherData');

  // if (cachedData) {
  //   return JSON.parse(cachedData);
  // }

  const teacherStats = await getTeacherStats();

  // Cache the result in Redis for future use
  // await redis.set('getTeacherData', JSON.stringify(teacherStats), 'EX', 24 * 60 * 60);

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

const getSchoolIdByStreamWiseAndDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$stream', // Group by stream
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];
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
        _id: '$typeOfSchool', // Group by typeOfSchool
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];
  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

const getSchoolIdByMinorityWiseAndDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$minority', // Group by SchManagement
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];

  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

const getSchoolIdByZoneNameWiseAndDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$Zone_Name', // Group by SchManagement
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

  const streamWiseCountIds = await getSchoolIdByStreamWiseAndDistrict(districtName);
  const teacherStreamWiseCounts = [];
  for (const stream of streamWiseCountIds) {
    const teacherStreamWiseCount = await Teacher.countDocuments({ schoolid: { $in: stream.schoolIds } });
    teacherStreamWiseCounts.push({
      stream: stream._id,
      teacherStreamWiseCount,
    });
  }

  const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWiseAndDistrict(districtName);
  const teacherTypeOfSchoolWiseCounts = [];
  for (const typeOfSchool of typeOfSchoolWiseCountIds) {
    const teacherTypeOfSchoolWiseCount = await Teacher.countDocuments({ schoolid: { $in: typeOfSchool.schoolIds } });
    teacherTypeOfSchoolWiseCounts.push({
      typeOfSchool: typeOfSchool._id,
      teacherTypeOfSchoolWiseCount,
    });
  }

  const zoneNameWiseCountIds = await getSchoolIdByZoneNameWiseAndDistrict(districtName);
  const teacherZoneWiseCounts = [];
  for (const zone of zoneNameWiseCountIds) {
    const teacherZoneWiseCount = await Teacher.countDocuments({ schoolid: { $in: zone.schoolIds } });
    teacherZoneWiseCounts.push({
      zoneName: zone._id,
      teacherZoneWiseCount,
    });
  }

  const minorityWiseCountIds = await getSchoolIdByMinorityWiseAndDistrict(districtName);
  const teacherMinorityWiseCounts = [];
  for (const minority of minorityWiseCountIds) {
    const teacherMinorityWiseCount = await Teacher.countDocuments({ schoolid: { $in: minority.schoolIds } });
    teacherMinorityWiseCounts.push({
      minority: minority._id,
      teacherMinorityWiseCount,
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
  const [totalSchools, totalTeachers, totalFemaleTeachers, totalMaleTeachers] = await Promise.allSettled([
    School.countDocuments({ District_name: districtName }).exec(),
    Teacher.countDocuments({ districtname: districtName }).exec(),
    Teacher.countDocuments({ gender: 'Female', districtname: districtName }).exec(),
    Teacher.countDocuments({ gender: 'Male', districtname: districtName }).exec(),
  ]);
  const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline3);
  const experianceOfTeachers = await getTeacherExperienceCountByRangeDistrictWise(districtName);
  const averageTeachers = totalTeachers.value / totalSchools.value;

  return {
    averageTeachers,
    totalSchools: totalSchools.value,
    totalTeachers: totalTeachers.value,
    totalFemaleTeachers: totalFemaleTeachers.value,
    totalMaleTeachers: totalMaleTeachers.value,
    teacherCounts,
    teacherTypeOfSchoolWiseCounts,
    teacherZoneWiseCounts,
    teacherStreamWiseCounts,
    teacherShiftWiseCounts,
    teacherMinorityWiseCounts,
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

const getSchoolIdByStreamWiseAndZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$stream', // Group by shift
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];

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
        _id: '$typeOfSchool', // Group by shift
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];

  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

const getSchoolIdByMinorityWiseAndZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$minority', // Group by shift
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];

  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

const getSchoolIdByZoneWiseAndZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$Zone_Name', // Group by shift
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

  const streamWiseCountIds = await getSchoolIdByStreamWiseAndZone(zone);
  const teacherStreamWiseCounts = [];
  for (const stream of streamWiseCountIds) {
    const teacherStreamWiseCount = await Teacher.countDocuments({ schoolid: { $in: stream.schoolIds } });
    teacherStreamWiseCounts.push({
      stream: stream._id,
      teacherStreamWiseCount,
    });
  }

  const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWiseAndZone(zone);
  const teacherTypeOfSchoolWiseCounts = [];

  for (const typeOfSchool of typeOfSchoolWiseCountIds) {
    const teacherTypeOfSchoolWiseCount = await Teacher.countDocuments({ schoolid: { $in: typeOfSchool.schoolIds } });
    teacherTypeOfSchoolWiseCounts.push({
      typeOfSchool: typeOfSchool._id,
      teacherTypeOfSchoolWiseCount,
    });
  }

  const minorityWiseCountIds = await getSchoolIdByMinorityWiseAndZone(zone);
  const teacherMinorityWiseCounts = [];

  for (const minority of minorityWiseCountIds) {
    const teacherMinorityWiseCount = await Teacher.countDocuments({ schoolid: { $in: minority.schoolIds } });
    teacherMinorityWiseCounts.push({
      minority: minority._id,
      teacherMinorityWiseCount,
    });
  }

  const zoneNameWiseCountIds = await getSchoolIdByZoneWiseAndZone(zone);
  const teacherZoneWiseCounts = [];
  for (const zone of zoneNameWiseCountIds) {
    const teacherZoneWiseCount = await Teacher.countDocuments({ schoolid: { $in: zone.schoolIds } });
    teacherZoneWiseCounts.push({
      zoneName: zone._id,
      teacherZoneWiseCount,
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

  const [totalSchools, totalTeachers, totalFemaleTeachers, totalMaleTeachers] = await Promise.allSettled([
    School.countDocuments({ Zone_Name: cleanedZoneName }).exec(),
    Teacher.countDocuments({ zonename: cleanedZoneName }).exec(),
    Teacher.countDocuments({ gender: 'Female', zonename: cleanedZoneName }).exec(),
    Teacher.countDocuments({ gender: 'Male', zonename: cleanedZoneName }).exec(),
  ]);
  const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline3);
  const experianceOfTeachers = await getTeacherExperienceCountByRangeZoneWise(cleanedZoneName);
  const averageTeachers = totalTeachers.value / totalSchools.value;

  return {
    averageTeachers,
    totalSchools: totalSchools.value,
    totalTeachers: totalTeachers.value,
    totalFemaleTeachers: totalFemaleTeachers.value,
    totalMaleTeachers: totalMaleTeachers.value,
    teacherCounts,
    teacherShiftWiseCounts,
    teacherStreamWiseCounts,
    teacherTypeOfSchoolWiseCounts,
    teacherMinorityWiseCounts,
    teacherZoneWiseCounts,
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
    const teachers = await Teacher.find({ School_Name: schname });

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

const getSchoolIdByShiftWiseAndSchoolName = async (schname) => {
  const pipeline = [
    {
      $match: {
        School_Name: schname,
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

const getSchoolIdByStreamWiseAndZone1 = async (schname) => {
  const pipeline = [
    {
      $match: {
        School_Name: schname,
      },
    },
    {
      $group: {
        _id: '$stream', // Group by shift
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];

  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

const getSchoolIdByTypeOfSchoolWiseAndZone1 = async (schname) => {
  const pipeline = [
    {
      $match: {
        School_Name: schname,
      },
    },
    {
      $group: {
        _id: '$typeOfSchool', // Group by shift
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];

  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

const getSchoolIdByMinorityWiseAndZone1 = async (schname) => {
  const pipeline = [
    {
      $match: {
        School_Name: schname,
      },
    },
    {
      $group: {
        _id: '$minority', // Group by shift
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];

  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

const getSchoolIdByZoneWiseAndZone1 = async (schname) => {
  const pipeline = [
    {
      $match: {
        School_Name: schname,
      },
    },
    {
      $group: {
        _id: '$Zone_Name', // Group by shift
        schoolIds: { $push: '$Schoolid' }, // Capture Schoolid values
      },
    },
  ];

  const schCategorySchoolIds = await School.aggregate(pipeline);
  return schCategorySchoolIds;
};

const getSchoolIdByManagmentWiseAndZone1 = async (schname) => {
  const pipeline = [
    {
      $match: {
        School_Name: schname,
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

const getSchoolIdBySchCategoryWiseAndZone1 = async (schname) => {
  const pipeline = [
    {
      $match: {
        School_Name: schname,
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

const getTeacherCountByZone1 = async (schname) => {
  const schCategorySchoolIds = await getSchoolIdBySchCategoryWiseAndZone1(schname);
  const teacherCounts = [];

  for (const category of schCategorySchoolIds) {
    const teacherCount = await Teacher.countDocuments({ schoolid: { $in: category.schoolIds } });
    teacherCounts.push({
      SchCategory: category._id,
      teacherCount,
    });
  }
  const shiftWiseSchoolid = await getSchoolIdByShiftWiseAndSchoolName(schname);
  const teacherShiftWiseCounts = [];
  for (const shift of shiftWiseSchoolid) {
    const teacherShiftWiseCount = await Teacher.countDocuments({ schoolid: { $in: shift.schoolIds } });
    teacherShiftWiseCounts.push({
      shift: shift._id,
      teacherShiftWiseCount,
    });
  }

  const streamWiseCountIds = await getSchoolIdByStreamWiseAndZone1(schname);
  const teacherStreamWiseCounts = [];
  for (const stream of streamWiseCountIds) {
    const teacherStreamWiseCount = await Teacher.countDocuments({ schoolid: { $in: stream.schoolIds } });
    teacherStreamWiseCounts.push({
      stream: stream._id,
      teacherStreamWiseCount,
    });
  }

  const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWiseAndZone1(schname);
  const teacherTypeOfSchoolWiseCounts = [];

  for (const typeOfSchool of typeOfSchoolWiseCountIds) {
    const teacherTypeOfSchoolWiseCount = await Teacher.countDocuments({ schoolid: { $in: typeOfSchool.schoolIds } });
    teacherTypeOfSchoolWiseCounts.push({
      typeOfSchool: typeOfSchool._id,
      teacherTypeOfSchoolWiseCount,
    });
  }

  const minorityWiseCountIds = await getSchoolIdByMinorityWiseAndZone1(schname);
  const teacherMinorityWiseCounts = [];

  for (const minority of minorityWiseCountIds) {
    const teacherMinorityWiseCount = await Teacher.countDocuments({ schoolid: { $in: minority.schoolIds } });
    teacherMinorityWiseCounts.push({
      minority: minority._id,
      teacherMinorityWiseCount,
    });
  }

  const zoneNameWiseCountIds = await getSchoolIdByZoneWiseAndZone1(schname);
  const teacherZoneWiseCounts = [];
  for (const zone of zoneNameWiseCountIds) {
    const teacherZoneWiseCount = await Teacher.countDocuments({ schoolid: { $in: zone.schoolIds } });
    teacherZoneWiseCounts.push({
      zoneName: zone._id,
      teacherZoneWiseCount,
    });
  }

  const managmentWiseCountId = await getSchoolIdByManagmentWiseAndZone1(schname);
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
        School_Name: schname,
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

  const [totalSchools, totalTeachers, totalFemaleTeachers, totalMaleTeachers] = await Promise.allSettled([
    School.countDocuments({ School_Name: schname }).exec(),
    Teacher.countDocuments({ School_Name: schname }).exec(),
    Teacher.countDocuments({ gender: 'Female', School_Name: schname }).exec(),
    Teacher.countDocuments({ gender: 'Male', School_Name: schname }).exec(),
  ]);
  const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline3);
  const experianceOfTeachers = await getTeacherExperienceCountByRangeZoneWise(cleanedZoneName);
  const averageTeachers = totalTeachers.value / totalSchools.value;

  return {
    averageTeachers,
    totalSchools: totalSchools.value,
    totalTeachers: totalTeachers.value,
    totalFemaleTeachers: totalFemaleTeachers.value,
    totalMaleTeachers: totalMaleTeachers.value,
    teacherCounts,
    teacherShiftWiseCounts,
    teacherStreamWiseCounts,
    teacherTypeOfSchoolWiseCounts,
    teacherMinorityWiseCounts,
    teacherZoneWiseCounts,
    postdescWiseTeacherCounts,
    teacherManagmentWiseCounts,
    experianceOfTeachers,
  };
};

module.exports = {
  getTeacherCountBySchoolManagement,
  getTeacherStatsByDistrict,
  getTeacherCountByZone,
  getTeacherExperienceCountByRange,
  getTeacherCountByZone1,
};
