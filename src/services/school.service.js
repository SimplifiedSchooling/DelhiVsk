const axios = require('axios');
const { School } = require('../models');

async function fetchStudentDataForSchool() {
  const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/School_Registry?password=VSK@9180`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for school `, error);
    return null;
  }
}

async function storeSchoolDataInMongoDB() {
  const studentData = await fetchStudentDataForSchool();

  if (studentData && studentData.Cargo) {
    await processStudentData(studentData.Cargo);
  }
}

async function processStudentData(studentData) {
  for (const student of studentData) {
    let record = new School(student);
    record = await record.save();
  }
}

const schoolData = async () => {
  const data = await School.find();
  // const book = await Student.paginate(filter, options);
  return data;
};

const bulkUpload = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  console.log(modifiedSchoolArray);
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    return { error: true, message: 'Missing array' };
  }

  const records = await Promise.all(
    modifiedSchoolArray.map(async (school) => {
      const record = new School(school);
      return await record.save();
    })
  );

  return records;
};

// // Define your API endpoints and routes here
// const attendanceData = () =>  {
//   const currentDate = new Date();
//   // Fetch data from the student attendance API using Axios
//   axios
//     .get(`https://www.edudel.nic.in//mis/EduWebService_Other/vidyasamikshakendra.asmx/Student_Attendence_School?password=VSK@9180&School_ID=1001216&Date=20/10/2023`, {
//       // Add any query parameters or headers if needed
//     })
//     .then((response) => {
//       // Process the data from the student attendance API
//       const studentData = response.data;

//       // Get the date of the day

//       // Create your API response
//       const apiResponse = {
//         studentData,
//         currentDate,
//       };

//       // Send the response
//       res.json(apiResponse);
//     })
//     .catch((error) => {
//       // Handle errors
//       console.error('Error fetching student data:', error);
//       res.status(500).json({ error: 'Failed to fetch student data' });
//     });
// };

module.exports = {
  storeSchoolDataInMongoDB,
  schoolData,
  bulkUpload,
};
