const Joi = require('joi');

const getGenderRangeWiseCount = {
  body: Joi.object().keys({
    schoolId: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
  }),
};
const getAttendancePercentageGenderAndRangeWise = {
  body: Joi.object().keys({
    districtName: Joi.string(),
    schoolId: Joi.string(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    zoneName: Joi.string(),
  }),
};
const getTopPerformingDistricts = {
  body: Joi.object().keys({
    date: Joi.string().required(),
  }),
};
const getBottomPerformingDistricts = {
  body: Joi.object().keys({
    date: Joi.string().required(),
  }),
};

const getTopPerformingZonesByDistrict = {
  body: Joi.object().keys({
    districtName: Joi.string().required(),
    date: Joi.string().required(),
  }),
};
const getBottomPerformingZonesByDistrict = {
  body: Joi.object().keys({
    districtName: Joi.string().required(),
    date: Joi.string().required(),
  }),
};
const getTopPerformingSchoolsByZoneName = {
  body: Joi.object().keys({
    zoneName: Joi.string().required(),
    date: Joi.string().required(),
  }),
};
const getBottomPerformingSchoolsByZoneName = {
  body: Joi.object().keys({
    zoneName: Joi.string().required(),
    date: Joi.string().required(),
  }),
};
module.exports = {
  getGenderRangeWiseCount,
  getAttendancePercentageGenderAndRangeWise,
  getTopPerformingDistricts,
  getBottomPerformingDistricts,
  getTopPerformingZonesByDistrict,
  getTopPerformingSchoolsByZoneName,
  getBottomPerformingZonesByDistrict,
  getBottomPerformingSchoolsByZoneName,
};
