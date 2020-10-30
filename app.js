if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const port = process.env.PORT;


const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

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
    res.render("cv/cv.ejs");
})

app.get('/projects', (req, res) => {
    res.render("cv/cv.ejs");
})

app.get('/photography', (req, res) => {
    res.render("cv/cv.ejs");
})

app.listen(port, (req, res) =>{
    console.log(`Serving on port ${port}`)
})