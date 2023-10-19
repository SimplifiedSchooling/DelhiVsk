const { School, Student, Teacher } = require('../models');

/**
 * Get school statistics
 * @returns {Promise<Object>} School statistics
 */
async function getSchoolStats() {
  const totalSchools = await School.countDocuments();
  const totalStudents = await Student.countDocuments();
  const totalTeachers = await Teacher.countDocuments();

  const totalGirls = await Student.countDocuments({ Gender: 'F' });
  const totalBoys = await Student.countDocuments({ Gender: 'M' });

  console.log(totalGirls, totalBoys);
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
