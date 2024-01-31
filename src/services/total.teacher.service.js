// const { Teacher, School, GuestTeacher, Student } = require('../models');



// // const getTotalTeacherCounts = async () => {
// //   // Shift wise total teacher count
// //   const shiftWiseTotalTeacherCounts = await Teacher.aggregate([
// //     { $group: { _id: '$shift', count: { $sum: 1 } } },
// //   ]);

// //   // Designation wise total teacher count
// //   const designationWiseTotalTeacherCounts = await Teacher.aggregate([
// //     { $group: { _id: '$postdesc', count: { $sum: 1 } } },
// //   ]);

// //   // School management wise total teacher count
// //   const schoolManagementWiseTotalTeacherCounts = await Teacher.aggregate([
// //     { $group: { _id: '$schname', count: { $sum: 1 } } },
// //   ]);

// //   // School category wise total teacher count
// //   const schoolCategoryWiseTotalTeacherCounts = await School.aggregate([
// //     { $group: { _id: '$SchCategory', count: { $sum: 1 } } },
// //   ]);

// //   // School type wise total teacher count
// //   const schoolTypeWiseTotalTeacherCounts = await School.aggregate([
// //     { $group: { _id: '$typeOfSchool', count: { $sum: 1 } } },
// //   ]);

// //   // Combine counts from GuestTeacher collection
// //   const guestTeacherCounts = await GuestTeacher.aggregate([
// //     { $group: { _id: '$shift', count: { $sum: 1 } } },
// //   ]);

// //   guestTeacherCounts.forEach((count) => {
// //     const shiftExists = shiftWiseTotalTeacherCounts.find((item) => item._id === count._id);
// //     if (shiftExists) {
// //       shiftExists.count += count.count;
// //     } else {
// //       shiftWiseTotalTeacherCounts.push(count);
// //     }
// //   });

// //   return {
// //     shiftWiseTotalTeacherCounts,
// //     designationWiseTotalTeacherCounts,
// //     schoolManagementWiseTotalTeacherCounts,
// //     schoolCategoryWiseTotalTeacherCounts,
// //     schoolTypeWiseTotalTeacherCounts,
// //   };
// // };












// // const getSchoolIdBySchCategoryWise = async () => {
// //     const pipeline = [
// //       {
// //         $group: {
// //           _id: '$SchCategory',
// //           schoolIds: { $push: '$Schoolid' },
// //         },
// //       },
// //     ];
  
// //     const schCategorySchoolIds = await School.aggregate(pipeline);
// //     return schCategorySchoolIds;
// //   };

// // const getMixedTeacherCounts = async () => {
// //     try {
// //       const teacherCounts = [];
  
// //       // Get counts based on school category from the "Teacher" collection
// //       const schCategorySchoolIds = await getSchoolIdBySchCategoryWise();
// //       for (const category of schCategorySchoolIds) {
// //         const teacherCount = await Teacher.countDocuments({ schoolid: { $in: category.schoolIds } });
// //         teacherCounts.push({
// //           SchCategory: category._id,
// //           teacherCount,
// //         });
// //       }
  
// //       // Get counts based on shift from the "Teacher" collection
// //       const shiftWiseSchoolid = await getSchoolIdByShiftWise();
// //       const teacherShiftWiseCounts = [];
// //       for (const shift of shiftWiseSchoolid) {
// //         const teacherShiftWiseCount = await Teacher.countDocuments({ schoolid: { $in: shift.schoolIds } });
// //         teacherShiftWiseCounts.push({
// //           shift: shift._id,
// //           teacherShiftWiseCount,
// //         });
// //       }
  
// //       // Get counts based on school category from the "GuestTeacher" collection
// //       const guestTeacherCounts = await getTeacherStats();
  
// //       // Combine the results from both collections
// //       const combinedCounts = {
// //         teacherCounts,
// //         teacherShiftWiseCounts,
// //         guestTeacherCounts,
// //       };
  
// //       return combinedCounts;
// //     } catch (error) {
// //       throw error;
// //     }
// //   };
  
//   // Usage
// //   const mixedTeacherCounts = await getMixedTeacherCounts();
// //   console.log(mixedTeacherCounts);
  
// // Usage
// // const totalTeacherCounts = await getTotalTeacherCounts();
// // console.log('Total Teacher Counts:', totalTeacherCounts);








// // const getTeacherCounts = async () => {
// //     const pipeline = [
// //       // Group by shift
// //       {
// //         $group: {
// //           _id: '$shift',
// //           teacherCount: { $sum: 1 },
// //         },
// //       },
// //     ];
  
// //     const teacherCountsByShift = await Teacher.aggregate(pipeline);
  
// //     // Add more pipelines for other criteria (designation, school management, etc.)
  
// //     return {
// //       teacherCountsByShift,
// //       // Add more properties for other criteria
// //     };
// //   };
  
// //   const getGuestTeacherCounts = async () => {
// //     const pipeline = [
// //       // Group by shift
// //       {
// //         $group: {
// //           _id: '$shift',
// //           guestTeacherCount: { $sum: 1 },
// //         },
// //       },
// //     ];
  
// //     const guestTeacherCountsByShift = await GuestTeacher.aggregate(pipeline);
  
// //     // Add more pipelines for other criteria (designation, school management, etc.)
  
// //     return {
// //       guestTeacherCountsByShift,
// //       // Add more properties for other criteria
// //     };
// //   };
  
//   // Example usage
// //   const teacherCounts = await getTeacherCounts();
// //   const guestTeacherCounts = await getGuestTeacherCounts();
  

  




// // Function to calculate teacher experience based on JoiningDate and get counts by experience range
// const getTeacherExperienceCountByRange = async () => {
//     try {
//       const currentDate = new Date(); // Current date
//       const teachers = await Teacher.find({});
//       const experienceCounts = {
//         under5Years: 0,
//         fiveTo10Years: 0,
//         tenTo15Years: 0,
//         fifteenTo20Years: 0,
//         twentyTo25Years: 0,
//         over25Years: 0,
//       };
  
//       teachers.forEach((teacher) => {
//         const joiningDate = new Date(teacher.initJoiningDate);
//         const experienceInMilliseconds = currentDate - joiningDate;
//         const yearsOfExperience = experienceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  
//         if (yearsOfExperience < 5) {
//           experienceCounts.under5Years += 1;
//         } else if (yearsOfExperience >= 5 && yearsOfExperience < 10) {
//           experienceCounts.fiveTo10Years += 1;
//         } else if (yearsOfExperience >= 10 && yearsOfExperience < 15) {
//           experienceCounts.tenTo15Years += 1;
//         } else if (yearsOfExperience >= 15 && yearsOfExperience < 20) {
//           experienceCounts.fifteenTo20Years += 1;
//         } else if (yearsOfExperience >= 20 && yearsOfExperience < 25) {
//           experienceCounts.twentyTo25Years += 1;
//         } else {
//           experienceCounts.over25Years += 1;
//         }
//       });
  
//       return experienceCounts;
//     } catch (error) {
//       throw error;
//     }
//   };
  
//   const getSchoolIdByShiftWise = async () => {
//     const pipeline = [
//       {
//         $group: {
//           _id: '$shift',
//           schoolIds: { $push: '$Schoolid' },
//         },
//       },
//     ];
  
//     const schCategorySchoolIds = await School.aggregate(pipeline);
//     return schCategorySchoolIds;
//   };
  
// //   const getSchoolIdByManagmentWise = async () => {
// //     const pipeline = [
// //       {
// //         $group: {
// //           _id: '$SchManagement',
// //           schoolIds: { $push: '$Schoolid' },
// //         },
// //       },
// //     ];
  
// //     const schCategorySchoolIds = await School.aggregate(pipeline);
// //     return schCategorySchoolIds;
// //   };
  
// // //   const getSchoolIdByZoneNameWise = async () => {
// // //     const pipeline = [
// // //       {
// // //         $group: {
// // //           _id: '$Zone_Name',
// // //           schoolIds: { $push: '$Schoolid' },
// // //         },
// // //       },
// // //     ];
// // //     const zoneNameWiseSchoolIds = await School.aggregate(pipeline);
// // //     return zoneNameWiseSchoolIds;
// // //   };
  
// //   const getSchoolIdByTypeOfSchoolWise = async () => {
// //     const pipeline = [
// //       {
// //         $group: {
// //           _id: '$typeOfSchool',
// //           schoolIds: { $push: '$Schoolid' },
// //         },
// //       },
// //     ];
// //     const typeOfSchoolWiseSchoolIds = await School.aggregate(pipeline);
// //     return typeOfSchoolWiseSchoolIds;
// //   };
  
//   const getSchoolIdBySchCategoryWise = async () => {
//     const pipeline = [
//       {
//         $group: {
//           _id: '$SchCategory',
//           schoolIds: { $push: '$Schoolid' },
//         },
//       },
//     ];
  
//     const schCategorySchoolIds = await School.aggregate(pipeline);
//     return schCategorySchoolIds;
//   };
  
// //   const getTeacherStats = async () => {
// //     // const cachedData = await redis.get('getTeacherStatsTeacherGraphical');
  
// //     // if (cachedData) {
// //     //   return JSON.parse(cachedData);
// //     // }
// //     const schCategorySchoolIds = await getSchoolIdBySchCategoryWise();
// //     const teacherCounts = [];
  
// //     for (const category of schCategorySchoolIds) {
// //       const teacherCount = await Teacher.countDocuments({ schoolid: { $in: category.schoolIds } });
// //       teacherCounts.push({
// //         SchCategory: category._id,
// //         teacherCount,
// //       });
// //     }
// //     const shiftWiseSchoolid = await getSchoolIdByShiftWise();
// //     const teacherShiftWiseCounts = [];
// //     for (const shift of shiftWiseSchoolid) {
// //       const teacherShiftWiseCount = await Teacher.countDocuments({ schoolid: { $in: shift.schoolIds } });
// //       teacherShiftWiseCounts.push({
// //         shift: shift._id,
// //         teacherShiftWiseCount,
// //       });
// //     }
  
// //     // const zoneNameWiseCountIds = await getSchoolIdByZoneNameWise();
// //     // const teacherZoneWiseCounts = [];
  
// //     // for (const zone of zoneNameWiseCountIds) {
// //     //   const teacherZoneWiseCount = await Teacher.countDocuments({ schoolid: { $in: zone.schoolIds } });
// //     //   teacherZoneWiseCounts.push({
// //     //     zoneName: zone._id,
// //     //     teacherZoneWiseCount,
// //     //   });
// //     // }
  
// //     const managmentWiseCountId = await getSchoolIdByManagmentWise();
// //     const teacherManagmentWiseCounts = [];
// //     for (const managment of managmentWiseCountId) {
// //       const teacherManagmentWiseCount = await Teacher.countDocuments({ schoolid: { $in: managment.schoolIds } });
// //       teacherManagmentWiseCounts.push({
// //         shift: managment._id,
// //         teacherManagmentWiseCount,
// //       });
// //     }
  
// //     const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWise();
// //     const teacherTypeOfSchoolWiseCounts = [];
  
// //     for (const typeOfSchool of typeOfSchoolWiseCountIds) {
// //       const teacherTypeOfSchoolWiseCount = await Teacher.countDocuments({ schoolid: { $in: typeOfSchool.schoolIds } });
// //       teacherTypeOfSchoolWiseCounts.push({
// //         typeOfSchool: typeOfSchool._id,
// //         teacherTypeOfSchoolWiseCount,
// //       });
// //     }
  
// //     const pipeline3 = [
// //       {
// //         $group: {
// //           _id: '$postdesc',
// //           teacherCount: { $sum: 1 },
// //         },
// //       },
// //       {
// //         $sort: { _id: 1 },
// //       },
// //     ];
  
// //     const [totalSchools, totalTeachers, totalFemaleTeachers, totalMaleTeachers, totalStydyingStudent] =
// //       await Promise.allSettled([
// //         School.countDocuments({}).exec(),
// //         Teacher.countDocuments({}).exec(),
// //         Teacher.countDocuments({ gender: 'Female' }).exec(),
// //         Teacher.countDocuments({ gender: 'Male' }).exec(),
// //         Student.countDocuments({ status: 'Studying' }).exec(),
// //       ]);
  
// //     // const totalGuestTeacher = await GuestTeacher.countDocuments().exec();
// //     // const totalTeach = totalGuestTeacher + totalTeachers.value;
// //     const postdescWiseTeacherCounts = await Teacher.aggregate(pipeline3);
// //     // const experianceOfTeachers = await getTeacherExperienceCountByRange();
// //     const averageTeachers = totalTeachers.value / totalSchools.value;
// //     const teacherStudentRatio = totalStydyingStudent.value / totalTeachers.value;
// //   // console.log(totalTeach)
// //     const result = {
// //       teacherStudentRatio,
// //       averageTeachers,
// //       totalSchools: totalSchools.value,
// //       totalTeachers: totalTeachers.value,
// //       totalFemaleTeachers: totalFemaleTeachers.value,
// //       totalMaleTeachers: totalMaleTeachers.value,
// //       teacherCounts,
// //       teacherShiftWiseCounts,
// //     //   teacherZoneWiseCounts,
// //       teacherTypeOfSchoolWiseCounts,
// //       postdescWiseTeacherCounts,
// //       teacherManagmentWiseCounts,
// //     //   experianceOfTeachers,
// //     };
// //     // await redis.set('getTeacherStatsTeacherGraphical', JSON.stringify(result), 'EX', 24 * 60 * 60);
// //     return result;
// //   };

// //   const getSchoolIdByShiftWise = async () => {
// //     const pipeline = [
// //       {
// //         $group: {
// //           _id: '$shift',
// //           schoolIds: { $push: '$Schoolid' },
// //         },
// //       },
// //     ];
  
// //     const schCategorySchoolIds = await School.aggregate(pipeline);
// //     return schCategorySchoolIds;
// //   };
  
// //   const getSchoolIdByManagmentWise = async () => {
// //     const pipeline = [
// //       {
// //         $group: {
// //           _id: '$SchManagement',
// //           schoolIds: { $push: '$Schoolid' },
// //         },
// //       },
// //     ];
  
// //     const schCategorySchoolIds = await School.aggregate(pipeline);
// //     return schCategorySchoolIds;
// //   };
  
// //   const getSchoolIdByZoneNameWise = async () => {
// //     const pipeline = [
// //       {
// //         $group: {
// //           _id: '$Zone_Name',
// //           schoolIds: { $push: '$Schoolid' },
// //         },
// //       },
// //     ];
// //     const zoneNameWiseSchoolIds = await School.aggregate(pipeline);
// //     return zoneNameWiseSchoolIds;
// //   };
  
// //   const getSchoolIdByTypeOfSchoolWise = async () => {
// //     const pipeline = [
// //       {
// //         $group: {
// //           _id: '$typeOfSchool',
// //           schoolIds: { $push: '$Schoolid' },
// //         },
// //       },
// //     ];
// //     const typeOfSchoolWiseSchoolIds = await School.aggregate(pipeline);
// //     return typeOfSchoolWiseSchoolIds;
// //   };
  
// //   const getSchoolIdBySchCategoryWise = async () => {
// //     const pipeline = [
// //       {
// //         $group: {
// //           _id: '$SchCategory',
// //           schoolIds: { $push: '$Schoolid' },
// //         },
// //       },
// //     ];
  
// //     const schCategorySchoolIds = await School.aggregate(pipeline);
// //     return schCategorySchoolIds;
// //   };



  
// //   const getGuestTeacherStats = async () => {
// //     const schCategorySchoolIds = await getSchoolIdBySchCategoryWise();
// //     const teacherCounts = [];
  
// //     for (const category of schCategorySchoolIds) {
// //       const teacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: category.schoolIds.map(String) } });
// //       teacherCounts.push({
// //         SchCategory: category._id,
// //         teacherCount,
// //       });
// //     }
// //     const shiftWiseSchoolid = await getSchoolIdByShiftWise();
// //     const teacherShiftWiseCounts = [];
// //     for (const shift of shiftWiseSchoolid) {
// //       const teacherShiftWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: shift.schoolIds.map(String) } });
// //       teacherShiftWiseCounts.push({
// //         shift: shift._id,
// //         teacherShiftWiseCount,
// //       });
// //     }

// //     // const zoneNameWiseCountIds = await getSchoolIdByZoneNameWise();
// //     // const teacherZoneWiseCounts = [];
  
// //     // for (const zone of zoneNameWiseCountIds) {
// //     //   const teacherZoneWiseCount = await GuestTeacher.countDocuments({ SchoolID: { $in: zone.schoolIds.map(String) } });
// //     //   teacherZoneWiseCounts.push({
// //     //     zoneName: zone._id,
// //     //     teacherZoneWiseCount,
// //     //   });
// //     // }
  
// //     const managmentWiseCountId = await getSchoolIdByManagmentWise();
// //     const teacherManagmentWiseCounts = [];
// //     for (const managment of managmentWiseCountId) {
// //       const teacherManagmentWiseCount = await GuestTeacher.countDocuments({
// //         SchoolID: { $in: managment.schoolIds.map(String) },
// //       });
// //       teacherManagmentWiseCounts.push({
// //         shift: managment._id,
// //         teacherManagmentWiseCount,
// //       });
// //     }
  
// //     const typeOfSchoolWiseCountIds = await getSchoolIdByTypeOfSchoolWise();
// //     const teacherTypeOfSchoolWiseCounts = [];
  
// //     for (const typeOfSchool of typeOfSchoolWiseCountIds) {
// //       const teacherTypeOfSchoolWiseCount = await GuestTeacher.countDocuments({
// //         SchoolID: { $in: typeOfSchool.schoolIds.map(String) },
// //       });
// //       teacherTypeOfSchoolWiseCounts.push({
// //         typeOfSchool: typeOfSchool._id,
// //         teacherTypeOfSchoolWiseCount,
// //       });
// //     }
  
// //     const pipeline3 = [
// //       {
// //         $group: {
// //           _id: '$Post',
// //           teacherCount: { $sum: 1 },
// //         },
// //       },
// //       {
// //         $sort: { _id: 1 },
// //       },
// //     ];
// //     const totoalStudent = await Student.countDocuments({ status: 'Studying' }).exec();
// //     const postdescWiseTeacherCounts = await GuestTeacher.aggregate(pipeline3);
// //     const totalSchool = await School.countDocuments().exec();
// //     const totalGuestTeacher = await GuestTeacher.countDocuments().exec();
// //     const averageTeachers = totalGuestTeacher / totalSchool;
// //     const studentRatio = totoalStudent / totalGuestTeacher;
  
// //     const result = {
// //       totalSchool,
// //       totalGuestTeacher,
// //       teacherCounts,
// //       teacherShiftWiseCounts,
// //     //   teacherZoneWiseCounts,
// //       teacherTypeOfSchoolWiseCounts,
// //       postdescWiseTeacherCounts,
// //       teacherManagmentWiseCounts,
// //       averageTeachers,
// //       studentRatio,
// //     };
// //     return result;
// //   };
  




// const getTeacherStats = async () => {
//     const schCategorySchoolIds = await getSchoolIdBySchCategoryWise();
//     const teacherCounts = [];
//     const guestTeacherCounts = [];
//     const totalTeacherCategoryWiseCounts = [];
  
//     for (const category of schCategorySchoolIds) {
//       const teacherCount = await Teacher.countDocuments({ schoolid: { $in: category.schoolIds } });
//       const guestTeacherCount = await GuestTeacher.countDocuments({ SchoolID: { $in: category.schoolIds.map(String) } });
  
//       teacherCounts.push({
//         SchCategory: category._id,
//         teacherCount,
//       });
  
//       guestTeacherCounts.push({
//         SchCategory: category._id,
//         guestTeacherCount,
//       });

//       const totalTeacherCount = teacherCounts + guestTeacherCounts;
  
//       totalTeacherCategoryWiseCounts.push({
//         SchCategory: category._id,
//         totalTeacherCount,
//       });
//     }

    
  
//     const shiftWiseSchoolid = await getSchoolIdByShiftWise();
//     const teacherShiftWiseCounts = [];
//     const guestTeacherShiftWiseCounts = [];
//     const totalTeacherShiftWiseCounts = []; // Add this array for total count by shift
  
//     for (const shift of shiftWiseSchoolid) {
//       const teacherShiftWiseCount = await Teacher.countDocuments({ schoolid: { $in: shift.schoolIds } });
//       const guestTeacherShiftWiseCount = await GuestTeacher.countDocuments({
//         SchoolID: { $in: shift.schoolIds.map(String) },
//       });
  
//       teacherShiftWiseCounts.push({
//         shift: shift._id,
//         teacherShiftWiseCount,
//       });
  
//       guestTeacherShiftWiseCounts.push({
//         shift: shift._id,
//         guestTeacherShiftWiseCount,
//       });
  
//       // Calculate total count by adding regular and guest teacher counts
//       const totalTeacherCount = teacherShiftWiseCount + guestTeacherShiftWiseCount;
  
//       totalTeacherShiftWiseCounts.push({
//         shift: shift._id,
//         totalTeacherCount,
//       });
//     }
  
//     // Rest of the code remains the same
  
//     const result = {
//     //   teacherStudentRatio,
//     //   averageTeachers,
//     //   totalSchools: totalSchools.value,
//     //   totalTeachers: totalTeachers.value,
//     //   totalFemaleTeachers: totalFemaleTeachers.value,
//     //   totalMaleTeachers: totalMaleTeachers.value,
//     //   teacherCounts,
//     //   guestTeacherCounts,
//     totoal: {...totalTeacherCategoryWiseCounts[0].totalTeacherCount},
//       teacherShiftWiseCounts,
//       guestTeacherShiftWiseCounts,
//       totalTeacherShiftWiseCounts,
//     //   teacherTypeOfSchoolWiseCounts,
//     //   postdescWiseTeacherCounts,
//     //   teacherManagmentWiseCounts,
//     };
  
//     return result;
//   };
  
// (async () => {
//     try {
//       const teacherCounts = await getTeacherStats();
//     //   const guestTeacherCounts = await getGuestTeacherStats();
//     //   const combinedCounts = {
//     //     ...teacherCounts,
//     //     ...guestTeacherCounts,
//     //   };
//       console.log('Total Teacher Counts:', teacherCounts);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   })();

