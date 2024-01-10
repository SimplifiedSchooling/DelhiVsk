const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tabularAttendanceService } = require('../services');

const getAttendanceData = catchAsync(async (req, res) => {
  const {Z_name, School_ID, shift,attendance_DATE} = req.body;
  if(!attendance_DATE){
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'Missing parameter date' });
  }
const result = await tabularAttendanceService.getAttendanceData(Z_name, School_ID, shift,attendance_DATE);
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
    getAttendanceData,
}