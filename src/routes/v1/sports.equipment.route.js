const express = require('express');
const { sportsEquipmentController } = require('../../controllers');

const router = express.Router();

router.route('/fetch-and-save').get(sportsEquipmentController.fetchAndSaveStudentOrientationData);
router.get('/path-to-get-all-data', sportsEquipmentController.getAllData);
router.get('/get-sports-games-equipment', sportsEquipmentController.getStudentOrientation);

module.exports = router;




/**
 * @swagger
 * /equipment/fetch-and-save:
 *   get:
 *     summary: Fetch data from an external API and save it to the database
 *     tags: [Sports And Games Equipment]
 *     responses:
 *       200:
 *         description: Data fetched and saved successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /equipment/path-to-get-all-data:
 *   get:
 *     summary: Get all data
 *     tags:
 *       - Sports And Games Equipment
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
 * /equipment/get-sports-games-equipment:
 *   get:
 *     summary: Get sports and games equipment data based on parameters
 *     tags:
 *       - Sports And Games Equipment
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
