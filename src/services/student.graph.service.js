const httpStatus = require('http-status');
const { School, Student } = require('../models');
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
const getSchoolIdByStreamWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$stream',
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

const getSchoolIdBySchCategoryWise = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$SchCategory',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};
const getSchoolIdByMinorityWise = async () => {
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
const getSchoolIdByTypeOfSchool = async () => {
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

const getStudentStats = async () => {
  const schCategorySchoolIds = await getSchoolIdBySchCategoryWise();
  const studentCounts = await getCountByCriteria(schCategorySchoolIds, 'SchCategory');

  const streamWiseSchoolIds = await getSchoolIdByStreamWise();
  const streanWiseCount = await getCountByCriteria(streamWiseSchoolIds, 'stream');

  const minorityWiseSchoolIds = await getSchoolIdByMinorityWise();
  const minorityWiseCount = await getCountByCriteria(minorityWiseSchoolIds, 'minority');

  const affiliationWiseSchoolIds = await getSchoolIdByAffiliationWise();
  const affiliationWiseCount = await getCountByCriteria(affiliationWiseSchoolIds, 'affiliation');

  const typeOfSchoolSchoolIds = await getSchoolIdByTypeOfSchool();
  const typeOfSchoolSchoolCount = await getCountByCriteria(typeOfSchoolSchoolIds, 'typeOfSchool');

  const shiftWiseSchoolid = await getSchoolIdByShiftWise();
  const studentShiftWiseCounts = await getCountByCriteria(shiftWiseSchoolid, 'shift');

  const managmentWiseCountId = await getSchoolIdByManagmentWise();
  const studentManagementWiseCounts = await getCountByCriteria(managmentWiseCountId, 'SchManagement');

  return {
    studentCounts,
    streanWiseCount,
    affiliationWiseCount,
    typeOfSchoolSchoolCount,
    minorityWiseCount,
    studentShiftWiseCounts,
    studentManagementWiseCounts,
  };
};

const getCountByCriteria = async (criteria, field) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const count = await Student.countDocuments({ Schoolid: { $in: item.Schoolid } });
      return { [field]: item._id, count };
    })
  );

  return counts;
};

const getStudentCount = async () => {
  // Check if the data is already cached in Redis
  const cachedData = await redis.get('getStudentCount');

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const studentStats = await getStudentStats();

  // Cache the result in Redis for future use
  await redis.set('getStudentCount', JSON.stringify(studentStats), 'EX', 24 * 60 * 60);

  return studentStats;
};

const getSchoolIdByShiftWiseByDistrictName = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$shift',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};
const getSchoolIdByStreamWiseByDistrictName = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$stream',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};

const getSchoolIdByManagmentWiseByDistrictName = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$SchManagement',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};

const getSchoolIdBySchCategoryWiseByDistrictName = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$SchCategory',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};
const getSchoolIdByMinorityWiseByDistrictName = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$minority',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};

const getSchoolIdByAffiliationWiseByDistrictName = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$affiliation',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};
const getSchoolIdByTypeOfSchoolByDistrictName = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: '$typeOfSchool',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};

const getStudentStatsByDistrictName = async (districtName) => {
  const schCategorySchoolIds = await getSchoolIdBySchCategoryWiseByDistrictName(districtName);
  const studentCounts = await getCountByCriteriaByDistrictName(schCategorySchoolIds, 'SchCategory');

  const streamWiseSchoolIds = await getSchoolIdByStreamWiseByDistrictName(districtName);
  const streanWiseCount = await getCountByCriteriaByDistrictName(streamWiseSchoolIds, 'stream');

  const minorityWiseSchoolIds = await getSchoolIdByMinorityWiseByDistrictName(districtName);
  const minorityWiseCount = await getCountByCriteriaByDistrictName(minorityWiseSchoolIds, 'minority');

  const affiliationWiseSchoolIds = await getSchoolIdByAffiliationWiseByDistrictName(districtName);
  const affiliationWiseCount = await getCountByCriteriaByDistrictName(affiliationWiseSchoolIds, 'affiliation');

  const typeOfSchoolSchoolIds = await getSchoolIdByTypeOfSchoolByDistrictName(districtName);
  const typeOfSchoolSchoolCount = await getCountByCriteriaByDistrictName(typeOfSchoolSchoolIds, 'typeOfSchool');

  const shiftWiseSchoolid = await getSchoolIdByShiftWiseByDistrictName(districtName);
  const studentShiftWiseCounts = await getCountByCriteriaByDistrictName(shiftWiseSchoolid, 'shift');

  const managmentWiseCountId = await getSchoolIdByManagmentWiseByDistrictName(districtName);
  const studentManagementWiseCounts = await getCountByCriteriaByDistrictName(managmentWiseCountId, 'SchManagement');

  return {
    studentCounts,
    streanWiseCount,
    affiliationWiseCount,
    typeOfSchoolSchoolCount,
    minorityWiseCount,
    studentShiftWiseCounts,
    studentManagementWiseCounts,
  };
};

const getCountByCriteriaByDistrictName = async (criteria, field) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const count = await Student.countDocuments({ Schoolid: { $in: item.Schoolid } });
      return { [field]: item._id, count };
    })
  );

  return counts;
};

/**
 * Get student graph data by districtName
 * @param {string} districtName - The districtName name to filter the counts
 * @returns {Promise<Object>} student graph data
 */

const getStudentCountByDistrictName = async (districtName) => {
  // Check if the data is already cached in Redis
  const cacheKey = `districtData:${districtName}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const studentStats = await getStudentStatsByDistrictName(districtName);

  // Cache the result in Redis for future use
  await redis.set(cacheKey, JSON.stringify(studentStats), 'EX', 24 * 60 * 60);
  return studentStats;
};
const getSchoolIdByShiftWiseByZoneName = async (zoneName) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zoneName,
      },
    },
    {
      $group: {
        _id: '$shift',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};
const getSchoolIdByStreamWiseByZoneName = async (zoneName) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zoneName,
      },
    },
    {
      $group: {
        _id: '$stream',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};

const getSchoolIdByManagmentWiseByZoneName = async (zoneName) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zoneName,
      },
    },
    {
      $group: {
        _id: '$SchManagement',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};

const getSchoolIdBySchCategoryWiseByZoneName = async (zoneName) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zoneName,
      },
    },
    {
      $group: {
        _id: '$SchCategory',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};
const getSchoolIdByMinorityWiseByZoneName = async (zoneName) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zoneName,
      },
    },
    {
      $group: {
        _id: '$minority',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};

const getSchoolIdByAffiliationWiseByZoneName = async (zoneName) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zoneName,
      },
    },
    {
      $group: {
        _id: '$affiliation',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};
const getSchoolIdByTypeOfSchoolByZoneName = async (zoneName) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zoneName,
      },
    },
    {
      $group: {
        _id: '$typeOfSchool',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};

const getStudentStatsByZoneName = async (zoneName) => {
  const schCategorySchoolIds = await getSchoolIdBySchCategoryWiseByZoneName(zoneName);
  const studentCounts = await getCountByCriteriaByZoneName(schCategorySchoolIds, 'SchCategory');

  const streamWiseSchoolIds = await getSchoolIdByStreamWiseByZoneName(zoneName);
  const streanWiseCount = await getCountByCriteriaByZoneName(streamWiseSchoolIds, 'stream');

  const minorityWiseSchoolIds = await getSchoolIdByMinorityWiseByZoneName(zoneName);
  const minorityWiseCount = await getCountByCriteriaByZoneName(minorityWiseSchoolIds, 'minority');

  const affiliationWiseSchoolIds = await getSchoolIdByAffiliationWiseByZoneName(zoneName);
  const affiliationWiseCount = await getCountByCriteriaByZoneName(affiliationWiseSchoolIds, 'affiliation');

  const typeOfSchoolSchoolIds = await getSchoolIdByTypeOfSchoolByZoneName(zoneName);
  const typeOfSchoolSchoolCount = await getCountByCriteriaByZoneName(typeOfSchoolSchoolIds, 'typeOfSchool');

  const shiftWiseSchoolid = await getSchoolIdByShiftWiseByZoneName(zoneName);
  const studentShiftWiseCounts = await getCountByCriteriaByZoneName(shiftWiseSchoolid, 'shift');

  const managmentWiseCountId = await getSchoolIdByManagmentWiseByZoneName(zoneName);
  const studentManagementWiseCounts = await getCountByCriteriaByZoneName(managmentWiseCountId, 'SchManagement');

  return {
    zoneName,
    studentCounts,
    streanWiseCount,
    affiliationWiseCount,
    typeOfSchoolSchoolCount,
    minorityWiseCount,
    studentShiftWiseCounts,
    studentManagementWiseCounts,
  };
};

const getCountByCriteriaByZoneName = async (criteria, field) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const count = await Student.countDocuments({ Schoolid: { $in: item.Schoolid } });
      return { [field]: item._id, count };
    })
  );

  return counts;
};
/**
 * Get student graph data by zoneName
 * @param {string} zoneName - The zoneName name to filter the counts
 * @returns {Promise<Object>} student graph data
 */
const getStudentCountByZoneName = async (zoneName) => {
  // Check if the data is already cached in Redis
  const cacheKey = `Zone_Name:${zoneName}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const studentStats = await getStudentStatsByZoneName(zoneName);

  // Cache the result in Redis for future use
  await redis.set(cacheKey, JSON.stringify(studentStats), 'EX', 24 * 60 * 60);
  return studentStats;
};

module.exports = {
  getStudentCount,
  getStudentCountByDistrictName,
  getStudentCountByZoneName,
};
