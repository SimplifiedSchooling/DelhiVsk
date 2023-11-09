const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const learningSessionSchema = mongoose.Schema(
  {
    state_name: {
      type: String,
    },
    state_code: {
      type: String,
    },
    board: {
      type: String,
    },
    subject: {
      type: String,
    },
    content_name: {
      type: String,
    },
    mime_type: {
      type: String,
    },
    total_no_of_plays_App_and_Portal: {
      type: Number,
    },
    total_play_time_App_and_Portal: {
      type: Number,
    },
    grade: {
      type: String,
    },
    medium: {
      type: String,
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
learningSessionSchema.plugin(toJSON);
learningSessionSchema.plugin(paginate);

/**
 * @typedef Learningsession
 */
const Learningsession = mongoose.model('Learningsession', learningSessionSchema);

module.exports = Learningsession;
