const Joi = require('joi');

const searchGuestTeachers = {
  body: Joi.object().keys({
    searchQuery: Joi.string().required(),
  }),
};

module.exports = {
    searchGuestTeachers,
};
