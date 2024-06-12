const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { teacherAttendanceService } = require('../services');

const getAttendanceData = catchAsync(async (req, res) => {
  const { day, month, year} = req.query
  const result = await teacherAttendanceService.getAttendanceData(day, month, year);
  res.status(httpStatus.CREATED).send(result);
});
module.exports = {
    getAttendanceData,
};
