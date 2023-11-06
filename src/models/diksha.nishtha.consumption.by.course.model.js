const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const consumptionByCourse = mongoose.Schema(
  {
    state_name: {
      type: String,
    },
    state_code: {
      type: String,
    },
    published_by: {
      type: String,
    },
    latitiude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    user_state: {
      type: String,
    },
    course_name: {
      type: String,
    },
    program: {
      type: String,
    },
    enrollments: {
      type: String,
    },
    completion: {
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
consumptionByCourse.plugin(toJSON);
consumptionByCourse.plugin(paginate);

/**
 * @typedef Consumptionbycourse
 */
const Consumptionbycourse = mongoose.model('Consumptionbycourse', consumptionByCourse);

module.exports = Consumptionbycourse;
