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
    Student_ID: {
      type: String,
    },
    Student_Name: {
      type: String,
    },
    Gender: {
      type: String,
    },
    CLASS: {
      type: String,
    },
    section: {
      type: String,
    },
    Date_Of_Birth: {
      type: String,
    },
    attendance: {
      type: String,
    },
    attendance_DATE: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
attendanceSchema.plugin(toJSON);
attendanceSchema.plugin(paginate);

attendanceSchema.index({ date: 1 }, { unique: true });
attendanceSchema.index({ s_Id: 1 }, { unique: true });

/**
 * @typedef Attendance
 */
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
