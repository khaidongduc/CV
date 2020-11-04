const { Project } = require("../models/project");
const { Overview } = require("../models/overview");

const { cloudinary } = require("../cloudinary");

module.exports.renderProjectMainPage = async function (req, res, next) {
    const projects = await Project.find({});
    const overview = await Overview.findOne({ forArticle: "Programming" });
    res.render("projects/main", { projects, overview });
}

module.exports.createNewProject = async function (req, res, next) {
    const project = new Project({ ...req.body.project });
    project.save();
    req.flash("success", "Make new project successfully");
    res.redirect('/projects')
}

module.exports.createNewOverview = async function (req, res, next) {
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
    req.flash("success", "Change overview successfully");
    res.redirect("/projects");
}

module.exports.renderNewProjectForm = function (req, res, next) {
    res.render("projects/new");
}

module.exports.renderEditProjectForm = async function (req, res, next) {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    res.render("projects/edit", { project });
}

module.exports.editProject = async function (req, res, next) {
    const { projectId } = req.params;
    const project = await Project.findByIdAndUpdate(projectId, { ...req.body.project });
    project.save();
    req.flash("success", "Edit project successfully");
    res.redirect('/projects');
}

module.exports.deleteProject = async function (req, res, next) {
    const { projectId } = req.params;
    await Project.findByIdAndDelete(projectId);
    req.flash("success", "Delete project successfully");
    res.redirect('/projects');
}