const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const udiseProgramStarted = mongoose.Schema(
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
udiseProgramStarted.plugin(toJSON);
udiseProgramStarted.plugin(paginate);

/**
 * @typedef Udiseprogramstarted
 */
const Udiseprogramstarted = mongoose.model('Udiseprogramstarted', udiseProgramStarted);

module.exports = Udiseprogramstarted;
