const httpStatus = require('http-status');
const { School, Student, Teacher } = require('../models');
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
  
  // Function to get gender counts of teachers by district
  const getGenderCountsTeachers = async () => {
    const pipeline = [
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 },
        },
      },
    ];
  
    return Teacher.aggregate(pipeline);
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
  
  // Function to get statistics about students
  const getStudentStats = async () => {
    const fields = ['SchCategory', 'stream', 'minority', 'affiliation', 'typeOfSchool', 'shift', 'SchManagement'];
    const fieldPromises = fields.map(async (field) => {
      const schoolIds = await getSchoolIdsByField(field);
      const counts = await getStudentCountsByField(schoolIds, field);
      return { [field]: counts };
    });
    const statusCounts = await getStudentStatusCountsAggregation();
    const genderCountsStudents = await getGenderCountsStudents();
    const genderCountsTeachers = await getGenderCountsTeachers();
    const fieldResults = await Promise.all(fieldPromises);
  
    // Fetch other statistics
    const [totalSchools, totalStudent, totalTeachers] = await Promise.allSettled([
      School.countDocuments().exec(),
      Student.countDocuments().exec(),
      Teacher.countDocuments().exec(),
    ]);
  
    const teacherStudentRatio = totalStudent.value / totalTeachers.value;
    const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
    const averageStudentOfSchool = totalStudent.value / totalSchools.value;
  
    const totalStudents = totalStudent.value;
  
    return {
      studentStats: fieldResults,
      studentStatusCounts: statusCounts,
      studentGenderCounts: genderCountsStudents,
      teacherGenderCounts: genderCountsTeachers,
      teacherStudentRatio,
      averageTeacherOfSchool,
      averageStudentOfSchool,
      totalStudents,
    };
  };
  
  // Function to get student counts
  const getStudentCount = async () => {
    // Check if the data is already cached in Redis
    const cachedData = await redis.get('getStudentCount');
  
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const studentStats = await getStudentStats();
    console.log(studentStats)
    // Cache the result in Redis for future use
    await redis.set('getStudentCount', JSON.stringify(studentStats), 'EX', 24 * 60 * 60);
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

// Function to get gender counts of teachers by district
const getGenderCountsTeachers = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$gender',
        count: { $sum: 1 },
      },
    },
  ];

  return Teacher.aggregate(pipeline);
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

// Function to get statistics about students
const getStudentStats = async () => {
  const fields = ['SchCategory', 'stream', 'minority', 'affiliation', 'typeOfSchool', 'shift', 'SchManagement'];
  const fieldPromises = fields.map(async (field) => {
    const schoolIds = await getSchoolIdsByField(field);
    const counts = await getStudentCountsByField(schoolIds, field);
    return { [field]: counts };
  });
  const statusCounts = await getStudentStatusCountsAggregation();
  const genderCountsStudents = await getGenderCountsStudents();
  const genderCountsTeachers = await getGenderCountsTeachers();
  const fieldResults = await Promise.all(fieldPromises);

  // Fetch other statistics
  const [totalSchools, totalStudent, totalTeachers] = await Promise.allSettled([
    School.countDocuments().exec(),
    Student.countDocuments().exec(),
    Teacher.countDocuments().exec(),
  ]);

  const teacherStudentRatio = totalStudent.value / totalTeachers.value;
  const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
  const averageStudentOfSchool = totalStudent.value / totalSchools.value;

  const totalStudents = totalStudent.value;

  return {
    studentStats: fieldResults,
    studentStatusCounts: statusCounts,
    studentGenderCounts: genderCountsStudents,
    teacherGenderCounts: genderCountsTeachers,
    teacherStudentRatio,
    averageTeacherOfSchool,
    averageStudentOfSchool,
    totalStudents,
  };
};

// Function to get student counts
const getStudentCount = async () => {
  // Check if the data is already cached in Redis
  // const cachedData = await redis.get('getStudentCount');

  // if (cachedData) {
  //   return JSON.parse(cachedData);
  // }
  console.log('jdgf');
  const studentStats = await getStudentStats();
  console.log(studentStats);
  // Cache the result in Redis for future use
  // await redis.set('getStudentCount', JSON.stringify(studentStats), 'EX', 24 * 60 * 60);

    return studentStats;
  };

