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
    TotalGovtSchools: {
      type: Number,
    },
    TotalEmployees: {
      type: Number,
    },
    AllPresent: {
      type: Number,
    },
    AllAbsent: {
      type: Number,
    },
    AllHCL: {
      type: Number,
    },
    AllCL: {
      type: Number,
    },
    AllEL: {
      type: Number,
    },
    AllOL: {
      type: Number,
    },
    AllOD: {
      type: Number,
    },
    AllSuspended: {
      type: Number,
    },
    AllVacation: {
      type: Number,
    },
    TotalEmployeesMarkedAtt: {
      type: Number,
    },
    SchoolsMarkedAttn: {
      type: Number,
    },
    SchoolsNotMarkedAttn: {
      type: Number,
    },
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
