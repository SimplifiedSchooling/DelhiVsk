const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const freeUniformSchema = new mongoose.Schema({
  district: { type: String, required: true },
  zone: { type: Number, required: true },
  SchoolID: { type: Number, required: true },
  SchName: { type: String, required: true },
  SchAddress: { type: String, required: true },
  Sch_Type: { type: String, required: true },
  LOWCLASS: { type: Number, required: true },
  HIGHCLASS: { type: Number, required: true },
  item_id: { type: Number, required: true },
  uniform_Prepri: { type: String, default: '' },
  uniform_Pri: { type: String, default: '' },
  uniform_Upperpri: { type: String, default: '' },
  uniform_Sec: { type: String, default: '' },
  uniform_HSec: { type: String, default: '' },
});

// add plugin that converts mongoose to json
freeUniformSchema.plugin(toJSON);
freeUniformSchema.plugin(paginate);

const FreeUniform = mongoose.model('FreeUniform', freeUniformSchema);

module.exports = FreeUniform;
