const Joi = require('joi');

const getAttendanceData = {
  body: Joi.object().keys({
    Z_name: Joi.string(),
    School_ID: Joi.string(),
    shift: Joi.string(),
    attendance_DATE: Joi.string(),
    district_name: Joi.string(),
  }),
};

const getSchoolList = {
  body: Joi.object().keys({
    date: Joi.string(),
    zone: Joi.string(),
  }),
};

module.exports = {
  getAttendanceData,
  getSchoolList,
};
