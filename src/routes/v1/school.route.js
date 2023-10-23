const express = require('express');
const { schoolController } = require('../../controllers');

const router = express.Router();

router.route('/webApi').get(schoolController.storeSchoolDataInMongoDB);

router.route('/').get(schoolController.schoolData);
module.exports = router;


/**
 * @swagger
 * tags:
 *   name: School
 *   description: School management
 */

/**
 * @swagger
 * /school:
 *   get:
 *     summary: Get all schools
 *     description: Get a list of all schools.
 *     tags: [Student]
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

// /**
//  * @swagger
//  * tags:
//  *   name: School
//  *   description: School management
//  */

// /**
//  * @swagger
//  * /school:
//  *   get:
//  *     summary: Get all schools
//  *     description: Get a list of all schools.
//  *     tags: [School]
//  *     responses:
//  *       "200":
//  *         description: OK
//  *       "401":
//  *         description: Unauthorized
//  *       "403":
//  *         description: Forbidden
//  */
