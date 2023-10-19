const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const schoolSchema = mongoose.Schema(
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
    Latitude: {
      type: String,
    },
    Longitude: {
      type: String,
    },
    shift: {
      type: String,
    },
    low_class: {
      type: String,
    },
    High_class: {
      type: String,
    },
    Z_ID: {
      type: Number,
    },
    Zone_Name: {
      type: String,
    },
    D_ID: {
      type: Number,
    },
    District_name: {
      type: String,
    },
    SchManagement: {
      type: String,
    },
    SchCategory: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
schoolSchema.plugin(toJSON);
schoolSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
schoolSchema.statics.isSchoolIdTaken = async function (Schoolid, excludeUserId) {
  const school = await this.findOne({ Schoolid, _id: { $ne: excludeUserId } });
  return !!school;
};
/**
 * @typedef School
 */
const School = mongoose.model('School', schoolSchema);

module.exports = School;
