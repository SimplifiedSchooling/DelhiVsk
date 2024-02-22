const axios = require('axios');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getStudentMrksList = async (studentId) => {
  const apiUrl = 'https://www.edudel.nic.in//mis/EduWebService_Other/vidyasamikshakendra.asmx/Student_MarksandResult_API';
  //   const studentId = '20190571357';
  const password = 'VSK@9180';

  try {
    const response = await axios.get(apiUrl, {
      params: {
        studentid: studentId,
        password,
      },
    });

    // Assuming the response data is already in JSON format
    const responseData = response.data.Cargo;

    return responseData;
  } catch (error) {
    throw new ApiError('Error fetching data:', error);
    throw error;
  }
};

module.exports = {
  getStudentMrksList,
};
