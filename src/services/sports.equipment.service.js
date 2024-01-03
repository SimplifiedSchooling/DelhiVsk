const axios = require('axios');
const logger = require('../config/logger');
const { SportsEquipments } = require('../models');

/**
 * Get Attendance data from server
 * @returns {Promise<SportsEquipments>}
 */

const apiUrl =
  'https://www.edudel.nic.in/mis/EduWebService_Other/DISE_New.asmx/SN47_J_Whether_play_material_games_and_sports_equipment?password=Dise123';

const saveUdiseData = async () => {
  try {
    const response = await axios.get(apiUrl);
    const dataFromApi = response.data.Cargo;
    for (const item of dataFromApi) {
      if (item.Sch_Type === 'Government' || item.Sch_Type === 'Aided') {
        const existingRecord = await SportsEquipments.findOne({ SchoolID: item.SchoolID });
        if (existingRecord) {
        } else {
          // Create a new record and save it to the database
          const newRecord = new SportsEquipments(item);
          await newRecord.save();
        }
      }
    }
    logger.info('Data fetch and store process completed.');
  } catch (error) {
    logger.error('Error during data fetch and store process:', error);
  }
};

module.exports = {
  saveUdiseData,
};