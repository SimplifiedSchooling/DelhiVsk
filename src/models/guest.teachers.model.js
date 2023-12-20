const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const guestTeacherSchema = mongoose.Schema(
  {
    ApplicationId: {
      type: String,
      index: true,
    },
    Name: {
      type: String,
    },
    Post: {
      type: String,
    },
    districtid: {
      type: String,
    },
    MobileNo: {
      type: Number,
    },
    JoiningDate: {
      type: String,
    },
    SchoolID: {
      type: String,
    },
    SchoolName: {
      type: String,
    },
    Districtname: {
      type: String,
    },
    Zonename: {
      type: String,
    },
    zoneid: {
        type: String,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
guestTeacherSchema.plugin(toJSON);
guestTeacherSchema.plugin(paginate);

guestTeacherSchema.index({ ApplicationId: 1 }, { unique: true });

/**
 * @typedef GuestTeacher
 */
const GuestTeacher = mongoose.model('GuestTeacher', guestTeacherSchema);

module.exports = GuestTeacher;
