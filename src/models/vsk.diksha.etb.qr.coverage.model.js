const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const coverageQr = mongoose.Schema(
  {
    textbook_id: {
      type: String,
    },
    medium: {
      type: String,
    },
    grade: {
      type: String,
    },
    subject: {
      type: String,
    },
    textbook_name: {
      type: String,
    },
    day_of_created_on: {
      type: String,
    },
    qr_coverage: {
      type: Number,
    },
    qr_codes_linked_to_content: {
      type: String,
    },
    total_qr_codes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
coverageQr.plugin(toJSON);
coverageQr.plugin(paginate);

/**
 * @typedef Coverageqr
 */
const Coverageqr = mongoose.model('Coverageqr', coverageQr);

module.exports = Coverageqr;
