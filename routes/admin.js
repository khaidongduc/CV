const express = require('express');
const passport = require('passport')

const wrapAsync = require("../utils/wrapAsync");
const { ensureLoggedIn } = require('../utils/middlewares');
const controller = require('../controllers/admin');

const router = express.Router();

router.get('/', controller.redirectLogin);

router.route('/login')
    .get(controller.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/admin/login' }),
          controller.loginFlashAndRedirect)

router.route('/register')
    .get(controller.renderLoginForm)
    .post(wrapAsync(controller.registerNewUser));

router.post("/logout", ensureLoggedIn, controller.logOutUser)

module.exports = router;