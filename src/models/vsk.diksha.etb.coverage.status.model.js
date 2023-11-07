const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const coverageStatus = mongoose.Schema(
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
    linked_qr_count: {
      type: String,
    },
    resource_count: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
coverageStatus.plugin(toJSON);
coverageStatus.plugin(paginate);

/**
 * @typedef Coveragestatus
 */
const Coveragestatus = mongoose.model('Coveragestatus', coverageStatus);

module.exports = Coveragestatus;
