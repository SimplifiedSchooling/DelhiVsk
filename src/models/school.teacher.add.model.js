const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const schoolTeachingAidsSchema = new mongoose.Schema({
  district: { type: String, required: true },
  zone: { type: Number, required: true },
  SchoolID: { type: Number, required: true },
  SchName: { type: String, required: true },
  SchAddress: { type: String, required: true },
  Sch_Type: { type: String, required: true },
  LOWCLASS: { type: Number, required: true },
  HIGHCLASS: { type: Number, required: true },
  item_id: { type: Number, required: true },
  createdteachingaids_YN_1: { type: String, required: true },
  createdteachingaids_YN_2: { type: String, required: true },
  createdteachingaids_YN_3: { type: String, required: true },
  createdteachingaids_YN_4: { type: String, required: true },
  createdteachingaids_YN_5: { type: String, required: true },
  createdteachingaids_YN_6: { type: String, required: true },
  createdteachingaids_YN_7: { type: String, required: true },
  createdteachingaids_YN_8: { type: String, required: true },
  createdteachingaids_YN_9: { type: String, required: true },
  createdteachingaids_YN_10: { type: String, required: true },
  createdteachingaids_YN_11: { type: String, required: true },
  createdteachingaids_YN_12: { type: String, required: true },
});
// add plugin that converts mongoose to json
schoolTeachingAidsSchema.plugin(toJSON);
schoolTeachingAidsSchema.plugin(paginate);

const SchoolTeacherCreated = mongoose.model('SchoolTeacherCreated', schoolTeachingAidsSchema);

module.exports = SchoolTeacherCreated;
