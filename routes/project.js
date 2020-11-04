const express = require('express');

const { ensureLoggedIn } = require('../utils/middlewares');
const wrapAsync = require("../utils/wrapAsync");


const { storage } = require('../cloudinary');
const upload = require('multer')({ storage });
const { cloudinary } = require("../cloudinary");

const controller = require('../controllers/project');
const { createNewOverview } = require('../controllers/photography');

const router = express.Router();

router.route('/')
    .get(wrapAsync(controller.renderProjectMainPage))
    .post(ensureLoggedIn, wrapAsync(controller.createNewProject))

router.post('/overview', ensureLoggedIn, upload.array("overview[images]"),
    wrapAsync(controller.createNewOverview));


router.get('/new', ensureLoggedIn, controller.renderNewProjectForm);

router.get('/:projectId/edit', ensureLoggedIn, wrapAsync(controller.renderEditProjectForm));

router.route('/:projectId')
    .patch(ensureLoggedIn, wrapAsync(controller.editProject))
    .delete(ensureLoggedIn, wrapAsync(controller.deleteProject))

module.exports = router;