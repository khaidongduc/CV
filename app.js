if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/my-cv';

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');


const wrapAsync = require("./utils/wrapAsync");
const Project = require("./models/project");

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

app.use(methodOverride("_method"));

app.get('/', (req, res) => {
    res.render("home.ejs");
})

app.get('/cv', (req, res) => {
    res.render("cv/main");
})

app.get('/projects', wrapAsync(async (req, res, next) => {
    const projects = await Project.find({});
    console.log(projects);
    res.render("projects/main", {projects});
}))

app.get('/photography', (req, res) => {
    res.render("photography/main");
})

app.listen(PORT, (req, res) =>{
    console.log(`Serving on port ${PORT}`)
})