const Joi = require('joi');

const getAllStudentSchoolTeacherDataByZoneName = {
  body: Joi.object().keys({
    zoneName: Joi.string().required(),
  }),
};

module.exports = {
  getAllStudentSchoolTeacherDataByZoneName,
};
