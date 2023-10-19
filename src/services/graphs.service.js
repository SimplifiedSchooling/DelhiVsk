const { School, Student, Teacher } = require('../models');

/**
 * Get school statistics
 * @returns {Promise<Object>} School statistics
 */
async function getSchoolStats() {
    const [totalSchools, totalStudents, totalTeachers, totalGirls, totalBoys] = await Promise.all([
    School.countDocuments(),
    Student.countDocuments(),
    Teacher.countDocuments(),
    Student.countDocuments({ Gender: 'F' }),
    Student.countDocuments({ Gender: 'M' }),
  ]);

  const teacherStudentRatio = totalStudents / totalTeachers;
  return {
    totalSchools,
    totalStudents,
    totalTeachers,
    totalGirls,
    totalBoys,
    teacherStudentRatio,
  };
}

module.exports = {
  getSchoolStats,
};
