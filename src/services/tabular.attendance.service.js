const { Attendance, School, Student } = require('../models');


const getAttendanceData = async (Z_name, School_ID, shift,attendance_DATE ) => {
const query = {attendance_DATE: new Date(attendance_DATE)};
  if (Z_name) query.Z_name = Z_name;
  if (School_ID) query.School_ID = School_ID;
  if (shift) query.shift = shift;
    const result = await Attendance.find(query,{ school_name: 1, School_ID: 1, _id: 0 , attendance_DATE:1, shift:1,district_name:1, Z_name:1, totalStudentCount:1, PresentCount:1, AbsentCount:1, totalNotMarkedAttendanceCount:1, totalLeaveCount:1});
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


const studentHealth = async(Schoolid) => {
    const student = await Student.findOne({ Schoolid });
    
}


module.exports = {
    getAttendanceData,
    getAllDistrictsAndZones,
    studentHealth,
}