const httpStatus = require('http-status');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const { studentService } = require('../services');

const getStudentData = catchAsync(async (req, res) => {
  const result = await studentService.storeStudentDataInMongoDB();
  res.status(httpStatus.CREATED).send(result);
});

const studentData = catchAsync(async (req, res) => {
  const result = await studentService.studentData();
  res.send(result);
});

const getStudentCountBySchoolName = catchAsync(async (req, res) => {
  const { Schoolid } = req.body;
  const result = await studentService.getStudentCountBySchoolName(Schoolid);
  res.send(result);
});

const getStudentCountBySchoolNameAndGender = catchAsync(async (req, res) => {
  const { Schoolid, Gender } = req.body;
  const result = await studentService.getStudentCountBySchoolNameAndGender(Schoolid, Gender);
  res.send(result);
});

const getStudentCountBySchoolNameAndStatus = catchAsync(async (req, res) => {
  const { Schoolid, status } = req.body;
  const result = await studentService.getStudentCountBySchoolNameAndStatus(Schoolid, status);
  res.send(result);
});

const getStudentAttendance = catchAsync(async (req, res) => {
  const { Schoolid, Date } = req.body;
  const password = "VSK@9180";
  // Validate required parameters
  if (!password || !Schoolid || !Date) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Make a request to the Attendance API
  const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Student_Attendence_School?password=${password}&School_ID=${Schoolid}&Date=${Date}`;
  const result = await axios.get(apiUrl);
  res.send(result.data);
});

module.exports = {
  getStudentData,
  studentData,
  getStudentAttendance,
  getStudentCountBySchoolName,
  getStudentCountBySchoolNameAndGender,
  getStudentCountBySchoolNameAndStatus,
};
