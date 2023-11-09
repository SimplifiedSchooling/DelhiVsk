const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const udiseSchoolSchema = mongoose.Schema(
  {
    district: {
      type: String,
    },
    zone: {
      type: Number,
    },
    SchoolID: {
      type: String,
    },
    SchName: {
      type: String,
    },
    SchAddress: {
      type: String,
    },
    PINCD: {
      type: Number,
    },
    CRCSchAddress: {
      type: String,
    },
    Sch_Type: {
      type: String,
    },
    MuncipalityName: {
      type: String,
    },
    RuralUrban: {
      type: String,
    },
    Udise_Code: {
      type: String,
    },
    ESTDYEAR: {
      type: Number,
    },
    CWSNSCH_YN: {
      type: String,
    },
    School_Deatils_STD: {
      type: String,
    },
    School_Deatils_Landline_Phone: {
      type: String,
    },
    School_Deatils_MobileNO: {
      type: String,
    },
    School_Incharge_Name: {
      type: String,
    },
    School_Incharge_Designation: {
      type: String,
    },
    School_Incharge_MobileNo: {
      type: String,
    },
    Respondent_Name: {
      type: String,
    },
    Respondent_Designation: {
      type: String,
    },
    Respondent_MobileNo: {
      type: String,
    },
    EMAIL: {
      type: String,
    },
    WEBSITE: {
      type: String,
    },
    School_Gender: {
      type: String,
    },
    School_Level: {
      type: String,
    },
    School_Nomenclature: {
      type: String,
    },
    LOWCLASS: {
      type: Number,
    },

    HIGHCLASS: {
      type: Number,
    },
    Shiftofschool: {
      type: String,
    },
    typeofschool: {
      type: String,
    },
    SCHMGT_Group: {
      type: String,
    },
    SCHMGT: {
      type: String,
    },
    minoritymanagedschool_YN: {
      type: String,
    },
    MEDINSTR1: {
      type: String,
    },
    MEDINSTR2: {
      type: String,
    },
    MEDINSTR3: {
      type: String,
    },
    MEDINSTR4: {
      type: String,
    },
    MTONGUE_YN: {
      type: String,
    },
    LANG1: {
      type: String,
    },
    LANG2: {
      type: String,
    },
    LANG3: {
      type: String,
    },
    LANG4: {
      type: String,
    },
    LANG5: {
      type: String,
    },
    VISITSCRC: {
      type: Number,
    },
    workdays_pre_pri: {
      type: Number,
    },
    workdays_pri: {
      type: Number,
    },
    WORKSDAYS_UPR: {
      type: Number,
    },
    WORKSDAYS_SEC: {
      type: Number,
    },
    workdays_hsec: {
      type: Number,
    },
    sch_hrs_stu_pre_pri_h: {
      type: Number,
    },
    sch_hrs_stu_pre_pri_m: {
      type: Number,
    },
    sch_hrs_stu_pri_h: {
      type: Number,
    },
    sch_hrs_stu_pri_m: {
      type: String,
    },
    sch_hrs_stu_upr_h: {
      type: Number,
    },
    sch_hrs_stu_upr_m: {
      type: Number,
    },
    sch_hrs_stu_sec_h: {
      type: Number,
    },
    sch_hrs_stu_sec_m: {
      type: Number,
    },
    sch_hrs_stu_hsec_h: {
      type: Number,
    },
    sch_hrs_stu_hsec_m: {
      type: Number,
    },
    sch_hrs_tch_pre_pri_h: {
      type: Number,
    },
    sch_hrs_tch_pre_pri_m: {
      type: Number,
    },
    sch_hrs_tch_pri_h: {
      type: Number,
    },
    sch_hrs_tch_pri_m: {
      type: Number,
    },
    sch_hrs_tch_upr_h: {
      type: Number,
    },
    sch_hrs_tch_upr_m: {
      type: Number,
    },
    sch_hrs_tch_sec_h: {
      type: Number,
    },
    sch_hrs_tch_sec_m: {
      type: Number,
    },
    sch_hrs_tch_hsec_h: {
      type: Number,
    },
    sch_hrs_tch_hsec_m: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
udiseSchoolSchema.plugin(toJSON);
udiseSchoolSchema.plugin(paginate);

/**
 * @typedef Udiseschool
 */
const Udiseschool = mongoose.model('udiseschool', udiseSchoolSchema);

module.exports = Udiseschool;
