const Joi = require('joi');

const getAllStudentByZoneName = {
  body: Joi.object().keys({
    zoneName: Joi.string().required(),
  }),
};
const getAllStudentByDistrictName = {
  body: Joi.object().keys({
    districtName: Joi.string().required(),
  }),
};
module.exports = {
  getAllStudentByZoneName,
  getAllStudentByDistrictName,
};
