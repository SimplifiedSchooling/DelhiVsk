
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
  

 const udiseSchoolStats = async() => {
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
    typeofschoolCounts
 }
 };
  module.exports = {
    bulkUpload,
    udiseSchoolStats,
  }