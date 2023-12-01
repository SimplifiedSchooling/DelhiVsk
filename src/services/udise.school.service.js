const { Udiseschool } = require('../models');

const bulkUpload = async (schoolArray, csvFilePath = null, maxRecordsToUpload = Infinity) => {
  let modifiedSchoolArray = schoolArray;

  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    return { error: true, message: 'Missing array' };
  }

  const recordsToUpload = modifiedSchoolArray.slice(0, maxRecordsToUpload);
  for (const school of recordsToUpload) {
    const record = new Udiseschool(school);
    await record.save();
  }

  return { success: true, message: `Uploaded ${recordsToUpload.length} records` };
};

// Count based on RuralUrban
const getRuralUrbanCounts = async () => {
  const counts = await Udiseschool.aggregate([
    {
      $group: {
        _id: '$RuralUrban',
        count: { $sum: 1 },
      },
    },
  ]);
  return counts;
};

// Count based on School_Gender
const getSchoolGenderCounts = async () => {
  const counts = await Udiseschool.aggregate([
    {
      $group: {
        _id: '$School_Gender',
        count: { $sum: 1 },
      },
    },
  ]);
  return counts;
};

// Count based on Shiftofschool
const getShiftofschoolCounts = async () => {
  const counts = await Udiseschool.aggregate([
    {
      $group: {
        _id: '$Shiftofschool',
        count: { $sum: 1 },
      },
    },
  ]);
  return counts;
};

// Count based on typeofschool
const getTypeofschoolCounts = async () => {
  const counts = await Udiseschool.aggregate([
    {
      $group: {
        _id: '$typeofschool',
        count: { $sum: 1 },
      },
    },
  ]);
  return counts;
};

const getSchoolTypeCounts = async () => {
  const counts = await Udiseschool.aggregate([
    {
      $group: {
        _id: '$Sch_Type',
        count: { $sum: 1 },
      },
    },
  ]);
  return counts;
};

const udiseSchoolStats = async () => {
  const totalSchoolCount = await Udiseschool.countDocuments();
  const ruralUrbanCounts = await getRuralUrbanCounts();
  const schoolGenderCounts = await getSchoolGenderCounts();
  const shiftofschoolCounts = await getShiftofschoolCounts();
  const typeofschoolCounts = await getTypeofschoolCounts();
  const schoolTypeCounts = await getSchoolTypeCounts();

  return {
    totalSchoolCount,
    ruralUrbanCounts,
    schoolGenderCounts,
    shiftofschoolCounts,
    typeofschoolCounts,
    schoolTypeCounts,
  };
};

const districtWiseCount = async (district) => {
  // Count based on RuralUrban
  const getRuralUrbanCountsDistrict = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { district } },
      {
        $group: {
          _id: '$RuralUrban',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  // Count based on School_Gender
  const getSchoolGenderCountsDist = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { district } },
      {
        $group: {
          _id: '$School_Gender',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  // Count based on Shiftofschool
  const getShiftofschoolCountsDist = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { district } },
      {
        $group: {
          _id: '$Shiftofschool',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  // Count based on typeofschool
  const getTypeofschoolCountsDist = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { district } },
      {
        $group: {
          _id: '$typeofschool',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  const getSchoolTypeCountsDist = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { district } },
      {
        $group: {
          _id: '$Sch_Type',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };
  const totalSchoolCount = await Udiseschool.countDocuments({ district });
  const ruralUrbanCounts = await getRuralUrbanCountsDistrict();
  const schoolGenderCounts = await getSchoolGenderCountsDist();
  const shiftofschoolCounts = await getShiftofschoolCountsDist();
  const typeofschoolCounts = await getTypeofschoolCountsDist();
  const schoolTypeCounts = await getSchoolTypeCountsDist();

  return {
    totalSchoolCount,
    ruralUrbanCounts,
    schoolGenderCounts,
    shiftofschoolCounts,
    typeofschoolCounts,
    schoolTypeCounts,
  };
};
/// /////////////////////////////  Zone udise school/////////////////
const ZoneWiseCount = async (zone) => {
  // Count based on RuralUrban
  const getRuralUrbanCountsZone = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { zone } },
      {
        $group: {
          _id: '$RuralUrban',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  // Count based on School_Gender
  const getSchoolGenderCountsZone = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { zone } },
      {
        $group: {
          _id: '$School_Gender',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  // Count based on Shiftofschool
  const getShiftofschoolCountsZone = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { zone } },
      {
        $group: {
          _id: '$Shiftofschool',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  // Count based on typeofschool
  const getTypeofschoolCountsZone = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { zone } },
      {
        $group: {
          _id: '$typeofschool',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  const getSchoolTypeCountsZone = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { zone } },
      {
        $group: {
          _id: '$Sch_Type',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };
  const totalSchoolCount = await Udiseschool.countDocuments({ zone });
  const ruralUrbanCounts = await getRuralUrbanCountsZone();
  const schoolGenderCounts = await getSchoolGenderCountsZone();
  const shiftofschoolCounts = await getShiftofschoolCountsZone();
  const typeofschoolCounts = await getTypeofschoolCountsZone();
  const schoolTypeCounts = await getSchoolTypeCountsZone();
  return {
    totalSchoolCount,
    ruralUrbanCounts,
    schoolGenderCounts,
    shiftofschoolCounts,
    typeofschoolCounts,
    schoolTypeCounts,
  };
};

/// ///////////////// udise School //////////////////
const ScholWiseCount = async (SchoolID) => {
  // Count based on RuralUrban
  const getRuralUrbanCountsSch = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { SchoolID } },
      {
        $group: {
          _id: '$RuralUrban',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  // Count based on School_Gender
  const getSchoolGenderCountsSch = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { SchoolID } },
      {
        $group: {
          _id: '$School_Gender',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  // Count based on Shiftofschool
  const getShiftofschoolCountsSch = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { SchoolID } },
      {
        $group: {
          _id: '$Shiftofschool',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  // Count based on typeofschool
  const getTypeofschoolCountsSch = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { SchoolID } },
      {
        $group: {
          _id: '$typeofschool',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  const getSchoolTypeCountsSch = async () => {
    const counts = await Udiseschool.aggregate([
      { $match: { SchoolID } },
      {
        $group: {
          _id: '$Sch_Type',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };

  const totalSchoolCount = await Udiseschool.countDocuments({ SchoolID });
  const ruralUrbanCounts = await getRuralUrbanCountsSch();
  const schoolGenderCounts = await getSchoolGenderCountsSch();
  const shiftofschoolCounts = await getShiftofschoolCountsSch();
  const typeofschoolCounts = await getTypeofschoolCountsSch();
  const schoolTypeCounts = await getSchoolTypeCountsSch();
  return {
    totalSchoolCount,
    ruralUrbanCounts,
    schoolGenderCounts,
    shiftofschoolCounts,
    typeofschoolCounts,
    schoolTypeCounts,
  };
};
/// //////////////end/////////////

const fetchSchoolDataDistrict = async () => {
  const duplicates = await Udiseschool.aggregate([
    {
      $group: {
        _id: { district: '$district' },
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        count: { $gt: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        districtName: '$_id.district',
        // count: 1,
      },
    },
  ]);
  return duplicates;
};

const fetchSchoolZone = async () => {
  const uniqueZones = await Udiseschool.aggregate([{ $group: { _id: { zone: '$zone' } } }]);

  const formattedZones = uniqueZones.map((zone) => ({
    Zone_Name: zone._id.zone,
    // Z_ID: zone._id.Z_ID
  }));

  return { ZoneInfo: formattedZones };
};

const getDistrictZoneNames = async (districtName) => {
  const zones = await Udiseschool.distinct('zone', { district: districtName }).exec();
  const result = zones.map((zone) => ({ Zone_Name: zone }));
  return result;
};

const getDistrictSchools = async (district) => {
  const schools = await Udiseschool.find({ district }, 'SchoolID SchName').exec();
  return schools;
};

const getZoneWiseSchools = async (zoneName) => {
  const schools = await Udiseschool.find({ zone: zoneName }).select('SchoolID SchName').exec();
  return schools;
};

const getSchoolsTypeWise = async (schoolType) => {
  const schools = await Udiseschool.find({ Sch_Type: schoolType });
  return schools;
};

const getSchoolsTypeWiseDistrict = async (schoolType, district) => {
  const schools = await Udiseschool.find({ Sch_Type: schoolType, district });
  return schools;
};

const getSchoolsTypeWiseZone = async (schoolType, zone) => {
  const schools = await Udiseschool.find({ Sch_Type: schoolType, zone });
  return schools;
};
module.exports = {
  bulkUpload,
  udiseSchoolStats,
  ZoneWiseCount,
  districtWiseCount,
  ScholWiseCount,
  fetchSchoolDataDistrict,
  fetchSchoolZone,
  getDistrictZoneNames,
  getDistrictSchools,
  getZoneWiseSchools,
  getSchoolsTypeWise,
  getSchoolsTypeWiseDistrict,
  getSchoolsTypeWiseZone,
};
