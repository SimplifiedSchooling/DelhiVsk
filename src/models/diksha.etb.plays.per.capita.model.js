const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const playsPerCapita = mongoose.Schema(
  {
    state_name: {
      type: String,
    },
    state_code: {
      type: String,
    },
    plays_per_capita: {
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
playsPerCapita.plugin(toJSON);
playsPerCapita.plugin(paginate);

/**
 * @typedef Playspercapita
 */
const Playspercapita = mongoose.model('Playspercapita', playsPerCapita);

module.exports = Playspercapita;
