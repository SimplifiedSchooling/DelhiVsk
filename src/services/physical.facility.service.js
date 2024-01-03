const axios = require('axios');
const logger = require('../config/logger');
const { PhysicalFacitlies } = require('../models');

/**
 * Get Attendance data from server
 * @returns {Promise<Attendance>}
 */


// const apiUrl =
//   'https://www.edudel.nic.in/mis/EduWebService_Other/DISE_New.asmx/DISE_Physical_Facilities_Part_F?password=Dise123'; // Replace with your API endpoint

// const saveUdiseData = async () => {
//   try {
//     const response = await axios.get(apiUrl);
//     const dataFromApi = response.data.Cargo;

//     for (const item of dataFromApi) {
//       if (item.Sch_Type === 'Government' || item.Sch_Type === 'Aided') {
//         const existingRecord = await PhysicalFacitlies.findOne({ SchoolID: item.SchoolID });
//         if (existingRecord) {
//         } else {
//           // Create a new record and save it to the database
//           const newRecord = new PhysicalFacitlies(item);
//           await newRecord.save();
//         }
//       }
//     }
//     logger.info('Data fetch and store process completed.');
//   } catch (error) {
//     logger.error('Error during data fetch and store process:', error);
//   }
// };

// module.exports = {
//   saveUdiseData,
// };

  const apiUrl = 'https://www.edudel.nic.in/mis/EduWebService_Other/DISE_New.asmx/DISE_Physical_Facilities_Part_F?password=Dise123'; // Replace with your API endpoint
  
  const saveUdiseData = async () => {
    try {
      const response = await axios.get(apiUrl);
      const dataFromApi = response.data.Cargo;
  
      for (const item of dataFromApi) {
        if (item.Sch_Type === 'Government' || item.Sch_Type === 'Aided') {
          const existingRecord = await PhysicalFacitlies.findOne({ SchoolID: item.SchoolID });
          if (existingRecord) {
          } else {
            // Create a new record and save it to the database
            const newRecord = new PhysicalFacitlies(item);
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

