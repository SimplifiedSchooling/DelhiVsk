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

const udiseSchoolStats = async () => {
  const totalSchoolCount = await Udiseschool.countDocuments();
  const ruralUrbanCounts = await getRuralUrbanCounts();
  const schoolGenderCounts = await getSchoolGenderCounts();
  const shiftofschoolCounts = await getShiftofschoolCounts();
  const typeofschoolCounts = await getTypeofschoolCounts();

  return {
    totalSchoolCount,
    ruralUrbanCounts,
    schoolGenderCounts,
    shiftofschoolCounts,
    typeofschoolCounts,
  };
};

const districtWiseCount = async(district) => {
// Count based on RuralUrban
const getRuralUrbanCounts = async (district) => {
  const counts = await Udiseschool.aggregate([
    {$match: {district} },
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
const getSchoolGenderCounts = async (district) => {
  const counts = await Udiseschool.aggregate([
    
    {$match: {district}},
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
const getShiftofschoolCounts = async (district) => {
  const counts = await Udiseschool.aggregate([
    {$match: {district}},
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
const getTypeofschoolCounts = async (district) => {
  const counts = await Udiseschool.aggregate([
    {$match: {district} },
    {
      $group: {
        _id: '$typeofschool',
        count: { $sum: 1 },
      },
    },
  ]);
  return counts;
};
  const totalSchoolCount = await Udiseschool.countDocuments({district});
  const ruralUrbanCounts = await getRuralUrbanCounts(district);
  const schoolGenderCounts = await getSchoolGenderCounts(district);
  const shiftofschoolCounts = await getShiftofschoolCounts(district);
  const typeofschoolCounts = await getTypeofschoolCounts(district);

  return {
    totalSchoolCount,
    ruralUrbanCounts,
    schoolGenderCounts,
    shiftofschoolCounts,
    typeofschoolCounts,
  };
};
////////////////////////////////  Zone udise school/////////////////
const ZoneWiseCount = async(zone) => {
  // Count based on RuralUrban
  const getRuralUrbanCounts = async (zone) => {
    const counts = await Udiseschool.aggregate([
      {$match: {zone} },
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
  const getSchoolGenderCounts = async (zone) => {
    const counts = await Udiseschool.aggregate([
      
      {$match: {zone}},
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
  const getShiftofschoolCounts = async (zone) => {
    const counts = await Udiseschool.aggregate([
      {$match: {zone}},
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
  const getTypeofschoolCounts = async (zone) => {
    const counts = await Udiseschool.aggregate([
      {$match: {zone} },
      {
        $group: {
          _id: '$typeofschool',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };
    const totalSchoolCount = await Udiseschool.countDocuments({zone});
    const ruralUrbanCounts = await getRuralUrbanCounts(zone);
    const schoolGenderCounts = await getSchoolGenderCounts(zone);
    const shiftofschoolCounts = await getShiftofschoolCounts(zone);
    const typeofschoolCounts = await getTypeofschoolCounts(zone);
    return {
      totalSchoolCount,
      ruralUrbanCounts,
      schoolGenderCounts,
      shiftofschoolCounts,
      typeofschoolCounts,
    };
  };


//////////////////// udise School //////////////////
const ScholWiseCount = async(SchoolID) => {
  // Count based on RuralUrban
  const getRuralUrbanCounts = async (SchoolID) => {
    const counts = await Udiseschool.aggregate([
      {$match: {SchoolID} },
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
  const getSchoolGenderCounts = async (SchoolID) => {
    const counts = await Udiseschool.aggregate([
      
      {$match: {SchoolID}},
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
  const getShiftofschoolCounts = async (SchoolID) => {
    const counts = await Udiseschool.aggregate([
      {$match: {SchoolID}},
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
  const getTypeofschoolCounts = async (SchoolID) => {
    const counts = await Udiseschool.aggregate([
      {$match: {SchoolID} },
      {
        $group: {
          _id: '$typeofschool',
          count: { $sum: 1 },
        },
      },
    ]);
    return counts;
  };
    const totalSchoolCount = await Udiseschool.countDocuments({SchoolID});
    const ruralUrbanCounts = await getRuralUrbanCounts(SchoolID);
    const schoolGenderCounts = await getSchoolGenderCounts(SchoolID);
    const shiftofschoolCounts = await getShiftofschoolCounts(SchoolID);
    const typeofschoolCounts = await getTypeofschoolCounts(SchoolID);
    return {
      totalSchoolCount,
      ruralUrbanCounts,
      schoolGenderCounts,
      shiftofschoolCounts,
      typeofschoolCounts,
    };
  };
/////////////////end/////////////


  const  fetchSchoolDataDistrict = async() =>  {
    const duplicates = await Udiseschool.aggregate([
      {
        $group: {
          _id: { district: '$district', },
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
  }
  
  const  fetchSchoolZone = async() =>  {
  
    const uniqueZones = await Udiseschool.aggregate([
      { $group: { _id: { zone: "$zone", } } }
    ]);
  
    const formattedZones = uniqueZones.map(zone => ({
      Zone_Name: zone._id.zone,
      // Z_ID: zone._id.Z_ID
    }));
  
    return { ZoneInfo: formattedZones };
  }


  const getDistrictZoneNames = async (districtName) => {
    const zones = await Udiseschool.distinct('zone', { district: districtName }).exec();
    const result = zones.map((zone, index) => ({ Zone_Name: zone }));
    return result;
  };


const getDistrictSchools = async(district) => {
  const schools = await Udiseschool.find({ district }, 'SchoolID SchName').exec();
  return schools;
}

const getZoneWiseSchools = async (zoneName) => {
  const schools = await Udiseschool.find({ zone: zoneName }).select('SchoolID SchName').exec();
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
};
