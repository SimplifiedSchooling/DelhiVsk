const axios = require('axios');
// const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getMissionBuniyad = async (schoolid) => {
  const apiUrl = 'https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Mission_Buniyad_API';
  //   const studentId = '20190571357';
  const password = 'VSK@9180';
  try {
    const response = await axios.get(apiUrl, {
      params: {
        schoolid,
        password,
      },
    });

    // Assuming the response data is already in JSON format
    const responseData = response.data.Cargo;

    return responseData;
  } catch (error) {
    throw new ApiError('Error fetching data:', error);
  }
};

module.exports = {
  getMissionBuniyad,
};
