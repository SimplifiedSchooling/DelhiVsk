const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const studentSchema = mongoose.Schema(
  {
    Schoolid: {
      type: Number,
      required: true,
    },
    School_Name: {
      type: String,
      required: true,
    },
    medium: {
      type: String,
      required: true,
    },
    shift: {
      type: String,
    },
    Zone_Name: {
      type: String,
    },
    District_name: {
      type: String,
    },
    totalStudent: {
      type: Number,
    },
    maleStudents: {
      type: Number,
    },
    femaleStudents: {
      type: Number,
    },
    otherStudents: {
      type: Number,
    },
    session: {
      type: String,
    },
    classes: [
      {
        class: {
          type: String,
        },
        male: {
          type: Number,
        },
        feMale: {
          type: Number,
        },
        other: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
studentSchema.plugin(toJSON);
studentSchema.plugin(paginate);

studentSchema.index({ Schoolid: 1 }, { unique: true });
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
 * @typedef StudentCounts
 */
const StudentCounts = mongoose.model('Student_counts', studentSchema);

module.exports = StudentCounts;
