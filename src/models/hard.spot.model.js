const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const schoolHardSpotSchema = new mongoose.Schema({
  district: { type: String, required: true },
  zone: { type: Number, required: true },
  SchoolID: { type: Number, required: true },
  SchName: { type: String, required: true },
  SchAddress: { type: String, required: true },
  Sch_Type: { type: String, required: true },
  LOWCLASS: { type: Number, required: true },
  HIGHCLASS: { type: Number, required: true },
  item_id: { type: Number, required: true },
  HardSpot_1: { type: String, required: true },
  HardSpot_2: { type: String, required: true },
  HardSpot_3: { type: String, required: true },
  HardSpot_4: { type: String, required: true },
  HardSpot_5: { type: String, required: true },
  HardSpot_6: { type: String, required: true },
  HardSpot_7: { type: String, required: true },
  HardSpot_8: { type: String, required: true },
  HardSpot_9: { type: String, required: true },
  HardSpot_10: { type: String, required: true },
  HardSpot_11: { type: String, required: true },
  HardSpot_12: { type: String, required: true },
});

// add plugin that converts mongoose to json
schoolHardSpotSchema.plugin(toJSON);
schoolHardSpotSchema.plugin(paginate);

const SchoolHardSpotModel = mongoose.model('SchoolHardSpot', schoolHardSpotSchema);

module.exports = SchoolHardSpotModel;
