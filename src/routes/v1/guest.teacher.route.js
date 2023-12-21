const express = require('express');
const { guestTeacherControler } = require('../../controllers');

const router = express.Router();

router.route('/school-wise').get(guestTeacherControler.getTeacherCountBySchoolManagement);

router.route('/school-district-wise').post(guestTeacherControler.getTeacherStatsDistrict);

router.route('/school/zone-wise').post(guestTeacherControler.getTeacherStatsZone);

router.route('/school-wise/stats').post(guestTeacherControler.getTeacherStatsSchool);

router.route('/search-guest-teachers').post(guestTeacherControler.getGuestTeacherSearch);

router.route('/school/teacher-list').post(guestTeacherControler.getGuestTeacherList);

router.route('/school/post-wise/teacher-list').post(guestTeacherControler.teacherGuestPostWiseList);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: GuestTeacherGraph
 *   description: School management
 */

/**
 * @swagger
 * /guest-teacher/school-wise:
 *   get:
 *     summary: Get all schCategory wise  teacher count
 *     description: Get a school data teacher data.
 *     tags: [GuestTeacherGraph]
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
 * /guest-teacher/school-district-wise:
 *   post:
 *     summary: Get all teacher graph data by district name.
 *     description: Get teacher graph data by district name.
 *     tags: [GuestTeacherGraph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DistrictName:
 *                 type: string
 *             required:
 *               - DistrictName
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
 * /guest-teacher/school/zone-wise:
 *   post:
 *     summary: Get all teacher graph data by zone name.
 *     description: Get teacher graph data by zone name.
 *     tags: [GuestTeacherGraph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zoneName:
 *                 type: string
 *             required:
 *               - zoneName
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
 * /guest-teacher/school-wise/stats:
 *   post:
 *     summary: Get  graph teacher graph data by school name.
 *     description: Get graph teacher graph data by school name.
 *     tags: [GuestTeacherGraph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Schoolid:
 *                 type: string
 *             required:
 *               - Schoolid
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
 * /guest-teacher/search-guest-teachers:
 *   post:
 *     summary: Get teachers data by a single property (Name, ApplicationId).
 *     description: Get teachers data by a single property (Name, ApplicationId).
 *     tags: [GuestTeacherGraph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchQuery:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with an array of matching teachers
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /guest-teacher/school/teacher-list:
 *   post:
 *     summary: Get teachers data by a single property (Name, ApplicationId).
 *     description: Get teachers data by a single property (Name, ApplicationId).
 *     tags: [GuestTeacherGraph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SchoolID:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with an array of matching teachers
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /guest-teacher/school/post-wise/teacher-list:
 *   post:
 *     summary: Get teachers data by Post and SchoolID.
 *     description: Get teachers data by Post and SchoolID.
 *     tags: [GuestTeacherGraph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SchoolID:
 *                 type: string
 *               Post:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with an array of matching teachers
 *       '500':
 *         description: Internal Server Error
 */
