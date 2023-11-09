const express = require('express');
const multer = require('multer');
const path = require('path');
const { learningSessionController } = require('../../controllers');

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
router.route('/counts').post(learningSessionController.getCounts);
module.exports = router;
/**
 * @swagger
 * tags:
 *   name: LearningSession
 *   description: LearningSession management for learningsession , playePerCapita, consumptionbycourse, consumptionBydistrict
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
 *     summary: Get Diksha etb learning session
 *     tags: [LearningSession]
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
 * /learningsession/consumptionbydistrict:
 *   get:
 *     summary: Get Diksha nishtha consumption by district
 *     tags: [LearningSession]
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
 * /learningsession/playspercapita:
 *   get:
 *     summary: Get Diksha etb plys per capita
 *     tags: [LearningSession]
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
 * /learningsession/consumptionbycourse:
 *   get:
 *     summary: Get Diksha nishtha consumption by course
 *     tags: [LearningSession]
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
 * /learningsession/counts:
 *     post:
 *       summary: Get counts based on program
 *       tags: [LearningSession]
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 program:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful response
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   enrollmentsCount:
 *                     type: array
 *                   completionCount:
 *                     type: array
 *                   certificationCount:
 *                     type: array
 *         400:
 *           description: Bad request
 *         500:
 *           description: Internal server error
 */
