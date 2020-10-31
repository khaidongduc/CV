const express = require('express');

const wrapAsync = require("../utils/wrapAsync");
const { Project } = require("../models/project");

const router = express.Router();

router.route('/')
    .get(wrapAsync(async (req, res, next) => {
        const projects = await Project.find({});
        res.render("projects/main", { projects });
    }))
    .post(wrapAsync(async (req, res, next) => {
        const project = new Project({ ...req.body.project });
        project.save();
        res.redirect('/projects')
    }))

router.get('/new', wrapAsync(async (req, res, next) => {
    res.render("projects/new");
}))

router.get('/:projectId/edit', wrapAsync(async (req, res, next) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    res.render("projects/edit", { project });
}))

router.patch('/:projectId', wrapAsync(async (req, res, next) => {
    const { projectId } = req.params;
    const project = await Project.findByIdAndUpdate(projectId, { ...req.body.project });
    project.save();
    res.redirect('/projects');
}))

module.exports = router;