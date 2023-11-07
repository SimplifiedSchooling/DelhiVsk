const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const udiseAllDashboard = mongoose.Schema(
  {
    state_name: {
      type: String,
    },
    state_code: {
      type: String,
    },
    latitiude: {
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
    number_of_schools: {
      type: String,
    },
    number_of_students: {
      type: String,
    },
    number_of_teachers: {
      type: String,
    },
    ptr: {
      type: String,
    },
    tot_school_having_toilet: {
      type: String,
    },
    tot_school_having_drinkingwater: {
      type: String,
    },
    tot_school_having_electricity: {
      type: String,
    },
    tot_school_having_library: {
      type: String,
    },
    tot_govt_n_govtaided_schools_recieved_textbook: {
      type: String,
    },
    total_enrollment_cwsn: {
      type: String,
    },
    tot_school_having_ramp: {
      type: String,
    },
    tot_school_having_toilet_percentage: {
      type: String,
    },
    school_having_drinking_percentage: {
      type: String,
    },
    school_having_library_percentage: {
      type: String,
    },
    govt__aided_schools_recieved_textbook_percentage: {
      type: String,
    },
    school_having_ramp_percentage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
udiseAllDashboard.plugin(toJSON);
udiseAllDashboard.plugin(paginate);

/**
 * @typedef UdiseallDashboard
 */
const UdiseallDashboard = mongoose.model('UdiseallDashboard', udiseAllDashboard);

module.exports = UdiseallDashboard;
