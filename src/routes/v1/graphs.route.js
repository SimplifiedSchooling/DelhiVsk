const express = require('express');
const { graphsController } = require('../../controllers');

const router = express.Router();

router.route('/').get(graphsController.getSchoolStats);

router.route('/school').post(graphsController.getSchoolStatistics);

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
/**
 * @swagger
 * /graphs/school:
 *   post:
 *      summary: Get School Statistics
 *      description: Retrieve statistics for schools based on query parameters.
 *      tags: [Graphs]
 *      parameters:
 *        - in: body
 *          name: requestBody
 *          description: Request body with query parameters.
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              SchCategory:
 *                type: string
 *                description: School Category
 *              shift:
 *                type: string
 *                description: School Shift
 *              School_Name:
 *                type: string
 *                description: School Name
 *      responses:
 *        200:
 *          description: Successful response
 *          schema:
 *            type: object
 *        400:
 *          description: Bad request
 *        500:
 *          description: Internal server error
 */
