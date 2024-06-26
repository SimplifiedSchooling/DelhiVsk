const httpStatus = require('http-status');
const { School, Student, Teacher, GuestTeacher } = require('../models');
const redis = require('../utils/redis');

// Function to get school IDs by a specific field (e.g., SchCategory, stream, etc.)
const getSchoolIdsByField = async (field) => {
  const pipeline = [
    {
      $match: { SchManagement: "Government" }
    },
    {
      $group: {
        _id: `$${field}`,
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};

const getStudentStatusCountsAggregation = async (schoolIds) => {
  const pipeline = [
    {
      $match:  { Schoolid: { $in: schoolIds }  }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ];

  return Student.aggregate(pipeline);
};

const getGenderCountsStudents = async (schoolIds) => {
  const pipeline = [
    {
      $match: { Schoolid: { $in: schoolIds }  }
    },
    {
      $group: {
        _id: '$Gender',
        count: { $sum: 1 },
      },
    },
  ];

  return Student.aggregate(pipeline);
};

const getStudentCountsByField = async (schoolIds, field) => {
  const counts = await Promise.all(
    schoolIds.map(async (item) => {
      const count = await Student.countDocuments({ Schoolid: { $in: item.Schoolid } });
      return { [field]: item._id, count };
    })
  );

  return counts;
};

const getStudentStats = async () => {
  const fields = ['SchCategory', 'gender', 'shift', 'SchManagement'];
  const fieldPromises = fields.map(async (field) => {
    const schoolIds = await getSchoolIdsByField(field);
    const counts = await getStudentCountsByField(schoolIds, field);
    return { [field]: counts };
  });
  const schools = await School.find({ SchManagement: "Government" });
  const schoolIds = schools.map((school) => school.Schoolid);
  const statusCounts = await getStudentStatusCountsAggregation(schoolIds);
  const genderCountsStudents = await getGenderCountsStudents(schoolIds);
  const fieldResults = await Promise.all(fieldPromises);



  const [totalSchools, totalStudent, studyingStudents, totalTeachers] = await Promise.allSettled([
    School.countDocuments({ SchManagement: "Government" }).exec(),
    Student.countDocuments({ Schoolid: { $in: schoolIds } }).exec(),
    Student.countDocuments({ Schoolid: { $in: schoolIds }, status: 'Studying' }).exec(),
    Teacher.countDocuments().exec(),
  ]);

  const totalGuestTeacher = await GuestTeacher.countDocuments().exec();
  const totalTeachersCount = totalGuestTeacher + totalTeachers.value;
  const teacherStudentRatio = studyingStudents.value / totalTeachersCount;
  const averageStudentOfSchool = totalStudent.value / totalSchools.value;
  const totalStudents = totalStudent.value;

  return {
    studentStats: fieldResults,
    studentStatusCounts: statusCounts,
    studentGenderCounts: genderCountsStudents,
    teacherStudentRatio,
    averageStudentOfSchool,
    totalStudents,
  };
};

// Function to get student counts
const getStudentCount = async () => {
  const cachedData = await redis.get('getStudentCount');

  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const studentStats = await getStudentStats();
  await redis.set('getStudentCount', JSON.stringify(studentStats), 'EX', 24 * 60 * 60);

  return studentStats;
};

/// //////////////////////////District//////////////////

// Function to get student counts by a specific field and district
const getStudentCountsByFieldAndDistrict = async (schoolIds, field, district) => {
  const counts = await Promise.all(
    schoolIds.map(async (item) => {
      const count = await Student.countDocuments({
        Schoolid: { $in: item.Schoolid },
        District: district,
      });
      return { [field]: item._id, count };
    })
  );

  return counts;
};

// Function to get student status counts by district
const getStudentStatusCountsByDistrict = async (district, schoolIds) => {
  const pipeline = [
    {
      $match: { District: district, Schoolid: { $in: schoolIds } },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ];

  return Student.aggregate(pipeline);
};

// Function to get gender counts of students by district
const getGenderCountsStudentsByDistrict = async (district, schoolIds) => {
  const pipeline = [
    {
      $match: { District: district, Schoolid: { $in: schoolIds } },
    },
    {
      $group: {
        _id: '$Gender',
        count: { $sum: 1 },
      },
    },
  ];

  return Student.aggregate(pipeline);
};

/**
 * Get student count statistics by district
 * @param {string} district - The district name
 * @returns {Promise<StudentStats>}
 */
const getStudentCountByDistrictName = async (district) => {
  const fields = ['SchCategory', 'gender', 'shift', 'SchManagement'];
  const fieldPromises = fields.map(async (field) => {
    const schoolIds = await getSchoolIdsByField(field);
    const counts = await getStudentCountsByFieldAndDistrict(schoolIds, field, district);
    return { [field]: counts };
  });
  const schools = await School.find({District_name:district, SchManagement: "Government" });
  const schoolIds = schools.map((school) => school.Schoolid);
  const statusCounts = await getStudentStatusCountsByDistrict(district, schoolIds);
  const genderCountsStudents = await getGenderCountsStudentsByDistrict(district, schoolIds);
  const fieldResults = await Promise.all(fieldPromises);

  // Fetch other statistics
  const [totalSchools, totalStudent, studyingStudents, totalTeachers] = await Promise.allSettled([
    School.countDocuments({ SchManagement: "Government", District_name: district }).exec(),
    Student.countDocuments({Schoolid: { $in: schoolIds }, District: district }).exec(),
    Student.countDocuments({ Schoolid: { $in: schoolIds }, District: district, status: 'Studying' }).exec(),
    Teacher.countDocuments({ districtname: district }).exec(),
  ]);

  const totalGuestTeacher = await GuestTeacher.countDocuments({ Districtname: district }).exec();
  const totoal = totalTeachers.value + totalGuestTeacher;

  const teacherStudentRatio = studyingStudents.value / totoal;
  // const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
  const averageStudentOfSchool = totalStudent.value / totalSchools.value;

  const totalStudents = totalStudent.value;

  return {
    studentStats: fieldResults,
    studentStatusCounts: statusCounts,
    studentGenderCounts: genderCountsStudents,
    teacherStudentRatio,
    averageStudentOfSchool,
    totalStudents,
  };
};

/// ///////////////////////////Zone//////////////////////
// Function to get student counts by a specific field and district
const getStudentCountsByFieldAndZone = async (schoolIds, field, zone) => {
  const counts = await Promise.all(
    schoolIds.map(async (item) => {
      const count = await Student.countDocuments({
        Schoolid: { $in: item.Schoolid },
        z_name: zone.toLowerCase(),
      });
      return { [field]: item._id, count };
    })
  );

  return counts;
};

// Function to get student status counts by district
const getStudentStatusCountsByZone = async (zone, schoolIds) => {
  const pipeline = [
    {
      $match: { z_name: zone.toLowerCase(), Schoolid: { $in: schoolIds }},
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ];

  return Student.aggregate(pipeline);
};

// Function to get gender counts of students by district
const getGenderCountsStudentsByZone = async (zone, schoolIds) => {
  const pipeline = [
    {
      $match: { z_name: zone.toLowerCase(), Schoolid: { $in: schoolIds } },
    },
    {
      $group: {
        _id: '$Gender',
        count: { $sum: 1 },
      },
    },
  ];

  return Student.aggregate(pipeline);
};

/**
 * Get student count statistics by school
 * @param {string} schoolId - The school ID
 * @returns {Promise<StudentStats>}
 */

const getStudentCountByZoneName = async (zone) => {
  const cleanedZoneName = zone.replace(/[^0-9]/g, '');
  const cacheKey = `zoneStudentGraphs:${cleanedZoneName}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const fields = ['SchCategory', 'gender', 'shift', 'SchManagement'];
  const fieldPromises = fields.map(async (field) => {
    const schoolIds = await getSchoolIdsByField(field);
    const counts = await getStudentCountsByFieldAndZone(schoolIds, field, zone);
    return { [field]: counts };
  });

  const schools = await School.find({Zone_Name: zone, SchManagement: "Government" });
  const schoolIds = schools.map((school) => school.Schoolid);
  const statusCounts = await getStudentStatusCountsByZone(zone, schoolIds);
  const genderCountsStudents = await getGenderCountsStudentsByZone(zone, schoolIds);
  const fieldResults = await Promise.all(fieldPromises);

  // Fetch other statistics
  const [totalSchools, totalStudent, studyingStudents, totalTeachers] = await Promise.allSettled([
    School.countDocuments({ Zone_Name: zone, SchManagement: "Government" }).exec(),
    Student.countDocuments({ Schoolid: { $in: schoolIds }, z_name: zone.toLowerCase() }).exec(),
    Student.countDocuments({ Schoolid: { $in: schoolIds }, z_name: zone.toLowerCase(), status: 'Studying' }).exec(),
    Teacher.countDocuments({ zonename: cleanedZoneName }).exec(),
  ]);

  const totalGuestTeacher = await GuestTeacher.countDocuments({ Zonename: cleanedZoneName }).exec();
  const total = totalGuestTeacher + totalTeachers.value;

  const teacherStudentRatio = studyingStudents.value / total;
  const averageStudentOfSchool = totalStudent.value / totalSchools.value;

  const totalStudents = totalStudent.value;
  const data = {
    studentStats: fieldResults,
    studentStatusCounts: statusCounts,
    studentGenderCounts: genderCountsStudents,
    teacherStudentRatio,
    averageStudentOfSchool,
    totalStudents,
  };

  await redis.set(cacheKey, JSON.stringify(data), 'EX', 24 * 60 * 60);
  return data;
};

/// //////////////////////////////////SChool////////////////////////

const getGenderCountsStudentsBySchoolId = async (schoolId) => {
  const pipeline = [
    {
      $match: { Schoolid: Number(schoolId) },
    },
    {
      $group: {
        _id: '$Gender',
        count: { $sum: 1 },
      },
    },
  ];

  return Student.aggregate(pipeline);
};

// Function to get student status counts by schoolId
const getStudentStatusCountsBySchoolId = async (schoolId) => {
  const pipeline = [
    {
      $match: { Schoolid: Number(schoolId) },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ];

  return Student.aggregate(pipeline);
};

// Function to get student counts by a specific field and schoolId
const getStudentCountsByFieldAndSchoolId = async (schoolId, field) => {
  const pipeline = [
    {
      $match: { Schoolid: Number(schoolId) },
    },
    {
      $lookup: {
        from: 'schools',
        localField: 'Schoolid',
        foreignField: 'Schoolid',
        as: 'schoolData',
      },
    },
    {
      $unwind: '$schoolData',
    },
    {
      $group: {
        _id: `$schoolData.${field}`,
        count: { $sum: 1 },
      },
    },
  ];

  return Student.aggregate(pipeline);
};

const getStudentCountBySchoolName = async (schoolId) => {
  const fields = ['SchCategory', 'gender', 'shift', 'SchManagement'];
  const fieldPromises = fields.map(async (field) => {
    const counts = await getStudentCountsByFieldAndSchoolId(schoolId, field);
    const formattedCounts = counts.map((item) => {
      return {
        [field]: [
          {
            [field]: item._id,
            count: item.count,
          },
        ],
      };
    });
    return formattedCounts;
  });

  const statusCounts = await getStudentStatusCountsBySchoolId(schoolId);
  const genderCountsStudents = await getGenderCountsStudentsBySchoolId(schoolId);

  // Fetch other statistics
  const [totalSchools, totalStudent, studyingStudents, totalTeachers] = await Promise.allSettled([
    School.countDocuments({ Schoolid: Number(schoolId) }).exec(),
    Student.countDocuments({ Schoolid: Number(schoolId) }).exec(),
    Student.countDocuments({ Schoolid: Number(schoolId), status: 'Studying' }).exec(),
    Teacher.countDocuments({ schoolid: schoolId }).exec(),
  ]);

  const totalGuestTeacher = await GuestTeacher.countDocuments({ SchoolID: schoolId }).exec();

  const totoal = totalTeachers.value + totalGuestTeacher;

  const teacherStudentRatio = studyingStudents.value / totoal;
  const averageStudentOfSchool = totalStudent.value / totalSchools.value;
  const totalStudents = totalStudent.value;

  const fieldResults = await Promise.all(fieldPromises);

  return {
    studentStats: fieldResults.flat(),
    studentStatusCounts: statusCounts,
    studentGenderCounts: genderCountsStudents,
    teacherStudentRatio,
    averageStudentOfSchool,
    totalStudents,
  };
};

module.exports = {
  getStudentCount,
  getStudentCountByDistrictName,
  getStudentCountByZoneName,
  getStudentCountBySchoolName,
};
