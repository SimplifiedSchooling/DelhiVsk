const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const studentOrientation = new mongoose.Schema({
  district: { type: String, required: true },
  zone: { type: Number, required: true },
  SchoolID: { type: Number, required: true },
  SchName: { type: String, required: true },
  SchAddress: { type: String, required: true },
  Sch_Type: { type: String, required: true },
  LOWCLASS: { type: Number, required: true },
  HIGHCLASS: { type: Number, required: true },
  item_id: { type: Number, required: true },
  cybersafety_1: { type: String, required: true },
  cybersafety_2: { type: String, required: true },
  cybersafety_3: { type: String, required: true },
  cybersafety_4: { type: String, required: true },
  cybersafety_5: { type: String, required: true },
  cybersafety_6: { type: String, required: true },
  cybersafety_7: { type: String, required: true },
  cybersafety_8: { type: String, required: true },
  cybersafety_9: { type: String, required: true },
  cybersafety_10: { type: String, required: true },
  cybersafety_11: { type: String, required: true },
  cybersafety_12: { type: String, required: true },
});

// add plugin that converts mongoose to json
studentOrientation.plugin(toJSON);
studentOrientation.plugin(paginate);

const StudentOrientation = mongoose.model('StudentOrientation', studentOrientation);

module.exports = StudentOrientation;
