const express = require('express');
const multer = require('multer');
const path = require('path');
const { schoolController } = require('../../controllers');

const router = express.Router();

// Construct the absolute path to the 'uploads' directory
const uploadDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage });

router.route('/bulkupload').post(uploads.single('file'), schoolController.bulkUploadFile);

router.route('/webApi').get(schoolController.storeSchoolDataInMongoDB);

router.route('/').get(schoolController.schoolData);

router.get('/districtNames', schoolController.getDistrictName);

router.get('/zonename', schoolController.getZoneName);

router.post('/getDistrictSchool', schoolController.getDistrictSchool);

router.post('/getDistrictZone', schoolController.getDistrictZoneNames);

router.post('/getZoneSchool', schoolController.getZoneSchool);

router.post('/get-zone-goverment-schools', schoolController.getZoneSchoolOfGoverment);

router.post('/get/school-by/district/zone/shift', schoolController.getSchoolByAll);

router.get('/get-all-school-name', schoolController.getAllSchoolsNames);
router.get('/school-data-tabular', schoolController.getSchoolData);

router.post('/tabular-school-data', schoolController.getSchoolDataForTabular);

router.route('/search-school').post(schoolController.searchSchool);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: School
 *   description: School management
 */

/**
 * @swagger
 * /school/get-all-school-name:
 *   get:
 *     summary: Get all schools name and schoolid
 *     description:  Get all schools name and schoolid
 *     tags: [School]
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
/**
 * @swagger
 * /school:
 *   get:
 *     summary: Get all schools
 *     description: Get a list of all schools.
 *     tags: [School]
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /school/bulkupload:
 *   post:
 *     summary: Upload a CSV file for bulk school upload
 *     tags: [School]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Successfully added CSV file
 *       404:
 *         description: Missing file
 */

/**
 * @swagger
 * /school/districtNames:
 *   get:
 *     summary: Get district names
 *     description: Get a list of district names.
 *     tags: [School]
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /school/zonename:
 *   get:
 *     summary: Get district names
 *     description: Get a list of district names.
 *     tags: [School]
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /school/getDistrictSchool:
 *   post:
 *     summary: Get District School
 *     description: Get a list of District School names.
 *     tags: [School]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               District_name:
 *                 type: string
 *             required:
 *               - District_name
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description: Bad Request
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /school/getDistrictZone:
 *   post:
 *     summary: Get District By Zone
 *     description: Get a list of District Zone names.
 *     tags: [School]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               District_name:
 *                 type: string
 *             required:
 *               - District_name
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description: Bad Request
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /school/getZoneSchool:
 *   post:
 *     summary: Get zone School names
 *     description: Get a list of zone School names.
 *     tags: [School]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Zone_Name:
 *                 type: string
 *             required:
 *               - Zone_Name
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /school/get-zone-goverment-schools:
 *   post:
 *     summary: Get zone School names
 *     description: Get a list of zone School names.
 *     tags: [School]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Zone_Name:
 *                 type: string
 *             required:
 *               - Zone_Name
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /school/get/school-by/district/zone/shift:
 *   post:
 *     summary: Get zone School names
 *     description: Get a list of zone School names.
 *     tags: [School]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               District_name:
 *                 type: string
 *               Zone_Name:
 *                 type: string
 *               shift:
 *                 type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
/**
 * @swagger
 * /school/school-data-tabular:
 *   get:
 *     summary: Get all schools
 *     description: Get a list of all schools.
 *     tags: [School]
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /school/tabular-school-data:
 *   post:
 *     summary: Get  School
 *     description: Get a list of School names.
 *     tags: [School]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Z_name:
 *                 type: string
 *               School_ID:
 *                 type: string
 *               shift:
 *                 type: string
 *               district_name:
 *                 type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description: Bad Request
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */


/**
 * @swagger
 * /school/search-school:
 *   post:
 *     summary: Get School data by a single property (Schoolid, schol Name ).
 *     description: Get School data by a single property (Schoolid, schol Name).
 *     tags: [School]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchQuery:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with an array of matching students
 *       '500':
 *         description: Internal Server Error
 */
// /**/get/school-by/district/zone/shift
//  * @swagger
//  * tags:
//  *   name: School
//  *   description: School management
//  */

// /**
//  * @swagger
//  * /school:
//  *   get:
//  *     summary: Get all schools
//  *     description: Get a list of all schools.
//  *     tags: [School]
//  *     responses:
//  *       "200":
//  *         description: OK
//  *       "401":
//  *         description: Unauthorized
//  *       "403":
//  *         description: Forbidden
//  */
