const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { studentMarksValidation } = require('../../validations');
const { missionBuniyadController } = require('../../controllers');

const router = express.Router();

router
  .route('/:schoolid')
  .get(validate(studentMarksValidation.getMissionBuniyad), missionBuniyadController.getMissionBuniyad);

  module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Mission Buniyad
 *   description: School management
 */



  /**
 * @swagger
 * /mission-buniyad/{schoolid}:
 *   get:
 *     summary: Get a Mission Buniyad
 *     tags: [Mission Buniyad]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */