const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const courseMedium = mongoose.Schema(
  {
    state_name: {
      type: String,
    },
    program_name: {
      type: String,
    },
    state_code: {
      type: String,
    },
    total_medium: {
      type: String,
    },
    total_courses: {
      type: String,
    },
    latitiude: {
      type: String,
    },
    longitude: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
courseMedium.plugin(toJSON);
courseMedium.plugin(paginate);

/**
 * @typedef Coursemedium
 */
const Coursemedium = mongoose.model('Coursemedium', courseMedium);

module.exports = Coursemedium;
