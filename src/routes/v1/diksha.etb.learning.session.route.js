const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../middlewares/auth');
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

router.route('/playspercapita').get(auth('district'), learningSessionController.getAllPlaysPerCapita);
router.route('/consumptionbycourse').get(auth('district'), learningSessionController.getAllConsumptionByCourse);
router.route('/consumptionbydistrict').get(auth('district'), learningSessionController.getAllConsumptionByDistrict);
router.route('/data/counts').post(auth('district'), learningSessionController.getCountsByProgram);
router.route('/counts-learningsession').post(auth('district'), learningSessionController.getCounts);
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
 *     tags: [diksha.etb.plays.per.capita.model]
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
 *     tags: [diksha.nishtha.consumption.by.course.model]
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
 *     tags: [diksha.nishtha.consumption.by.district.model]
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
 *     tags: [diksha.nishtha.consumption.by.district.model]
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
 *     tags: [diksha.etb.plays.per.capita.model]
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
 *     tags: [diksha.nishtha.consumption.by.course.model]
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
 * /learningsession/data/counts:
 *     post:
 *       summary: Get counts based on program for consumption by course
 *       tags: [diksha.nishtha.consumption.by.course.model]
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

/**
 * @swagger
 * /learningsession/counts-learningsession:
 *   post:
 *     summary: Get dashboard data based on medium,grade,subject filters for Learning Session
 *     description: Get dashboard data based on medium,grade,subject filters for Learning Session
 *     tags: [LearningSession]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               grade:
 *                 type: string
 *               medium:
 *                 type: string
 *             example:
 *               subject: "English"
 *               grade: "Class 10"
 *               medium: "English"
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
