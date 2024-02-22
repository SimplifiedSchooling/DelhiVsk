const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema(
  {
    visitor: [
      {
        name: {
          type: String,
        },
      },
    ],
    date: {
      type: Date,
    },
    imageLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Gallery
 */

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
