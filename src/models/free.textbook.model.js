const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const textbookSchema = new mongoose.Schema({
  district: { type: String, required: true },
  zone: { type: Number, required: true },
  SchoolID: { type: Number, required: true },
  SchName: { type: String, required: true },
  SchAddress: { type: String, required: true },
  Sch_Type: { type: String, required: true },
  LOWCLASS: { type: Number, required: true },
  HIGHCLASS: { type: Number, required: true },
  item_id: { type: Number, required: true },
  cpp_tot: { type: String, default: ''  }, // assuming this field can be empty
  Txtbook_pri: { type: String, default: ''  },
  Txtbook_Upperpri: { type: String, default: ''  },
  Txtbook_Sec: { type: String, default: ''  },
  Txtbook_HSec: { type: String, default: ''  },
});

// add plugin that converts mongoose to json
textbookSchema.plugin(toJSON);
textbookSchema.plugin(paginate);

/**
 * @typedef Textbook
 */

const Textbook = mongoose.model('Textbook', textbookSchema);

module.exports = Textbook;
