const express = require('express');

const { ensureLoggedIn } = require('../utils/middlewares');

const { Overview } = require("../models/overview");

const { storage } = require('../cloudinary');
const upload = require('multer')({ storage });
const { cloudinary } = require("../cloudinary");

const wrapAsync = require("../utils/wrapAsync");


const router = express.Router();

router.get('/', wrapAsync(async (req, res, next) => {
    const overview = await Overview.findOne({ forArticle: "Photography" });
    res.render("photography/main", { overview });
}))

router.post('/overview', ensureLoggedIn, upload.array("overview[images]"), wrapAsync(async (req, res, next) => {
    const overview = await Overview.findOne({ forArticle: "Photography" });
    if (overview) {
        for (image of overview.images) {
            cloudinary.uploader.destroy(image.filename);
        }
    }
    await Overview.deleteMany({ forArticle: "Photography" });
    const newOverview = new Overview({
        htmlBody: req.body.overview.htmlBody,
        forArticle: "Photography"
    });
    await newOverview.images.push(...req.files.map(f => ({ url: f.path, filename: f.filename })));
    newOverview.save();
    res.redirect("/photography");
}))

module.exports = router;