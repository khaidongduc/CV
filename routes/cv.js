const express = require('express');

const { storage } = require('../cloudinary');
const upload = require('multer')({ storage });

const { ensureLoggedIn } = require('../utils/middlewares');
const wrapAsync = require("../utils/wrapAsync");
const controller = require('../controllers/cv');

const router = express.Router();

router.route('/')
    .get(wrapAsync(controller.renderCVMainPage))
    .post(ensureLoggedIn, upload.single("cv"), wrapAsync(controller.replaceCV))
    .delete(ensureLoggedIn, wrapAsync(controller.deleteCV));

router.get('/edit', ensureLoggedIn, controller.renderEditForm);

module.exports = router;