const express = require('express');
const { attendanceController } = require('../../controllers');

const router = express.Router();


router.route('/').get(attendanceController.getAttedanceData);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Attendnace
 *   description: Attendnace management
 */

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get all attendnace
 *     description: Get a list of all attendnace.
 *     tags: [Attendnace]
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

