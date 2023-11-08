const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const consumptionByDistrict = mongoose.Schema(
  {
    state_name: {
      type: String,
    },
    state_code: {
      type: String,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    district_name: {
      type: String,
    },
    district_code: {
      type: String,
    },
    program: {
      type: String,
    },
    total_enrollments: {
      type: String,
    },
    total_completion: {
      type: String,
    },
    total_certifications: {
      type: String,
    },
    certification: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
consumptionByDistrict.plugin(toJSON);
consumptionByDistrict.plugin(paginate);

/**
 * @typedef Consumptionbydistrict
 */
const Consumptionbydistrict = mongoose.model('Consumptionbydistrict', consumptionByDistrict);

module.exports = Consumptionbydistrict;
