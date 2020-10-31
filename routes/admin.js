const express = require('express');
const passport = require('passport')

const wrapAsync = require("../utils/wrapAsync");
const { User } = require("../models/user");
const { ensureLoggedIn } = require('../utils/middlewares');
const router = express.Router();

router.route('/login')
    .get((req, res, next) => {
        res.render('admin/login');
    })
    .post(passport.authenticate('local', { failureRedirect: '/admin/login' }), (req, res, next) => {
        res.redirect('/');
    })

router.route('/register')
    .get((req, res, next) => {
        res.render('admin/register');
    })
    .post(wrapAsync(async (req, res, next) => {
        const { username, password, secret } = req.body;
        if(secret != process.env.SECRET) {
            return res.redirect('/admin/register')
        }
        try {
            const newUser = await User.register(new User({ username }), password);
            req.logIn(newUser, err => {
                if (err) return next(err);
            });
            res.redirect('/');
        } catch (err) {
            res.redirect('/admin/register');
        }
    }))

router.post("/logout", ensureLoggedIn, (req, res, next) => {
    req.logOut();
    res.redirect('/');
})

module.exports = router;