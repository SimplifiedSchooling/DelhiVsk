const express = require('express');
const multer = require('multer');
const path = require('path');
const { udiseSchooolController } = require('../../controllers');

const router = express.Router();

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

router.route('/bulkupload').post(uploads.single('file'), udiseSchooolController.bulkUploadFile);

router.route('/udise-school-stats').get(udiseSchooolController.getUdiseSchoolStats);

router.route('/udise-school-stats-by/district').post(udiseSchooolController.getUdiseSchoolStatsDistrict);
router.route('/udise-school-stats-by/zone').post(udiseSchooolController.getUdiseSchoolStatsZone);

router.route('/udise-school-stats-by/school').post(udiseSchooolController.getUdiseSchoolCountSchooolWise);

router.route('/district').get(udiseSchooolController.getUdiseSchoolDistrict);
router.route('/zone').get(udiseSchooolController.getUdiseSchoolZone);

/// ///school type wise ///////
router.route('/school/school-type-wise').post(udiseSchooolController.getSchoolsTypeWise);
router.route('/school/school-type-wise/district').post(udiseSchooolController.getSchoolsTypeWiseDistrict);
router.route('/school/school-type-wise/zone').post(udiseSchooolController.getSchoolsTypeWiseZone);

router.route('/district-zones').post(udiseSchooolController.getUdiseSchoolZoneByDistrict);

router.route('/district-wise/schools').post(udiseSchooolController.getUdiseSchoolByDistrict);
router.route('/zone-wise/school').post(udiseSchooolController.getZoneWiseSchools);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: UdiseSchool
 *   description: Udise School management
 */

/**
 * @swagger
 * /udise-school/getalldata:
 *   get:
 *     summary: Get all UdiseSchool
 *     description: Get a list of all UdiseSchool.
 *     tags: [UdiseSchool]
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
 * /udise-school/udise-school-stats:
 *   get:
 *     summary: Get all udise school stats
 *     description: Get all udise school stats
 *     tags: [UdiseSchool]
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
 * /udise-school/district:
 *   get:
 *     summary: Get all udise school stats
 *     description: Get all udise school stats
 *     tags: [UdiseSchool]
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
 * /udise-school/zone:
 *   get:
 *     summary: Get all udise school stats
 *     description: Get all udise school stats
 *     tags: [UdiseSchool]
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
 * /udise-school/school/school-type-wise:
 *   post:
 *     summary: Get udise school school-type-wise
 *     description: Get udise school school-type-wise
 *     tags: [UdiseSchool]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolType:
 *                 type: string
 *             required:
 *               - schoolType
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
 * /udise-school/school/school-type-wise/district:
 *   post:
 *     summary: Get udise school school-type-wise
 *     description: Get udise school school-type-wise
 *     tags: [UdiseSchool]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolType:
 *                 type: string
 *               district:
 *                 type: string
 *             required:
 *               - schoolType
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
 * /udise-school/school/school-type-wise/zone:
 *   post:
 *     summary: Get udise school school-type-wise zone
 *     description: Get udise school school-type-wise zone
 *     tags: [UdiseSchool]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolType:
 *                 type: string
 *               zone:
 *                 type: number
 *             required:
 *               - schoolType
 *               - zone
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
 * /udise-school/district-zones:
 *   post:
 *     summary: Get all udise graph data by district name.
 *     description: Get udise graph data by district name.
 *     tags: [UdiseSchool]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               districtName:
 *                 type: string
 *             required:
 *               - districtName
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
 * /udise-school/district-wise/schools:
 *   post:
 *     summary: Get all udise graph data by district name.
 *     description: Get udise graph data by district name.
 *     tags: [UdiseSchool]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               district:
 *                 type: string
 *             required:
 *               - district
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
 * /udise-school/zone-wise/school:
 *   post:
 *     summary: Get all udise school by zone .
 *     description: Get udise graph data by zone.
 *     tags: [UdiseSchool]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zone:
 *                 type: number
 *             required:
 *               - zone
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
 * /udise-school/bulkupload:
 *   post:
 *     summary: Upload a CSV file for bulk school upload
 *     tags: [UdiseSchool]
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
 * /udise-school/udise-school-stats-by/district:
 *   post:
 *     summary: Get all udise graph data by district name.
 *     description: Get udise graph data by district name.
 *     tags: [UdiseSchool]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               district:
 *                 type: string
 *             required:
 *               - district
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
 * /udise-school/udise-school-stats-by/zone:
 *   post:
 *     summary: Get all udise graph data by zone name.
 *     description: Get udise graph data by zone name.
 *     tags: [UdiseSchool]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zone:
 *                 type: number
 *             required:
 *               - zone
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
 * /udise-school/udise-school-stats-by/school:
 *   post:
 *     summary: Get all udise graph data by SchoolID.
 *     description: Get udise graph data by SchoolID.
 *     tags: [UdiseSchool]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SchoolID:
 *                 type: string
 *             required:
 *               - SchoolID
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
