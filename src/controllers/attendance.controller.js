const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { attendanceService } = require('../services');

const getAttedanceData = catchAsync(async (req, res) => {
  const result = await attendanceService.storeAttendanceDataInMongoDB();
  res.status(httpStatus.CREATED).send(result);
});

const getAttendanceCounts = catchAsync(async (req, res) => {
  const result = await attendanceService.getAttendanceCounts(req.body.date);
  res.status(httpStatus.CREATED).send(result);
});

const getDistrictwiseAttendanceCount = catchAsync(async (req, res) => {
  const result = await attendanceService.getAttendanceCountsDistrictWise(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getZoneAttendanceCount = catchAsync(async (req, res) => {
  const { date, zoneName } = req.body;
  const result = await attendanceService.getAttendanceCountsZoneWise(date, zoneName);
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  getAttedanceData,
  getAttendanceCounts,
  getDistrictwiseAttendanceCount,
  getZoneAttendanceCount,
};
