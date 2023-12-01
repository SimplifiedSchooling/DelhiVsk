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
    return null;
  }
}

// /**
//  * Get Attendance data from server and store in databae
//  * @returns {Promise<Attendance>}
//  */

// const storeAttendanceDataInMongoDB = async () => {
//   const now = new Date();
//   const day = String(now.getDate()).padStart(2, '0');
//   const month = String(now.getMonth() + 1).padStart(2, '0');
//   const year = now.getFullYear();

//   const date = `${day}/${month}/${year}`;
//   const password = 'VSK@9180';

//   const schools = await School.find().exec();
//   for (const school of schools) {
//     const studentData = await fetchStudentDataForSchool(school.Schoolid, password, date);

//     if (studentData) {
//       // Create a unique identifier based on school and date
//       const identifier = `${school.Schoolid}-${date}`;

//       // Check if an entry with the same identifier exists
//       const existingAttendance = await Attendance.findOne({ identifier });

//       const genderCounts = studentData.reduce(
//         (count, student) => {
//           count[student.Gender] = (count[student.Gender] || 0) + 1;
//           return count;
//         },
//         { M: 0, F: 0, T: 0 }
//       );

//       const studentgenderWiseCount = await StudentCounts.findOne({ Schoolid: school.Schoolid });

//       const genderAbsentCount = {
//         male: studentgenderWiseCount.maleStudents - genderCounts.M,
//         female: studentgenderWiseCount.femaleStudents - genderCounts.F,
//         others: studentgenderWiseCount.otherStudents - genderCounts.T,
//       };

//       const totalStudentCount =
//         studentgenderWiseCount.maleStudents + studentgenderWiseCount.femaleStudents + studentgenderWiseCount.otherStudents;

//       if (existingAttendance) {
//         // If an entry with the same identifier exists, update it
//         await Attendance.updateOne(
//           { identifier },
//           {
//             district_name: school.District_name,
//             Z_name: school.Zone_Name,
//             School_ID: school.Schoolid,
//             school_name: school.School_Name,
//             shift: school.shift,
//             attendance_DATE: date,
//             totalStudentCount,
//             PreasentCount: studentData.length,
//             malePresentCount: genderCounts.M,
//             feMalePresentCount: genderCounts.F,
//             otherPresentCount: genderCounts.T,
//             maleAbsentCount: genderAbsentCount.male,
//             feMaleAbsentCount: genderAbsentCount.female,
//             othersAbsentCount: genderAbsentCount.others,
//           }
//         );
//       } else {
//         // If no entry with the same identifier exists, create a new one
//         await Attendance.create({
//           identifier, // Add the identifier to the entry
//           district_name: school.District_name,
//           Z_name: school.Zone_Name,
//           School_ID: school.Schoolid,
//           school_name: school.School_Name,
//           shift: school.shift,
//           attendance_DATE: date,
//           totalStudentCount,
//           PreasentCount: studentData.length,
//           malePresentCount: genderCounts.M,
//           feMalePresentCount: genderCounts.F,
//           otherPresentCount: genderCounts.T,
//           maleAbsentCount: genderAbsentCount.male,
//           feMaleAbsentCount: genderAbsentCount.female,
//           othersAbsentCount: genderAbsentCount.others,
//         });
//       }
//     }
//   }
// };

// const storeAttendanceDataInMongoDB = async () => {
//   const now = new Date();
//   const day = String(now.getDate()).padStart(2, '0');
//   const month = String(now.getMonth() + 1).padStart(2, '0');
//   const year = now.getFullYear();

//   const date = `${day}/${month}/${year}`;
//   const password = 'VSK@9180';

//   const schools = await School.find().exec();
//   for (const school of schools) {
//     const studentData = await fetchStudentDataForSchool(school.Schoolid, password, date);

//     if (studentData) {
//       // Create a unique identifier based on school and date
//       const identifier = `${school.Schoolid}-${date}`;

//       // Check if an entry with the same identifier exists
//       const existingAttendance = await Attendance.findOne({ identifier });

//       // const studentgenderWiseCount = await StudentCounts.findOne({ Schoolid: school.Schoolid });

//       const maleStudents = await Student.countDocuments({ Gender: 'M', Schoolid: Number(school.Schoolid) }).exec();
//       const femaleStudents = await Student.countDocuments({ Gender: 'F', Schoolid: Number(school.Schoolid) }).exec();
//       const otherStudents = await Student.countDocuments({ Gender: 'T', Schoolid: Number(school.Schoolid) }).exec();

//       const totalStudentCount = maleStudents + femaleStudents + otherStudents;

//       let attendanceStatus = 'done';

//       // Check if attendance data is not found
//       if (studentData.length === 0) {
//         attendanceStatus = 'data not found';
//       } else if (studentData.some((student) => student.attendance === '')) {
//         attendanceStatus = 'attendanceNotTaken';
//       }

//       const malePresentCount = studentData.filter(
//         (student) => student.Gender === 'M' && student.attendance === 'Present'
//       ).length;
//       const femalePresentCount = studentData.filter(
//         (student) => student.Gender === 'F' && student.attendance === 'Present'
//       ).length;
//       const otherPresentCount = studentData.filter(
//         (student) => student.Gender === 'T' && student.attendance === 'Present'
//       ).length;

//       const maleAbsentCount = studentData.filter(
//         (student) => student.Gender === 'M' && student.attendance === 'Absent'
//       ).length;
//       const femaleAbsentCount = studentData.filter(
//         (student) => student.Gender === 'F' && student.attendance === 'Absent'
//       ).length;
//       const otherAbsentCount = studentData.filter(
//         (student) => student.Gender === 'T' && student.attendance === 'Absent'
//       ).length;

//       const maleLeaveCount = studentData.filter(
//         (student) => student.Gender === 'M' && student.attendance === 'Leave'
//       ).length;
//       const femaleLeaveCount = studentData.filter(
//         (student) => student.Gender === 'F' && student.attendance === 'Leave'
//       ).length;
//       const otherLeaveCount = studentData.filter(
//         (student) => student.Gender === 'T' && student.attendance === 'Leave'
//       ).length;

//       const maleAttendanceNotMarked = studentData.filter(
//         (student) => student.Gender === 'M' && student.attendance === ''
//       ).length;
//       const femaleAttendanceNotMarked = studentData.filter(
//         (student) => student.Gender === 'F' && student.attendance === ''
//       ).length;
//       const otherAttendanceNotMarked = studentData.filter(
//         (student) => student.Gender === 'T' && student.attendance === ''
//       ).length;

//       const presentCountData = (await malePresentCount) + femalePresentCount + otherPresentCount;
//       const AbsentCount = (await maleAbsentCount) + femaleAbsentCount + otherAbsentCount;
//       const totalNotMarkedAttendanceCount =
//         (await maleAttendanceNotMarked) + femaleAttendanceNotMarked + otherAttendanceNotMarked;
//       const totalLeaveCount = (await maleLeaveCount) + femaleLeaveCount + otherLeaveCount;
//       if (existingAttendance) {
//         // If an entry with the same identifier exists, update it
//         await Attendance.updateOne(
//           { identifier },
//           {
//             district_name: school.District_name,
//             Z_name: school.Zone_Name,
//             School_ID: school.Schoolid,
//             school_name: school.School_Name,
//             shift: school.shift,
//             attendance_DATE: date,
//             totalStudentCount,
//             PresentCount: presentCountData,
//             AbsentCount,
//             totalNotMarkedAttendanceCount,
//             totalLeaveCount,
//             malePresentCount,
//             feMalePresentCount: femalePresentCount,
//             otherPresentCount,
//             maleAbsentCount,
//             feMaleAbsentCount: femaleAbsentCount,
//             otherAbsentCount,
//             maleLeaveCount,
//             femaleLeaveCount,
//             otherLeaveCount,
//             maleAttendanceNotMarked,
//             femaleAttendanceNotMarked,
//             otherAttendanceNotMarked,
//             attendanceStatus,
//           }
//         );
//       } else {
//         // If no entry with the same identifier exists, create a new one
//         await Attendance.create({
//           identifier, // Add the identifier to the entry
//           district_name: school.District_name,
//           Z_name: school.Zone_Name,
//           School_ID: school.Schoolid,
//           school_name: school.School_Name,
//           shift: school.shift,
//           attendance_DATE: date,
//           totalStudentCount,
//           PresentCount: presentCountData,
//           AbsentCount,
//           totalNotMarkedAttendanceCount,
//           totalLeaveCount,
//           malePresentCount,
//           feMalePresentCount: femalePresentCount,
//           otherPresentCount,
//           maleAbsentCount,
//           feMaleAbsentCount: femaleAbsentCount,
//           otherAbsentCount,
//           maleLeaveCount,
//           femaleLeaveCount,
//           otherLeaveCount,
//           maleAttendanceNotMarked,
//           femaleAttendanceNotMarked,
//           otherAttendanceNotMarked,
//           attendanceStatus,
//         });
//       }
//     }
//   }
// };

const storeAttendanceDataInMongoDB = async () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  const date = `${day}/${month}/${year}`;
  // const date = "28/11/2023";
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

      let attendanceStatus = 'done';

      // Check if attendance data is not found
      if (studentData.length === 0) {
        attendanceStatus = 'data not found';
      } else if (studentData.some((student) => student.attendance === '')) {
        attendanceStatus = 'attendanceNotTaken';
      }

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
          console.log(otherAbsentCount);
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
            attendance_DATE: date,
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
            othersAbsentCount :otherAbsentCount ,
            maleLeaveCount,
            femaleLeaveCount,
            otherLeaveCount,
            maleAttendanceNotMarked,
            femaleAttendanceNotMarked,
            otherAttendanceNotMarked,
            attendanceStatus,
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
          attendance_DATE: date,
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
          othersAbsentCount : otherAbsentCount ,
          maleLeaveCount,
          femaleLeaveCount,
          otherLeaveCount,
          maleAttendanceNotMarked,
          femaleAttendanceNotMarked,
          otherAttendanceNotMarked,
          attendanceStatus,
          classCount,
        });
      }
    }
  }
};

const storeAttendanceDataByDate = async (date) => {
  // const now = new Date();
  // const day = String(now.getDate()).padStart(2, '0');
  // const month = String(now.getMonth() + 1).padStart(2, '0');
  // const year = now.getFullYear();

  // const date = `${day}/${month}/${year}`;
  // const date = "28/11/2023";
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

      let attendanceStatus = 'done';

      // Check if attendance data is not found
      if (studentData.length === 0) {
        attendanceStatus = 'data not found';
      } else if (studentData.some((student) => student.attendance === '')) {
        attendanceStatus = 'attendanceNotTaken';
      }

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
            attendance_DATE: date,
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
            attendanceStatus,
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
          attendance_DATE: date,
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
          attendanceStatus,
          classCount,
        });
      }
    }
  }
};

// Schedule the job to run every day at 9 PM
cron.schedule('0 21 * * *', async () => {
  try {
    logger.info(`Running the attendance data update job...`);
    await storeAttendanceDataInMongoDB();
    logger.info(`Attendance data update job completed.`);
  } catch (error) {
    logger.info('Error running the job:', error);
  }
});
//////////////////////////Attendance graph by single date /////////////
const getAttendanceCounts = async (date) => {
  const match = {
    attendance_DATE: date,
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
        maleLeaveCount: {$sum: '$maleLeaveCount'},
        femaleLeaveCount: {$sum: '$femaleLeaveCount'},
        otherLeaveCount: {$sum: '$otherLeaveCount'},
        maleAttendanceNotMarked: {$sum: '$maleAttendanceNotMarked'},
        femaleAttendanceNotMarked: {$sum: '$femaleAttendanceNotMarked'},
        otherAttendanceNotMarked: {$sum: '$otherAttendanceNotMarked'},
        attendanceNotFoundCount: {
          $sum: { $cond: [{ $eq: ['$attendanceStatus', 'data not found'] }, 1, 0] },
        },
      },
    },
  ]);
  const countofSchoool = await School.countDocuments().exec();
  const totalStudentCount = await Student.countDocuments().exec();
  return {
    countofSchoool,
    totalStudentCount: totalStudentCount,
    Counts:Counts
  };
};

const getAttendanceCountsDistrictWise = async (body) => {
  const { date, districtName } = body;
  const dateMatch = {
    $match: {
      attendance_DATE: date,
      district_name: districtName,
    },
  };
  const Counts = await Attendance.aggregate([
     dateMatch ,
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
        maleLeaveCount: {$sum: '$maleLeaveCount'},
        femaleLeaveCount: {$sum: '$femaleLeaveCount'},
        otherLeaveCount: {$sum: '$otherLeaveCount'},
        maleAttendanceNotMarked: {$sum: '$maleAttendanceNotMarked'},
        femaleAttendanceNotMarked: {$sum: '$femaleAttendanceNotMarked'},
        otherAttendanceNotMarked: {$sum: '$otherAttendanceNotMarked'},
        attendanceNotFoundCount: {
          $sum: { $cond: [{ $eq: ['$attendanceStatus', 'data not found'] }, 1, 0] },
        },
      },
    },
  ]);
  const countofSchoool = await School.countDocuments({District_name: districtName}).exec();
  const totalStudentCount = await Student.countDocuments({District: districtName}).exec();
  return {
    countofSchoool,
    totalStudentCount: totalStudentCount,
    Counts:Counts
  };
};

const getAttendanceCountsZoneWise = async (date, Z_name) => {
  const match = {
    $match: {
      attendance_DATE: date,
      Z_name,
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
        maleLeaveCount: {$sum: '$maleLeaveCount'},
        femaleLeaveCount: {$sum: '$femaleLeaveCount'},
        otherLeaveCount: {$sum: '$otherLeaveCount'},
        maleAttendanceNotMarked: {$sum: '$maleAttendanceNotMarked'},
        femaleAttendanceNotMarked: {$sum: '$femaleAttendanceNotMarked'},
        otherAttendanceNotMarked: {$sum: '$otherAttendanceNotMarked'},
        attendanceNotFoundCountSchoolCount: {
          $sum: { $cond: [{ $eq: ['$attendanceStatus', 'data not found'] }, 1, 0] },
        },
      },
    },
  ]);
  const countofSchoool = await School.countDocuments({Zone_Name: Z_name}).exec();
  const totalStudentCount = await Student.countDocuments({z_name: Z_name.toLowerCase()}).exec();
  return {
    countofSchoool,
    totalStudentCount: totalStudentCount,
    Counts:Counts
  };
};

const getAttendanceCountsShiftWise = async (date, shift) => {
  const dateMatch = {
    $match: {
      attendance_DATE: date,
      shift,
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
       maleLeaveCount: {$sum: '$maleLeaveCount'},
       femaleLeaveCount: {$sum: '$femaleLeaveCount'},
       otherLeaveCount: {$sum: '$otherLeaveCount'},
       maleAttendanceNotMarked: {$sum: '$maleAttendanceNotMarked'},
       femaleAttendanceNotMarked: {$sum: '$femaleAttendanceNotMarked'},
       otherAttendanceNotMarked: {$sum: '$otherAttendanceNotMarked'},
       attendanceNotFoundCountSchoolCount: {
         $sum: { $cond: [{ $eq: ['$attendanceStatus', 'data not found'] }, 1, 0] },
       },
     },
   },
 ]);
 const countofSchoool = await School.countDocuments({shift}).exec();
 const schools = await School.find({ shift });

 // Extract school IDs from the result
 const schoolIds = schools.map((school) => school.Schoolid);

 // Use aggregation to get shift-wise student count
 const result = await Student.aggregate([
   {
     $match: {
       Schoolid: { $in: schoolIds },
     },
   },
   {
     $group: {
       _id: '$shift',
       studentCount: { $sum: 1 },
     },
   },
 ]);

console.log(result[0].studentCount)

// const totalStudentCount = await Student.countDocuments({z_name: Z_name}).exec();
 return {
   countofSchoool,
   totalStudentCount: result[0].studentCount,
   Counts:Counts
 };
};

const getDistrictWisePresentCount = async (date) => {
  const match = {
    attendance_DATE: date,
  };

  const districtCounts = await Attendance.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: '$district_name',
        totalStudentCount: { $sum: '$totalStudentCount' },
        totalPreasentCount: { $sum: '$PreasentCount' },
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
 * Get Attendance data from server
 * @param {string} schoolId
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Promise<Attendance>}
 */
const getGenderRangeWiseCount = async (schoolId, startDate, endDate) => {
  const result = await Attendance.aggregate([
    {
      $match: {
        School_ID: schoolId,
        attendance_DATE: { $gte: startDate, $lte: endDate },
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

// const getAttendancePercentageGenderAndRangeWise = async (startDate, endDate, zoneName, districtName, schoolId) => {
//   // Match stage to filter based on parameters
//   const matchStage = {
//     attendance_DATE: { $gte: startDate, $lte: endDate },
//   };

//   if (schoolId) {
//     matchStage.School_ID = schoolId;
//   }

//   if (districtName) {
//     matchStage.district_name = districtName;
//   }

//   if (zoneName) {
//     matchStage.Z_name = zoneName;
//   }

//   // Aggregation pipeline
//   const result = await Attendance.aggregate([
//     {
//       $match: matchStage,
//     },
//     {
//       $group: {
//         _id: null,
//         totalEntries: { $sum: '$totalStudentCount' }, // Count total entries
//         malePresentCount: { $sum: '$malePresentCount' },
//         feMalePresentCount: { $sum: '$feMalePresentCount' },
//         otherPresentCount: { $sum: '$otherPresentCount' },
//         maleAbsentCount: { $sum: '$maleAbsentCount' },
//         feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
//         otherAbsentCount: { $sum: '$otherAbsentCount' },
//         maleLeaveCount: { $sum: '$maleLeaveCount' },
//         femaleLeaveCount: { $sum: '$femaleLeaveCount' },
//         otherLeaveCount: { $sum: '$otherLeaveCount' },
//         maleNotMarkedCount: { $sum: '$maleAttendanceNotMarked' },
//         femaleNotMarkedCount: { $sum: '$femaleAttendanceNotMarked' },
//         otherNotMarkedCount: { $sum: '$otherAttendanceNotMarked' },
//       },
//     },
//     {
//       $project: {
//         _id: 0, // Exclude _id field
//         totalEntries: 1,
//         malePresentPercentage: { $multiply: [{ $divide: ['$malePresentCount', '$totalEntries'] }, 100] },
//         feMalePresentPercentage: { $multiply: [{ $divide: ['$feMalePresentCount', '$totalEntries'] }, 100] },
//         otherPresentPercentage: { $multiply: [{ $divide: ['$otherPresentCount', '$totalEntries'] }, 100] },
//         maleAbsentPercentage: { $multiply: [{ $divide: ['$maleAbsentCount', '$totalEntries'] }, 100] },
//         feMaleAbsentPercentage: { $multiply: [{ $divide: ['$feMaleAbsentCount', '$totalEntries'] }, 100] },
//         otherAbsentPercentage: { $multiply: [{ $divide: ['$otherAbsentCount', '$totalEntries'] }, 100] },
//         maleLeavePercentage: { $multiply: [{ $divide: ['$maleLeaveCount', '$totalEntries'] }, 100] },
//         femaleLeavePercentage: { $multiply: [{ $divide: ['$femaleLeaveCount', '$totalEntries'] }, 100] },
//         otherLeavePercentage: { $multiply: [{ $divide: ['$otherLeaveCount', '$totalEntries'] }, 100] },
//         maleNotMarkedPercentage: { $multiply: [{ $divide: ['$maleNotMarkedCount', '$totalEntries'] }, 100] },
//         femaleNotMarkedPercentage: { $multiply: [{ $divide: ['$femaleNotMarkedCount', '$totalEntries'] }, 100] },
//         otherNotMarkedPercentage: { $multiply: [{ $divide: ['$otherNotMarkedCount', '$totalEntries'] }, 100] },
//       },
//     },
//   ]);

//   return result[0] || {}; // Return the first element or an empty object if no data found
// };

// const getAttendancePercentageGenderAndRangeWise = async (startDate, endDate, zoneName, districtName, schoolId) => {
//   // Match stage to filter based on parameters
//   const matchStage = {
//     attendance_DATE: { $gte: startDate, $lte: endDate },
//   };

//   if (schoolId) {
//     matchStage.School_ID = schoolId;
//   }

//   if (districtName) {
//     matchStage.district_name = districtName;
//   }

//   if (zoneName) {
//     matchStage.Z_name = zoneName;
//   }

//   // Aggregation pipeline for overall percentage
//   const overallResult = await Attendance.aggregate([
//     {
//       $match: matchStage,
//     },
//     {
//       $group: {
//         _id: null,
//         totalEntries: { $sum: '$totalStudentCount' }, // Count total entries
//         malePresentCount: { $sum: '$malePresentCount' },
//         feMalePresentCount: { $sum: '$feMalePresentCount' },
//         otherPresentCount: { $sum: '$otherPresentCount' },
//         maleAbsentCount: { $sum: '$maleAbsentCount' },
//         feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
//         otherAbsentCount: { $sum: '$otherAbsentCount' },
//         maleLeaveCount: { $sum: '$maleLeaveCount' },
//         femaleLeaveCount: { $sum: '$femaleLeaveCount' },
//         otherLeaveCount: { $sum: '$otherLeaveCount' },
//         maleNotMarkedCount: { $sum: '$maleAttendanceNotMarked' },
//         femaleNotMarkedCount: { $sum: '$femaleAttendanceNotMarked' },
//         otherNotMarkedCount: { $sum: '$otherAttendanceNotMarked' },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         overallPercentage: {
//           totalEntries: 1,
//           malePresentPercentage: { $multiply: [{ $divide: ['$malePresentCount', '$totalEntries'] }, 100] },
//           feMalePresentPercentage: { $multiply: [{ $divide: ['$feMalePresentCount', '$totalEntries'] }, 100] },
//           otherPresentPercentage: { $multiply: [{ $divide: ['$otherPresentCount', '$totalEntries'] }, 100] },
//           maleAbsentPercentage: { $multiply: [{ $divide: ['$maleAbsentCount', '$totalEntries'] }, 100] },
//           feMaleAbsentPercentage: { $multiply: [{ $divide: ['$feMaleAbsentCount', '$totalEntries'] }, 100] },
//           otherAbsentPercentage: { $multiply: [{ $divide: ['$otherAbsentCount', '$totalEntries'] }, 100] },
//           maleLeavePercentage: { $multiply: [{ $divide: ['$maleLeaveCount', '$totalEntries'] }, 100] },
//           femaleLeavePercentage: { $multiply: [{ $divide: ['$femaleLeaveCount', '$totalEntries'] }, 100] },
//           otherLeavePercentage: { $multiply: [{ $divide: ['$otherLeaveCount', '$totalEntries'] }, 100] },
//           maleNotMarkedPercentage: { $multiply: [{ $divide: ['$maleNotMarkedCount', '$totalEntries'] }, 100] },
//           femaleNotMarkedPercentage: { $multiply: [{ $divide: ['$femaleNotMarkedCount', '$totalEntries'] }, 100] },
//           otherNotMarkedPercentage: { $multiply: [{ $divide: ['$otherNotMarkedCount', '$totalEntries'] }, 100] },
//         },
//       },
//     },
//   ]);

//   // Aggregation pipeline for date-wise percentage
//   const dateWiseResult = await Attendance.aggregate([
//     {
//       $match: matchStage,
//     },
//     {
//       $group: {
//         _id: '$attendance_DATE',
//         totalEntries: { $sum: '$totalStudentCount' }, // Count total entries
//         malePresentCount: { $sum: '$malePresentCount' },
//         feMalePresentCount: { $sum: '$feMalePresentCount' },
//         otherPresentCount: { $sum: '$otherPresentCount' },
//         maleAbsentCount: { $sum: '$maleAbsentCount' },
//         feMaleAbsentCount: { $sum: '$feMaleAbsentCount' },
//         otherAbsentCount: { $sum: '$otherAbsentCount' },
//         maleLeaveCount: { $sum: '$maleLeaveCount' },
//         femaleLeaveCount: { $sum: '$femaleLeaveCount' },
//         otherLeaveCount: { $sum: '$otherLeaveCount' },
//         maleNotMarkedCount: { $sum: '$maleAttendanceNotMarked' },
//         femaleNotMarkedCount: { $sum: '$femaleAttendanceNotMarked' },
//         otherNotMarkedCount: { $sum: '$otherAttendanceNotMarked' },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         attendance_DATE: '$_id',
//         totalEntries: 1,
//         malePresentPercentage: { $multiply: [{ $divide: ['$malePresentCount', '$totalEntries'] }, 100] },
//         feMalePresentPercentage: { $multiply: [{ $divide: ['$feMalePresentCount', '$totalEntries'] }, 100] },
//         otherPresentPercentage: { $multiply: [{ $divide: ['$otherPresentCount', '$totalEntries'] }, 100] },
//         maleAbsentPercentage: { $multiply: [{ $divide: ['$maleAbsentCount', '$totalEntries'] }, 100] },
//         feMaleAbsentPercentage: { $multiply: [{ $divide: ['$feMaleAbsentCount', '$totalEntries'] }, 100] },
//         otherAbsentPercentage: { $multiply: [{ $divide: ['$otherAbsentCount', '$totalEntries'] }, 100] },
//         maleLeavePercentage: { $multiply: [{ $divide: ['$maleLeaveCount', '$totalEntries'] }, 100] },
//         femaleLeavePercentage: { $multiply: [{ $divide: ['$femaleLeaveCount', '$totalEntries'] }, 100] },
//         otherLeavePercentage: { $multiply: [{ $divide: ['$otherLeaveCount', '$totalEntries'] }, 100] },
//         maleNotMarkedPercentage: { $multiply: [{ $divide: ['$maleNotMarkedCount', '$totalEntries'] }, 100] },
//         femaleNotMarkedPercentage: { $multiply: [{ $divide: ['$femaleNotMarkedCount', '$totalEntries'] }, 100] },
//         otherNotMarkedPercentage: { $multiply: [{ $divide: ['$otherNotMarkedCount', '$totalEntries'] }, 100] },
//       },
//     },
//     {
//       $sort: { attendance_DATE: 1 }, // Sort by date ascending
//     },
//   ]);

//   return {
//     overallPercentage: overallResult[0]?.overallPercentage || {},
//     dateWisePercentage: dateWiseResult || [],
//   };
// };
const getAttendancePercentageGenderAndRangeWise = async (startDate, endDate, zoneName, districtName, schoolId) => {
  // Match stage to filter based on parameters
  const matchStage = {
    attendance_DATE: { $gte: startDate, $lte: endDate },
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
        totalEntries: { $sum: '$totalStudentCount' }, // Count total entries
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
        totalEntries: { $sum: '$totalStudentCount' }, // Count total entries
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
      $sort: { attendance_DATE: 1 }, // Sort by date ascending
    },
  ]);

  return {
    overallPercentage: overallResult[0] ? overallResult[0].overallPercentage || {} : {},
    dateWisePercentage: dateWiseResult || [],
  };
};

/**
 * Get top 5 performing districts based on present counts
 * @returns {Promise<Array<Object>>} - Array of top 5 performing districts with present counts
 */
const getTopPerformingDistricts = async () => {
  const result = await Attendance.aggregate([
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

  return result;
};

/**
 * Get top 5 performing zones based on present counts for a specific district
 * @param {string} districtName - Name of the district
 * @returns {Promise<Array<Object>>} - Array of top 5 performing zones with present counts
 */

const getTopPerformingZonesByDistrict = async (districtName) => {
  const result = await Attendance.aggregate([
    {
      $match: { district_name: districtName },
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

  return result;
};

/**
 * Get top 5 performing schools based on present counts for a specific zoneName
 * @param {string} zoneName - Name of the district
 * @returns {Promise<Array<Object>>} - Array of top 5 performing schools with present counts
 */
const getTopPerformingSchoolsByZoneName = async (zoneName) => {
  const result = await Attendance.aggregate([
    {
      $match: { Z_name: zoneName },
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

  return result;
};

module.exports = {
  storeAttendanceDataInMongoDB,
  getAttendanceCounts,
  getAttendanceCountsDistrictWise,
  getAttendanceCountsZoneWise,
  getAttendanceCountsShiftWise,
  getDistrictWisePresentCount,
  //------------------------------------------------------------------
  getGenderRangeWiseCount,
  getAttendancePercentageGenderAndRangeWise,
  storeAttendanceDataByDate,
  getTopPerformingDistricts,
  getTopPerformingZonesByDistrict,
  getTopPerformingSchoolsByZoneName,
};
