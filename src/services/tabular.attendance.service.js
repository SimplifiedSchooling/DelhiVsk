const { Attendance, School, Student } = require('../models');


const getAttendanceData = async (Z_name, School_ID, shift,attendance_DATE ,district_name) => {
const query = {attendance_DATE: new Date(attendance_DATE)};
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


module.exports = {
    getAttendanceData,
    getAllDistrictsAndZones,
    studentHealth,
}