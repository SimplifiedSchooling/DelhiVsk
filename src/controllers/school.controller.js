const httpStatus = require('http-status');
const { join } = require('path');
const csv = require('csvtojson');
const catchAsync = require('../utils/catchAsync');
const { schoolService } = require('../services');
const ApiError = require('../utils/ApiError');

const staticFolder = join(__dirname, '../');
const uploadsFolder = join(staticFolder, 'uploads');

const bulkUploadFile = catchAsync(async (req, res) => {
  if (req.file) {
    if (req.file.mimetype !== 'text/csv') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
    }

    const csvFilePath = join(uploadsFolder, req.file.filename);
    const csvJsonArray = await csv().fromFile(csvFilePath);
    const result = await schoolService.bulkUpload(csvJsonArray);

    res.status(httpStatus.CREATED).json(result);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});

const storeSchoolDataInMongoDB = catchAsync(async (req, res) => {
  const result = await schoolService.storeSchoolDataInMongoDB();
  res.status(httpStatus.CREATED).send(result);
});

const schoolData = catchAsync(async (req, res) => {
  const result = await schoolService.schoolData();
  res.status(httpStatus.CREATED).send(result);
});

async function getDistrictName(req, res) {
  const result = await schoolService.fetchSchoolData();
  res.status(httpStatus.CREATED).send(result);
}

async function getZoneName(req, res) {
  const result = await schoolService.fetchSchoolZone();
  res.status(httpStatus.CREATED).send(result);
}
async function getDistrictSchool(req, res) {
  try {
    const districtName = req.body.District_name;
    if (!districtName) {
      new ApiError(httpStatus.NOT_FOUND, 'DistrictName not found');
    }
    const districtSchools = await schoolService.getDistrictSchools(districtName);
    res.send({ districtSchools });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schools not found');
  }
}

async function getDistrictZoneNames(req, res) {
  try {
    const districtName = req.body.District_name;
    if (!districtName) {
      new ApiError(httpStatus.NOT_FOUND, 'District_name is required');
    }
    const ZoneSchool = await schoolService.getDistrictZoneNames(districtName);

    res.status(httpStatus.CREATED).send({ ZoneSchool });
  } catch (error) {
    new ApiError(httpStatus.NOT_FOUND, 'Zone school not found');
  }
}

async function getZoneSchool(req, res) {
  try {
    const zoneName = req.body.Zone_Name; // Get the Zone_Name from the query parameters
    if (!zoneName) {
      new ApiError(httpStatus.NOT_FOUND, 'Zone_Name parameter is required');
    }

    const ZoneSchool = await schoolService.getZoneNameSchools(zoneName);
    res.status(httpStatus.CREATED).send({ ZoneSchool });
  } catch (error) {
    new ApiError(httpStatus.NOT_FOUND, 'School not found');
  }
}

const getZoneSchoolOfGoverment = catchAsync(async (req, res) => {
  try {
    const zoneName = req.body.Zone_Name; // Get the Zone_Name from the query parameters
    if (!zoneName) {
      new ApiError(httpStatus.NOT_FOUND, 'Zone_Name parameter is required');
    }

    const ZoneSchool = await schoolService.getZoneNameSchoolsOfGoverment(zoneName);
    res.status(httpStatus.CREATED).send({ ZoneSchool });
  } catch (error) {
    new ApiError(httpStatus.NOT_FOUND, 'School not found');
  }
});

const getSchoolStatsBySchoolName = catchAsync(async (req, res) => {
  const { schoolName } = req.body;
  const result = await schoolService.getStudentCountBySchoolName(schoolName);
  res.status(httpStatus.CREATED).send(result);
});

const getSchoolByAll = catchAsync(async (req, res) => {
  // const { District_name, Zone_Name, shift } = req.body;
  const query = {};

  // Build the query based on the provided parameters
  if (req.body.District_name) {
    query.District_name = req.body.District_name;
  }
  if (req.body.Zone_Name) {
    query.Zone_Name = req.body.Zone_Name;
  }
  if (req.body.shift) {
    query.shift = req.body.shift;
  }
  const result = await schoolService.getSchoolByName(query);
  res.status(httpStatus.CREATED).send(result);
});

// const fromUserIDGetData = catchAsync(async(req, res) => {

//   if (!result) {
//     return res.status(httpStatus.NOT_FOUND).json({ error: 'Invalid id' });
//   }

//   return res.status(httpStatus.OK).json(result);

// })
const getAllSchoolsNames = catchAsync(async (req, res) => {
  const result = await schoolService.getAllSchoolsNames();
  if (!result) {
    new ApiError(httpStatus.NOT_FOUND, 'Not found School data');
  }
  res.status(httpStatus.CREATED).send(result);
});

const getSchoolDataForTabular = catchAsync(async (req, res) => {
  const { Z_name, School_ID, shift, district_name } = req.body;
  const result = await schoolService.getSchoolDataForTabular(Z_name, School_ID, shift, district_name);
  if (!result) {
    new ApiError(httpStatus.NOT_FOUND, 'School data not found');
  }
  res.status(httpStatus.CREATED).send(result);
});

const getSchoolData = catchAsync(async (req, res) => {
  const result = await schoolService.getSchoolData();
  if (!result) {
    new ApiError(httpStatus.NOT_FOUND, 'School data not found');
  }
  res.status(httpStatus.CREATED).send(result);
});

const searchSchool = catchAsync(async (req, res) => {
  const result = await schoolService.searchSchool(req.body.searchQuery);
  res.send(result);
});


module.exports = {
  storeSchoolDataInMongoDB,
  schoolData,
  bulkUploadFile,
  getDistrictZoneNames,
  getDistrictName,
  getZoneName,
  getDistrictSchool,
  getZoneSchool,
  getSchoolStatsBySchoolName,
  getZoneSchoolOfGoverment,
  getSchoolByAll,
  getAllSchoolsNames,
  getSchoolDataForTabular,
  getSchoolData,
  searchSchool,
};
