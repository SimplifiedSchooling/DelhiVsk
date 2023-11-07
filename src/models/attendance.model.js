const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const attendanceSchema = mongoose.Schema(
  {
    district_name: {
      type: String,
    },
    Z_name: {
      type: String,
    },
    School_ID: {
      type: String,
    },
    school_name: {
      type: String,
    },
    shift: {
      type: String,
    },
    totalStudentCount: {
      type: Number,
    },
    PreasentCount: {
      type: Number,
    },
    AbsentCount: {
      type: Number,
    },
    attendance_DATE: {
      type: String,
    },
    malePresentCount: {
      type: Number,
    },
    feMalePresentCount: {
      type: Number,
    },
    otherPresentCount: {
      type: Number,
    },
    maleAbsentCount: {
      type: Number,
    },
    feMaleAbsentCount: {
      type: Number,
    },
    othersAbsentCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
attendanceSchema.plugin(toJSON);
attendanceSchema.plugin(paginate);
attendanceSchema.index({ School_ID: 1 }, { unique: true });
/**
 * @typedef Attendance
 */
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
