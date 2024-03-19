const Joi = require('joi');

const searchTeachers = {
  body: Joi.object().keys({
    searchQuery: Joi.string().required(),
  }),
};

const getTeachersDistrictWise = {
    body: Joi.object().keys({
        DistrictName: Joi.string().required(),
    }),
  };
const getTotalTeachersDistrictWise = {
    body: Joi.object().keys({
        districtName: Joi.string().required(),
    }),
  };
  const getTotalTeachersZoneWise = {
    body: Joi.object().keys({
        zoneName: Joi.string().required(),
    }),
  };
  const getTotalTeachersSchoolWise = {
    body: Joi.object().keys({
        schoolId: Joi.string().required(),
    }),
  };
  
  const getTeachersSchoolWise = {
    body: Joi.object().keys({
        schname: Joi.string().required(),
    }),
  };

  const getTeachersPostdescWise = {
    body: Joi.object().keys({
        postdesc: Joi.string().required(),
        schname: Joi.string().required(),
    }),
  };
  const getTeachersSchoolNameWise = {
    body: Joi.object().keys({
        schname: Joi.string().required(),
    }),
  };
  
module.exports = {
    searchTeachers,
    getTotalTeachersDistrictWise,
    getTotalTeachersZoneWise,
    getTotalTeachersSchoolWise,

    getTeachersDistrictWise,
    getTeachersSchoolWise,
    getTeachersPostdescWise,
    getTeachersSchoolNameWise,
};
