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
  
//   // Function to get gender counts of teachers by district
//   const getGenderCountsTeachers = async () => {
//     const pipeline = [
//       {
//         $group: {
//           _id: '$gender',
//           count: { $sum: 1 },
//         },
//       },
//     ];
  
//     return Teacher.aggregate(pipeline);
//   };
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
//   'stream', 'minority', 'affiliation',
  const getStudentStats = async () => {
    const fields = ['SchCategory',  'typeOfSchool', 'shift', 'SchManagement'];
    const fieldPromises = fields.map(async (field) => {
      const schoolIds = await getSchoolIdsByField(field);
      const counts = await getStudentCountsByField(schoolIds, field);
      return { [field]: counts };
    });
    const statusCounts = await getStudentStatusCountsAggregation();
    const genderCountsStudents = await getGenderCountsStudents();
    // const genderCountsTeachers = await getGenderCountsTeachers();
    const fieldResults = await Promise.all(fieldPromises);
  
    // Fetch other statistics
    const [totalSchools, totalStudent, studyingStudents, totalTeachers] = await Promise.allSettled([
      School.countDocuments().exec(),
      Student.countDocuments().exec(),
      Student.countDocuments({status: 'Studying'}).exec(),
      Teacher.countDocuments().exec(),
    ]);

    const teacherStudentRatio = studyingStudents.value / totalTeachers.value;
    // const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
    const averageStudentOfSchool = totalStudent.value / totalSchools.value;
  
    const totalStudents = totalStudent.value;
  
    return {
      studentStats: fieldResults,
      studentStatusCounts: statusCounts,
      studentGenderCounts: genderCountsStudents,
    //   teacherGenderCounts: genderCountsTeachers,
      teacherStudentRatio,
    //   averageTeacherOfSchool,
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
    // Cache the result in Redis for future use
    await redis.set('getStudentCount', JSON.stringify(studentStats), 'EX', 24 * 60 * 60);

    return studentStats;
  };

/////////////////////////////District//////////////////

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

 
  // Function to get statistics about students by district
//   'stream', 'minority', 'affiliation',
  const getStudentCountByDistrictName = async (district) => {
    const fields = ['SchCategory',  'typeOfSchool', 'shift', 'SchManagement'];
    const fieldPromises = fields.map(async (field) => {
      const schoolIds = await getSchoolIdsByField(field);
      const counts = await getStudentCountsByFieldAndDistrict(schoolIds, field, district);
      return { [field]: counts };
    });
    const statusCounts = await getStudentStatusCountsByDistrict(district);
    const genderCountsStudents = await getGenderCountsStudentsByDistrict(district);
    // const genderCountsTeachers = await getGenderCountsTeachersByDistrict(district);
    const fieldResults = await Promise.all(fieldPromises);
  
    // Fetch other statistics
    const [totalSchools, totalStudent, studyingStudents, totalTeachers] = await Promise.allSettled([
      School.countDocuments({ District_name: district }).exec(),
      Student.countDocuments({ District: district }).exec(),
      Student.countDocuments({District: district, status: 'Studying'}).exec(),
      Teacher.countDocuments({ districtname: district }).exec(),
    ]);
  
    const teacherStudentRatio = studyingStudents.value / totalTeachers.value;
    // const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
    const averageStudentOfSchool = totalStudent.value / totalSchools.value;
  
    const totalStudents = totalStudent.value;
  
    return {
        studentStats: fieldResults,
        studentStatusCounts: statusCounts,
        studentGenderCounts: genderCountsStudents,
      //   teacherGenderCounts: genderCountsTeachers,
        teacherStudentRatio,
        // averageTeacherOfSchool,
        averageStudentOfSchool,
        totalStudents,
      };
  };

//////////////////////////////Zone//////////////////////
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
  
//   // Function to get gender counts of teachers by district
//   const getGenderCountsTeachersByZone = async (zone) => {
//     const cleanedZoneName = zone.replace(/[^0-9]/g, '');
//     const pipeline = [
//       {
//         $match: { zonename: cleanedZoneName },
//       },
//       {
//         $group: {
//           _id: '$gender',
//           count: { $sum: 1 },
//         },
//       },
//     ];
  
//     return Teacher.aggregate(pipeline);
//   };
  
  // Function to get statistics about students by zone
  const getStudentCountByZoneName = async (zone) => {
    const cleanedZoneName = zone.replace(/[^0-9]/g, '');
    const fields = ['SchCategory', 'stream', 'minority', 'affiliation', 'typeOfSchool', 'shift', 'SchManagement'];
    const fieldPromises = fields.map(async (field) => {
      const schoolIds = await getSchoolIdsByField(field);
      const counts = await getStudentCountsByFieldAndZone(schoolIds, field, zone);
      return { [field]: counts };
    });
    const statusCounts = await getStudentStatusCountsByZone(zone);
    const genderCountsStudents = await getGenderCountsStudentsByZone(zone);
    // const genderCountsTeachers = await getGenderCountsTeachersByZone(zone);
    const fieldResults = await Promise.all(fieldPromises);
  
    // Fetch other statistics
    const [totalSchools, totalStudent, studyingStudents, totalTeachers, ] =
      await Promise.allSettled([
        School.countDocuments({ Zone_Name: zone }).exec(),
        Student.countDocuments({ z_name: zone.toLowerCase() }).exec(),
        Student.countDocuments({z_name: zone.toLowerCase(), status: 'Studying'}).exec(),
        Teacher.countDocuments({ zonename: cleanedZoneName }).exec(),
      ]);
  
    const teacherStudentRatio = studyingStudents.value / totalTeachers.value;
    // const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
    const averageStudentOfSchool = totalStudent.value / totalSchools.value;
  
    const totalStudents = totalStudent.value;
    return {
      studentStats: fieldResults,
      studentStatusCounts: statusCounts,
      studentGenderCounts: genderCountsStudents,
    //   teacherGenderCounts: genderCountsTeachers,
      teacherStudentRatio,
    //   averageTeacherOfSchool,
      averageStudentOfSchool,
      totalStudents,
    };
  };
  
  
/////////////////////////////////////SChool////////////////////////

    // Function to get gender counts of students by schoolName
    const getGenderCountsStudentsBySchoolName = async (schoolName) => {
        const pipeline = [
          {
            $match: { SCHOOL_NAME: schoolName },
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

        // Function to get student status counts by district
  const getStudentStatusCountsBySchoolName = async (schoolNAme) => {
    const pipeline = [
      {
        $match: { SCHOOL_NAME: schoolNAme },
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
    // Function to get student counts by a specific field and schoolName
    // const getStudentCountsByFieldAndSchoolName = async (schoolIds, field, schoolName) => {
    //     const counts = await Promise.all(
    //       schoolIds.map(async (item) => {
    //         const count = await Student.countDocuments({
    //           Schoolid: { $in: item.Schoolid },
    //           SCHOOL_NAME: schoolName,
    //           [field]: item._id, // Include the specific field in the query
    //         });
    //         return { [field]: item._id, count };
    //       })
    //     );
      
    //     return counts;
    //   };
      
//        // Function to get gender counts of teachers by schoolName
//   const getGenderCountsTeachersBySchoolName = async (schoolName) => {
//     const pipeline = [
//       {
//         $match: { schname: schoolName },
//       },
//       {
//         $group: {
//           _id: '$gender',
//           count: { $sum: 1 },
//         },
//       },
//     ];
  
//     return Teacher.aggregate(pipeline);
//   };
// 'stream', 'minority', 'affiliation',
  const getStudentCountBySchoolName = async (schoolName) => {
    // const fields = ['SchCategory', 'typeOfSchool', 'shift', 'SchManagement'];
    // const fieldPromises = fields.map(async (field) => {
    //   const schoolIds = await getSchoolIdsByField(field);
    //   const counts = await getStudentCountsByFieldAndSchoolName(schoolIds, field, schoolName);
    //   return { [field]: counts };
    // });
    const statusCounts = await getStudentStatusCountsBySchoolName(schoolName);
    const genderCountsStudents = await getGenderCountsStudentsBySchoolName(schoolName);
    // const genderCountsTeachers = await getGenderCountsTeachersBySchoolName(schoolName);
    // const fieldResults = await Promise.all(fieldPromises);
  
   const schoolData = await School.findOne({School_Name: schoolName})
   const data = [{
    SchCategory: [{
        SchCategory: schoolData.SchCategory,
        count: 1
    }],
   },
{
    typeOfSchool: [{
        typeOfSchool: schoolData.typeOfSchool,
        count: 1
    }]
},{
    shift: [{
        shift: schoolData.shift,
        count: 1
    }]
},
{
    SchManagement:[{
        SchManagement: schoolData.SchManagement,
        count: 1
    }]
}]

    // Fetch other statistics
    const [totalSchools, totalStudent, studyingStudents, totalTeachers] = await Promise.allSettled([
      School.countDocuments({ School_Name: schoolName }).exec(),
      Student.countDocuments({ SCHOOL_NAME: schoolName }).exec(),
      Student.countDocuments({SCHOOL_NAME: schoolName, status: 'Studying'}).exec(),
      Teacher.countDocuments({ schname: schoolName }).exec(),
    ]);

    const teacherStudentRatio = studyingStudents.value / totalTeachers.value;
    // const averageTeacherOfSchool = totalTeachers.value / totalSchools.value;
    const averageStudentOfSchool = totalStudent.value / totalSchools.value;
  
    const totalStudents = totalStudent.value;
  
    return {
    //   studentStats: fieldResults,
      studentStats: data,
      studentStatusCounts: statusCounts,
      studentGenderCounts: genderCountsStudents,
    //   teacherGenderCounts: genderCountsTeachers,
      teacherStudentRatio,
    //   averageTeacherOfSchool,
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
