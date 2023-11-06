const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const percentageEnrollmentCertification = mongoose.Schema(
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
    program: {
      type: String,
    },
    total_enrollments: {
      type: String,
    },
    total_completions: {
      type: String,
    },
    total_certificates_issued: {
      type: String,
    },
    total_courses: {
      type: String,
    },
    doe: {
      type: String,
    },
    local_body: {
      type: String,
    },
    target_achieved_enrolment: {
      type: String,
    },
    target_achieved_certificates: {
      type: String,
    },
    target_remaining_enrolment: {
      type: String,
    },
    target_remaining_certificates: {
      type: String,
    },
    target_expected_enrolment: {
      type: String,
    },
    target_expected_certification: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
percentageEnrollmentCertification.plugin(toJSON);
percentageEnrollmentCertification.plugin(paginate);

/**
 * @typedef Percentageenrollmentcertification
 */
const Percentageenrollmentcertification = mongoose.model(
  'Percentageenrollmentcertification',
  percentageEnrollmentCertification
);

module.exports = Percentageenrollmentcertification;
