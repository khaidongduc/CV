if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const PORT = process.env.PORT || 3000;

const ExpressError = require('./utils/ExpressError');

const overviewRoute = require('./routes/overview');
const projectRoute = require('./routes/project');
const cvRoute = require('./routes/cv');
const adminRoute = require('./routes/admin');
const photographyRoute = require('./routes/photography');

const app = require('./configurations/app_config');

// connect to database
const db = require('./configurations/database');
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

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