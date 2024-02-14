const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {studentMarksService } = require('../services');


const getStudentMarks = catchAsync(async (req, res) => {
    const user = await studentMarksService.getStudentMrksList(req.params.studentId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Marks not found');
    }
    res.send(user);
  });

  module.exports = {
    getStudentMarks,
};