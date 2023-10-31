const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { attendanceService } = require('../services');

const getAttedanceData = catchAsync(async (req, res) => {
  const result = await attendanceService.storeAttendanceDataInMongoDB();
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  getAttedanceData,
};
