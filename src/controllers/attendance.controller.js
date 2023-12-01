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

const getAttendanceCountsShiftWise = catchAsync(async (req, res) => {
  const { date, shift } = req.body;
  const result = await attendanceService.getAttendanceCountsShiftWise(date, shift);
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

  res.status(httpStatus.CREATED).send(result);
});

const getTopPerformingDistrictsController = catchAsync(async (req, res) => {
  const { date } = req.body;
  const topPerformingDistricts = await attendanceService.getTopPerformingDistricts(date);
  res.status(httpStatus.CREATED).send(topPerformingDistricts);
});

const getTopPerformingZonesByDistrict = catchAsync(async (req, res) => {
  const { districtName, date } = req.body;
  const topPerformingZonesByDistricts = await attendanceService.getTopPerformingZonesByDistrict(districtName, date);
  res.status(httpStatus.CREATED).send(topPerformingZonesByDistricts);
});
const getTopPerformingSchoolsByZoneName = catchAsync(async (req, res) => {
  const { zoneName, date } = req.body;
  const topPerformingSchoolsByZoneName = await attendanceService.getTopPerformingSchoolsByZoneName(zoneName, date);
  res.status(httpStatus.CREATED).send(topPerformingSchoolsByZoneName);
});

const getBottomPerformingDistricts = catchAsync(async (req, res) => {
  const { date } = req.body;
  const bottomPerformingDistricts = await attendanceService.getBottomPerformingDistricts(date);
  res.status(httpStatus.CREATED).send(bottomPerformingDistricts);
});

const getBottomPerformingZonesByDistrict = catchAsync(async (req, res) => {
  const { districtName, date } = req.body;
  const topPerformingZonesByDistricts = await attendanceService.getBottomPerformingZonesByDistrict(districtName, date);
  res.status(httpStatus.CREATED).send(topPerformingZonesByDistricts);
});

const getBottomPerformingSchoolsByZoneName = catchAsync(async (req, res) => {
  const { zoneName, date } = req.body;
  const topPerformingSchoolsByZoneName = await attendanceService.getBottomPerformingSchoolsByZoneName(zoneName, date);
  res.status(httpStatus.CREATED).send(topPerformingSchoolsByZoneName);
});

const getSchoolsDataNotFoundCount = catchAsync(async (req, res) => {
  const { date } = req.body;
  const count = await attendanceService.getSchoolsDataNotFoundCount(date);
  res.status(httpStatus.OK).json({ count });
});

module.exports = {
  getAttedanceData,
  getAttendanceCounts,
  getDistrictwiseAttendanceCount,
  getZoneAttendanceCount,
  getAttendanceCountsShiftWise,
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
};
