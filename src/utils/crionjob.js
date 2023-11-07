const cron = require('node-cron');
const logger = require('../config/logger');
const { attendanceService } = require('../services');

// Schedule the job to run every day at 9 PM
cron.schedule('0 21 * * *', async () => {
  try {
    logger.info(`Running the attendance data update job...`);
    await attendanceService.storeAttendanceDataInMongoDB();
    logger.info(`Attendance data update job completed.`);
  } catch (error) {
    logger.info('Error running the job:', error);
  }
});
