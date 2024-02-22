const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const SportsEquipmentSchema = new mongoose.Schema({
  district: {
    type: String,
  },
  zone: {
    type: Number,
  },
  SchoolID: {
    type: Number,
    unique: true,
  },
  SchName: {
    type: String,
  },
  SchAddress: {
    type: String,
  },
  Sch_Type: {
    type: String,
    // enum: ['Government', 'Aided'], // Add other possible values if needed
  },
  LOWCLASS: {
    type: Number,
    default: 0,
  },
  HIGHCLASS: {
    type: Number,
  },
  item_id: {
    type: Number,
  },
  PlayMater_Prepri: {
    type: String,
  },
  PlayMater_Pri: {
    type: String,
  },
  PlayMater_Upperpri: {
    type: String,
  },
  PlayMater_Sec: {
    type: String,
  },
  PlayMater_HSec: {
    type: String,
  },
});

// add plugin that converts mongoose to json
SportsEquipmentSchema.plugin(toJSON);
SportsEquipmentSchema.plugin(paginate);
/**
 * @typedef SportsEquipment
 */
const SportsEquipment = mongoose.model('SportsEquipment', SportsEquipmentSchema);

module.exports = SportsEquipment;
