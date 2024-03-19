const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const academicCriterionSchema = new mongoose.Schema({
  district: { type: String, required: true },
  zone: { type: Number, required: true },
  SchoolID: { type: Number, required: true },
  SchName: { type: String, required: true },
  SchAddress: { type: String, required: true },
  Sch_Type: { type: String, required: true },
  LOWCLASS: { type: Number, required: true },
  HIGHCLASS: { type: Number, required: true },
  item_id: { type: Number, required: true },
  Noofcriterion_1: { type: String, required: true },
  Noofcriterion_2: { type: String, required: true },
  Noofcriterion_3: { type: String, required: true },
  Noofcriterion_4: { type: String, required: true },
  Noofcriterion_5: { type: String, required: true },
  Noofcriterion_6: { type: String, required: true },
  Noofcriterion_7: { type: String, required: true },
  Noofcriterion_8: { type: String, required: true },
  Noofcriterion_9: { type: String, required: true },
  Noofcriterion_10: { type: String, required: true },
  Noofcriterion_11: { type: String, required: true },
  Noofcriterion_12: { type: String, required: true },
});

// add plugin that converts mongoose to json
academicCriterionSchema.plugin(toJSON);
academicCriterionSchema.plugin(paginate);

const AcademicCriterionModel = mongoose.model('AcademicCriterion', academicCriterionSchema);

module.exports = AcademicCriterionModel;
