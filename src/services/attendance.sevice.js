const axios = require('axios');
const cron = require('node-cron');
const logger = require('../config/logger');
const { School, Attendance, Student } = require('../models');

/**
 * Get Attendance data from server
 * @param {string} schoolId
 * @param {string} password
 * @param {string} date
 * @returns {Promise<Attendance>}
 */

async function fetchStudentDataForSchool(schoolId, password, date) {
  try {
    const apiUrl = `https://www.edudel.nic.in//mis/EduWebService_Other/vidyasamikshakendra.asmx/Student_Attendence_School?password=${password}&School_ID=${schoolId}&Date=${date}`;

    const response = await axios.get(apiUrl);

    if (Array.isArray(response.data.Cargo)) {
      return response.data.Cargo;
    }
    return [response.data.Cargo];
  } catch (error) {
    console.log(error)
    return null;
  }
}

const storeAttendanceDataInMongoDB = async () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  const date = `${day}/${month}/${year}`;
  const parsedDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  const password = 'VSK@9180';
  const schools = await School.find().exec();
  for (const school of schools) {
    const studentData = await fetchStudentDataForSchool(school.Schoolid, password, date);

    if (studentData) {
      // Create a unique identifier based on school and date
      const identifier = `${school.Schoolid}-${date}`;
      const existingAttendance = await Attendance.findOne({ School_ID: school.Schoolid, attendance_DATE: parsedDate });

      const maleStudents = await Student.countDocuments({ Gender: 'M', Schoolid: Number(school.Schoolid) }).exec();
      const femaleStudents = await Student.countDocuments({ Gender: 'F', Schoolid: Number(school.Schoolid) }).exec();
      const otherStudents = await Student.countDocuments({ Gender: 'T', Schoolid: Number(school.Schoolid) }).exec();

      const totalStudentCount = maleStudents + femaleStudents + otherStudents;
      const countByGenderAndAttendance = (gender, attendanceType) =>
        studentData.filter((student) => student.Gender === gender && student.attendance === attendanceType).length;

      const countByClass = (className, attendanceType) =>
        studentData.filter((student) => student.CLASS === className && student.attendance === attendanceType).length;

      const countByClassAndGender = (className, attendanceType, gender) =>
        studentData.filter(
          (student) => student.CLASS === className && student.attendance === attendanceType && student.Gender === gender
        ).length;

      const malePresentCount = countByGenderAndAttendance('M', 'Present');
      const femalePresentCount = countByGenderAndAttendance('F', 'Present');
      const otherPresentCount = countByGenderAndAttendance('T', 'Present');

      const maleAbsentCount = countByGenderAndAttendance('M', 'Absent');
      const femaleAbsentCount = countByGenderAndAttendance('F', 'Absent');
      const otherAbsentCount = countByGenderAndAttendance('T', 'Absent');

      const maleLeaveCount = countByGenderAndAttendance('M', 'Leave');
      const femaleLeaveCount = countByGenderAndAttendance('F', 'Leave');
      const otherLeaveCount = countByGenderAndAttendance('T', 'Leave');

      const maleAttendanceNotMarked = countByGenderAndAttendance('M', '');
      const femaleAttendanceNotMarked = countByGenderAndAttendance('F', '');
      const otherAttendanceNotMarked = countByGenderAndAttendance('T', '');

      const presentCountData = malePresentCount + femalePresentCount + otherPresentCount;
      const AbsentCount = maleAbsentCount + femaleAbsentCount + otherAbsentCount;
      const totalNotMarkedAttendanceCount = maleAttendanceNotMarked + femaleAttendanceNotMarked + otherAttendanceNotMarked;
      const totalLeaveCount = maleLeaveCount + femaleLeaveCount + otherLeaveCount;

      const classCount = [];
      // Include class-wise counts in the array
      const classes = Array.from(new Set(studentData.map((student) => student.CLASS)));
      for (const className of classes) {
        const classPresentCount = countByClass(className, 'Present');
        const classAbsentCount = countByClass(className, 'Absent');
        const classLeaveCount = countByClass(className, 'Leave');

        const classMalePresentCount = countByClassAndGender(className, 'Present', 'M');
        const classFemalePresentCount = countByClassAndGender(className, 'Present', 'F');
        const classOtherPresentCount = countByClassAndGender(className, 'Present', 'T');

        const classMaleAbsentCount = countByClassAndGender(className, 'Absent', 'M');
        const classFemaleAbsentCount = countByClassAndGender(className, 'Absent', 'F');
        const classOtherAbsentCount = countByClassAndGender(className, 'Absent', 'T');

        const classMaleLeaveCount = countByClassAndGender(className, 'Leave', 'M');
        const classFemaleLeaveCount = countByClassAndGender(className, 'Leave', 'F');
        const classOtherLeaveCount = countByClassAndGender(className, 'Leave', 'T');

        const classMaleAttendanceNotMarkedCount = countByClassAndGender(className, '', 'M');
        const classFemaleAttendanceNotMarkedCount = countByClassAndGender(className, '', 'F');
        const classOtherAttendanceNotMarkedCount = countByClassAndGender(className, '', 'T');

        const classNotMarkedAttendanceCount = countByClass(className, '');
        const classTotalStudentCount =
          classPresentCount + classAbsentCount + classLeaveCount + classNotMarkedAttendanceCount;
        classCount.push({
          className,
          classTotalStudentCount,
          classPresentCount,
          classAbsentCount,
          classLeaveCount,
          classNotMarkedAttendanceCount,
          classMalePresentCount,
          classFemalePresentCount,
          classOtherPresentCount,
          classMaleAbsentCount,
          classFemaleAbsentCount,
          classOtherAbsentCount,
          classMaleLeaveCount,
          classFemaleLeaveCount,
          classOtherLeaveCount,
          classMaleAttendanceNotMarkedCount,
          classFemaleAttendanceNotMarkedCount,
          classOtherAttendanceNotMarkedCount,
        });
      }
      const updateData = {
        district_name: school.District_name,
        Z_name: school.Zone_Name,
        School_ID: school.Schoolid,
        school_name: school.School_Name,
        shift: school.shift,
        attendance_DATE: parsedDate,
        totalStudentCount,
        PresentCount: presentCountData,
        AbsentCount,
        totalNotMarkedAttendanceCount,
        totalLeaveCount,
        malePresentCount,
        feMalePresentCount: femalePresentCount,
        otherPresentCount,
        maleAbsentCount,
        feMaleAbsentCount: femaleAbsentCount,
        othersAbsentCount: otherAbsentCount,
        maleLeaveCount,
        femaleLeaveCount,
        otherLeaveCount,
        maleAttendanceNotMarked,
        femaleAttendanceNotMarked,
        otherAttendanceNotMarked,
        attendanceStatus:(Astatus =
          studentData.length === 0
            ? 'data not found'
            : presentCountData === 0 && AbsentCount === 0 && totalLeaveCount === 0
            ? 'attendance not marked'
            : 'done'),
        classCount,
      };

      if (existingAttendance) {
        // If an entry with the same identifier exists, update it
        await Attendance.updateOne(
          { identifier },
          {
            district_name: school.District_name,
            Z_name: school.Zone_Name,
            School_ID: school.Schoolid,
            school_name: school.School_Name,
            shift: school.shift,
            attendance_DATE: parsedDate,
            SchManagement: school.SchManagement,
            totalStudentCount,
            PresentCount: presentCountData,
            AbsentCount,
            totalNotMarkedAttendanceCount,
            totalLeaveCount,
            malePresentCount,
            feMalePresentCount: femalePresentCount,
            otherPresentCount,
            maleAbsentCount,
            feMaleAbsentCount: femaleAbsentCount,
            othersAbsentCount: otherAbsentCount,
            maleLeaveCount,
            femaleLeaveCount,
            otherLeaveCount,
            maleAttendanceNotMarked,
            femaleAttendanceNotMarked,
            otherAttendanceNotMarked,
            attendanceStatus: (Astatus =
              studentData.length === 0
                ? 'data not found'
                : presentCountData === 0 && AbsentCount === 0 && totalLeaveCount === 0
                ? 'attendance not marked'
                : 'done'),
            classCount,
          }
        );
      } else {
        // If no entry with the same identifier exists, create a new one
        await Attendance.create({
          identifier,
          district_name: school.District_name,
          Z_name: school.Zone_Name,
          School_ID: school.Schoolid,
          school_name: school.School_Name,
          shift: school.shift,
          SchManagement: school.SchManagement,
          attendance_DATE: parsedDate,
          totalStudentCount,
          PresentCount: presentCountData,
          AbsentCount,
          totalNotMarkedAttendanceCount,
          totalLeaveCount,
          malePresentCount,
          feMalePresentCount: femalePresentCount,
          otherPresentCount,
          maleAbsentCount,
          feMaleAbsentCount: femaleAbsentCount,
          othersAbsentCount: otherAbsentCount,
          maleLeaveCount,
          femaleLeaveCount,
          otherLeaveCount,
          maleAttendanceNotMarked,
          femaleAttendanceNotMarked,
          otherAttendanceNotMarked,
          attendanceStatus: (Astatus =
            studentData.length === 0
              ? 'data not found'
              : presentCountData === 0 && AbsentCount === 0 && totalLeaveCount === 0
              ? 'attendance not marked'
              : 'done'),
          classCount,
        });
      }
    }
  }
};

const storeAttendanceDataByDate = async (date) => {
  const [day, month, year] = date.split('/');
  const parsedDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  const password = 'VSK@9180';
  const schools = await School.find().exec();
  for (const school of schools) {
    const studentData = await fetchStudentDataForSchool(school.Schoolid, password, date);
    if (studentData) {
      // Create a unique identifier based on school and date
      const identifier = `${school.Schoolid}-${date}`;
      // Check if an entry with the same identifier exists
      const existingAttendance = await Attendance.findOne({ identifier });

      const maleStudents = await Student.countDocuments({ Gender: 'M', Schoolid: Number(school.Schoolid) }).exec();
      const femaleStudents = await Student.countDocuments({ Gender: 'F', Schoolid: Number(school.Schoolid) }).exec();
      const otherStudents = await Student.countDocuments({ Gender: 'T', Schoolid: Number(school.Schoolid) }).exec();

      const totalStudentCount = maleStudents + femaleStudents + otherStudents;

      const countByGenderAndAttendance = (gender, attendanceType) =>
        studentData.filter((student) => student.Gender === gender && student.attendance === attendanceType).length;

      const countByClass = (className, attendanceType) =>
        studentData.filter((student) => student.CLASS === className && student.attendance === attendanceType).length;

      const countByClassAndGender = (className, attendanceType, gender) =>
        studentData.filter(
          (student) => student.CLASS === className && student.attendance === attendanceType && student.Gender === gender
        ).length;

      const malePresentCount = countByGenderAndAttendance('M', 'Present');
      const femalePresentCount = countByGenderAndAttendance('F', 'Present');
      const otherPresentCount = countByGenderAndAttendance('T', 'Present');

      const maleAbsentCount = countByGenderAndAttendance('M', 'Absent');
      const femaleAbsentCount = countByGenderAndAttendance('F', 'Absent');
      const othersAbsentCount = countByGenderAndAttendance('T', 'Absent');

      const maleLeaveCount = countByGenderAndAttendance('M', 'Leave');
      const femaleLeaveCount = countByGenderAndAttendance('F', 'Leave');
      const otherLeaveCount = countByGenderAndAttendance('T', 'Leave');

      const maleAttendanceNotMarked = countByGenderAndAttendance('M', '');
      const femaleAttendanceNotMarked = countByGenderAndAttendance('F', '');
      const otherAttendanceNotMarked = countByGenderAndAttendance('T', '');

      const presentCountData = malePresentCount + femalePresentCount + otherPresentCount;
      const AbsentCount = maleAbsentCount + femaleAbsentCount + othersAbsentCount;
      const totalNotMarkedAttendanceCount = maleAttendanceNotMarked + femaleAttendanceNotMarked + otherAttendanceNotMarked;
      const totalLeaveCount = maleLeaveCount + femaleLeaveCount + otherLeaveCount;

      const classCount = [];
      const classes = Array.from(new Set(studentData.map((student) => student.CLASS)));
      for (const className of classes) {
        const classPresentCount = countByClass(className, 'Present');
        const classAbsentCount = countByClass(className, 'Absent');
        const classLeaveCount = countByClass(className, 'Leave');

        const classMalePresentCount = countByClassAndGender(className, 'Present', 'M');
        const classFemalePresentCount = countByClassAndGender(className, 'Present', 'F');
        const classOtherPresentCount = countByClassAndGender(className, 'Present', 'T');

        const classMaleAbsentCount = countByClassAndGender(className, 'Absent', 'M');
        const classFemaleAbsentCount = countByClassAndGender(className, 'Absent', 'F');
        const classOtherAbsentCount = countByClassAndGender(className, 'Absent', 'T');

        const classMaleLeaveCount = countByClassAndGender(className, 'Leave', 'M');
        const classFemaleLeaveCount = countByClassAndGender(className, 'Leave', 'F');
        const classOtherLeaveCount = countByClassAndGender(className, 'Leave', 'T');

        const classMaleAttendanceNotMarkedCount = countByClassAndGender(className, '', 'M');
        const classFemaleAttendanceNotMarkedCount = countByClassAndGender(className, '', 'F');
        const classOtherAttendanceNotMarkedCount = countByClassAndGender(className, '', 'T');

        const classNotMarkedAttendanceCount = countByClass(className, '');
        const classTotalStudentCount =
          classPresentCount + classAbsentCount + classLeaveCount + classNotMarkedAttendanceCount;
        classCount.push({
          className,
          classTotalStudentCount,
          classPresentCount,
          classAbsentCount,
          classLeaveCount,
          classNotMarkedAttendanceCount,
          classMalePresentCount,
          classFemalePresentCount,
          classOtherPresentCount,
          classMaleAbsentCount,
          classFemaleAbsentCount,
          classOtherAbsentCount,
          classMaleLeaveCount,
          classFemaleLeaveCount,
          classOtherLeaveCount,
          classMaleAttendanceNotMarkedCount,
          classFemaleAttendanceNotMarkedCount,
          classOtherAttendanceNotMarkedCount,
        });
      }

      if (existingAttendance) {
        await Attendance.updateOne(
          { identifier },
          {
            district_name: school.District_name,
            Z_name: school.Zone_Name,
            School_ID: school.Schoolid,
            school_name: school.School_Name,
            shift: school.shift,
            SchManagement: school.SchManagement,
            attendance_DATE: parsedDate,
            totalStudentCount,
            PresentCount: presentCountData,
            AbsentCount,
            totalNotMarkedAttendanceCount,
            totalLeaveCount,
            malePresentCount,
            feMalePresentCount: femalePresentCount,
            otherPresentCount,
            maleAbsentCount,
            feMaleAbsentCount: femaleAbsentCount,
            othersAbsentCount,
            maleLeaveCount,
            femaleLeaveCount,
            otherLeaveCount,
            maleAttendanceNotMarked,
            femaleAttendanceNotMarked,
            otherAttendanceNotMarked,
            attendanceStatus: (Astatus =
              studentData.length === 0
                ? 'data not found'
                : presentCountData === 0 && AbsentCount === 0 && totalLeaveCount === 0
                ? 'attendance not marked'
                : 'done'),
            classCount,
          }
        );
      } else {
        await Attendance.create({
          identifier,
          district_name: school.District_name,
          Z_name: school.Zone_Name,
          School_ID: school.Schoolid,
          school_name: school.School_Name,
          shift: school.shift,
          SchManagement: school.SchManagement,
          attendance_DATE: parsedDate,
          totalStudentCount,
          PresentCount: presentCountData,
          AbsentCount,
          totalNotMarkedAttendanceCount,
          totalLeaveCount,
          malePresentCount,
          feMalePresentCount: femalePresentCount,
          otherPresentCount,
          maleAbsentCount,
          feMaleAbsentCount: femaleAbsentCount,
          othersAbsentCount,
          maleLeaveCount,
          femaleLeaveCount,
          otherLeaveCount,
          maleAttendanceNotMarked,
          femaleAttendanceNotMarked,
          otherAttendanceNotMarked,
          attendanceStatus: (Astatus =
            studentData.length === 0
              ? 'data not found'
              : presentCountData === 0 && AbsentCount === 0 && totalLeaveCount === 0
              ? 'attendance not marked'
              : 'done'),
          classCount,
        });
      }
    }
  }
};

// Schedule the job to run every day at 9 PM
// cron.schedule('0 21 * * *', async () => {
//   try {
//     logger.info(`Running the attendance data update job...`);
//     await storeAttendanceDataInMongoDB();
//     logger.info(`Attendance data update job completed.`);
//   } catch (error) {
//     logger.info('Error running the job:', error);
//   }
// });


cron.schedule('*/1 * * * *', async () => {
  try {
    logger.info(`Running the attendance data update job...`);
    await storeAttendanceDataInMongoDB();
    logger.info(`Attendance data update job completed.`);
  } catch (error) {
    logger.error('Error running the job:', error);
  }
});

/// ///////////////////////Attendance graph by single date /////////////
/**
 * Get attendance counts for a specific date
 * @param {string} date - The date for which attendance is requested
 * @returns {Promise<Object>} - Object containing school and student counts
 */

const getAttendanceCounts = async (date) => {
  const match = {
    attendance_DATE: new Date(date),
    SchManagement: 'Government',
  };

  const Counts = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        PresentCount: { $sum: '$PresentCount' },
        AbsentCount: { $sum: '$AbsentCount' },
        totalNotMarkedAttendanceCount: { $sum: '$totalNotMarkedAttendanceCount' },
        totalLeaveCount: { $sum: '$totalLeaveCount' },
        malePresentCount: { $sum: '$malePresentCount' },
        feMalePresentCount: { $sum: '$feMalePresentCount' },
        otherPresentCount: { $sum: '$otherPresentCount' },
        maleAbsentCount: { $sum: '$maleAbsentCount' },
        feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
        othersAbsentCount: { $sum: '$othersAbsentCount' },
        maleLeaveCount: { $sum: '$maleLeaveCount' },
        femaleLeaveCount: { $sum: '$femaleLeaveCount' },
        otherLeaveCount: { $sum: '$otherLeaveCount' },
        maleAttendanceNotMarked: { $sum: '$maleAttendanceNotMarked' },
        femaleAttendanceNotMarked: { $sum: '$femaleAttendanceNotMarked' },
        otherAttendanceNotMarked: { $sum: '$otherAttendanceNotMarked' },
      },
    },
  ]);

  const statusCounts = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$attendanceStatus',
        count: { $sum: 1 },
      },
    },
  ]);

  const countofSchool = await School.countDocuments({ SchManagement: 'Government' }).exec();
  const schools = await School.find({ SchManagement: 'Government' }, 'Schoolid');
  const schoolIds = schools.map((school) => school.Schoolid);
  const totalStudentCount = await Student.countDocuments({ Schoolid: { $in: schoolIds }, status: 'Studying' });

  // const totalStudentCount = await Student.countDocuments({ status: 'Studying', SchManagement: 'Government'}).exec();

  return {
    statusCounts,
    countofSchool,
    totalStudentCount,
    Counts,
  };
};
/**
 * Get attendance counts for a specific date and district
 * @param {Object} body - Request body containing date and districtName
 * @returns {Promise<Object>} - Object containing school and student counts for the district
 */

const getAttendanceCountsDistrictWise = async (body) => {
  const { date, districtName } = body;
  const dateMatch = {
    $match: {
      attendance_DATE: new Date(date),
      district_name: districtName,
      SchManagement: 'Government',
    },
  };
  const Counts = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        PresentCount: { $sum: '$PresentCount' },
        AbsentCount: { $sum: '$AbsentCount' },
        totalNotMarkedAttendanceCount: { $sum: '$totalNotMarkedAttendanceCount' },
        totalLeaveCount: { $sum: '$totalLeaveCount' },

        malePresentCount: { $sum: '$malePresentCount' },
        feMalePresentCount: { $sum: '$feMalePresentCount' },
        otherPresentCount: { $sum: '$otherPresentCount' },
        maleAbsentCount: { $sum: '$maleAbsentCount' },
        feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
        othersAbsentCount: { $sum: '$othersAbsentCount' },
        maleLeaveCount: { $sum: '$maleLeaveCount' },
        femaleLeaveCount: { $sum: '$femaleLeaveCount' },
        otherLeaveCount: { $sum: '$otherLeaveCount' },
        maleAttendanceNotMarked: { $sum: '$maleAttendanceNotMarked' },
        femaleAttendanceNotMarked: { $sum: '$femaleAttendanceNotMarked' },
        otherAttendanceNotMarked: { $sum: '$otherAttendanceNotMarked' },
        attendanceNotFoundCount: {
          $sum: { $cond: [{ $eq: ['$attendanceStatus', 'data not found'] }, 1, 0] },
        },
      },
    },
  ]);

  const statusCounts = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: '$attendanceStatus',
        count: { $sum: 1 },
      },
    },
  ]);

  const countofSchoool = await School.countDocuments({ District_name: districtName }).exec();

  const schools = await School.find({ SchManagement: 'Government' }, 'Schoolid');
  const schoolIds = schools.map((school) => school.Schoolid);
  const totalStudentCount = await Student.countDocuments({
    Schoolid: { $in: schoolIds },
    status: 'Studying',
    District: districtName,
  });
  // const totalStudentCount = await Student.countDocuments({ District: districtName, status: 'Studying' }).exec();
  return {
    statusCounts,
    countofSchoool,
    totalStudentCount,
    Counts,
  };
};

/**
 * Get attendance counts for a specific date and education zone
 * @param {string} date - The date for which attendance is requested
 * @param {string} Z_name - The education zone name
 * @returns {Promise<Object>} - Object containing school and student counts for the zone
 */

const getAttendanceCountsZoneWise = async (date, Z_name) => {
  const match = {
    $match: {
      attendance_DATE: new Date(date),
      Z_name,
      SchManagement: 'Government',
    },
  };

  const Counts = await Attendance.aggregate([
    match,
    {
      $group: {
        _id: null,
        PresentCount: { $sum: '$PresentCount' },
        AbsentCount: { $sum: '$AbsentCount' },
        totalNotMarkedAttendanceCount: { $sum: '$totalNotMarkedAttendanceCount' },
        totalLeaveCount: { $sum: '$totalLeaveCount' },
        malePresentCount: { $sum: '$malePresentCount' },
        feMalePresentCount: { $sum: '$feMalePresentCount' },
        otherPresentCount: { $sum: '$otherPresentCount' },
        maleAbsentCount: { $sum: '$maleAbsentCount' },
        feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
        othersAbsentCount: { $sum: '$othersAbsentCount' },
        maleLeaveCount: { $sum: '$maleLeaveCount' },
        femaleLeaveCount: { $sum: '$femaleLeaveCount' },
        otherLeaveCount: { $sum: '$otherLeaveCount' },
        maleAttendanceNotMarked: { $sum: '$maleAttendanceNotMarked' },
        femaleAttendanceNotMarked: { $sum: '$femaleAttendanceNotMarked' },
        otherAttendanceNotMarked: { $sum: '$otherAttendanceNotMarked' },
        attendanceNotFoundCountSchoolCount: {
          $sum: { $cond: [{ $eq: ['$attendanceStatus', 'data not found'] }, 1, 0] },
        },
      },
    },
  ]);
  const statusCounts = await Attendance.aggregate([
    match,
    {
      $group: {
        _id: '$attendanceStatus',
        count: { $sum: 1 },
      },
    },
  ]);

  const countofSchoool = await School.countDocuments({ Zone_Name: Z_name, SchManagement: 'Government' }).exec();

  const schools = await School.find({ SchManagement: 'Government' }, 'Schoolid');
  const schoolIds = schools.map((school) => school.Schoolid);
  const totalStudentCount = await Student.countDocuments({
    Schoolid: { $in: schoolIds },
    status: 'Studying',
    // District: districtName,
    z_name: Z_name.toLowerCase(),
  });
  //  const totalStudentCount = await Student.countDocuments({ z_name: Z_name.toLowerCase(), status: 'Studying' }).exec();
  return {
    statusCounts,
    countofSchoool,
    totalStudentCount,
    Counts,
  };
};

/**
 * Get attendance counts for a specific date and school
 * @param {string} date - The date for which attendance is requested
 * @param {string} School_ID - The school ID
 * @returns {Promise<Object>} - Object containing attendance counts for the school
 */

const getAttendanceCountsSchoolWise = async (date, School_ID) => {
  const match = {
    $match: {
      attendance_DATE: new Date(date),
      School_ID,
    },
  };

  const Counts = await Attendance.aggregate([
    match,
    {
      $group: {
        _id: null,
        PresentCount: { $sum: '$PresentCount' },
        AbsentCount: { $sum: '$AbsentCount' },
        totalNotMarkedAttendanceCount: { $sum: '$totalNotMarkedAttendanceCount' },
        totalLeaveCount: { $sum: '$totalLeaveCount' },
        malePresentCount: { $sum: '$malePresentCount' },
        feMalePresentCount: { $sum: '$feMalePresentCount' },
        otherPresentCount: { $sum: '$otherPresentCount' },
        maleAbsentCount: { $sum: '$maleAbsentCount' },
        feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
        othersAbsentCount: { $sum: '$othersAbsentCount' },
        maleLeaveCount: { $sum: '$maleLeaveCount' },
        femaleLeaveCount: { $sum: '$femaleLeaveCount' },
        otherLeaveCount: { $sum: '$otherLeaveCount' },
        maleAttendanceNotMarked: { $sum: '$maleAttendanceNotMarked' },
        femaleAttendanceNotMarked: { $sum: '$femaleAttendanceNotMarked' },
        otherAttendanceNotMarked: { $sum: '$otherAttendanceNotMarked' },
        attendanceNotFoundCountSchoolCount: {
          $sum: { $cond: [{ $eq: ['$attendanceStatus', 'data not found'] }, 1, 0] },
        },
      },
    },
  ]);

  const statusCounts = await Attendance.aggregate([
    match,
    {
      $group: {
        _id: '$attendanceStatus',
        count: { $sum: 1 },
      },
    },
  ]);
  const Schoolid = Number(School_ID);
  const countofSchoool = await School.countDocuments(Number(School_ID)).exec();
  const totalStudentCount = await Student.countDocuments({ Schoolid, status: 'Studying' }).exec();
  return {
    statusCounts,
    countofSchoool,
    totalStudentCount,
    Counts,
  };
};

/**
 * Get attendance counts for a specific date and shift
 * @param {string} date - The date for which attendance is requested
 * @param {string} shift - The shift for which attendance is requested
 * @returns {Promise<Object>} - Object containing attendance counts for the shift
 */

const getAttendanceCountsShiftWise = async (date, shift) => {
  const dateMatch = {
    $match: {
      attendance_DATE: new Date(date),
      shift,
      SchManagement: 'Government',
    },
  };
  const Counts = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: null,
        PresentCount: { $sum: '$PresentCount' },
        AbsentCount: { $sum: '$AbsentCount' },
        totalNotMarkedAttendanceCount: { $sum: '$totalNotMarkedAttendanceCount' },
        totalLeaveCount: { $sum: '$totalLeaveCount' },
        malePresentCount: { $sum: '$malePresentCount' },
        feMalePresentCount: { $sum: '$feMalePresentCount' },
        otherPresentCount: { $sum: '$otherPresentCount' },
        maleAbsentCount: { $sum: '$maleAbsentCount' },
        feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
        othersAbsentCount: { $sum: '$othersAbsentCount' },
        maleLeaveCount: { $sum: '$maleLeaveCount' },
        femaleLeaveCount: { $sum: '$femaleLeaveCount' },
        otherLeaveCount: { $sum: '$otherLeaveCount' },
        maleAttendanceNotMarked: { $sum: '$maleAttendanceNotMarked' },
        femaleAttendanceNotMarked: { $sum: '$femaleAttendanceNotMarked' },
        otherAttendanceNotMarked: { $sum: '$otherAttendanceNotMarked' },
        attendanceNotFoundCountSchoolCount: {
          $sum: { $cond: [{ $eq: ['$attendanceStatus', 'data not found'] }, 1, 0] },
        },
      },
    },
  ]);
  const statusCounts = await Attendance.aggregate([
    dateMatch,
    {
      $group: {
        _id: '$attendanceStatus',
        count: { $sum: 1 },
      },
    },
  ]);
  const countofSchoool = await School.countDocuments({ shift, SchManagement: 'Government' }).exec();
  const schools = await School.find({ shift, SchManagement: 'Government' });

  // Extract school IDs from the result
  const schoolIds = schools.map((school) => school.Schoolid);

  // Use aggregation to get shift-wise student count
  const result = await Student.aggregate([
    {
      $match: {
        Schoolid: { $in: schoolIds },
        status: 'Studying', // Add this condition to filter by status
      },
    },
    {
      $group: {
        _id: '$shift',
        studentCount: { $sum: 1 },
      },
    },
  ]);

  // const totalStudentCount = await Student.countDocuments({z_name: Z_name}).exec();
  return {
    statusCounts,
    countofSchoool,
    totalStudentCount: result[0].studentCount,
    Counts,
  };
};

/**
 * Get By Attendance ststus wie School data
 * @param {string} date - The date for which attendance is requested
 * @returns {Promise<Array>} - Array containing district-wise attendance present counts
 */
const attendanceStatus = async (attendance_DATE, attendanceStatus) => {
  const data = await Attendance.find({
    attendance_DATE: new Date(attendance_DATE),
    attendanceStatus,
    SchManagement: 'Government',
  })
    .select('attendanceStatus district_name Z_name School_ID school_name shift SchManagement attendance_DATE') // Add the specific fields you want to retrieve
    .exec();
  return data;
};
const attendanceStatusDistrictWise = async (district_name, attendance_DATE, attendanceStatus) => {
  const data = await Attendance.find({
    district_name,
    attendance_DATE: new Date(attendance_DATE),
    attendanceStatus,
    SchManagement: 'Government',
  })
    .select('attendanceStatus district_name Z_name School_ID school_name shift SchManagement attendance_DATE') // Add the specific fields you want to retrieve
    .exec();
  return data;
};

const attendanceStatusZoneWise = async (Z_name, attendance_DATE, attendanceStatus) => {
  const data = await Attendance.find({
    Z_name,
    attendance_DATE: new Date(attendance_DATE),
    attendanceStatus,
    SchManagement: 'Government',
  })
    .select('attendanceStatus district_name Z_name School_ID school_name shift SchManagement attendance_DATE') // Add the specific fields you want to retrieve
    .exec();
  return data;
};

const attendanceStatusSchoolWise = async (School_ID, attendance_DATE, attendanceStatus) => {
  const data = await Attendance.find({ School_ID, attendance_DATE: new Date(attendance_DATE), attendanceStatus })
    .select('attendanceStatus district_name Z_name School_ID school_name shift SchManagement attendance_DATE') // Add the specific fields you want to retrieve
    .exec();
  return data;
};

const attendanceStatusShiftWise = async (shift, attendance_DATE, attendanceStatus) => {
  const data = await Attendance.find({
    shift,
    attendance_DATE: new Date(attendance_DATE),
    attendanceStatus,
    SchManagement: 'Government',
  })
    .select('attendanceStatus district_name Z_name School_ID school_name shift SchManagement attendance_DATE') // Add the specific fields you want to retrieve
    .exec();
  return data;
};

/**
 * Get district-wise attendance present counts for a specific date
 * @param {string} date - The date for which attendance is requested
 * @returns {Promise<Array>} - Array containing district-wise attendance present counts
 */

const getDistrictWisePresentCount = async (date) => {
  const match = {
    attendance_DATE: new Date(date),
    SchManagement: 'Government',
  };

  const districtCounts = await Attendance.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: '$district_name',
        totalStudentCount: { $sum: '$totalStudentCount' },
        totalPreasentCount: { $sum: '$PresentCount' },
      },
    },
    {
      $addFields: {
        presentPercentage: {
          $multiply: [
            { $divide: ['$totalPreasentCount', '$totalStudentCount'] },
            100, // To convert to percentage
          ],
        },
      },
    },
  ]);
  return districtCounts;
};
//-----------------------------------------------------------------------------------------------

/**
 * Get gender range-wise attendance counts for a specific school and date range
 * @param {string} schoolId - The school ID
 * @param {string} startDate - The start date of the attendance range
 * @param {string} endDate - The end date of the attendance range
 * @returns {Promise<Object>} - Object containing gender range-wise attendance counts
 */

const getGenderRangeWiseCount = async (schoolId, startDate, endDate) => {
  const result = await Attendance.aggregate([
    {
      $match: {
        School_ID: schoolId,
        SchManagement: 'Government',
        attendance_DATE: {
          $gte: new Date(startDate),
          $lt: new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000), // Add one day to include the end date
        },
      },
    },
    {
      $group: {
        _id: null,
        malePresentCount: { $sum: '$malePresentCount' },
        feMalePresentCount: { $sum: '$feMalePresentCount' },
        otherPresentCount: { $sum: '$otherPresentCount' },
        maleAbsentCount: { $sum: '$maleAbsentCount' },
        feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
        otherAbsentCount: { $sum: '$othersAbsentCount' },
        maleLeaveCount: { $sum: '$maleLeaveCount' },
        femaleLeaveCount: { $sum: '$femaleLeaveCount' },
        otherLeaveCount: { $sum: '$otherLeaveCount' },
        maleAttendanceNotMarked: { $sum: '$maleAttendanceNotMarked' },
        femaleAttendanceNotMarked: { $sum: '$femaleAttendanceNotMarked' },
        otherAttendanceNotMarked: { $sum: '$otherAttendanceNotMarked' },
      },
    },
    {
      $project: {
        _id: 0, // Exclude _id field
      },
    },
  ]);

  return result[0]; // Return the first element as we used $group
};

/**
 * Get Attendance data from database with proper percentage calculations
 * @param {Object} filters - Filter parameters including startDate, endDate, zoneName, districtName, schoolId
 * @returns {Promise<Object>} - Attendance percentages
 */

const getAttendancePercentageGenderAndRangeWise = async (startDate, endDate, zoneName, districtName, schoolId) => {
  const matchStage = {
    SchManagement: 'Government',
    attendance_DATE: {
      $gte: new Date(startDate),
      $lt: new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000), // Add one day to include the end date
    },
  };

  if (schoolId) {
    matchStage.School_ID = schoolId;
  }

  if (districtName) {
    matchStage.district_name = districtName;
  }

  if (zoneName) {
    matchStage.Z_name = zoneName;
  }

  // Aggregation pipeline for overall percentage
  const overallResult = await Attendance.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: '$totalStudentCount' },
        malePresentCount: { $sum: '$malePresentCount' },
        feMalePresentCount: { $sum: '$feMalePresentCount' },
        otherPresentCount: { $sum: '$otherPresentCount' },
        maleAbsentCount: { $sum: '$maleAbsentCount' },
        feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
        otherAbsentCount: { $sum: '$othersAbsentCount' },
        maleLeaveCount: { $sum: '$maleLeaveCount' },
        femaleLeaveCount: { $sum: '$femaleLeaveCount' },
        otherLeaveCount: { $sum: '$otherLeaveCount' },
        maleNotMarkedCount: { $sum: '$maleAttendanceNotMarked' },
        femaleNotMarkedCount: { $sum: '$femaleAttendanceNotMarked' },
        otherNotMarkedCount: { $sum: '$otherAttendanceNotMarked' },
      },
    },
    {
      $project: {
        _id: 0,
        overallPercentage: {
          totalEntries: 1,
          malePresentPercentage: { $multiply: [{ $divide: ['$malePresentCount', '$totalEntries'] }, 100] },
          feMalePresentPercentage: { $multiply: [{ $divide: ['$feMalePresentCount', '$totalEntries'] }, 100] },
          otherPresentPercentage: { $multiply: [{ $divide: ['$otherPresentCount', '$totalEntries'] }, 100] },
          maleAbsentPercentage: { $multiply: [{ $divide: ['$maleAbsentCount', '$totalEntries'] }, 100] },
          feMaleAbsentPercentage: { $multiply: [{ $divide: ['$feMaleAbsentCount', '$totalEntries'] }, 100] },
          otherAbsentPercentage: { $multiply: [{ $divide: ['$otherAbsentCount', '$totalEntries'] }, 100] },
          maleLeavePercentage: { $multiply: [{ $divide: ['$maleLeaveCount', '$totalEntries'] }, 100] },
          femaleLeavePercentage: { $multiply: [{ $divide: ['$femaleLeaveCount', '$totalEntries'] }, 100] },
          otherLeavePercentage: { $multiply: [{ $divide: ['$otherLeaveCount', '$totalEntries'] }, 100] },
          maleNotMarkedPercentage: { $multiply: [{ $divide: ['$maleNotMarkedCount', '$totalEntries'] }, 100] },
          femaleNotMarkedPercentage: { $multiply: [{ $divide: ['$femaleNotMarkedCount', '$totalEntries'] }, 100] },
          otherNotMarkedPercentage: { $multiply: [{ $divide: ['$otherNotMarkedCount', '$totalEntries'] }, 100] },
        },
      },
    },
  ]);

  // Aggregation pipeline for date-wise percentage
  const dateWiseResult = await Attendance.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: '$attendance_DATE',
        totalEntries: { $sum: '$totalStudentCount' },
        malePresentCount: { $sum: '$malePresentCount' },
        feMalePresentCount: { $sum: '$feMalePresentCount' },
        otherPresentCount: { $sum: '$otherPresentCount' },
        maleAbsentCount: { $sum: '$maleAbsentCount' },
        feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
        otherAbsentCount: { $sum: '$othersAbsentCount' },
        maleLeaveCount: { $sum: '$maleLeaveCount' },
        femaleLeaveCount: { $sum: '$femaleLeaveCount' },
        otherLeaveCount: { $sum: '$otherLeaveCount' },
        maleNotMarkedCount: { $sum: '$maleAttendanceNotMarked' },
        femaleNotMarkedCount: { $sum: '$femaleAttendanceNotMarked' },
        otherNotMarkedCount: { $sum: '$otherAttendanceNotMarked' },
      },
    },
    {
      $project: {
        _id: 0,
        attendance_DATE: '$_id',
        totalEntries: 1,
        malePresentPercentage: { $multiply: [{ $divide: ['$malePresentCount', '$totalEntries'] }, 100] },
        feMalePresentPercentage: { $multiply: [{ $divide: ['$feMalePresentCount', '$totalEntries'] }, 100] },
        otherPresentPercentage: { $multiply: [{ $divide: ['$otherPresentCount', '$totalEntries'] }, 100] },
        maleAbsentPercentage: { $multiply: [{ $divide: ['$maleAbsentCount', '$totalEntries'] }, 100] },
        feMaleAbsentPercentage: { $multiply: [{ $divide: ['$feMaleAbsentCount', '$totalEntries'] }, 100] },
        otherAbsentPercentage: { $multiply: [{ $divide: ['$otherAbsentCount', '$totalEntries'] }, 100] },
        maleLeavePercentage: { $multiply: [{ $divide: ['$maleLeaveCount', '$totalEntries'] }, 100] },
        femaleLeavePercentage: { $multiply: [{ $divide: ['$femaleLeaveCount', '$totalEntries'] }, 100] },
        otherLeavePercentage: { $multiply: [{ $divide: ['$otherLeaveCount', '$totalEntries'] }, 100] },
        maleNotMarkedPercentage: { $multiply: [{ $divide: ['$maleNotMarkedCount', '$totalEntries'] }, 100] },
        femaleNotMarkedPercentage: { $multiply: [{ $divide: ['$femaleNotMarkedCount', '$totalEntries'] }, 100] },
        otherNotMarkedPercentage: { $multiply: [{ $divide: ['$otherNotMarkedCount', '$totalEntries'] }, 100] },
      },
    },
    {
      $sort: { attendance_DATE: 1 },
    },
  ]);
  return {
    overallPercentage: overallResult[0] ? overallResult[0].overallPercentage || {} : {},
    dateWisePercentage: dateWiseResult || [],
  };
};

const getAttendancePercentageGenderAndRangeAndShiftWise = async (
  startDate,
  endDate,
  zoneName,
  districtName,
  schoolId,
  shift
) => {
  const matchStage = {
    SchManagement: 'Government',
    attendance_DATE: {
      $gte: new Date(startDate),
      $lt: new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000), // Add one day to include the end date
    },
    shift,
  };

  if (schoolId) {
    matchStage.School_ID = schoolId;
  }

  if (districtName) {
    matchStage.district_name = districtName;
  }

  if (zoneName) {
    matchStage.Z_name = zoneName;
  }

  // Aggregation pipeline for overall percentage
  const overallResult = await Attendance.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: '$totalStudentCount' },
        malePresentCount: { $sum: '$malePresentCount' },
        feMalePresentCount: { $sum: '$feMalePresentCount' },
        otherPresentCount: { $sum: '$otherPresentCount' },
        maleAbsentCount: { $sum: '$maleAbsentCount' },
        feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
        otherAbsentCount: { $sum: '$othersAbsentCount' },
        maleLeaveCount: { $sum: '$maleLeaveCount' },
        femaleLeaveCount: { $sum: '$femaleLeaveCount' },
        otherLeaveCount: { $sum: '$otherLeaveCount' },
        maleNotMarkedCount: { $sum: '$maleAttendanceNotMarked' },
        femaleNotMarkedCount: { $sum: '$femaleAttendanceNotMarked' },
        otherNotMarkedCount: { $sum: '$otherAttendanceNotMarked' },
      },
    },
    {
      $project: {
        _id: 0,
        overallPercentage: {
          totalEntries: 1,
          malePresentPercentage: { $multiply: [{ $divide: ['$malePresentCount', '$totalEntries'] }, 100] },
          feMalePresentPercentage: { $multiply: [{ $divide: ['$feMalePresentCount', '$totalEntries'] }, 100] },
          otherPresentPercentage: { $multiply: [{ $divide: ['$otherPresentCount', '$totalEntries'] }, 100] },
          maleAbsentPercentage: { $multiply: [{ $divide: ['$maleAbsentCount', '$totalEntries'] }, 100] },
          feMaleAbsentPercentage: { $multiply: [{ $divide: ['$feMaleAbsentCount', '$totalEntries'] }, 100] },
          otherAbsentPercentage: { $multiply: [{ $divide: ['$otherAbsentCount', '$totalEntries'] }, 100] },
          maleLeavePercentage: { $multiply: [{ $divide: ['$maleLeaveCount', '$totalEntries'] }, 100] },
          femaleLeavePercentage: { $multiply: [{ $divide: ['$femaleLeaveCount', '$totalEntries'] }, 100] },
          otherLeavePercentage: { $multiply: [{ $divide: ['$otherLeaveCount', '$totalEntries'] }, 100] },
          maleNotMarkedPercentage: { $multiply: [{ $divide: ['$maleNotMarkedCount', '$totalEntries'] }, 100] },
          femaleNotMarkedPercentage: { $multiply: [{ $divide: ['$femaleNotMarkedCount', '$totalEntries'] }, 100] },
          otherNotMarkedPercentage: { $multiply: [{ $divide: ['$otherNotMarkedCount', '$totalEntries'] }, 100] },
        },
      },
    },
  ]);
  const dateWiseResult = await Attendance.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: '$attendance_DATE',
        totalEntries: { $sum: '$totalStudentCount' },
        malePresentCount: { $sum: '$malePresentCount' },
        feMalePresentCount: { $sum: '$feMalePresentCount' },
        otherPresentCount: { $sum: '$otherPresentCount' },
        maleAbsentCount: { $sum: '$maleAbsentCount' },
        feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
        otherAbsentCount: { $sum: '$othersAbsentCount' },
        maleLeaveCount: { $sum: '$maleLeaveCount' },
        femaleLeaveCount: { $sum: '$femaleLeaveCount' },
        otherLeaveCount: { $sum: '$otherLeaveCount' },
        maleNotMarkedCount: { $sum: '$maleAttendanceNotMarked' },
        femaleNotMarkedCount: { $sum: '$femaleAttendanceNotMarked' },
        otherNotMarkedCount: { $sum: '$otherAttendanceNotMarked' },
      },
    },
    {
      $project: {
        _id: 0,
        attendance_DATE: '$_id',
        totalEntries: 1,
        malePresentPercentage: { $multiply: [{ $divide: ['$malePresentCount', '$totalEntries'] }, 100] },
        feMalePresentPercentage: { $multiply: [{ $divide: ['$feMalePresentCount', '$totalEntries'] }, 100] },
        otherPresentPercentage: { $multiply: [{ $divide: ['$otherPresentCount', '$totalEntries'] }, 100] },
        maleAbsentPercentage: { $multiply: [{ $divide: ['$maleAbsentCount', '$totalEntries'] }, 100] },
        feMaleAbsentPercentage: { $multiply: [{ $divide: ['$feMaleAbsentCount', '$totalEntries'] }, 100] },
        otherAbsentPercentage: { $multiply: [{ $divide: ['$otherAbsentCount', '$totalEntries'] }, 100] },
        maleLeavePercentage: { $multiply: [{ $divide: ['$maleLeaveCount', '$totalEntries'] }, 100] },
        femaleLeavePercentage: { $multiply: [{ $divide: ['$femaleLeaveCount', '$totalEntries'] }, 100] },
        otherLeavePercentage: { $multiply: [{ $divide: ['$otherLeaveCount', '$totalEntries'] }, 100] },
        maleNotMarkedPercentage: { $multiply: [{ $divide: ['$maleNotMarkedCount', '$totalEntries'] }, 100] },
        femaleNotMarkedPercentage: { $multiply: [{ $divide: ['$femaleNotMarkedCount', '$totalEntries'] }, 100] },
        otherNotMarkedPercentage: { $multiply: [{ $divide: ['$otherNotMarkedCount', '$totalEntries'] }, 100] },
      },
    },
    {
      $sort: { attendance_DATE: 1 },
    },
  ]);

  return {
    overallPercentage: overallResult[0] ? overallResult[0].overallPercentage || {} : {},
    dateWisePercentage: dateWiseResult || [],
  };
};

const getTopPerformingDistricts = async (date) => {
  // Get top 5 performing districts based on present counts for Government schools
  const result = await Attendance.aggregate([
    {
      $match: {
        attendance_DATE: new Date(date),
        SchManagement: 'Government', // Filter records based on Government schools
      },
    },
    {
      $group: {
        _id: '$district_name',
        totalPresentCount: { $sum: '$PresentCount' },
      },
    },
    {
      $sort: { totalPresentCount: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        district_name: '$_id',
        totalPresentCount: 1,
        _id: 0,
      },
    },
  ]);

  // Fetch count of schools with attendanceStatus = "data not found" for each district
  const resultWithSchoolsDataNotFoundCount = await Promise.all(
    result.map(async (district) => {
      const schoolsDataNotFoundCount = await Attendance.countDocuments({
        attendanceStatus: 'data not found',
        attendance_DATE: new Date(date),
        district_name: district.district_name,
        SchManagement: 'Government', // Also filter based on Government schools here
      });

      return {
        district_name: district.district_name,
        totalPresentCount: district.totalPresentCount,
        schoolsDataNotFoundCount,
      };
    })
  );

  return resultWithSchoolsDataNotFoundCount;
};

/**
 * Get top 5 performing zones based on present counts for a specific district and Date
 * @param {string} districtName - Name of the district
 * @param {string} date - date of the attendance
 * @returns {Promise<Array<Object>>} - Array of top 5 performing zones with present counts
 */

const getTopPerformingZonesByDistrict = async (districtName, date) => {
  const result = await Attendance.aggregate([
    {
      $match: { SchManagement: 'Government', district_name: districtName, attendance_DATE: new Date(date) },
    },
    {
      $group: {
        _id: '$Z_name',
        totalPresentCount: { $sum: '$PresentCount' },
      },
    },
    {
      $sort: { totalPresentCount: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        zone_name: '$_id',
        totalPresentCount: 1,
        _id: 0,
      },
    },
  ]);
  const resultWithSchoolDataNotFoundCount = await Promise.all(
    result.map(async (zone) => {
      const schoolsDataNotFoundCount = await Attendance.countDocuments({
        attendanceStatus: 'data not found',
        attendance_DATE: new Date(date),
        district_name: districtName,
        Z_name: zone.zone_name,
        SchManagement: 'Government', // Filter for Government schools
      });

      return {
        zone_name: zone.zone_name,
        totalPresentCount: zone.totalPresentCount,
        schoolsDataNotFoundCount,
      };
    })
  );

  return resultWithSchoolDataNotFoundCount;
};

/**
 * Get top 5 performing schools based on present counts for a specific zoneName and Date
 * @param {string} zoneName - Name of the district
 * @param {string} date - date of the attendance
 * @returns {Promise<Array<Object>>} - Array of top 5 performing schools with present counts
 */
const getTopPerformingSchoolsByZoneName = async (zoneName, date) => {
  const result = await Attendance.aggregate([
    {
      $match: { SchManagement: 'Government', Z_name: zoneName, attendance_DATE: new Date(date) },
    },
    {
      $group: {
        _id: '$School_ID',
        totalPresentCount: { $sum: '$PresentCount' },
        schoolName: { $first: '$school_name' }, // Include school name
      },
    },
    {
      $sort: { totalPresentCount: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        schoolName: 1,
        totalPresentCount: 1,
        _id: 0,
      },
    },
  ]);

  const resultWithSchoolDataNotFoundCount = await Promise.all(
    result.map(async (school) => {
      const schoolsDataNotFoundCount = await Attendance.countDocuments({
        attendanceStatus: 'data not found',
        attendance_DATE: new Date(date),
        Z_name: zoneName,
        School_ID: school.schoolName,
        SchManagement: 'Government',
      });

      return {
        schoolName: school.schoolName,
        totalPresentCount: school.totalPresentCount,
        schoolsDataNotFoundCount,
      };
    })
  );

  return resultWithSchoolDataNotFoundCount;
};

/**
 * Get bottom 5 performing districts based on present counts
 * @param {string} date - date of the attendance
 * @returns {Promise<Array<Object>>} - Array of bottom 5 performing districts with present counts
 */
const getBottomPerformingDistricts = async (date) => {
  const result = await Attendance.aggregate([
    {
      $match: { attendance_DATE: new Date(date), SchManagement: 'Government' }, // Filter records based on the provided date
    },
    {
      $group: {
        _id: '$district_name',
        totalPresentCount: { $sum: '$PresentCount' },
      },
    },
    {
      $sort: { totalPresentCount: 1 }, // Sort in ascending order for bottom performance
    },
    {
      $limit: 5,
    },
    {
      $project: {
        district_name: '$_id',
        totalPresentCount: 1,
        _id: 0,
      },
    },
  ]);

  // Fetch count of schools with attendanceStatus = "data not found" for each district
  const resultWithSchoolsDataNotFoundCount = await Promise.all(
    result.map(async (district) => {
      const schoolsDataNotFoundCount = await Attendance.countDocuments({
        attendanceStatus: 'data not found',
        attendance_DATE: new Date(date),
        district_name: district.district_name,
        SchManagement: 'Government',
      });

      return {
        district_name: district.district_name,
        totalPresentCount: district.totalPresentCount,
        schoolsDataNotFoundCount,
      };
    })
  );

  return resultWithSchoolsDataNotFoundCount;
};
/**
 * Get top 5 performing zones based on present counts for a specific district and Date
 * @param {string} districtName - Name of the district
 * @param {string} date - date of the attendance
 * @returns {Promise<Array<Object>>} - Array of top 5 performing zones with present counts
 */

const getBottomPerformingZonesByDistrict = async (districtName, date) => {
  const result = await Attendance.aggregate([
    {
      $match: { SchManagement: 'Government', district_name: districtName, attendance_DATE: new Date(date) },
    },
    {
      $group: {
        _id: '$Z_name',
        totalPresentCount: { $sum: '$PresentCount' },
      },
    },
    {
      $sort: { totalPresentCount: 1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        zone_name: '$_id',
        totalPresentCount: 1,
        _id: 0,
      },
    },
  ]);
  const resultWithSchoolDataNotFoundCount = await Promise.all(
    result.map(async (zone) => {
      const schoolsDataNotFoundCount = await Attendance.countDocuments({
        attendanceStatus: 'data not found',
        attendance_DATE: new Date(date),
        district_name: districtName,
        Z_name: zone.zone_name,
        SchManagement: 'Government',
      });

      return {
        zone_name: zone.zone_name,
        totalPresentCount: zone.totalPresentCount,
        schoolsDataNotFoundCount,
      };
    })
  );

  return resultWithSchoolDataNotFoundCount;
};

/**
 * Get bottom 5 performing schools based on present counts for a specific zoneName and Date
 * @param {string} zoneName - Name of the district
 * @param {string} date - date of the attendance
 * @returns {Promise<Array<Object>>} - Array of top 5 performing schools with present counts
 */
const getBottomPerformingSchoolsByZoneName = async (zoneName, date) => {
  const result = await Attendance.aggregate([
    {
      $match: { SchManagement: 'Government', Z_name: zoneName, attendance_DATE: new Date(date) },
    },
    {
      $group: {
        _id: '$School_ID',
        totalPresentCount: { $sum: '$PresentCount' },
        schoolName: { $first: '$school_name' }, // Include school name
      },
    },
    {
      $sort: { totalPresentCount: 1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        schoolName: 1,
        totalPresentCount: 1,
        _id: 0,
      },
    },
  ]);
  const resultWithSchoolDataNotFoundCount = await Promise.all(
    result.map(async (school) => {
      const schoolsDataNotFoundCount = await Attendance.countDocuments({
        attendanceStatus: 'data not found',
        attendance_DATE: new Date(date),
        Z_name: zoneName,
        School_ID: school.schoolName,
        SchManagement: 'Government',
      });

      return {
        schoolName: school.schoolName,
        totalPresentCount: school.totalPresentCount,
        schoolsDataNotFoundCount,
      };
    })
  );

  return resultWithSchoolDataNotFoundCount;
};

/**
 * Get count of schools with attendanceStatus = "data not found"
 * @returns {Promise<number>} - Count of schools with attendanceStatus = "data not found"
 */
const getSchoolsDataNotFoundCount = async (date) => {
  const count = await Attendance.countDocuments({
    attendanceStatus: 'data not found',
    attendance_DATE: new Date(date),
    SchManagement: 'Government',
  });
  return count;
};

/**
 * Get top 5 performing classes based on present counts for a specific school and Date
 * @param {string} schoolId - ID of the school
 * @param {string} date - Date of the attendance
 * @returns {Promise<Array<Object>>} - Array of top 5 performing classes with present counts
 */
const getTopPerformingClassesBySchoolId = async (schoolId, date) => {
  const result = await Attendance.aggregate([
    {
      $match: { School_ID: schoolId, attendance_DATE: new Date(date), SchManagement: 'Government' },
    },
    {
      $unwind: '$classCount', // Unwind the classCount array
    },
    {
      $group: {
        _id: '$classCount.className',
        totalPresentCount: { $sum: '$classCount.classPresentCount' },
      },
    },
    {
      $sort: { totalPresentCount: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        className: '$_id',
        totalPresentCount: 1,
        _id: 0,
      },
    },
  ]);

  return result;
};

/**
 * Get bottom 5 performing classes based on present counts for a specific school and Date
 * @param {string} schoolId - ID of the school
 * @param {string} date - Date of the attendance
 * @returns {Promise<Array<Object>>} - Array of bottom 5 performing classes with present counts
 */
const getBottomPerformingClassesBySchoolId = async (schoolId, date) => {
  const result = await Attendance.aggregate([
    {
      $match: { School_ID: schoolId, attendance_DATE: new Date(date), SchManagement: 'Government' },
    },
    {
      $unwind: '$classCount', // Unwind the classCount array
    },
    {
      $group: {
        _id: '$classCount.className',
        totalPresentCount: { $sum: '$classCount.classPresentCount' },
      },
    },
    {
      $sort: { totalPresentCount: 1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        className: '$_id',
        totalPresentCount: 1,
        _id: 0,
      },
    },
  ]);

  return result;
};
//------------------------------------------------------------------------------

/**
 * Get  attendance counts for a specific date for Added schools
 * @param {string} date - The end date of the attendance range
 * @returns {Promise<Object>} - Object containing gender range-wise attendance counts
 */
const getAttendanceCountForAddedSchools = async (date) => {
  const result = await Attendance.aggregate([
    {
      $match: {
        attendance_DATE: new Date(date),
        SchManagement: 'Aided',
      },
    },
    {
      $group: {
        _id: null,
        totalPresentCount: { $sum: '$PresentCount' },
        totalAbsentCount: { $sum: '$AbsentCount' },
        totalLeaveCount: { $sum: '$totalLeaveCount' },
        totalAttendanceNotMarked: { $sum: '$totalNotMarkedAttendanceCount' },
      },
    },
    {
      $project: {
        _id: 0, // Exclude _id field
      },
    },
  ]);
  const attendanceCounts = result[0]; // Return the first element as we used $group
  const countofSchool = await School.countDocuments({ SchManagement: 'Aided' }).exec();
  const schools = await School.find({ SchManagement: 'Aided' }, 'Schoolid');
  const schoolIds = schools.map((school) => school.Schoolid);
  const totalStudentCount = await Student.countDocuments({ Schoolid: { $in: schoolIds }, status: 'Studying' });
  const results = {
    countofSchool,
    totalStudentCount,
    attendanceCounts,
  };
  return results;
};

/**
 * Get schools list of Aided
 * @returns {Promise<Object>} - Get schools list of Aided
 */
const getAidedSchoolList = async () => {
  const count = await School.find({
    SchManagement: 'Aided',
  });
  return count;
};

module.exports = {
  storeAttendanceDataInMongoDB,
  getAttendanceCounts,
  getAttendanceCountsDistrictWise,
  getAttendanceCountsZoneWise,
  getAttendanceCountsSchoolWise,
  getAttendanceCountsShiftWise,
  attendanceStatus,
  attendanceStatusDistrictWise,
  attendanceStatusZoneWise,
  attendanceStatusSchoolWise,
  attendanceStatusShiftWise,
  getDistrictWisePresentCount,
  //-----------------------
  getGenderRangeWiseCount,
  getAttendancePercentageGenderAndRangeWise,
  getAttendancePercentageGenderAndRangeAndShiftWise,
  storeAttendanceDataByDate,
  getTopPerformingDistricts,
  getTopPerformingZonesByDistrict,
  getTopPerformingSchoolsByZoneName,
  getBottomPerformingDistricts,
  getBottomPerformingZonesByDistrict,
  getBottomPerformingSchoolsByZoneName,
  getSchoolsDataNotFoundCount,
  getTopPerformingClassesBySchoolId,
  getBottomPerformingClassesBySchoolId,
  //----------------------------------------------------------------
  getAttendanceCountForAddedSchools,
  getAidedSchoolList,
};
