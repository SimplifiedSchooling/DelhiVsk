const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const TeacherAttendaceSchema = mongoose.Schema(
  {
    month: {
      type: String,
    },
    day: {
      type: String,
    },
    year: {
      type: String,
    },
    district_name: {
      type: String,
    },
    Latitude: {
      type: String,
    },
    Longitude: {
      type: String,
    },
    status: {
      type: String,
    },
    Z_name: {
      type: String,
    },
    schoolID: {
      type: String,
    },
    school_name: {
      type: String,
    },
    shift: {
      type: String,
    },
    SchManagement: {
      type: String,
    },
    Present: {
      type: Number,
    },
    TotAbsent: {
      type: Number,
    },
    HalfCL: {
      type: Number,
    },
    CL: {
      type: Number,
    },
    EL: {
      type: Number,
    },
    OtherLeave: {
      type: Number,
    },
    OD: {
      type: Number,
    },
    Suspended: {
      type: Number,
    },
    vacation: {
      type: Number,
    },
    TotalEmployees: {
      type: Number,
    },
    TotalEmployeesMarkedAtt: {
      type: String,
    },
    totalSchool: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
TeacherAttendaceSchema.plugin(toJSON);
TeacherAttendaceSchema.plugin(paginate);
/**
 * @typedef TeacherAttendance
 */
const TeacherAttendance = mongoose.model('TeacherAttendance', TeacherAttendaceSchema);

module.exports = TeacherAttendance;
