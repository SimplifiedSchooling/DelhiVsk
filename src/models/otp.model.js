const mongoose = require('mongoose');

const otpSchema = mongoose.Schema(
  {
    otp: {
      type: Number,
      require: true,
    },
    mobNumber: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 120,
    },
  }
  // {
  //   timestamps: true,
  // }
);

/**
 * @typedef Otp
 */

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
