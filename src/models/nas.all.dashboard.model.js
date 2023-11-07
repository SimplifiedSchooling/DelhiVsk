const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const allDashboard = mongoose.Schema(
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
    number_of_teachers: {
      type: String,
    },
    student_surveyed: {
      type: String,
    },
    learning_outcome_code: {
      type: String,
    },
    performance: {
      type: String,
    },
    subject: {
      type: String,
    },
    grade: {
      type: String,
    },
    learning_outcome: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
allDashboard.plugin(toJSON);
allDashboard.plugin(paginate);

/**
 * @typedef AllDashboard
 */
const AllDashboard = mongoose.model('AllDashboard', allDashboard);

module.exports = AllDashboard;
