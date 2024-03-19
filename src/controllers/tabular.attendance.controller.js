const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { tabularAttendanceService } = require('../services');

const getAttendanceData = catchAsync(async (req, res) => {
  const { Z_name, School_ID, shift, attendance_DATE, district_name } = req.body;
  if (!attendance_DATE) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'Missing parameter date' });
  }
  const result = await tabularAttendanceService.getAttendanceData(Z_name, School_ID, shift, attendance_DATE, district_name);
  res.status(httpStatus.CREATED).send(result);
});

const getAllDistrictsAndZones = catchAsync(async (req, res) => {
  const result = await tabularAttendanceService.getAllDistrictsAndZones();
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json('Data not found');
  }
  res.status(httpStatus.CREATED).send(result);
});

const getStudentHealth = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['Schoolid, Name, S_ID']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = 'CLASS';
  const allClasses = await tabularAttendanceService.studentHealth(filter, options);
  res.send(allClasses);
});

const getSchoolList = catchAsync(async (req, res) => {
  const { date, zone } = req.body;
  const password = tabularAttendanceService.getpassword();
  const result = await tabularAttendanceService.getSchoolList(date, zone, password);
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json('Data not found');
  }
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  getAttendanceData,
  getAllDistrictsAndZones,
  getStudentHealth,
  getSchoolList,
};
