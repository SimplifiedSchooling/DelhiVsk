const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const attendanceSchema = mongoose.Schema(
  {
    attendanceStatus: {
      type: String,
    },
    district_name: {
      type: String,
    },
    Z_name: {
      type: String,
    },
    School_ID: {
      type: String,
    },
    school_name: {
      type: String,
    },
    shift: {
      type: String,
    },
    SchManagement: {
      type: String,
    },
    totalStudentCount: {
      type: Number,
    },
    PresentCount: {
      type: Number,
    },
    AbsentCount: {
      type: Number,
    },
    totalNotMarkedAttendanceCount: {
      type: Number,
    },
    totalLeaveCount: {
      type: Number,
    },
    attendance_DATE: {
      type: String,
    },
    malePresentCount: {
      type: Number,
    },
    feMalePresentCount: {
      type: Number,
    },
    otherPresentCount: {
      type: Number,
    },
    maleAbsentCount: {
      type: Number,
    },
    feMaleAbsentCount: {
      type: Number,
    },
    othersAbsentCount: {
      type: Number,
    },
    maleLeaveCount: {
      type: Number,
    },
    femaleLeaveCount: {
      type: Number,
    },
    otherLeaveCount: {
      type: Number,
    },
    maleAttendanceNotMarked: {
      type: Number,
    },
    femaleAttendanceNotMarked: {
      type: Number,
    },
    otherAttendanceNotMarked: {
      type: Number,
    },

    classCount: [
      {
        className: {
          type: String,
        },
        classTotalStudentCount: {
          type: Number,
        },
        classPresentCount: {
          type: Number,
        },
        classAbsentCount: {
          type: Number,
        },
        classLeaveCount: {
          type: Number,
        },
        classNotMarkedAttendanceCount: {
          type: Number,
        },
        classMalePresentCount: {
          type: Number,
        },
        classFemalePresentCount: {
          type: Number,
        },
        classOtherPresentCount: {
          type: Number,
        },
        classMaleAbsentCount: {
          type: Number,
        },
        classFemaleAbsentCount: {
          type: Number,
        },
        classOtherAbsentCount: {
          type: Number,
        },
        classMaleLeaveCount: {
          type: Number,
        },
        classFemaleLeaveCount: {
          type: Number,
        },
        classOtherLeaveCount: {
          type: Number,
        },
        classMaleAttendanceNotMarkedCount: {
          type: Number,
        },
        classFemaleAttendanceNotMarkedCount: {
          type: Number,
        },
        classOtherAttendanceNotMarkedCount: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
attendanceSchema.plugin(toJSON);
attendanceSchema.plugin(paginate);
/**
 * @typedef Attendance
 */
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
