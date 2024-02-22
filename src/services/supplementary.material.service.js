const axios = require('axios');
const logger = require('../config/logger');
const { SupplyMaterial } = require('../models');

async function fetchDataFromExternalAPI() {
  const data = [];
  try {
    // Make a request to the external API
    const response = await axios.get(
      'https://www.edudel.nic.in/mis/EduWebService_Other/DISE_New.asmx/SN47_J_Whether_play_material_games_and_sports_equipment',
      {
        params: {
          password: 'Dise123',
          // Add other necessary parameters if required
        },
      }
    );
    data.push(response.data);
    return data[0].Cargo;
  } catch (error) {
    throw new Error('Error fetching data from external API');
  }
}
async function saveFreeUniform(data) {
  try {
    // Ensure that the unique index on SchoolID is created before attempting to save data
    await SupplyMaterial.collection.createIndex({ SchoolID: 1 }, { unique: true });

    // Iterate over the fetched data and create documents in the MongoDB database
    for (const item of data) {
      try {
        // Attempt to insert the document
        await SupplyMaterial.create(item);
      } catch (insertError) {
        // Handle the duplicate key error if SchoolID is not unique
        if (insertError.code === 11000 && insertError.keyPattern && insertError.keyPattern.SchoolID === 1) {
          console.log(`Document with SchoolID ${item.SchoolID} already exists.`);
          // You can choose to log or handle the duplicate in a way that fits your application
        } else {
          console.error('Error inserting document:', insertError);
          throw new Error('Error saving data to the database');
        }
      }
    }
  } catch (error) {
    console.error('Error creating index:', error);
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
  const data = await SupplyMaterial.paginate(filter, options);
  return data;
};
const getStudentOrientationData = async (filter) => {
  const data = await SupplyMaterial.find(filter);
  return data;
};

module.exports = {
  queryData,
  getStudentOrientationData,
  fetchDataFromExternalAPI,
  saveFreeUniform,
};
