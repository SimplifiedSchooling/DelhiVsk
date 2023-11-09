const express = require('express');
const multer = require('multer');
const path = require('path');
const { allDashboard2 } = require('../../controllers');

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

router.route('/bulkupload-nas-program-started').post(uploads.single('file'), allDashboard2.bulkUploadFile);
router.route('/bulkupload-pgi-alldashboard').post(uploads.single('file'), allDashboard2.bulkUploadFileForPlaysPerCapita);
router
  .route('/bulkupload-udise-alldashboard')
  .post(uploads.single('file'), allDashboard2.bulkUploadFileForConsumptionByCourse);
router
  .route('/bulkupload-udise-programstarted')
  .post(uploads.single('file'), allDashboard2.bulkUploadFileForConsumptionByDistrict);

router.route('/').get(allDashboard2.getAllLearningSessions);

router.route('/pgi-alldashboard').get(allDashboard2.getAllPlaysPerCapita);
router.route('/udise-alldashboard').get(allDashboard2.getAllConsumptionByCourse);
router.route('/udise-programstarted').get(allDashboard2.getAllConsumptionByDistrict);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: AllDashboards2
 *   description: AllDashboards2 management for Nas-programStarted, Pgi-AllDashboards, UdiseAlldashboards , UdiseProgrameStarted
 */

/**
 * @swagger
 * /alldashboard2/bulkupload-nas-program-started:
 *   post:
 *     summary: Upload a CSV file for bulk nas.program.started.model
 *     tags: [AllDashboards2]
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
 * /alldashboard2/bulkupload-pgi-alldashboard:
 *   post:
 *     summary: Upload a CSV file for bulk pgi.all.dashboard.model
 *     tags: [AllDashboards2]
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
 * /alldashboard2/bulkupload-udise-alldashboard:
 *   post:
 *     summary: Upload a CSV file for bulk udise.all.dashboard.model
 *     tags: [AllDashboards2]
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
 * /alldashboard2/bulkupload-udise-programstarted:
 *   post:
 *     summary: Upload a CSV file for bulk udise.program.started.model
 *     tags: [AllDashboards2]
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
 * /alldashboard2:
 *   get:
 *     summary: Get data for nas.program.started.model
 *     tags: [AllDashboards2]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /alldashboard2/pgi-alldashboard:
 *   get:
 *     summary: Get all data of pgi.all.dashboard.model
 *     tags: [AllDashboards2]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /alldashboard2/udise-alldashboard:
 *   get:
 *     summary: Get all data of udise.all.dashboard.model
 *     tags: [AllDashboards2]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /alldashboard2/udise-programstarted:
 *   get:
 *     summary: Get all data of udise.program.started.model
 *     tags: [AllDashboards2]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
