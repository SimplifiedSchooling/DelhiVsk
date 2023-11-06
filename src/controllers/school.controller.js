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
  try {
    const schoolData1 = await schoolService.fetchSchoolData();
    const districtNames = schoolData1.map((school) => school.District_name);
    const uniqueDistrictNames = [...new Set(districtNames)];
    res.json({ districtNames: uniqueDistrictNames });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}
async function getZoneName(req, res) {
  try {
    const schoolData2 = await schoolService.fetchSchoolData();
    const ZoneNames = schoolData2.map((school) => school.Zone_Name);
    const uniqueZoneNames = [...new Set(ZoneNames)];
    // console.log(uniqueZoneNames);
    res.json({ ZoneNames: uniqueZoneNames });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}

// async function getDistrictSchool(req, res) {
//   try {
//     const districtSchools = await schoolService.getDistrictSchools();
//     res.json({ districtSchools });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred' });
//   }
// }
async function getDistrictSchool(req, res) {
  try {
    const districtName = req.body.District_name;
    if (!districtName) {
      return res.status(400).json({ error: 'District_name is required' });
    }
    const districtSchools = await schoolService.getDistrictSchools(districtName);
    res.json({ districtSchools });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}

// async function getZoneSchool(req, res) {
//   try {
//     const ZoneSchool = await schoolService.getZoneNameSchools();
//     res.json({ ZoneSchool });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred' });
//   }
// }
async function getZoneSchool(req, res) {
  try {
    const zoneName = req.body.Zone_Name; // Get the Zone_Name from the query parameters
    if (!zoneName) {
      return res.status(400).json({ error: 'Zone_Name parameter is required' });
    }

    const ZoneSchool = await schoolService.getZoneNameSchools(zoneName);
    res.json({ ZoneSchool });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = {
  storeSchoolDataInMongoDB,
  schoolData,
  bulkUploadFile,
  getDistrictName,
  getZoneName,
  getDistrictSchool,
  getZoneSchool,
};
