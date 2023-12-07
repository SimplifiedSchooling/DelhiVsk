const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { attendanceService } = require('../services');

const getAttedanceData = catchAsync(async (req, res) => {
  const { date } = req.body;
  const result = await attendanceService.storeAttendanceDataByDate(date);
  res.status(httpStatus.CREATED).send(result);
});

const getAttendanceCounts = catchAsync(async (req, res) => {
  const result = await attendanceService.getAttendanceCounts(req.body.date, req.body.endDate);
  res.status(httpStatus.CREATED).send(result);
});

const getDistrictwiseAttendanceCount = catchAsync(async (req, res) => {
  const result = await attendanceService.getAttendanceCountsDistrictWise(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getZoneAttendanceCount = catchAsync(async (req, res) => {
  const { date, zoneName } = req.body;
  const result = await attendanceService.getAttendanceCountsZoneWise(date, zoneName);
  res.status(httpStatus.CREATED).send(result);
});

const getAttendanceCountsSchoolWise = catchAsync(async (req, res) => {
  const { date, School_ID } = req.body;
  const result = await attendanceService.getAttendanceCountsSchoolWise(date, School_ID);
  res.status(httpStatus.CREATED).send(result);
});

const getAttendanceCountsShiftWise = catchAsync(async (req, res) => {
  const { date, shift } = req.body;
  const result = await attendanceService.getAttendanceCountsShiftWise(date, shift);
  res.status(httpStatus.CREATED).send(result);
});

const attendanceStatus = catchAsync(async (req, res) => {
  const { date, attendanceStatus } = req.body;
  const result = await attendanceService.attendanceStatus(date, attendanceStatus);
  res.status(httpStatus.CREATED).send(result);
});

const attendanceStatusDistrictWise = catchAsync(async (req, res) => {
  const { district_name, date, attendanceStatus } = req.body;
  const result = await attendanceService.attendanceStatusDistrictWise(district_name, date, attendanceStatus);
  res.status(httpStatus.CREATED).send(result);
});

const attendanceStatusZoneWise = catchAsync(async (req, res) => {
  const { Z_name, date, attendanceStatus } = req.body;
  const result = await attendanceService.attendanceStatusZoneWise(Z_name, date, attendanceStatus);
  res.status(httpStatus.CREATED).send(result);
});

const attendanceStatusSchoolWise = catchAsync(async (req, res) => {
  const { School_ID, date, attendanceStatus } = req.body;
  const result = await attendanceService.attendanceStatusSchoolWise(School_ID, date, attendanceStatus);
  res.status(httpStatus.CREATED).send(result);
});

const attendanceStatusShiftWise = catchAsync(async (req, res) => {
  const { shift, date, attendanceStatus } = req.body;
  const result = await attendanceService.attendanceStatusShiftWise(shift, date, attendanceStatus);
  res.status(httpStatus.CREATED).send(result);
});

const getDistrictWisePresentCount = catchAsync(async (req, res) => {
  const { date } = req.body;
  const result = await attendanceService.getDistrictWisePresentCount(date);
  res.status(httpStatus.CREATED).send(result);
});

//----------------------------------------------------------------

const getGenderRangeWiseCountCount = catchAsync(async (req, res) => {
  const { schoolId, startDate, endDate } = req.body;
  const result = await attendanceService.getGenderRangeWiseCount(schoolId, startDate, endDate);
  if (result.length === 0) {
    throw new Error([]);
  }
  res.status(httpStatus.CREATED).send(result);
});

const getAttendancePercentageByGenderAndRangeWise = catchAsync(async (req, res) => {
  const { startDate, endDate, zoneName, districtName, schoolId } = req.body;

  const result = await attendanceService.getAttendancePercentageGenderAndRangeWise(
    startDate,
    endDate,
    zoneName,
    districtName,
    schoolId
  );
  if (result.length === 0) {
    throw new Error([]);
  }
  res.status(httpStatus.CREATED).send(result);
});

const getAttendancePercentageByGenderAndRangeAndShiftWise = catchAsync(async (req, res) => {
  const { startDate, endDate, zoneName, districtName, schoolId, shift } = req.body;

  const result = await attendanceService.getAttendancePercentageGenderAndRangeAndShiftWise(
    startDate,
    endDate,
    zoneName,
    districtName,
    schoolId,
    shift
  );
  if (result.length === 0) {
    throw new Error([]);
  }
  res.status(httpStatus.CREATED).send(result);
});

const getTopPerformingDistrictsController = catchAsync(async (req, res) => {
  const { date } = req.body;
  const topPerformingDistricts = await attendanceService.getTopPerformingDistricts(date);
  if (topPerformingDistricts.length === 0) {
    throw new Error([]);
  }
  res.status(httpStatus.CREATED).send(topPerformingDistricts);
});

const getTopPerformingZonesByDistrict = catchAsync(async (req, res) => {
  const { districtName, date } = req.body;
  const topPerformingZonesByDistricts = await attendanceService.getTopPerformingZonesByDistrict(districtName, date);
  if (topPerformingZonesByDistricts.length === 0) {
    throw new Error([]);
  }
  res.status(httpStatus.CREATED).send(topPerformingZonesByDistricts);
});
const getTopPerformingSchoolsByZoneName = catchAsync(async (req, res) => {
  const { zoneName, date } = req.body;
  const topPerformingSchoolsByZoneName = await attendanceService.getTopPerformingSchoolsByZoneName(zoneName, date);
  if (topPerformingSchoolsByZoneName.length === 0) {
    throw new Error([]);
  }
  res.status(httpStatus.CREATED).send(topPerformingSchoolsByZoneName);
});

const getBottomPerformingDistricts = catchAsync(async (req, res) => {
  const { date } = req.body;
  const bottomPerformingDistricts = await attendanceService.getBottomPerformingDistricts(date);
  if (bottomPerformingDistricts.length === 0) {
    throw new Error([]);
  }
  res.status(httpStatus.CREATED).send(bottomPerformingDistricts);
});

const getBottomPerformingZonesByDistrict = catchAsync(async (req, res) => {
  const { districtName, date } = req.body;
  const topPerformingZonesByDistricts = await attendanceService.getBottomPerformingZonesByDistrict(districtName, date);
  if (topPerformingZonesByDistricts.length === 0) {
    throw new Error([]);
  }
  res.status(httpStatus.CREATED).send(topPerformingZonesByDistricts);
});

const getBottomPerformingSchoolsByZoneName = catchAsync(async (req, res) => {
  const { zoneName, date } = req.body;
  const topPerformingSchoolsByZoneName = await attendanceService.getBottomPerformingSchoolsByZoneName(zoneName, date);
  if (topPerformingSchoolsByZoneName.length === 0) {
    throw new Error([]);
  }
  res.status(httpStatus.CREATED).send(topPerformingSchoolsByZoneName);
});

const getSchoolsDataNotFoundCount = catchAsync(async (req, res) => {
  const { date } = req.body;
  const count = await attendanceService.getSchoolsDataNotFoundCount(date);
  if (count.length === 0) {
    throw new Error([]);
  }
  res.status(httpStatus.OK).json({ count });
});

const getTopPerformingClassesBySchoolId = catchAsync(async (req, res) => {
  const { schoolId, date } = req.body;
  const topPerformingClasses = await attendanceService.getTopPerformingClassesBySchoolId(schoolId, date);
  if (topPerformingClasses.length === 0) {
    throw new Error([]);
  }
  res.json(topPerformingClasses);
});

const getBottomPerformingClassesBySchoolId = catchAsync(async (req, res) => {
  const { schoolId, date } = req.body;
  const bottomPerformingClasses = await attendanceService.getBottomPerformingClassesBySchoolId(schoolId, date);
  if (bottomPerformingClasses.length === 0) {
    throw new Error([]);
  }
  res.json(bottomPerformingClasses);
});

module.exports = {
  getAttedanceData,
  getAttendanceCounts,
  getDistrictwiseAttendanceCount,
  getZoneAttendanceCount,
  getAttendanceCountsSchoolWise,
  getAttendanceCountsShiftWise,
  attendanceStatus,
  attendanceStatusDistrictWise,
  attendanceStatusZoneWise,
  attendanceStatusSchoolWise,
  attendanceStatusShiftWise,
  getDistrictWisePresentCount,
  //----------------------------------------------------------------
  getGenderRangeWiseCountCount,
  getAttendancePercentageByGenderAndRangeWise,
  getTopPerformingDistrictsController,
  getTopPerformingZonesByDistrict,
  getTopPerformingSchoolsByZoneName,
  getBottomPerformingDistricts,
  getBottomPerformingZonesByDistrict,
  getBottomPerformingSchoolsByZoneName,
  getSchoolsDataNotFoundCount,
  getTopPerformingClassesBySchoolId,
  getBottomPerformingClassesBySchoolId,
  getAttendancePercentageByGenderAndRangeAndShiftWise,
};
