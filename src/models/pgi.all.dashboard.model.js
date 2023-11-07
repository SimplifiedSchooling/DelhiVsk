const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const pgiAllDashboard = mongoose.Schema(
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
    effective_classroom_transaction: {
      type: String,
    },
    student_surveyed: {
      type: String,
    },
    infrastructure_facilities_studentitlements: {
      type: String,
    },
    school_safety_and_child_protection: {
      type: String,
    },
    digital_learning: {
      type: String,
    },
    governance_processes: {
      type: String,
    },
    outcome: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
pgiAllDashboard.plugin(toJSON);
pgiAllDashboard.plugin(paginate);

/**
 * @typedef Pgialldashboard
 */
const Pgialldashboard = mongoose.model('Pgialldashboard', pgiAllDashboard);

module.exports = Pgialldashboard;
