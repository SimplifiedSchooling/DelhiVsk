const express = require('express');
const { teacherGraphController } = require('../../controllers');

const router = express.Router();

router.route('/school-category-wise').get(teacherGraphController.getTeacherCountBySchoolManagement);

router.route('/school-category-wise/district').post(teacherGraphController.getTeacherStatsByDistrict);

router.route('/school-category-wise/zone').post(teacherGraphController.getTeacherCountByZone);

router.route('/school-category-wise/school').post(teacherGraphController.getTeacherCountBySchool);
router.route('/postwisecount').post(teacherGraphController.getTeacherData);
router.route('/teachercount/schoolname').post(teacherGraphController.getTeacherCountBySchoolName);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: TeacherGraph
 *   description: School management
 */

/**
 * @swagger
 * /teacher-graph/school-category-wise:
 *   get:
 *     summary: Get all schCategory wise  teacher count
 *     description: Get a school data teacher data.
 *     tags: [TeacherGraph]
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
 * /teacher-graph/school-category-wise/district:
 *   post:
 *     summary: Get all teacher graph data by district name.
 *     description: Get teacher graph data by district name.
 *     tags: [TeacherGraph]
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
 * /teacher-graph/school-category-wise/zone:
 *   post:
 *     summary: Get all teacher graph data by zone name.
 *     description: Get teacher graph data by zone name.
 *     tags: [TeacherGraph]
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
 * /teacher-graph/school-category-wise/school:
 *   post:
 *     summary: Get all teacher graph data by school name.
 *     description: Get teacher graph data by school name.
 *     tags: [TeacherGraph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schname:
 *                 type: string
 *             required:
 *               - schname
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
 * /teacher-graph/postwisecount:
 *   post:
 *     summary: Get all teacher postwise count and  data by schoolName and postName.
 *     description: Get all teacher postwise count and  data by schoolName and postName
 *     tags: [TeacherGraph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postdesc:
 *                 type: string
 *               schname:
 *                 type: string
 *             required:
 *               - postdesc
 *               - schname
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
 * /teacher-graph/teachercount/schoolname:
 *   post:
 *     summary: Get all teacher count and  data by schoolName
 *     description: Get all teacher count and  data by schoolName
 *     tags: [TeacherGraph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schname:
 *                 type: string
 *             required:
 *               - schname
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
