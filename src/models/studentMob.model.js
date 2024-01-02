const mongoose = require('mongoose');
// const { toJSON, paginate } = require('./plugins');

const studentMOb = mongoose.Schema(
  {
    FirstName: {
      type: String,
    },
    MiddleName: {
      type: String,
    },
    LastName: {
      type: String,
    },
    ContactNo: {
      type: String,
    },
    Email: {
      type: String,
    },
    Gender: {
      type: String,
    },
    class: {
      type: String,
    },
    FOffPhone: {
      type: String,
    },
    MOfficePhone: {
      type: String,
    },
    ContactNo: {
      type: String,
    },
    ChilDMobNO: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const StudentMOb = mongoose.model('studentMOb', studentMOb);

module.exports = StudentMOb;
