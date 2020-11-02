module.exports.ensureLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Need to login");
        res.redirect('/admin/login');
        return;
    }
    next();
}