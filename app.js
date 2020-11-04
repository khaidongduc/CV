if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/my-cv';
const SECRET = process.env.SESSION_SECRET || "a secret";

const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const flash = require('connect-flash');

const helmet = require('helmet');

const session = require('express-session');
const passport = require('passport')
const LocalPassport = require('passport-local');

const ExpressError = require('./utils/ExpressError');

const overviewRoute = require('./routes/overview');
const projectRoute = require('./routes/project');
const cvRoute = require('./routes/cv');
const adminRoute = require('./routes/admin');
const photographyRoute = require('./routes/photography');

const { User } = require('./models/user');

// connect to database
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


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

// send and flash user info to template
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.flashSuccess = req.flash('success');
    res.locals.flashError = req.flash('error');
    next();
})


// routes
app.get('/', (req, res) => {
    res.redirect('/overview');
})

app.use('/admin', adminRoute);
app.use('/overview', overviewRoute);
app.use('/cv', cvRoute);
app.use('/projects', projectRoute);
app.use('/photography', photographyRoute)

// Error handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'))
})
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    if (!err.message) err.message = "Something Went Wrong";
    res.status(statusCode).render("error", { err });
})

app.listen(PORT, (req, res) => {
    console.log(`Serving on port ${PORT}`)
})