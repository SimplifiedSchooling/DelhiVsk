const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const suppMatSchema = new mongoose.Schema({
  district: { type: String, required: true },
  zone: { type: Number, required: true },
  SchoolID: { type: Number, required: true },
  SchName: { type: String, required: true },
  SchAddress: { type: String, required: true },
  Sch_Type: { type: String, required: true },
  LOWCLASS: { type: Number, required: true },
  HIGHCLASS: { type: Number, required: true },
  item_id: { type: Number, required: true },
  SuppMat_Prepri: { type: String, default: '' },
  SuppMat_Pri: { type: String, default: '' },
  SuppMat_Upperpri: { type: String, default: '' },
  SuppMat_Sec: { type: String, default: '' },
  SuppMat_HSec: { type: String, default: '' },
});

// add plugin that converts mongoose to json
suppMatSchema.plugin(toJSON);
suppMatSchema.plugin(paginate);
/**
 * @typedef SupplyMaterial
 */

const SupplyMaterial = mongoose.model('SupplyMaterial', suppMatSchema);

module.exports = SupplyMaterial;
