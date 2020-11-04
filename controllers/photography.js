const { Overview } = require("../models/overview");
const { cloudinary } = require("../cloudinary");

module.exports.renderPhotographyMainPage = async function (req, res, next) {
    const overview = await Overview.findOne({ forArticle: "Photography" });
    res.render("photography/main", { overview });
}

module.exports.createNewOverview = async function(req, res, next){
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
    req.flash("success", "Change overview successfully");
    res.redirect("/photography");
}