const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const imageGallerySchema = mongoose.Schema(
  {
    date: {
      type: Date,
    },
    visitor: [
      {
        _id: false,
        name: {
          type: String,
        },
      },
    ],
    images: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
imageGallerySchema.plugin(toJSON);
imageGallerySchema.plugin(paginate);

const ImageGallery = mongoose.model('ImageGallery', imageGallerySchema);
module.exports = ImageGallery;
