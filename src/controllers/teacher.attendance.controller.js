const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { teacherAttendanceService } = require('../services');

const getAttendanceData = catchAsync(async (req, res) => {
  const { day, month, year, shift} = req.query
  const result = await teacherAttendanceService.getAttendanceData(day, month, year, shift);
  res.status(httpStatus.CREATED).send(result);
});

const getAttendanceDataByDistrict = catchAsync(async (req, res) => {
    const { day, month, year, district, shift} = req.body
    const result = await teacherAttendanceService.getAttendanceDataByDistrict(day, month, year, district, shift);
    res.status(httpStatus.CREATED).send(result);
  });
 
  const getAttendanceDataByZone = catchAsync(async (req, res) => {
    const { day, month, year, zone, shift} = req.query
    const result = await teacherAttendanceService.getAttendanceDataByZone(day, month, year, zone, shift);
    res.status(httpStatus.CREATED).send(result);
  });
  
  const getAttendanceDataByschoolID = catchAsync(async (req, res) => {
    const { day, month, year, schoolID} = req.query
    const result = await teacherAttendanceService.getAttendanceDataByschoolID(day, month, year, schoolID);
    res.status(httpStatus.CREATED).send(result);
  }); 
  
  const treandGraph = catchAsync(async (req, res) => {
    const {startDay, endDay, month, year} = req.query
    const result = await teacherAttendanceService.treandGraph(startDay, endDay, month, year);
    res.status(httpStatus.CREATED).send(result);
  });

  const getAttendanceDashbord = catchAsync(async (req, res) => {
    const result = await teacherAttendanceService.getAttendanceDashbord();
    res.status(httpStatus.CREATED).send(result);
  });

module.exports = {
    getAttendanceData,
    getAttendanceDataByDistrict,
    getAttendanceDataByZone,
    getAttendanceDataByschoolID,
    treandGraph,
    getAttendanceDashbord,
};
