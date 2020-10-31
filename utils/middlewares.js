module.exports.ensureLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        res.redirect('/admin/login');
        return;
    }
    next();
}