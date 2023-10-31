const express = require('express');
const { graphsController } = require('../../controllers');

const router = express.Router();

router.route('/').get(graphsController.getSchoolStats);

router.route('/school-graph').get(graphsController.getAggregatedSchoolDataController);

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
/**
 * @swagger
 * /graphs/school-graph:
 *   get:
 *     summary: Get all schools graph data
 *     description: Get school graph data.
 *     tags: [Graphs]
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
