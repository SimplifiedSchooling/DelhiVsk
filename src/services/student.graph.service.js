const { School, Student, Teacher, StudentCounts } = require('../models');
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

const getSchoolIdByTypeOfSchoolWise = async () => {
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

const getSchoolIdByMinortyWise = async () => {
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

const getSchoolIdByManagementWise = async () => {
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

const getSchoolIdBySchCategory = async () => {
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

const getCountByCriteria = async (criteria, field) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const counts = await StudentCounts.aggregate([
        {
          $match: {
            Schoolid: { $in: item.Schoolid },
          },
        },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: '$totalStudent' },
          },
        },
      ]);
      return counts;
    })
  );
  return counts;
};

const getSchoolCountsByCriteria = async (criteria, field) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const counts = await School.aggregate([
        {
          $match: {
            Schoolid: { $in: item.Schoolid },
          },
        },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 }, // Count schools
          },
        },
      ]);
      return counts;
    })
  );
  return counts;
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

const getStudentCount = async () => {
  const schCategorySchoolIds = await getSchoolIdByManagmentWise();
  const ManagementWiseCounts = [];
  for (const category of schCategorySchoolIds) {
    const counts = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: category.schoolIds },
        },
      },
      {
        $group: {
          _id: null,
          totalStudent: { $sum: '$totalStudent' },
        },
      },
    ]);
    ManagementWiseCounts.push({
      SchCategory: category._id,
      count: counts.length > 0 ? counts[0].totalStudent : 0,
    });
  }

  const fieldSchoolIds = await getSchoolIdByStreamWise();
  const streamWiseCount = [];
  for (const fieldData of fieldSchoolIds) {
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: fieldData.Schoolid },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);
    streamWiseCount.push({
      stream: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }

  const minortyWiseCountSchoolIds = await getSchoolIdByMinortyWise();
  const minortyWiseCount = [];
  for (const fieldData of minortyWiseCountSchoolIds) {
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: fieldData.Schoolid },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);
    minortyWiseCount.push({
      minority: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }

  const affiliationWiseCountSchoolIds = await getSchoolIdByAffiliationWise();
  const affiliationWiseCount = [];
  for (const fieldData of affiliationWiseCountSchoolIds) {
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: fieldData.Schoolid },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);
    affiliationWiseCount.push({
      affiliation: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }

  const SchCategoryCountSchoolIds = await getSchoolIdBySchCategory();
  const SchCategoryCount = [];
  for (const fieldData of SchCategoryCountSchoolIds) {
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: fieldData.Schoolid },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);
    SchCategoryCount.push({
      SchCategory: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }


  const studentShiftWiseCountsSchoolIds = await getSchoolIdByShiftWise();
  const studentShiftWiseCounts = [];
  for (const fieldData of studentShiftWiseCountsSchoolIds) {
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: fieldData.Schoolid },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);
    studentShiftWiseCounts.push({
      shift: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }


  const typeOfSchoolWiseCountsSchoolIds = await getSchoolIdByTypeOfSchoolWise();
  const typeOfSchoolWiseCounts = [];
  for (const fieldData of typeOfSchoolWiseCountsSchoolIds) {
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: fieldData.Schoolid },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);
    typeOfSchoolWiseCounts.push({
      typeOfSchool: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }

  try {
    const studentCount = await StudentCounts.aggregate([
      {
        $group: {
          _id: null,
          totalStudents: { $sum: '$totalStudent' },
          maleStudents: { $sum: '$maleStudents' },
          femaleStudents: { $sum: '$femaleStudents' },
          otherStudents: { $sum: '$otherStudents' },
        },
      },
    ]);

    const [totalSchools, totalTeachers, totalFemaleTeachers, totalMaleTeachers] = await Promise.allSettled([
      School.countDocuments().exec(),
      Teacher.countDocuments().exec(),
      Teacher.countDocuments({ gender: 'Female' }).exec(),
      Teacher.countDocuments({ gender: 'Male' }).exec(),
    ]);

    const teacherStudentRatio = studentCount[0].totalStudents / totalTeachers.value;
    const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
    const averageStudentOfSchool = studentCount[0].totalStudents / totalSchools.value;


    const SchoolCatogoryStudent = await StudentCounts.aggregate([
      {
        $unwind: '$classes',
      },
      {
        $group: {
          _id: '$classes.class',
          totalMaleStudents: { $sum: '$classes.male' },
          totalFemaleStudents: { $sum: '$classes.feMale' },
          totalOtherStudents: { $sum: '$classes.other' },
        },
      },
    ]);

    return {
      typeOfSchoolWiseCounts,
      studentShiftWiseCounts,
      minortyWiseCount,
      affiliationWiseCount,
      streamWiseCount,
      SchCategoryCount,
      ManagementWiseCounts,
      studentCount,
      averageStudentOfSchool,
      averageTeacherOfSchool,
      teacherStudentRatio,
    };
  } catch (error) {
    console.error('Error updating student statistics:', error);
  }
};


const getSchoolIdByShiftWiseDistrict = async (districtName) => {
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
  return StudentCounts.aggregate(pipeline);
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
        _id: '$SchCategory',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return schCategorySchoolIds = await School.aggregate(pipeline);
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
        _id: '$typeOfSchool',
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return School.aggregate(pipeline);
};


const getSchoolIdByMinorityWiseDistrict = async (districtName) => {
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
const getSchoolIdByManagementWiseDistrict = async (districtName) => {
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

const getSchoolIdByAffiliationWiseDistrict = async (districtName) => {
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

const getSchoolCountsByCriteriaDistrict = async (districtName) => {
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

const getStudentCountByDistrictName = async (districtName) => {
  const ShiftwiseCountsSchoolIds = await getSchoolIdByShiftWiseDistrict(districtName);
  const studentShiftWiseCounts = [];
  for (const fieldData of ShiftwiseCountsSchoolIds) {
    const schoolIds = Array.isArray(fieldData.Schoolid) ? fieldData.Schoolid : [fieldData.Schoolid];
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: schoolIds },
          District_name: districtName,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);
    studentShiftWiseCounts.push({
      shift: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }
  const SchCategoryCountSchoolIds = await getSchoolIdBySchCategoryWiseAndDistrict(districtName);
  const SchCategoryCount = [];
  for (const fieldData of SchCategoryCountSchoolIds) {
    const schoolIds = Array.isArray(fieldData.Schoolid) ? fieldData.Schoolid : [fieldData.Schoolid];
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: schoolIds },
          District_name: districtName,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);

    SchCategoryCount.push({
      SchCategory: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }

  const typeOfSchoolWiseCountsSchoolIds = await getSchoolIdByTypeOfSchoolWiseDistrict(districtName);
  const typeOfSchoolWiseCounts = [];
  for (const fieldData of typeOfSchoolWiseCountsSchoolIds) {
    const schoolIds = Array.isArray(fieldData.Schoolid) ? fieldData.Schoolid : [fieldData.Schoolid];
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: schoolIds },
          District_name: districtName,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);
    typeOfSchoolWiseCounts.push({
      typeOfSchool: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }

  const minortyWiseCountSchoolIds = await getSchoolIdByMinorityWiseDistrict(districtName);
  const minortyWiseCount = [];
  for (const fieldData of minortyWiseCountSchoolIds) {
    const schoolIds = Array.isArray(fieldData.Schoolid) ? fieldData.Schoolid : [fieldData.Schoolid];
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: schoolIds },
          District_name: districtName,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);
    minortyWiseCount.push({
      minority: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }

  const affiliationWiseCountSchoolIds = await getSchoolIdByAffiliationWiseDistrict(districtName);
  const affiliationWiseCount = [];
  for (const fieldData of affiliationWiseCountSchoolIds) {
    const schoolIds = Array.isArray(fieldData.Schoolid) ? fieldData.Schoolid : [fieldData.Schoolid];
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: schoolIds },
          District_name: districtName,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);
    affiliationWiseCount.push({
      minority: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }

  const streamWiseCountSchoolIds = await getSchoolCountsByCriteriaDistrict(districtName);
  const streamWiseCount = [];
  for (const fieldData of streamWiseCountSchoolIds) {
    const schoolIds = Array.isArray(fieldData.Schoolid) ? fieldData.Schoolid : [fieldData.Schoolid];
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: schoolIds },
          District_name: districtName,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);
    streamWiseCount.push({
      stream: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }
  const SchManagementSchoolIds = await getSchoolIdByManagementWiseDistrict(districtName);
  const studentManagemenetWiseCounts = [];
  for (const fieldData of SchManagementSchoolIds) {
    const schoolIds = Array.isArray(fieldData.Schoolid) ? fieldData.Schoolid : [fieldData.Schoolid];
    const count = await StudentCounts.aggregate([
      {
        $match: {
          Schoolid: { $in: schoolIds },
          District_name: districtName,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$totalStudent' },
        },
      },
    ]);
    studentManagemenetWiseCounts.push({
      SchManagement: fieldData._id,
      count: count.length > 0 ? count[0].totalCount : 0,
    });
  }


  const studentCount = await StudentCounts.aggregate([
    {
      $match: {
        District_name: districtName,
      },
    },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: '$totalStudent' },
        maleStudents: { $sum: '$maleStudents' },
        femaleStudents: { $sum: '$femaleStudents' },
        otherStudents: { $sum: '$otherStudents' },
      },
    },
  ]);

  const [totalSchools, totalTeachers, totalFemaleTeachers, totalMaleTeachers] = await Promise.allSettled([
    School.countDocuments({ District_name: districtName }).exec(),
    Teacher.countDocuments({ districtname: districtName }).exec(),
    Teacher.countDocuments({ gender: 'Female', districtname: districtName }).exec(),
    Teacher.countDocuments({ gender: 'Male', districtname: districtName }).exec(),
  ]);
  const teacherStudentRatio = studentCount[0].totalStudents / totalTeachers.value;
  const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
  const averageStudentOfSchool = studentCount[0].totalStudents / totalSchools.value;

  return {
    studentShiftWiseCounts,
    typeOfSchoolWiseCounts,
    minortyWiseCount,
    studentManagemenetWiseCounts,
    affiliationWiseCount,
    streamWiseCount,
    SchCategoryCount,
    studentCount,
    teacherStudentRatio,
    averageTeacherOfSchool,
    averageStudentOfSchool,
  };
};

const getSchoolIdByStreamWiseZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: { $ifNull: ['$stream', null] }, // Group by stream or null for missing values
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return StudentCounts.aggregate(pipeline);
};

const getSchoolIdByShiftWisZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$shift',
        count: { $sum: 1 },
      },
    },
  ];
  return StudentCounts.aggregate(pipeline);
};

const getSchoolIdByTypeOfSchoolWiseZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$typeOfSchool',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdBySchCategoryZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$SchCategory',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByMinorityWiseZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$minority',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};
const getSchoolIdByManagementWiseZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$SchManagement',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByAffiliationWiseZone = async (zone) => {
  const pipeline = [
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: '$affiliation',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolCountsByCriteriaZone = async (criteria, field, zone) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const counts = await School.aggregate([
        {
          $match: {
            Schoolid: { $in: item.Schoolid },
            Zone_Name: zone,
          },
        },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 }, // Count schools
          },
        },
      ]);
      return counts;
    })
  );
  return counts;
};

const getStudentCountByZoneName = async (zone) => {
  const studentShiftWiseCounts = await getSchoolIdByShiftWisZone(zone);
  const SchCategoryCount = await getSchoolIdBySchCategoryZone(zone);
  const TypeOfSchoolCounts = await getSchoolIdByTypeOfSchoolWiseZone(zone);
  const MinorityCounts = await getSchoolIdByMinorityWiseZone(zone);
  const ManagemenetCounts = await getSchoolIdByManagementWiseZone(zone);
  const AffilitionCounts = await getSchoolIdByAffiliationWiseZone(zone);
  const schoolCriteria = await getSchoolIdByStreamWiseZone(zone);
  const streamWiseCount = await getSchoolCountsByCriteriaZone(schoolCriteria, 'stream', zone);

  const studentCount = await StudentCounts.aggregate([
    {
      $match: {
        Zone_Name: zone,
      },
    },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: '$totalStudent' },
        maleStudents: { $sum: '$maleStudents' },
        femaleStudents: { $sum: '$femaleStudents' },
        otherStudents: { $sum: '$otherStudents' },
      },
    },
  ]);

  const cleanedZoneName = zone.replace(/[^0-9]/g, '');
  const [totalSchools, totalTeachers, totalFemaleTeachers, totalMaleTeachers ] = await Promise.allSettled([
    School.countDocuments({ Zone_Name: zone }).exec(),
    Teacher.countDocuments({ zonename: cleanedZoneName }).exec(),
    Teacher.countDocuments({ gender: 'Female', zonename: cleanedZoneName }).exec(),
    Teacher.countDocuments({ gender: 'Male', zonename: cleanedZoneName }).exec(),
  ]);

  // const teacherStudentRatio = studentCount[0].totalStudents / totalTeachers.value;
  const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
  // const averageStudentOfSchool = studentCount[0].totalStudents / totalSchools.value;

  return {
    studentShiftWiseCounts,
    TypeOfSchoolCounts,
    MinorityCounts,
    ManagemenetCounts,
    AffilitionCounts,
    streamWiseCount,
    SchCategoryCount,
    studentCount,
    // teacherStudentRatio,
    averageTeacherOfSchool,
    // averageStudentOfSchool,
  };
};
const getSchoolIdByStreamWiseschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: { $ifNull: ['$stream', null] }, // Group by stream or null for missing values
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];
  return StudentCounts.aggregate(pipeline);
};

const getSchoolIdByShiftWisschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: '$shift',
        count: { $sum: 1 },
      },
    },
  ];
  return StudentCounts.aggregate(pipeline);
};

const getSchoolIdByTypeOfSchoolWiseschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: '$typeOfSchool',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByMinorityWiseschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: '$minority',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};
const getSchoolIdByManagementWiseschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: '$SchManagement',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdByAffiliationWiseschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: '$affiliation',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolIdBySchCategoryWiseschoolName = async (schoolName) => {
  const pipeline = [
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: '$SchCategory',
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolCountsByCriteriaschoolName = async (criteria, field, schoolName) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const counts = await School.aggregate([
        {
          $match: {
            Schoolid: { $in: item.Schoolid },
            School_Name: schoolName,
          },
        },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 }, // Count schools
          },
        },
      ]);
      return counts;
    })
  );
  return counts;
};


const getStudentCountBySchoolName = async (schoolName) => {
  const studentShiftWiseCounts = await getSchoolIdByShiftWisschoolName(schoolName);
  const typeOfSchoolWiseCounts = await getSchoolIdByTypeOfSchoolWiseschoolName(schoolName);
  const minortyWiseCount = await getSchoolIdByMinorityWiseschoolName(schoolName);
  const managementWiseCount = await getSchoolIdByManagementWiseschoolName(schoolName);
  const affiliationWiseCount = await getSchoolIdByAffiliationWiseschoolName(schoolName);
  const SchCategoryCount = await getSchoolIdBySchCategoryWiseschoolName(schoolName);
  const schoolCriteria = await getSchoolIdByStreamWiseschoolName(schoolName);
  const streamWiseCount = await getSchoolCountsByCriteriaschoolName(schoolCriteria, 'stream', schoolName);
  const studentCount = await StudentCounts.aggregate([
    {
      $match: {
        School_Name: schoolName,
      },
    },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: '$totalStudent' },
        maleStudents: { $sum: '$maleStudents' },
        femaleStudents: { $sum: '$femaleStudents' },
        otherStudents: { $sum: '$otherStudents' },
      },
    },
  ]);
  
  const [totalSchools, totalTeachers, totalFemaleTeachers, totalMaleTeachers] = await Promise.allSettled([
    School.countDocuments({ School_Name: schoolName }).exec(),
    Teacher.countDocuments({ School_Name: schoolName }).exec(),
    Teacher.countDocuments({ gender: 'Female', School_Name: schoolName }).exec(),
    Teacher.countDocuments({ gender: 'Male', School_Name: schoolName }).exec(),
  ]);
  const teacherStudentRatio = studentCount[0].totalStudents / totalTeachers.value;
  const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
  const averageStudentOfSchool = studentCount[0].totalStudents / totalSchools.value;

  return {
    studentShiftWiseCounts,
    typeOfSchoolWiseCounts,
    minortyWiseCount,
    managementWiseCount,
    affiliationWiseCount,
    streamWiseCount,
    SchCategoryCount,
    studentCount,
    teacherStudentRatio,
    averageTeacherOfSchool,
    averageStudentOfSchool,
  };
};

module.exports = {
  getStudentCount,
  getStudentCountByDistrictName,
  getStudentCountByZoneName,
  getStudentCountBySchoolName,
};
