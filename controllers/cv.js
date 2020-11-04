const { CV } = require("../models/cv");
const { cloudinary } = require("../cloudinary");

module.exports.renderCVMainPage = async function (req, res, next) {
    var cv;
    try {
        cv = await CV.findOne({});
    } catch (error) {
        cv = null;
    }
    res.render("cv/main", { cv });
}

module.exports.replaceCV = async function (req, res, next) {
    const cv = await CV.findOne({});
    if (cv) cloudinary.uploader.destroy(`${cv.filename}`);
    await CV.deleteMany({});
    await new CV({
        url: req.file.path,
        filename: req.file.filename
    }).save();
    req.flash("success", "Upload successfully");
    res.redirect("/cv");
}

module.exports.deleteCV = async function (req, res, next) {
    const cv = await CV.findOne({});
    cloudinary.uploader.destroy(cv.filename);
    await CV.deleteMany({});
    req.flash("success", "Delete successfully");
    res.redirect('/cv');
}

module.exports.renderEditForm = function (req, res, next) {
    res.render('cv/edit');
}