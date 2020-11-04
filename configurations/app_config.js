if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/my-cv';
const SECRET = process.env.SESSION_SECRET || "a secret";

const path = require('path');

const { User } = require('../models/user');

const express = require('express');
const ejsMate = require('ejs-mate');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const flash = require('connect-flash');

const helmet = require('helmet');

const session = require('express-session');
const passport = require('passport')
const LocalPassport = require('passport-local');


const app = express();

// config views
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"));

// config authentication
const MongoDBStore = require('connect-mongo')(session);
const store = new MongoDBStore({
    url: DB_URL,
    secret: SECRET,
    touchAfter: 24 * 60 * 60 // a day
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // a week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// config helmet
app.use(helmet());
const scriptSrcUrls = [];
const styleSrcUrls = [
    "https://fonts.googleapis.com/",
];
const connectSrcUrls = [];
const fontSrcUrls = [
    "https://fonts.gstatic.com"
];
const imgSrcUrls = [
    "https://source.unsplash.com/",
    "https://images.unsplash.com/",
    "https://res.cloudinary.com/dbgsbqpht/"
];
const frameSrcUrls = [
    "https://res.cloudinary.com/dbgsbqpht/"
]
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: ["'self'", "blob:", "data:", ...imgSrcUrls],
            fontSrc: ["'self'", ...fontSrcUrls],
            frameSrc: ["'self'", ...frameSrcUrls]
        },
    })
);

// config flash
app.use(flash());

module.exports = app;
