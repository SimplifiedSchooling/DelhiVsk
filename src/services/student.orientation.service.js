const axios = require('axios');
const { StudentOrientation } = require('../models');

async function fetchDataFromExternalAPI() {
  let data =[];
  try {
    // Make a request to the external API
    const response = await axios.get('https://www.edudel.nic.in/mis/EduWebService_Other/DISE_New.asmx/SN48_F_Number_of_students_received_orientation', {
      params: {
        password: 'Dise123',
        // Add other necessary parameters if required
      },
    });
    data.push(response.data);
    return data;
  } catch (error) {
    throw new Error('Error fetching data from external API');
  }
}

async function saveStudentOrientationData(data) {
  try {
    // Iterate over the fetched data and create documents in the MongoDB database if they don't exist
    for (let item of data[0].Cargo) {
      // console.log(item,"item")
      // Check if document with the same SchoolID already exists
      const existingDocument = await StudentOrientation.findOne({ SchoolID: item.SchoolID });
      if (!existingDocument) {
        // If document doesn't exist, create a new one
        await StudentOrientation.create(item);
      }
    }
  } catch (error) {
    throw new Error('Error saving data to the database');
  }
}

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryData = async (filter, options) => {
  const data = await StudentOrientation.paginate(filter, options);
  return data;
};
const getStudentOrientationData = async (filter) => {
  const data = await StudentOrientation.find(filter);
  return data;
};

module.exports = { fetchDataFromExternalAPI, saveStudentOrientationData, queryData, getStudentOrientationData};
