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

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: School
 *   description: School management
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

// /**
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
