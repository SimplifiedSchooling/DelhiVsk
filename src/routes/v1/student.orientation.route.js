const express = require('express');
const { studentOrientationController } = require('../../controllers');

const router = express.Router();

router.route('/fetch-and-save').get(studentOrientationController.fetchAndSaveStudentOrientationData);
router.get('/path-to-get-all-data', studentOrientationController.getAllData);
router.get('/get-student-orientation', studentOrientationController.getStudentOrientation);

module.exports = router;

/**
 * @swagger
 * /student-orientation/fetch-and-save:
 *   get:
 *     summary: Fetch data from an external API and save it to the database
 *     tags: [Student Orientation]
 *     responses:
 *       200:
 *         description: Data fetched and saved successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /student-orientation/path-to-get-all-data:
 *   get:
 *     summary: Get all data
 *     tags:
 *       - Student Orientation
 *     description: |
 *       Retrieve all data from the database based on provided filters and options.
 *     parameters:
 *       - in: query
 *         name: SchName
 *         schema:
 *           type: string
 *         description: School name to filter the results.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: |
 *           Sort option in the format: sortField:(desc|asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of results per page.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Current page.
 *     responses:
 *       '200':
 *         description: Successful response with the data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StudentOrientation'  # Reference to your model schema
 *                 totalDocs:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
/**
 * @swagger
 * /student-orientation/get-student-orientation:
 *   get:
 *     summary: Get student orientation data based on parameters
 *     tags:
 *       - Student Orientation
 *     parameters:
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: District to filter the results.
 *       - in: query
 *         name: zone
 *         schema:
 *           type: integer
 *         description: Zone to filter the results.
 *       - in: query
 *         name: SchoolID
 *         schema:
 *           type: integer
 *         description: SchoolID to filter the results.
 *     responses:
 *       '200':
 *         description: Successful response with the data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentOrientation'  # Reference to your model schema
 */
