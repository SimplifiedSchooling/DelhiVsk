const express = require('express');
const multer = require('multer');
const path = require('path');
const { PerCourseProgressAlldashboardController } = require('../../controllers');

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

router
  .route('/bulkupload-percentageenrollmentcertification')
  .post(uploads.single('file'), PerCourseProgressAlldashboardController.bulkUploadFile);
router
  .route('/bulkupload-programstarted')
  .post(uploads.single('file'), PerCourseProgressAlldashboardController.bulkUploadFileForPlaysPerCapita);
router
  .route('/bulkupload-coursemedium')
  .post(uploads.single('file'), PerCourseProgressAlldashboardController.bulkUploadFileForConsumptionByCourse);
router
  .route('/bulkupload-allDashboard')
  .post(uploads.single('file'), PerCourseProgressAlldashboardController.bulkUploadFileForConsumptionByDistrict);

router.route('/').get(PerCourseProgressAlldashboardController.getAllLearningSessions);

router.route('/programstarted').get(PerCourseProgressAlldashboardController.getAllPlaysPerCapita);
router.route('/coursemedium').get(PerCourseProgressAlldashboardController.getAllConsumptionByCourse);
router.route('/alldashboard').get(PerCourseProgressAlldashboardController.getAllConsumptionByDistrict);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: AllDashboards
 *   description: AllDashboards for percentageenrollmentcertification, programStarted, courseMedium, allDashboard management
 */

/**
 * @swagger
 * /alldashboard/bulkupload-percentageenrollmentcertification:
 *   post:
 *     summary: Upload a CSV file for bulk diksha.nishtha.percentage.enrollment.certification.model
 *     tags: [AllDashboards]
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
 * /alldashboard/bulkupload-programstarted:
 *   post:
 *     summary: Upload a CSV file for bulk diksha.nishtha.program.started.model
 *     tags: [AllDashboards]
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
 * /alldashboard/bulkupload-coursemedium:
 *   post:
 *     summary: Upload a CSV file for bulk diksha.nishtha.tot.courses.medium.model
 *     tags: [AllDashboards]
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
 * /alldashboard/bulkupload-allDashboard:
 *   post:
 *     summary: Upload a CSV file for bulk nas.all.dashboard.model
 *     tags: [AllDashboards]
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
 * /alldashboard:
 *   get:
 *     summary: Get data for diksha.nishtha.percentage.enrollment.certification.model
 *     tags: [AllDashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: state_name
 *         schema:
 *           type: string
 *         description: State name *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of records per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Learningsession'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /alldashboard/programstarted:
 *   get:
 *     summary: Get all data of diksha.nishtha.program.started.model
 *     tags: [AllDashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: state_name
 *         schema:
 *           type: string
 *         description: State name *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of records per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Learningsession'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /alldashboard/coursemedium:
 *   get:
 *     summary: Get all data of diksha.nishtha.tot.courses.medium.model
 *     tags: [AllDashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: state_name
 *         schema:
 *           type: string
 *         description: State name *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of records per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Playspercapita'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /alldashboard/alldashboard:
 *   get:
 *     summary: Get all data of nas.all.dashboard.model
 *     tags: [AllDashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: state_name
 *         schema:
 *           type: string
 *         description: State name *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of records per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Consumptionbycourse'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
