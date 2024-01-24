const httpStatus = require('http-status');
const { School, Student, Teacher, GuestTeacher } = require('../models');
const redis = require('../utils/redis');

// Function to get school IDs by a specific field (e.g., SchCategory, stream, etc.)
const getSchoolIdsByField = async (field) => {
  const pipeline = [
    {
      $group: {
        _id: `$${field}`,
        Schoolid: { $addToSet: '$Schoolid' },
      },
    },
  ];

  return School.aggregate(pipeline);
};

const getStudentStatusCountsAggregation = async () => {
  const pipeline = [
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
const getGenderCountsStudents = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$Gender',
        count: { $sum: 1 },
      },
    },
  ];

  return Student.aggregate(pipeline);
};

// Function to get student counts by a specific field (e.g., SchCategory, stream, etc.)
const getStudentCountsByField = async (schoolIds, field) => {
  const counts = await Promise.all(
    schoolIds.map(async (item) => {
      const count = await Student.countDocuments({ Schoolid: { $in: item.Schoolid } });
      return { [field]: item._id, count };
    })
  );

  return counts;
};

/**
 * Get student count statistics
 * @returns {Promise<StudentStats>}
 */

// Function to get statistics about students
const getStudentStats = async () => {
  const fields = ['SchCategory', 'typeOfSchool', 'shift', 'SchManagement'];
  const fieldPromises = fields.map(async (field) => {
    const schoolIds = await getSchoolIdsByField(field);
    const counts = await getStudentCountsByField(schoolIds, field);
    return { [field]: counts };
  });
  const statusCounts = await getStudentStatusCountsAggregation();
  const genderCountsStudents = await getGenderCountsStudents();
  const fieldResults = await Promise.all(fieldPromises);

  // Fetch other statistics
  const [totalSchools, totalStudent, studyingStudents, totalTeachers] = await Promise.allSettled([
    School.countDocuments().exec(),
    Student.countDocuments().exec(),
    Student.countDocuments({ status: 'Studying' }).exec(),
    Teacher.countDocuments().exec(),
  ]);
  const totalGuestTeacher = await GuestTeacher.countDocuments().exec();

  const totalTeachersCount =  totalGuestTeacher + totalTeachers.value;
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
const getStudentStatusCountsByDistrict = async (district) => {
  const pipeline = [
    {
      $match: { District: district },
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
const getGenderCountsStudentsByDistrict = async (district) => {
  const pipeline = [
    {
      $match: { District: district },
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
  const fields = ['SchCategory', 'typeOfSchool', 'shift', 'SchManagement'];
  const fieldPromises = fields.map(async (field) => {
    const schoolIds = await getSchoolIdsByField(field);
    const counts = await getStudentCountsByFieldAndDistrict(schoolIds, field, district);
    return { [field]: counts };
  });
  const statusCounts = await getStudentStatusCountsByDistrict(district);
  const genderCountsStudents = await getGenderCountsStudentsByDistrict(district);
  const fieldResults = await Promise.all(fieldPromises);

  // Fetch other statistics
  const [totalSchools, totalStudent, studyingStudents, totalTeachers] = await Promise.allSettled([
    School.countDocuments({ District_name: district }).exec(),
    Student.countDocuments({ District: district }).exec(),
    Student.countDocuments({ District: district, status: 'Studying' }).exec(),
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
const getStudentStatusCountsByZone = async (zone) => {
  const pipeline = [
    {
      $match: { z_name: zone.toLowerCase() },
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
const getGenderCountsStudentsByZone = async (zone) => {
  const pipeline = [
    {
      $match: { z_name: zone.toLowerCase() },
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
  const fields = ['SchCategory', 'typeOfSchool', 'shift', 'SchManagement'];
  const fieldPromises = fields.map(async (field) => {
    const schoolIds = await getSchoolIdsByField(field);
    const counts = await getStudentCountsByFieldAndZone(schoolIds, field, zone);
    return { [field]: counts };
  });
  const statusCounts = await getStudentStatusCountsByZone(zone);
  const genderCountsStudents = await getGenderCountsStudentsByZone(zone);
  const fieldResults = await Promise.all(fieldPromises);

  // Fetch other statistics
  const [totalSchools, totalStudent, studyingStudents, totalTeachers] = await Promise.allSettled([
    School.countDocuments({ Zone_Name: zone }).exec(),
    Student.countDocuments({ z_name: zone.toLowerCase() }).exec(),
    Student.countDocuments({ z_name: zone.toLowerCase(), status: 'Studying' }).exec(),
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
  const fields = ['SchCategory', 'typeOfSchool', 'shift', 'SchManagement'];
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
