const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { imageGalleryValidation } = require('../../validations');
const { imageGalleryController } = require('../../controllers');
const { upload } = require('../../utils/cdn');

const router = express.Router();

router
  .route('/')
  .post(upload.fields([{ name: 'images', maxCount: 10 }]),validate(imageGalleryValidation.createGallery), imageGalleryController.createGallery)
  .get(validate(imageGalleryValidation.getgalleries), imageGalleryController.getgallerys);

router
  .route('/:id')
  .get(validate(imageGalleryValidation.getGallery), imageGalleryController.getGallery)
  .patch(validate(imageGalleryValidation.updateGallery), imageGalleryController.updateGallery)
  .delete(validate(imageGalleryValidation.deleteGallery), imageGalleryController.deleteGallery);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Image Galleries
 *   description: API endpoints for managing image galleries
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ImageGallery:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the image gallery
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the image gallery
 *         visitor:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *           description: Visitors of the image gallery
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the image gallery was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the image gallery was last updated
 */

/**
 * @swagger
 * /image-galleries:
 *   post:
 *     summary: Create a new image gallery
 *     tags: [Image Galleries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImageGallery'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageGallery'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all image galleries
 *     tags: [Image Galleries]
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ImageGallery'
 *       '500':
 *         description: Internal server error
 *
 * /image-galleries/{id}:
 *   get:
 *     summary: Get an image gallery by ID
 *     tags: [Image Galleries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the image gallery to get
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageGallery'
 *       '404':
 *         description: Image gallery not found
 *       '500':
 *         description: Internal server error
 *
 *   patch:
 *     summary: Update an image gallery
 *     tags: [Image Galleries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the image gallery to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImageGallery'
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageGallery'
 *       '404':
 *         description: Image gallery not found
 *       '500':
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete an image gallery
 *     tags: [Image Galleries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the image gallery to delete
 *     responses:
 *       '204':
 *         description: No content
 *       '404':
 *         description: Image gallery not found
 *       '500':
 *         description: Internal server error
 */
