const axios = require('axios');
const cron = require('node-cron');
const logger = require('../config/logger');
const {GuestTeacher, School } = require('../models');

// Function to fetch data from the API
const fetchDataFromApi = async () => {
  try {
    const response = await axios.get('https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Guest_Teacher_details_API?password=VSK@9180');
    return response.data; // Assuming the API response contains an array of guest teacher data
  } catch (error) {
    console.error('Error fetching data from API:', error.message);
    return null;
  }
};

// Function to update or delete records in the database based on the retrieved data
const updateDatabaseWithApiData = async () => {
  try {
    const apiData = await fetchDataFromApi();
    // If data is received from the API
    if (apiData.Cargo && Array.isArray(apiData.Cargo)) {
      // Process the data and update or delete records in the database
      for (const guestTeacherData of apiData.Cargo) {
        const { ApplicationId } = guestTeacherData;

        // Update or create record in the database
        await GuestTeacher.findOneAndUpdate({ ApplicationId }, guestTeacherData, { upsert: true });
      }

      // Delete records not present in the retrieved data
      const apiApplicationIds = apiData.Cargo.map((guestTeacherData) => guestTeacherData.ApplicationId);
      await GuestTeacher.deleteMany({ ApplicationId: { $nin: apiApplicationIds } });

      console.log('Database updated successfully.');
    } else {
      // If no data is received from the API, delete all records from the database
      await GuestTeacher.deleteMany({});
      console.log('No data received from the API. Database cleared.');
    }
  } catch (error) {
    console.error('Error updating database:', error.message);
  }
};

// Call the function to update or delete records in the database based on the retrieved data



// Schedule the job to run every day at 11 PM  0 23 * * *
cron.schedule('*/5 * * * *', async () => {
  try {
    logger.info(`Running the attendance data update job...`);
    await updateDatabaseWithApiData();
    logger.info(`Student data update job completed.`);
  } catch (error) {
    logger.info('Error running the job:', error);
  }
});


/**
 * Get guest teacher graph  by School Statistic
 * @returns {Promise<Object>} School statistics
 */
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
  // const cachedData = await redis.get('getTeacherStatsTeacherGraphical');

  // if (cachedData) {
  //   return JSON.parse(cachedData);
  // }
  const schCategorySchoolIds = await getSchoolIdBySchCategoryWise();
  const teacherCounts = [];

  for (const category of schCategorySchoolIds) {
    const teacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: category.schoolIds.map(String) } });
    teacherCounts.push({
      SchCategory: category._id,
      teacherCount,
    });
  }
  const shiftWiseSchoolid = await getSchoolIdByShiftWise();
  const teacherShiftWiseCounts = [];
  for (const shift of shiftWiseSchoolid) {
    const teacherShiftWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: shift.schoolIds.map(String) } });
    teacherShiftWiseCounts.push({
      shift: shift._id,
      teacherShiftWiseCount,
    });
  }

  const zoneNameWiseCountIds = await getSchoolIdByZoneNameWise();
  const teacherZoneWiseCounts = [];

  for (const zone of zoneNameWiseCountIds) {
    const teacherZoneWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: zone.schoolIds.map(String) } });
    teacherZoneWiseCounts.push({
      zoneName: zone._id,
      teacherZoneWiseCount,
    });
  }

  const managmentWiseCountId = await getSchoolIdByManagmentWise();
  const teacherManagmentWiseCounts = [];
  for (const managment of managmentWiseCountId) {
    const teacherManagmentWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: managment.schoolIds.map(String) } });
    teacherManagmentWiseCounts.push({
      shift: managment._id,
      teacherManagmentWiseCount,
    });
  }

  const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWise();
  const teacherTypeOfSchoolWiseCounts = [];

  for (const typeOfSchool of typeOfSchoolWiseCountIds) {
    const teacherTypeOfSchoolWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: typeOfSchool.schoolIds.map(String)  } });
    teacherTypeOfSchoolWiseCounts.push({
      typeOfSchool: typeOfSchool._id,
      teacherTypeOfSchoolWiseCount,
    });
  }

  const pipeline3 = [
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
  const postdescWiseTeacherCounts = await GuestTeacher.aggregate(pipeline3);

  const result = {
    teacherCounts,
    teacherShiftWiseCounts,
    // teacherStreamWiseCounts,
    teacherZoneWiseCounts,
    teacherTypeOfSchoolWiseCounts,
    // teacherMinorityWiseCounts,
    postdescWiseTeacherCounts,
    teacherManagmentWiseCounts,
  };
  // await redis.set('getTeacherStatsTeacherGraphical', JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};


/**
 * Get guest teacher graph  by School Statistic by District
 * @returns {Promise<Object>} School statistics
 */
const getSchoolIdByShiftWiseDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
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

const getSchoolIdByManagmentWiseDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
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

const getSchoolIdByZoneNameWiseDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
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

const getSchoolIdByTypeOfSchoolWiseDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
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

const getSchoolIdBySchCategoryWiseDistrict = async (districtName) => {
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

const getTeacherStatsDistrict = async (districtName) => {
  // const cachedData = await redis.get('getTeacherStatsTeacherGraphical');

  // if (cachedData) {
  //   return JSON.parse(cachedData);
  // }
  const schCategorySchoolIds = await getSchoolIdBySchCategoryWiseDistrict(districtName);
  const teacherCounts = [];

  for (const category of schCategorySchoolIds) {
    const teacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: category.schoolIds.map(String) } });
    teacherCounts.push({
      SchCategory: category._id,
      teacherCount,
    });
  }
  const shiftWiseSchoolid = await getSchoolIdByShiftWiseDistrict(districtName);
  const teacherShiftWiseCounts = [];
  for (const shift of shiftWiseSchoolid) {
    const teacherShiftWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: shift.schoolIds.map(String) } });
    teacherShiftWiseCounts.push({
      shift: shift._id,
      teacherShiftWiseCount,
    });
  }

  const zoneNameWiseCountIds = await getSchoolIdByZoneNameWiseDistrict(districtName);
  const teacherZoneWiseCounts = [];

  for (const zone of zoneNameWiseCountIds) {
    const teacherZoneWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: zone.schoolIds.map(String) } });
    teacherZoneWiseCounts.push({
      zoneName: zone._id,
      teacherZoneWiseCount,
    });
  }

  const managmentWiseCountId = await getSchoolIdByManagmentWiseDistrict(districtName);
  const teacherManagmentWiseCounts = [];
  for (const managment of managmentWiseCountId) {
    const teacherManagmentWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: managment.schoolIds.map(String) } });
    teacherManagmentWiseCounts.push({
      shift: managment._id,
      teacherManagmentWiseCount,
    });
  }

  const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWiseDistrict(districtName);
  const teacherTypeOfSchoolWiseCounts = [];

  for (const typeOfSchool of typeOfSchoolWiseCountIds) {
    const teacherTypeOfSchoolWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: typeOfSchool.schoolIds.map(String)  } });
    teacherTypeOfSchoolWiseCounts.push({
      typeOfSchool: typeOfSchool._id,
      teacherTypeOfSchoolWiseCount,
    });
  }

  const pipeline3 = [
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
  const postdescWiseTeacherCounts = await GuestTeacher.aggregate(pipeline3);

  const result = {
    teacherCounts,
    teacherShiftWiseCounts,
    teacherZoneWiseCounts,
    teacherTypeOfSchoolWiseCounts,
    postdescWiseTeacherCounts,
    teacherManagmentWiseCounts,
  };
  // await redis.set('getTeacherStatsTeacherGraphical', JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};


/**
 * Get guest teacher graph  by School Statistic by District
 * @returns {Promise<Object>} School statistics
 */
const getSchoolIdByShiftWiseZone = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
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

const getSchoolIdByManagmentWiseZone = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
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

const getSchoolIdByZoneNameWiseZone = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
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

const getSchoolIdByTypeOfSchoolWiseZone = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
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

const getSchoolIdBySchCategoryWiseZone = async (districtName) => {
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

const getTeacherStatsZone = async (districtName) => {
  // const cachedData = await redis.get('getTeacherStatsTeacherGraphical');

  // if (cachedData) {
  //   return JSON.parse(cachedData);
  // }
  const schCategorySchoolIds = await getSchoolIdBySchCategoryWiseZone(districtName);
  const teacherCounts = [];

  for (const category of schCategorySchoolIds) {
    const teacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: category.schoolIds.map(String) } });
    teacherCounts.push({
      SchCategory: category._id,
      teacherCount,
    });
  }
  const shiftWiseSchoolid = await getSchoolIdByShiftWiseZone(districtName);
  const teacherShiftWiseCounts = [];
  for (const shift of shiftWiseSchoolid) {
    const teacherShiftWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: shift.schoolIds.map(String) } });
    teacherShiftWiseCounts.push({
      shift: shift._id,
      teacherShiftWiseCount,
    });
  }

  const zoneNameWiseCountIds = await getSchoolIdByZoneNameWiseZone(districtName);
  const teacherZoneWiseCounts = [];

  for (const zone of zoneNameWiseCountIds) {
    const teacherZoneWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: zone.schoolIds.map(String) } });
    teacherZoneWiseCounts.push({
      zoneName: zone._id,
      teacherZoneWiseCount,
    });
  }

  const managmentWiseCountId = await getSchoolIdByManagmentWiseZone(districtName);
  const teacherManagmentWiseCounts = [];
  for (const managment of managmentWiseCountId) {
    const teacherManagmentWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: managment.schoolIds.map(String) } });
    teacherManagmentWiseCounts.push({
      shift: managment._id,
      teacherManagmentWiseCount,
    });
  }

  const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWiseZone(districtName);
  const teacherTypeOfSchoolWiseCounts = [];

  for (const typeOfSchool of typeOfSchoolWiseCountIds) {
    const teacherTypeOfSchoolWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: typeOfSchool.schoolIds.map(String)  } });
    teacherTypeOfSchoolWiseCounts.push({
      typeOfSchool: typeOfSchool._id,
      teacherTypeOfSchoolWiseCount,
    });
  }

  const pipeline3 = [
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
  const postdescWiseTeacherCounts = await GuestTeacher.aggregate(pipeline3);

  const result = {
    teacherCounts,
    teacherShiftWiseCounts,
    teacherZoneWiseCounts,
    teacherTypeOfSchoolWiseCounts,
    postdescWiseTeacherCounts,
    teacherManagmentWiseCounts,
  };
  // await redis.set('getTeacherStatsTeacherGraphical', JSON.stringify(result), 'EX', 24 * 60 * 60);
  return result;
};

module.exports = {    
  getTeacherStats,
  getTeacherStatsDistrict,
}