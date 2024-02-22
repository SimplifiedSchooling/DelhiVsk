const express = require('express');
const { studentTrainingController } = require('../../controllers');

const router = express.Router();

router.route('/fetch-and-save').get(studentTrainingController.fetchAndSaveStudentOrientationData);
router.get('/path-to-get-all-data', studentTrainingController.getAllData);
router.get('/get-student-training', studentTrainingController.getStudentOrientation);

module.exports = router;




/**
 * @swagger
 * /student-training/fetch-and-save:
 *   get:
 *     summary: Fetch data from an external API and save it to the database
 *     tags: [Student Training]
 *     responses:
 *       200:
 *         description: Data fetched and saved successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /student-training/path-to-get-all-data:
 *   get:
 *     summary: Get all data
 *     tags:
 *       - Student Training
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
 * /student-training/get-student-training:
 *   get:
 *     summary: Get student training data based on parameters
 *     tags:
 *       - Student Training
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
