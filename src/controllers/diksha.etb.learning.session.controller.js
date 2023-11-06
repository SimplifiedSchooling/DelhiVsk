const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { learningSessionService } = require('../services');

const getAllLearningSessions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['state_name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await learningSessionService.getAllLearningSessions(filter, options);
  res.send(result);
});

const getAllPlaysPerCapita = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['state_name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await learningSessionService.getAllPlaysPerCapita(filter, options);
  res.send(result);
});

const getAllConsumptionByCourse = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['state_name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await learningSessionService.getAllConsumptionByCourse(filter, options);
  res.send(result);
});

module.exports = {
  getAllLearningSessions,
  getAllPlaysPerCapita,
  getAllConsumptionByCourse,
};
