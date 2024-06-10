const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createGallery = {
  body: Joi.object().keys({
    date: Joi.date(),
    visitor: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
      })
    ),
    images: Joi.array().items(Joi.string().required()).required(),
  }),
};

const getgalleries = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getGallery = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateGallery = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        date: Joi.date(),
        visitor: Joi.array().items(
          Joi.object({
            name: Joi.string(),
          })
        ),
        images: Joi.array().items(Joi.string()),
    })
    .min(1),
};

const deleteGallery = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
    createGallery,
  getgalleries,
  getGallery,
  updateGallery,
  deleteGallery,
};
