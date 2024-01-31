const { Attendance, School, Student } = require('../models');
const axios = require('axios');
const https = require('https')

const getAttendanceData = async (Z_name, School_ID, shift,attendance_DATE ,district_name) => {
const query = {attendance_DATE: new Date(attendance_DATE),SchManagement: 'Government' };
  if (Z_name) query.Z_name = Z_name;
  if (School_ID) query.School_ID = School_ID;
  if (shift) query.shift = shift;
  if(district_name) query.district_name = district_name;
    const result = await Attendance.find(query,{ school_name: 1, School_ID: 1, _id: 0 , attendance_DATE:1, shift:1,district_name:1, Z_name:1, totalStudentCount:1, PresentCount:1, AbsentCount:1, totalNotMarkedAttendanceCount:1, totalLeaveCount:1, Latitude:1, Longitude:1});
    return result;
};

const getAllDistrictsAndZones = async () => {
    const districts = await School.distinct('District_name');
    const districtZoneArray = [];

    for (const district of districts) {
      const zones = await School.distinct('Zone_Name', { District_name: district });
      zones.forEach((zone) => {
        districtZoneArray.push({ districtName: district, zoneName: zone });
      });
    }
    return districtZoneArray;
};

/**
 * Query for Classes
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const studentHealth = async (filter, options) => {
    const students = await Student.paginate(filter, options);
    return students;
  };


  const getpassword = () => {
    const dateValue = new Date();
    return "Mob#" + (dateValue.getFullYear() * dateValue.getDate() + dateValue.getMonth() + 1) + "37t@Zr"
}

// const todaydate = () => {
//     const date = new Date();
//     return (date.getMonth()+1)+"/"+(date.getDate())+"/"+(date.getFullYear())
// }


const getSchoolList = async (selectedDate, zone, password) => {
  return new Promise((resolve, reject) => {
    const url = new URL("https://www.edudel.nic.in/mis/eduwebservice/webappsmob.asmx/get");
    url.searchParams.set('proc', `uspGetReportMobApps_NEW_ADMIN_school_zone '${selectedDate}','Government',${zone}`);
    url.searchParams.set('password', password);

    const request = https.request(url, async (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data = data + chunk.toString();
      });

      response.on('end', async () => {
        try {
          const body = JSON.parse(data);

          if (body.Cargo instanceof Array) {
            const schoolIds = body.Cargo.map(item => Number(item.schid));
            const studyingStudentCounts = await Student.aggregate([
              { $match: { Schoolid: { $in: schoolIds }, status: 'Studying' } },
              { $group: { _id: '$Schoolid', count: { $sum: 1 } } }
            ]);
            const schools = body.Cargo.map(item => {
              const schid = Number(item.schid);
              const matchingCount = studyingStudentCounts.find(counts => counts._id === schid);
              const studyingStudentCount = matchingCount ? matchingCount.count : 0;
              return {
                School_ID: schid,
                school_name: item.schname,
                totalStudentCount: item.enroll,
                PresentCount: item.P,
                AbsentCount: item.A,
                totalLeaveCount: item.L,
                noexam: item.E,
                totalNotMarkedAttendanceCount: item.U,
                shift: item.shift,
                studyingStudentCount: studyingStudentCount
              };
            });
            
            resolve(schools);
            
          } else {
            reject(new Error("Error: " + body.Cargo));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.end();
  });
};


// const getSchoolList = async (selectedDate, zone, password) => {
//   return new Promise((resolve, reject) => {
//     const url = new URL("https://www.edudel.nic.in/mis/eduwebservice/webappsmob.asmx/get");
//     url.searchParams.set('proc', `uspGetReportMobApps_NEW_ADMIN_school_zone '${selectedDate}','Government',${zone}`);
//     url.searchParams.set('password', password);

//     const request = https.request(url, async (response) => {
//       let data = '';

//       response.on('data', (chunk) => {
//         data = data + chunk.toString();
//       });

//       response.on('end', async () => {
//         try {
//           const body = JSON.parse(data);

//           if (body.Cargo instanceof Array) {
//             const schools = await Promise.all(body.Cargo.map(async (item) => {
//               const studyingStudentCount = await Student.countDocuments({ Schoolid: item.schid, status: 'Studying' });
              
//               return {
//                 School_ID: item.schid,
//                 school_name: item.schname,
//                 totalStudentCount: item.enroll,
//                 PresentCount: item.P,
//                 AbsentCount: item.A,
//                 totalLeaveCount: item.L,
//                 noexam: item.E,
//                 totalNotMarkedAttendanceCount: item.U,
//                 shift: item.shift,
//                 studyingStudentCount: studyingStudentCount
//               };
//             }));

//             resolve(schools);
//           } else {
//             reject(new Error("Error: " + body.Cargo));
//           }
//         } catch (error) {
//           reject(error);
//         }
//       });
//     });

//     request.on('error', (error) => {
//       reject(error);
//     });

//     request.end();
//   });
// };

module.exports = {
    getAttendanceData,
    getAllDistrictsAndZones,
    studentHealth,
    getSchoolList,
    getpassword,
}