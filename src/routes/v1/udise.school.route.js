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
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: UdiseSchool
 *   description: Udise School management
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
