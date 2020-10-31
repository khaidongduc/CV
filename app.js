if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/my-cv';

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const ExpressError = require('./utils/ExpressError');

const projectRoute = require('./routes/project');
const cvRoute = require('./routes/cv');

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

// start the app
const app = express();

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride("_method"));

app.get('/', (req, res) => {
    res.render("home.ejs");
})

app.use('/cv', cvRoute);

app.use('/projects', projectRoute);

app.get('/photography', (req, res) => {
    res.render("photography/main");
})

// Error handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'))
})
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    if (!err.message) err.message = "Something Went Wrong";
    res.status(statusCode).send(err.message);
})

app.listen(PORT, (req, res) => {
    console.log(`Serving on port ${PORT}`)
})