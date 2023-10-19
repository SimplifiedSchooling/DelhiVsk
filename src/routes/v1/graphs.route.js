const express = require('express');
const { graphsController } = require('../../controllers');

const router = express.Router();

router.route('/').get(graphsController.getSchoolStats);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Graphs
 *   description: School management
 */

/**
 * @swagger
 * /graphs:
 *   get:
 *     summary: Get all schools overview
 *     description: Get a school data.
 *     tags: [Graphs]
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
