const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const studentSchema = mongoose.Schema(
  {
    District: {
      type: String,
    },
    z_name: {
      type: String,
    },
    S_ID: {
      type: String,
      require: true,
      unique: true,
    },
    Name: {
      type: String,
    },
    Dob: {
      type: String,
    },
    Father_Name: {
      type: String,
    },
    Gender: {
      type: String,
    },
    CLASS: {
      type: String,
    },
    status: {
      type: String,
    },
    stream: {
      type: String,
    },
    section: {
      type: String,
    },
    Schoolid: {
      type: Number,
    },
    SCHOOL_NAME: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
studentSchema.plugin(toJSON);
studentSchema.plugin(paginate);

// studentSchema.index({ S_ID: 1 }, { unique: true });
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
studentSchema.statics.isS_IDTaken = async function (S_ID, excludeUserId) {
  const student = await this.findOne({ S_ID, _id: { $ne: excludeUserId } });
  return !!student;
};
/**
 * @typedef Student
 */
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
