const { School, StudentCounts } = require('../models');

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
        _id: { $ifNull: ['$stream', null] }, // Group by stream or null for missing values
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

const getStudentCount = async () => {
  const studentManagementWiseCounts = await getSchoolIdByManagmentWise();
  const ManagementWiseCounts = await getSchoolCountsByCriteria(studentManagementWiseCounts, 'SchManagement');

  const streamWisehoolIds = await getSchoolIdByStreamWise();
  const streamWiseCount = await getSchoolCountsByCriteria(streamWisehoolIds, 'stream');

  const minorityWiseSchoolIds = await getSchoolIdByMinortyWise();
  const minortyWiseCount = await getSchoolCountsByCriteria(minorityWiseSchoolIds, 'minority');

  const affiliationWiseSchoolIds = await getSchoolIdByAffiliationWise();
  const affiliationWiseCount = await getSchoolCountsByCriteria(affiliationWiseSchoolIds, 'affiliation');

  const ManagementWiseSchoolIds = await getSchoolIdByManagementWise();
  const managementWiseCount = await getSchoolCountsByCriteria(ManagementWiseSchoolIds, 'SchManagement');

  const SchCategory = await getSchoolIdBySchCategory();
  const SchCategoryCount = await getSchoolCountsByCriteria(SchCategory, 'SchCategory');

  const shiftWiseSchoolid = await getSchoolIdByShiftWise();
  const studentShiftWiseCounts = await getSchoolCountsByCriteria(shiftWiseSchoolid, 'shift');

  const typeOfSchoolsWiseSchoolid = await getSchoolIdByTypeOfSchoolWise();
  const typeOfSchoolWiseCounts = await getSchoolCountsByCriteria(typeOfSchoolsWiseSchoolid, 'typeOfSchool');

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

    // Format the output data consistently
    const formattedTypeOfSchoolWiseCounts = typeOfSchoolWiseCounts.map((item) => ({
      _id: item[0]._id,
      count: item[0].count,
    }));

    const formattedStudentShiftWiseCounts = studentShiftWiseCounts.map((item) => ({
      _id: item[0]._id,
      count: item[0].count,
    }));

    // Format other fields in a similar way
    const formattedMinortyWiseCount = minortyWiseCount.map((item) => ({
      _id: item[0]._id,
      count: item[0].count,
    }));

    const formattedAffiliationWiseCount = affiliationWiseCount.map((item) => ({
      _id: item[0]._id,
      count: item[0].count,
    }));

    const formattedmanagementWiseCount = managementWiseCount.map((item) => ({
      _id: item[0]._id,
      count: item[0].count,
    }));

    const formattedSchCategoryCount = SchCategoryCount.map((item) => ({
      _id: item[0]._id,
      count: item[0].count,
    }));
    const formattedStreamWiseCount = streamWiseCount.map((item) => ({
      _id: item[0]._id,
      count: item[0].count,
    }));
    // 
    const formattedManagementWiseCounts = ManagementWiseCounts.map((item) => ({
      _id: item[0]._id,
      count: item[0].count,
    }));
    return {
      typeOfSchoolWiseCounts: formattedTypeOfSchoolWiseCounts,
      studentShiftWiseCounts: formattedStudentShiftWiseCounts,
      minortyWiseCount: formattedMinortyWiseCount,
      affiliationWiseCount: formattedAffiliationWiseCount,
      managementWiseCount: formattedmanagementWiseCount,
      streamWiseCount: formattedStreamWiseCount,
      SchCategoryCount: formattedSchCategoryCount,
      ManagementWiseCounts:formattedManagementWiseCounts,
      studentCount,
      averageStudentOfSchool,
      averageTeacherOfSchool,
      teacherStudentRatio,
      // SchoolCatogoryStudent,
      // teacherCounts,

    };
  } catch (error) {
    console.error('Error updating student statistics:', error);
  }
};

const getSchoolIdByStreamWiseDistrict = async (districtName) => {
  const pipeline = [
    {
      $match: {
        District_name: districtName,
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
        count: { $sum: 1 },
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
        count: { $sum: 1 },
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
        count: { $sum: 1 },
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
        count: { $sum: 1 },
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
        count: { $sum: 1 },
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
        count: { $sum: 1 },
      },
    },
  ];
  return School.aggregate(pipeline);
};

const getSchoolCountsByCriteriaDistrict = async (criteria, field, districtName) => {
  const counts = await Promise.all(
    criteria.map(async (item) => {
      const counts = await School.aggregate([
        {
          $match: {
            Schoolid: { $in: item.Schoolid },
            District_name: districtName,
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


const getStudentCountByDistrictName = async (districtName) => {
  const studentShiftWiseCounts = await getSchoolIdByShiftWiseDistrict(districtName);
  const SchCategoryCount = await getSchoolIdBySchCategoryWiseAndDistrict(districtName);
  const typeOfSchoolWiseCounts = await getSchoolIdByTypeOfSchoolWiseDistrict(districtName);
  const minortyWiseCount = await getSchoolIdByMinorityWiseDistrict(districtName);
  const studentManagemenetWiseCounts = await getSchoolIdByManagementWiseDistrict(districtName);
  const affiliationWiseCount = await getSchoolIdByAffiliationWiseDistrict(districtName);
  const schoolCriteria = await getSchoolIdByStreamWiseDistrict(districtName);
  const streamWiseCount = await getSchoolCountsByCriteriaDistrict(schoolCriteria, 'stream', districtName);
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
  const [totalSchools, totalTeachers, totalFemaleTeachers, totalMaleTeachers] = await Promise.allSettled([
    School.countDocuments({ Zone_Name: zone }).exec(),
    Teacher.countDocuments({ zonename: cleanedZoneName }).exec(),
    Teacher.countDocuments({ gender: 'Female', zonename: cleanedZoneName }).exec(),
    Teacher.countDocuments({ gender: 'Male', zonename: cleanedZoneName }).exec(),
  ]);

  const teacherStudentRatio = studentCount[0].totalStudents / totalTeachers.value;
  const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
  const averageStudentOfSchool = studentCount[0].totalStudents / totalSchools.value;

  return {
    studentShiftWiseCounts,
    TypeOfSchoolCounts,
    MinorityCounts,
    ManagemenetCounts,
    AffilitionCounts,
    streamWiseCount,
    SchCategoryCount,
    studentCount,
    teacherStudentRatio,
    averageTeacherOfSchool,
    averageStudentOfSchool,
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
