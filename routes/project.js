const express = require('express');

const { ensureLoggedIn } = require('../utils/middlewares');
const wrapAsync = require("../utils/wrapAsync");
const { Project } = require("../models/project");
const { Overview } = require("../models/overview");


const { storage } = require('../cloudinary');
const upload = require('multer')({ storage });
const { cloudinary } = require("../cloudinary");

const router = express.Router();

router.route('/')
    .get(wrapAsync(async (req, res, next) => {
        const projects = await Project.find({});
        const overview = await Overview.findOne({ forArticle: "Programming" });
        res.render("projects/main", { projects, overview });
    }))
    .post(ensureLoggedIn, wrapAsync(async (req, res, next) => {
        const project = new Project({ ...req.body.project });
        project.save();
        res.redirect('/projects')
    }))

router.post('/overview', ensureLoggedIn, upload.array("overview[images]"), wrapAsync(async (req, res, next) => {
    const overview = await Overview.findOne({ forArticle: "Programming" });
    if (overview) {
        for (image of overview.images) {
            cloudinary.uploader.destroy(image.filename);
        }
    }
    await Overview.deleteMany({ forArticle: "Programming" });
    const newOverview = new Overview({
        htmlBody: req.body.overview.htmlBody,
        forArticle: "Programming"
    });
    await newOverview.images.push(...req.files.map(f => ({ url: f.path, filename: f.filename })));
    newOverview.save();
    res.redirect("/projects");
}))


router.get('/new', ensureLoggedIn, wrapAsync(async (req, res, next) => {
    res.render("projects/new");
}))

router.get('/:projectId/edit', ensureLoggedIn, wrapAsync(async (req, res, next) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    res.render("projects/edit", { project });
}))

router.route('/:projectId')
    .patch(ensureLoggedIn, wrapAsync(async (req, res, next) => {
        const { projectId } = req.params;
        const project = await Project.findByIdAndUpdate(projectId, { ...req.body.project });
        project.save();
        res.redirect('/projects');
    }))
    .delete(ensureLoggedIn, wrapAsync(async (req, res, next) => {
        const { projectId } = req.params;
        const project = await Project.findByIdAndDelete(projectId);
        res.redirect('/projects');       
        res.send(projectId);
    }))

module.exports = router;