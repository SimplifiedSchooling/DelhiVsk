const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { zonegraph } = require('../services');

const getAllSchoolStudentTeacherDataByZoneName = catchAsync(async (req, res) => {
  const { zoneName } = req.body;
  const result = await zonegraph.getAllSchoolStudentTeacherDataByZoneName(zoneName);
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  getAllSchoolStudentTeacherDataByZoneName,
};
