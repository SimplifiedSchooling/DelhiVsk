const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { attendanceService } = require('../services');

const getAttedanceData = catchAsync(async (req, res) => {
  const result = await attendanceService.storeAttendanceDataInMongoDB();
  res.status(httpStatus.CREATED).send(result);
});

const getAttendanceCounts = catchAsync(async (req, res) => {
  const result = await attendanceService.getAttendanceCounts(req.body.startDate, req.body.endDate,);
  res.status(httpStatus.CREATED).send(result);
});

const getDistrictwiseAttendanceCount = catchAsync(async (req, res) => {
  const result = await attendanceService.getAttendanceCountsDistrictWise(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getZoneAttendanceCount = catchAsync(async (req, res) => {
  const { startDate, endDate, zoneName } = req.body;
  const result = await attendanceService.getAttendanceCountsZoneWise(startDate, endDate, zoneName);
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  getAttedanceData,
  getAttendanceCounts,
  getDistrictwiseAttendanceCount,
  getZoneAttendanceCount,
};
