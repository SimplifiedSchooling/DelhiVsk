const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const schoolSchema = new mongoose.Schema({
  district: String,
  zone: Number,
  SchoolID: Number,
  SchName: String,
  SchAddress: String,
  PINCD: Number,
  Sch_Type: String,
  LOWCLASS: Number,
  HIGHCLASS: Number,
  BNDRYWALL: String,
  ToClsPry: Number,
  ToClsITOV: Number,
  ToClsVITOVIII: Number,
  ToClsIXTOX: Number,
  ToClsXITOXII: Number,
  Room_ins_Notinuse: Number,
  TotalRooms: Number,
  Urinaltoilet: Number,
  TOILET_B: Number,
  TOILETBFUNC: Number,
  TOILET_G: Number,
  TOILETGFUNC: Number,
  AvaCWSNTOILET_B: Number,
  CWSNTOILETBFUNC: Number,
  AvaCWSNTOILET_G: Number,
  CWSNTOILETGFUNC: Number,
  URINALS_B: Number,
  URINALS_B_Fun: Number,
  URINALS_G: Number,
  URINALS_G_Fun: Number,
  FlusingCleaningB_Fun: Number,
  FlusingCleaningBU_Fun: Number,
  FlusingCleaningStaff_Fun: Number,
  FlusingCleaningStaffU_Fun: Number,
  FlusingCleaningLoked_Fun: Number,
  FlusingCleaningLokedU_Fun: Number,
  FlusingCleaningTotalSchool: Number,
  FlusingCleaningTotalSchoolU: Number,
  TOILET_Handwash: Number,
  Atachedtoiletgirl: Number,
  drink_water_yn: String,
  hand_pump_yn: String,
  hand_pump_fun_yn: String,
  well_prot_yn: String,
  well_prot_fun_yn: String,
  tap_yn: String,
  tap_fun_yn: String,
  well_unprot_yn: String,
  well_unprot_fun_yn: String,
  pack_water_yn: String,
  pack_water_fun_yn: String,
  othsrc_yn: String,
  othsrc_fun_yn: String,
  OTHSRC_NAME: String,
  WATER_PURIFIER_YN: String,
  RAIN_HARVEST_YN: String,
  WATER_TESTED_YN: String,
  HANDWASH_MEAL_YN: String,
  HANDWASH_MEAL_TOT: Number,
  ELECTRICITY_YN: String,
  SOLARPANEL_YN: String,
  LIBRARY_YN: String,
  LIB_BOOKS: Number,
  LIB_BOOKS_NCERT: Number,
  BOOKBANK_YN: String,
  BKBNK_BOOKS: Number,
  BKBNK_BOOKS_NCERT: Number,
  READCORNER_YN: String,
  READCORNER_BOOKS: Number,
  LIBRARIAN_YN: String,
  NEWSPAPER_YN: String,
  PLAYGROUND_YN: String,
  PLAYGROUND_ALT_YN: String,
  MEDCHK_YN: String,
  MEDCHK_TOT: Number,
  annual_health_record_yn: String,
  RAMPS_YN: String,
  HANDRAILS_YN: String,
  SPL_EDUCATOR_YN: String,
});
// add plugin that converts mongoose to json
schoolSchema.plugin(toJSON);
schoolSchema.plugin(paginate);
/**
 * @typedef Udisephysicalfacitlies
 */
const Udisephysicalfacitlies = mongoose.model('Udisephysicalfacitlies', schoolSchema);

module.exports = Udisephysicalfacitlies;
