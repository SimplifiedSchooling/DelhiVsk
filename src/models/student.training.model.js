const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const studentTrainingSchema = new mongoose.Schema({
  district: { type: String, required: true },
  zone: { type: Number, required: true },
  SchoolID: { type: Number, required: true },
  SchName: { type: String, required: true },
  SchAddress: { type: String, required: true },
  Sch_Type: { type: String, required: true },
  LOWCLASS: { type: Number, required: true },
  HIGHCLASS: { type: Number, required: true },
  item_id: { type: Number, required: true },
  trainingpsycosocialaspects_1: { type: String, required: true },
  trainingpsycosocialaspects_2: { type: String, required: true },
  trainingpsycosocialaspects_3: { type: String, required: true },
  trainingpsycosocialaspects_4: { type: String, required: true },
  trainingpsycosocialaspects_5: { type: String, required: true },
  trainingpsycosocialaspects_6: { type: String, required: true },
  trainingpsycosocialaspects_7: { type: String, required: true },
  trainingpsycosocialaspects_8: { type: String, required: true },
  trainingpsycosocialaspects_9: { type: String, required: true },
  trainingpsycosocialaspects_10: { type: String, required: true },
  trainingpsycosocialaspects_11: { type: String, required: true },
  trainingpsycosocialaspects_12: { type: String, required: true },
});

// add plugin that converts mongoose to json
studentTrainingSchema.plugin(toJSON);
studentTrainingSchema.plugin(paginate);

const StudentTraining = mongoose.model('StudentTraining', studentTrainingSchema);

module.exports = StudentTraining;
