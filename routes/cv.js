const express = require('express');

const { ensureLoggedIn } = require('../utils/middlewares');

const { storage } = require('../cloudinary');
const upload = require('multer')({ storage });
const { cloudinary } = require("../cloudinary");

const wrapAsync = require("../utils/wrapAsync");
const { CV } = require("../models/cv");

const router = express.Router();

router.route('/')
    .get(wrapAsync(async (req, res) => {
        var cv;
        try {
            cv = await CV.findOne({});
        } catch (error) {
            cv = null;
        }
        res.render("cv/main", { cv });
    }))
    .post(ensureLoggedIn, upload.single("cv"), wrapAsync(async (req, res) => {
        const cv = await CV.findOne({});
        if (cv) cloudinary.uploader.destroy(`${cv.filename}`);
        await CV.deleteMany({});
        await new CV({
            url: req.file.path,
            filename: req.file.filename
        }).save();

        res.redirect("/cv");
    }))
    .delete(ensureLoggedIn, wrapAsync(async (req, res) => {
        const cv = await CV.findOne({});
        cloudinary.uploader.destroy(cv.filename);
        await CV.deleteMany({});
        res.redirect('/cv');
    }))


router.get('/edit', (req, res) => {
    res.render('cv/edit');
})

module.exports = router;