const express = require('express');

const { storage } = require('../cloudinary');
const upload = require('multer')({ storage });

const controller = require('../controllers/photography');
const wrapAsync = require("../utils/wrapAsync");
const { ensureLoggedIn } = require('../utils/middlewares');

const router = express.Router();

router.get('/', wrapAsync(controller.renderPhotographyMainPage))

router.post('/overview', ensureLoggedIn, upload.array("overview[images]"), 
            wrapAsync(controller.createNewOverview))

module.exports = router;