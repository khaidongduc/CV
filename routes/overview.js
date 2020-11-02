const express = require('express');

const { ensureLoggedIn } = require('../utils/middlewares');
const wrapAsync = require("../utils/wrapAsync");
const { Overview } = require("../models/overview");

const { storage } = require('../cloudinary');
const upload = require('multer')({ storage });
const { cloudinary } = require("../cloudinary");

const router = express.Router();

router.route('/')
    .get(wrapAsync(async (req, res, next) => {
        var overview;
        try {
            overview = await Overview.findOne({forArticle: "Overview"});
        } catch (err) {
            overview = null;
        }
        res.render("overview/main", { overview });
    }))
    .post(ensureLoggedIn, upload.array("overview[images]"), wrapAsync(async (req, res, next) => {
        const overview = await Overview.findOne({forArticle: "Overview"});
        if (overview) {
            for (image of overview.images) {
                cloudinary.uploader.destroy(image.filename);
            }
        }
        await Overview.deleteMany({forArticle: "Overview"});
        const newOverview = new Overview({
            htmlBody: req.body.overview.htmlBody,
            forArticle: "Overview"
        });
        await newOverview.images.push(...req.files.map(f => ({ url: f.path, filename: f.filename })));
        newOverview.save();
        req.flash("success", "Change overview successfully");
        res.redirect("/overview");
    }))

module.exports = router;