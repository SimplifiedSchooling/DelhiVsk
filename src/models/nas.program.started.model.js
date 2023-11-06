const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const nasProgramStarted = mongoose.Schema(
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
nasProgramStarted.plugin(toJSON);
nasProgramStarted.plugin(paginate);

/**
 * @typedef Nasprogramstarted
 */
const Nasprogramstarted = mongoose.model('Nasprogramstarted', nasProgramStarted);

module.exports = Nasprogramstarted;
