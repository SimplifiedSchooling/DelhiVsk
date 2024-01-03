const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const staffSchema = mongoose.Schema(
  {
    empid: {
      type: String,
      index: true,
    },
    Name: {
      type: String,
    },
    postdesc: {
      type: String,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    JoiningDate: {
      type: String,
    },
    schoolid: {
      type: String,
    },
    schname: {
      type: String,
    },
    districtname: {
      type: String,
    },
    zonename: {
      type: String,
    },
    initJoiningDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
staffSchema.plugin(toJSON);
staffSchema.plugin(paginate);

staffSchema.index({ empid: 1 }, { unique: true });
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
staffSchema.statics.isS_IDTaken = async function (empid, excludeUserId) {
  const teacher = await this.findOne({ empid, _id: { $ne: excludeUserId } });
  return !!teacher;
};
/**
 * @typedef Teacher
 */
const Teacher = mongoose.model('Teacher', staffSchema);

module.exports = Teacher;
