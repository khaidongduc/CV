const express = require('express');

const { storage } = require('../cloudinary');
const upload = require('multer')({ storage });

const { ensureLoggedIn } = require('../utils/middlewares');
const wrapAsync = require("../utils/wrapAsync");
const controller = require('../controllers/overview');

const router = express.Router();

router.route('/')
    .get(wrapAsync(controller.renderOverviewMainPage))
    .post(ensureLoggedIn, upload.array("overview[images]"), wrapAsync(controller.editOverview))

module.exports = router;