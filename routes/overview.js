const express = require('express');

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
            overview = await Overview.findOne({});
        } catch (err) {
            overview = null;
        }
        
        res.render("overview/main", { overview });
    }))
    .post(upload.array("overview[images]"), wrapAsync(async (req, res, next) => {
        const overview = await Overview.findOne({});
        if (overview) {
            for (image of overview.images) {
                cloudinary.uploader.destroy(image.filename);
            }
        }
        await Overview.deleteMany({});
        const newOverview = new Overview({
            htmlBody: req.body.overview.htmlBody
        });
        newOverview.images.push(...req.files.map(f => ({ url: f.path, filename: f.filename })));
        newOverview.save();
        res.redirect("/overview");
    }))

module.exports = router;