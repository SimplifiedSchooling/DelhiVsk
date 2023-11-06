const express = require('express');
const { learningSessionController } = require('../../controllers');
const multer = require('multer');
const path = require('path');

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

router.route('/bulkupload-learningsession').post(uploads.single('file'), learningSessionController.bulkUploadFile);
router
  .route('/bulkupload-playspercapita')
  .post(uploads.single('file'), learningSessionController.bulkUploadFileForPlaysPerCapita);
router
  .route('/bulkupload-consumptionbycourse')
  .post(uploads.single('file'), learningSessionController.bulkUploadFileForConsumptionByCourse);
router
  .route('/bulkupload-consumptionbydistrict')
  .post(uploads.single('file'), learningSessionController.bulkUploadFileForConsumptionByDistrict);

router.route('/').get(learningSessionController.getAllLearningSessions);

router.route('/playspercapita').get(learningSessionController.getAllPlaysPerCapita);
router.route('/consumptionbycourse').get(learningSessionController.getAllConsumptionByCourse);
router.route('/consumptionbydistrict').get(learningSessionController.getAllConsumptionByDistrict);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: LearningSession
 *   description: LearningSession management
 */

/**
 * @swagger
 * /learningsession/bulkupload-learningsession:
 *   post:
 *     summary: Upload a CSV file for bulk learningsession upload
 *     tags: [LearningSession]
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
 * /learningsession/bulkupload-playspercapita:
 *   post:
 *     summary: Upload a CSV file for bulk playspercapita upload
 *     tags: [LearningSession]
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
 * /learningsession/bulkupload-consumptionbycourse:
 *   post:
 *     summary: Upload a CSV file for bulk consumptionbycourse upload
 *     tags: [LearningSession]
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
 * /learningsession/bulkupload-consumptionbydistrict:
 *   post:
 *     summary: Upload a CSV file for bulk consumptionbydistrict upload
 *     tags: [LearningSession]
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
 * /learningsession:
 *   get:
 *     summary: Get LearningSessions
 *     tags: [LearningSession]
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
 * /learningsession/consumptionbydistrict:
 *   get:
 *     summary: Get consumptionbydistrict
 *     tags: [LearningSession]
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
 * /learningsession/playspercapita:
 *   get:
 *     summary: Get Playspercapita
 *     tags: [LearningSession]
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
 * /learningsession/consumptionbycourse:
 *   get:
 *     summary: Get Consumptionbycourse
 *     tags: [LearningSession]
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
