const axios = require('axios');
const logger = require('../config/logger');
const { Udisephysicalfacitlies } = require('../models');

/**
 * Get Attendance data from server
 * @returns {Promise<Attendance>}
 */

async function fetchUdisePhysicalFacilitiesData() {
  try {
    const apiUrl = `https://www.edudel.nic.in/mis/EduWebService_Other/DISE_New.asmx/DISE_Physical_Facilities_Part_F?password=Dise123`;

    const response = await axios.get(apiUrl);

    if (Array.isArray(response.data.Cargo)) {
      return response.data.Cargo;
    }
    return [response.data.Cargo];
  } catch (error) {
    return null;
  }
}

const saveUdiseData = async (req, res) => {
  try {
    const udiseData = await fetchUdisePhysicalFacilitiesData();
    const savedData = await Udisephysicalfacitlies.create(udiseData);
    console.log(savedData);
    res.status(201).json(savedData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  saveUdiseData,
};
