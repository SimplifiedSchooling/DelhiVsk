const express = require('express');
const multer = require('multer');
const path = require('path');
const { allDashboard3 } = require('../../controllers');

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

router.route('/bulkupload-coveragestatus').post(uploads.single('file'), allDashboard3.bulkUploadFile);
router.route('/bulkupload-coverageqr').post(uploads.single('file'), allDashboard3.bulkUploadFileForPlaysPerCapita);

router.route('/').get(allDashboard3.getAllLearningSessions);

router.route('/coverageqr').get(allDashboard3.getAllPlaysPerCapita);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: AllDashboards3
 *   description: AllDashboards3 management for coveragestatus,coverageqr
 */

/**
 * @swagger
 * /alldashboard3/bulkupload-coveragestatus:
 *   post:
 *     summary: Upload a CSV file for bulk vsk.diksha.etb.coverage.status.model
 *     tags: [AllDashboards3]
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
 * /alldashboard3/bulkupload-coverageqr:
 *   post:
 *     summary: Upload a CSV file for vsk.diksha.etb.qr.coverage.model
 *     tags: [AllDashboards3]
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
 * /alldashboard3:
 *   get:
 *     summary: Get data for vsk.diksha.etb.coverage.status.model
 *     tags: [AllDashboards3]
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
 * /alldashboard3/coverageqr:
 *   get:
 *     summary: Get all data of vsk.diksha.etb.qr.coverage.model
 *     tags: [AllDashboards3]
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
