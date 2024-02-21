// services/student.service.js
const Student = require('../models/student.model');

const getClasswiseCounts = async () => {
  const classwiseCounts = await Student.aggregate([
    {
      $group: {
        _id: { class: '$CLASS', gender: '$Gender' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.class',
        counts: {
          $push: {
            gender: '$_id.gender',
            count: '$count',
          },
        },
      },
    },
  ]);

  return classwiseCounts.map((classGroup) => {
    const countsByGender = classGroup.counts.reduce((result, { gender, count }) => {
      result[gender] = count;
      return result;
    }, {});

    return {
      class: classGroup._id,
      ...countsByGender,
    };
  });
};

const getClasswiseCountsDistrict = async (District) => {
  const classwiseCounts = await Student.aggregate([
    {
      $match: {
        District,
      },
    },
    {
      $group: {
        _id: { class: '$CLASS', gender: '$Gender' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.class',
        counts: {
          $push: {
            gender: '$_id.gender',
            count: '$count',
          },
        },
      },
    },
  ]);

  return classwiseCounts.map((classGroup) => {
    const countsByGender = classGroup.counts.reduce((result, { gender, count }) => {
      result[gender] = count;
      return result;
    }, {});

    return {
      class: classGroup._id,
      ...countsByGender,
    };
  });
};


const getClasswiseCountsZone = async (zone) => {
  const classwiseCounts = await Student.aggregate([
    {
      $match: {
        z_name: zone.toLowerCase(),
      },
    },
    {
      $group: {
        _id: { class: '$CLASS', gender: '$Gender' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.class',
        counts: {
          $push: {
            gender: '$_id.gender',
            count: '$count',
          },
        },
      },
    },
  ]);

  return classwiseCounts.map((classGroup) => {
    const countsByGender = classGroup.counts.reduce((result, { gender, count }) => {
      result[gender] = count;
      return result;
    }, {});

    return {
      class: classGroup._id,
      ...countsByGender,
    };
  });
};

const getClasswiseCountsSchool = async (Schoolid) => {
  const classwiseCounts = await Student.aggregate([
    {
      $match: {
        Schoolid,
      },
    },
    {
      $group: {
        _id: { class: '$CLASS', gender: '$Gender' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.class',
        counts: {
          $push: {
            gender: '$_id.gender',
            count: '$count',
          },
        },
      },
    },
  ]);

  return classwiseCounts.map((classGroup) => {
    const countsByGender = classGroup.counts.reduce((result, { gender, count }) => {
      result[gender] = count;
      return result;
    }, {});

    return {
      class: classGroup._id,
      ...countsByGender,
    };
  });
};


module.exports = {
  getClasswiseCounts,
  getClasswiseCountsDistrict,
  getClasswiseCountsZone,
  getClasswiseCountsSchool,
};


