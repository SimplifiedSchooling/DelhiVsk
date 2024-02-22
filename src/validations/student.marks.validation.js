const Joi = require('joi');

const getStudentMarks = {
  params: Joi.object().keys({
    studentId: Joi.string().required(),
  }),
};

const getMissionBuniyad = {
  params: Joi.object().keys({
    schoolid: Joi.string().required(),
  }),
};

module.exports = {
  getStudentMarks,
  getMissionBuniyad,
};
