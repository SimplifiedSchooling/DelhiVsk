const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const programStarted = mongoose.Schema(
  {
    state_name: {
      type: String,
    },
    state_code: {
      type: String,
    },
    started: {
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
programStarted.plugin(toJSON);
programStarted.plugin(paginate);

/**
 * @typedef Programstarted
 */
const Programstarted = mongoose.model('Programstarted', programStarted);

module.exports = Programstarted;
