const { User } = require("../models/user");

module.exports.redirectLogin = function(req, res, next){
    res.redirect('/admin/login');
}

module.exports.renderLoginForm = function(req, res, next){
    res.render('admin/login');
}

module.exports.loginFlashAndRedirect = function(req, res, next){
    req.flash('success', 'Login successfully');
    const redirectUrl = req.session.returnTo || '/overview';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.renderRegisterForm = function(req, res, next){
    res.render('admin/register');
}

module.exports.registerNewUser = async function (req, res, next){
    const { username, password, secret } = req.body;
    if (secret != process.env.SECRET) {
        req.flash("error", "Something went wrong");
        return res.redirect('/admin/register')
    }
    try {
        const newUser = await User.register(new User({ username }), password);
        req.logIn(newUser, err => {
            if (err) return next(err);
        });
        req.flash("success", "Register successfully");
        res.redirect('/overview');
    } catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect('/admin/register');
    }
}

module.exports.logOutUser = function(req, res, next){
    req.logOut();
    req.flash('success', 'Log out successfully');
    const redirectUrl = req.session.returnTo || '/overview';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}