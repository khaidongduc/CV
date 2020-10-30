if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/my-cv';

const mongoose = require('mongoose');
const Project = require('../models/project');


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

const seedDB = async() => {
    await Project.deleteMany({});
    await new Project({
        title: "Yelp Camp",
        url: "https://obscure-wave-19607.herokuapp.com/",
        repository: "https://github.com/khaidongduc/YelpCamp",
        description: "Yelp Camp is a fun application that allows you to view campgrounds with a short description.\n\
        Once you login or signup you can begin to create your own campgrounds that includes a title, image address and short description.\n\
        YelpCamp is a more complex application built from scratch using the following technologies:\n\
        On the front-end I have used HTML5, CSS3, JavaScript, Bootstrap for responsive layout, and jQuery.\n\
        On the back-end I used NodeJS, NPM, ExpressJS, REST, Authentication, Authorization and PassportJS. \n\
        For datastore I used non-sql MongoDB.\n\
        The application was developed on VSCode and source versioned with GIT. \
        The application is hosted on Heroku servers and MongoLab.",
        htmlDescription: "<p> Yelp Camp is a fun application that allows you to view campgrounds with a short description.\
        Once you login or signup you can begin to create your own campgrounds that includes a title, image address and short description.</p>\
        <p>YelpCamp is a more complex application built from scratch using the following technologies:</p>\
        <ul>\
        <li>On the front-end I have used HTML5, CSS3, JavaScript, Bootstrap for responsive layout, and jQuery.</li>\
        <li>On the back-end I used NodeJS, NPM, ExpressJS, REST, Authentication, Authorization and PassportJS.</li>\
        <li>For datastore I used non-sql MongoDB.</li>\
        <li>The application was developed on VSCode and source versioned with GIT.</li>\
        <li>The application is hosted on Heroku servers and MongoLab.</li>\
        </ul>"
    }).save();
}

seedDB().then(() => {
    db.close();
});