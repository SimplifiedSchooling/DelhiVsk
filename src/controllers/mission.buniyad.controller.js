const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { missionBuniyadService } = require('../services');


const getMissionBuniyad = catchAsync(async (req, res) => {
    const result = await missionBuniyadService.getMissionBuniyad(req.params.schoolid);
    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'school data not found');
    }
    res.send(result);
  });

  module.exports = {
    getMissionBuniyad,
};