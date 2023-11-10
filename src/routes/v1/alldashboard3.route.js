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

router.route('/coverageqr/status/average').post(allDashboard3.getSubjectAverageByMediumAndGrade);

router.route('/coverageqr/average').post(allDashboard3.getAveragesByMediumAndGrade);

module.exports = router;

/**
 * @swagger
 * /alldashboard3/bulkupload-coveragestatus:
 *   post:
 *     summary: Upload a CSV file for bulk vsk.diksha.etb.coverage.status.model
 *     tags: [vsk.diksha.etb.coverage.status]
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
 *     tags: [vsk.diksha.etb.qr.coverage]
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
 *     tags: [vsk.diksha.etb.coverage.status]
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
 * /alldashboard3/coverageqr/status/average:
 *   post:
 *     summary: Get data for vsk.diksha.etb.coverage.by medium grade avrage
 *     description: Get data for vsk.diksha.etb.coverage.by medium grade avrage
 *     tags: [vsk.diksha.etb.coverage.status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medium:
 *                 type: string
 *               grade:
 *                 type: string
 *             required:
 *               - medium
 *               - grade
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
 * /alldashboard3/coverageqr:
 *   get:
 *     summary: Get all data of vsk.diksha.etb.qr.coverage.model
 *     tags: [vsk.diksha.etb.qr.coverage]
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
 * /alldashboard3/coverageqr/average:
 *   post:
 *     summary: Get data for vsk.diksha.etb.coverage.by medium grade avrage
 *     description: Get data for vsk.diksha.etb.coverage.by medium grade avrage
 *     tags: [vsk.diksha.etb.qr.coverage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medium:
 *                 type: string
 *               grade:
 *                 type: string
 *             required:
 *               - medium
 *               - grade
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
